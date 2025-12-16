import React, { useState, useEffect } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import TemplateSelector from "./components/TemplateSelector";
import Dashboard from "./components/Dashboard";
import PaymentModal from "./components/PaymentModal";
import { Auth } from "./components/Auth";
import { INITIAL_RESUME_DATA } from "./constants";
import { ResumeData, TemplateType, User } from "./types";
import { authService } from "./services/auth";
import { storageService } from "./services/storage";
import { FileText, Loader2, LogIn, Crown, Star } from "lucide-react";
import { AuthGuard } from "./components/AuthGuard";
import { PremiumGuard } from "./components/PremiumGuard";

const GUEST_ID = "guest_user";

const App: React.FC = () => {
  const [view, setView] = useState<"login" | "dashboard" | "editor">("login");
  const [user, setUser] = useState<User | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [currentTemplate, setCurrentTemplate] = useState<string>(
    TemplateType.ONYX
  );
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ✅ Initial auth check (FIXED)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          setUser(currentUser);

          const savedData = storageService.loadResume(currentUser.id);
          if (savedData) setResumeData(savedData);

          const savedTemplate = storageService.loadLastTemplate(currentUser.id);
          if (savedTemplate) setCurrentTemplate(savedTemplate);

          setView("dashboard");
        } else {
          setView("login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Auto-save
  useEffect(() => {
    if (view === "editor") {
      const targetId = user ? user.id : GUEST_ID;
      storageService.saveResume(targetId, resumeData);
      storageService.saveLastTemplate(targetId, currentTemplate);
    }
  }, [resumeData, currentTemplate, user, view]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);

    const savedData = storageService.loadResume(loggedInUser.id);
    setResumeData(savedData || INITIAL_RESUME_DATA);

    const savedTemplate = storageService.loadLastTemplate(loggedInUser.id);
    if (savedTemplate) setCurrentTemplate(savedTemplate);

    setView("dashboard");
  };

  const handleGuestAccess = () => {
    const savedData = storageService.loadResume(GUEST_ID);
    setResumeData(savedData || INITIAL_RESUME_DATA);

    const savedTemplate = storageService.loadLastTemplate(GUEST_ID);
    if (savedTemplate) setCurrentTemplate(savedTemplate);

    setUser(null);
    setView("dashboard");
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setResumeData(INITIAL_RESUME_DATA);
    setView("login");
  };

  const handleSelectTemplate = (templateId: string) => {
    setCurrentTemplate(templateId);
    setView("editor");
  };

  const handleUpgradeRequest = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!user) return;
    await authService.upgradeToPremium(user.id);
    setUser({ ...user, isPremium: true });
    setShowPaymentModal(false);
    alert("Successfully upgraded to Premium!");
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-blue-600">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const paymentOverlay =
    showPaymentModal && (
      <PaymentModal
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    );

  // ✅ AUTH SCREEN (single source of truth)
  if (view === "login") {
    return (
      <Auth onLogin={handleLogin} onGuestAccess={handleGuestAccess} />
    );
  }

  // ✅ DASHBOARD
  if (view === "dashboard") {
    return (
      <AuthGuard
        user={user}
        onLogin={handleLogin}
        onGuestAccess={handleGuestAccess}
      >
        <>
          <Dashboard
            onSelectTemplate={handleSelectTemplate}
            onLogout={handleLogout}
            onContinue={() => setView("editor")}
            onLoginRequest={() => setView("login")}
            onUpgradeRequest={handleUpgradeRequest}
            user={user}
            hasSavedResume={!!storageService.loadResume(user?.id || GUEST_ID)}
          />
          {paymentOverlay}
        </>
      </AuthGuard>
    );
  }  

  // ✅ EDITOR
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      {paymentOverlay}

      <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col h-full bg-white border-r border-slate-200 shadow-xl">
        <div className="h-16 border-b border-slate-200 flex items-center px-6 justify-between">
          <div
            className="flex items-center gap-3 text-blue-600 cursor-pointer"
            onClick={() => setView("dashboard")}
          >
            <FileText size={24} />
            <h1 className="text-xl font-bold">Resumify</h1>
          </div>

          {!user ? (
            <button
              onClick={() => setView("login")}
              className="text-xs font-bold text-blue-600"
            >
              <LogIn size={14} /> Log In
            </button>
          ) : user.isPremium ? (
            <div className="bg-slate-900 text-amber-400 text-xs px-2 py-1 rounded-full">
              <Star size={10} /> PRO
            </div>
          ) : (
            <button
              onClick={handleUpgradeRequest}
              className="bg-amber-400 text-white text-xs px-2 py-1 rounded-full"
            >
              <Crown size={12} /> Upgrade
            </button>
          )}
        </div>

        <TemplateSelector
          currentTemplate={currentTemplate}
          onChange={setCurrentTemplate}
        />

        <div className="flex-1 overflow-y-auto">
          <Editor
            data={resumeData}
            onChange={setResumeData}
            onBack={() => setView("dashboard")}
          />
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-slate-100">
        <Preview
          data={resumeData}
          template={currentTemplate}
          user={user}
          onLoginRequest={() => setView("login")}
          onUpgradeRequest={handleUpgradeRequest}
        />
      </div>
    </div>
  );
};

export default App;
