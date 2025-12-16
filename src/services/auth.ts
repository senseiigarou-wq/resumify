import { supabase } from "../supabaseClient";
import { User } from "../types";

// ================================
// ⚠️ SIMPLE IN-MEMORY RATE LIMITER
// ================================
type RateLimitEntry = {
  count: number;
  last: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

function rateLimit(key: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, last: now });
    return;
  }

  if (now - entry.last < WINDOW_MS) {
    entry.count += 1;

    if (entry.count > MAX_ATTEMPTS) {
      throw new Error("Too many attempts. Please try again later.");
    }
  } else {
    entry.count = 1;
    entry.last = now;
  }
}

// ================================
// ⏱ Timeout Wrapper (SAFE)
// ================================
const DEFAULT_TIMEOUT = 5000;

const withTimeout = async <T>(
  promise: Promise<T>,
  ms = DEFAULT_TIMEOUT
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), ms)
    ),
  ]);
};

// ================================
// 🔎 FETCH USER PREMIUM STATUS (SECURE)
// ================================
async function fetchUserProfile(
  userId: string
): Promise<{ is_premium: boolean }> {
  const { data, error } = await supabase
    .from("users")
    .select("is_premium")
    .eq("id", userId)
    .maybeSingle(); // ✅ IMPORTANT

  if (error) {
    console.error("Failed to fetch premium status:", error);
  }

  return {
    is_premium: Boolean(data?.is_premium),
  };
}

// ================================
// 🌐 PROD CONFIG
// ================================
const PROD_REDIRECT = "https://your-production-domain.com/";

export const authService = {
  // ================================
  // 🔑 LOGIN
  // ================================
  async login(email: string, password: string): Promise<User> {
    email = email.trim();
    password = password.trim();

    rateLimit(`login_${email}`);

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password })
    );

    if (error || !data.user) {
      throw new Error("Invalid email or password.");
    }

    const profile = await fetchUserProfile(data.user.id);

    return {
      id: data.user.id,
      name: data.user.user_metadata?.name || "",
      email: data.user.email || "",
      is_premium: profile.is_premium,
    };
  },

  // ================================
  // 🆕 REGISTER
  // ================================
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    name = name.trim();
    email = email.trim();
    password = password.trim();

    rateLimit(`register_${email}`);

    if (!name || !email || !password) {
      throw new Error("All fields are required.");
    }

    const { data, error } = await withTimeout(
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: PROD_REDIRECT,
        },
      })
    );

    if (error || !data.user) {
      throw new Error("Unable to create account.");
    }

    return {
      id: data.user.id,
      name,
      email,
      is_premium: false, // default false until webhook upgrades
    };
  },

  // ================================
  // 🔄 RESET PASSWORD
  // ================================
  async resetPassword(email: string): Promise<void> {
    email = email.trim();
    rateLimit(`reset_${email}`);

    const { error } = await withTimeout(
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: PROD_REDIRECT,
      })
    );

    if (error) {
      throw new Error("Unable to send reset email.");
    }
  },

  // ================================
  // 🚪 LOGOUT
  // ================================
  async logout(): Promise<void> {
    await withTimeout(supabase.auth.signOut());
  },

  // ================================
  // 👤 CURRENT USER
  // ================================
  async getCurrentUser(): Promise<User | null> {
    const { data } = await withTimeout(supabase.auth.getUser());

    if (!data.user) return null;

    const profile = await fetchUserProfile(data.user.id);

    return {
      id: data.user.id,
      name: data.user.user_metadata?.name || "",
      email: data.user.email || "",
      is_premium: profile.is_premium,
    };
  },

  // ================================
  // ⭐ UPGRADE TO PREMIUM (DISABLED)
  // ================================
  // ❌ SECURITY: Premium upgrade is handled
  // ❌ ONLY by PayPal Webhook + Cloudflare Worker
};
