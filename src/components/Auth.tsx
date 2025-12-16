// Secure Auth.tsx
// [Generated fully patched version]

import React, { useState, useEffect } from "react";
import { User } from "../types";
import { authService } from "../services/auth";
import {
  Layout,
  ArrowRight,
  Loader2,
  AlertCircle,
  User as UserIcon,
  Eye,
  EyeOff,
} from "lucide-react";

interface AuthProps {
  onLogin: (user: User) => void;
  onGuestAccess: () => void;
}

type AuthView = "login" | "signup" | "forgot";

const AuthLayout: React.FC<{
  children: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex w-full bg-slate-50">
    <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-blue-400 mb-6">
          <Layout size={32} />
          <span className="text-2xl font-bold tracking-tight">Resumify</span>
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Craft your professional story.
        </h1>
        <p className="text-xl text-slate-400 max-w-md">
          Build a stunning, ATS-friendly resume in minutes with our real-time
          editor and premium templates.
        </p>
      </div>

      <div className="relative z-10 text-slate-500 text-sm">
        © {new Date().getFullYear()} Resumify Inc. All rights reserved.
      </div>
    </div>

    {/* Right Side */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-slate-500">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  </div>
);

// Password Strength Checker
const getPasswordStrength = (password: string) => {
  if (password.length < 6) return { label: "Weak", color: "red" };
  if (password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/))
    return { label: "Medium", color: "orange" };
  if (
    password.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    )
  )
    return { label: "Strong", color: "green" };
  return { label: "Weak", color: "red" };
};

export const Auth: React.FC<AuthProps> = ({ onLogin, onGuestAccess }) => {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await authService.login(email, password);

      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register(name, email, password);
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <>
      {/* LOGIN */}
      {view === "login" && (
        <AuthLayout
          title="Welcome back"
          subtitle="Enter your credentials to access your account."
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-slate-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => setView("forgot")}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="mx-4 text-slate-400 text-xs">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={onGuestAccess}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 p-3 rounded-lg font-medium"
              >
                <UserIcon size={18} /> Continue as Guest
              </button>
            </div>

            <div className="text-center text-sm text-slate-500">
              Don't have an account? {" "}
              <button
                type="button"
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => setView("signup")}
              >
                Create one for free
              </button>
            </div>
          </form>
        </AuthLayout>
      )}

      {/* SIGNUP */}
      {view === "signup" && (
        <AuthLayout
          title="Create an account"
          subtitle="Start building your professional career today."
        >
          {verificationSent ? (
            <div className="p-4 rounded-md bg-blue-50 text-blue-700 text-center space-y-4">
              <div>
                ✅ Registration successful! Check your email <strong>{email}</strong> for verification.
              </div>
              <button
                type="button"
                onClick={() => setView("login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow-md"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-slate-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {password && (
                  <div
                    className="text-sm font-medium"
                    style={{ color: passwordStrength.color }}
                  >
                    Password strength: {passwordStrength.label}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow-md disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                  {!loading && <ArrowRight size={18} />}
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="mx-4 text-slate-400 text-xs">OR</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={onGuestAccess}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 p-3 rounded-lg font-medium"
                >
                  <UserIcon size={18} /> Continue as Guest
                </button>
              </div>

              <div className="text-center text-sm text-slate-500">
                Already have an account? {" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </AuthLayout>
      )}

      {/* FORGOT PASSWORD */}
      {view === "forgot" && (
        <AuthLayout
          title="Reset Password"
          subtitle="Enter your email to receive a reset link."
        >
          {resetSent ? (
            <div className="p-4 rounded-md bg-blue-50 text-blue-700 text-center space-y-4">
              <div>
                ✅ Check your email <strong>{email}</strong> for the reset link.
              </div>
              <button
                type="button"
                onClick={() => setView("login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow-md disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div className="text-center text-sm text-slate-500">
                Remembered your password? {" "}
                <button
                  type="button"
                  className="text-blue-600 font-semibold hover:underline"
                  onClick={() => setView("login")}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </AuthLayout>
      )}
    </>
  );
};
