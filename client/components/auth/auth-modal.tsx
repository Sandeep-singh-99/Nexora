"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Lock, Mail, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, initialTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTab(initialTab);
    setSuccess(false);
    setLoading(false);
  }, [initialTab, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#0D131D] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 z-10 transition-all animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600/30 via-emerald-500/20 to-teal-500/30 border border-emerald-500/30">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-emerald-400"
            >
              <path
                d="M4 19L4 5L10 14L16 5L20 5L20 19"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Nexora AI</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setTab("signin"); setSuccess(false); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              tab === "signin"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("signup"); setSuccess(false); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              tab === "signup"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {tab === "signin" ? "Welcome back!" : "Account Created!"}
            </h3>
            <p className="text-xs text-slate-400">
              {tab === "signin" ? "Redirecting to your Nexora workspace..." : "Your workspace is ready to go."}
            </p>
          </div>
        ) : (
          <>
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              {/* Google Login Button */}
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(onClose, 1500); }, 800);
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.18] rounded-xl text-xs sm:text-sm font-medium text-slate-200 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Facebook Login Button */}
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(onClose, 1500); }, 800);
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.18] rounded-xl text-xs sm:text-sm font-medium text-slate-200 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="w-full border-t border-white/[0.08]" />
              <span className="absolute bg-[#0D131D] px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                or continue with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "signup" && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">Password</label>
                  {tab === "signin" && (
                    <a href="#" className="text-[11px] text-emerald-400 hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full justify-center mt-2 py-3 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    {tab === "signin" ? "Sign In to Nexora" : "Create Free Account"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <p className="mt-4 text-center text-[11px] text-slate-500">
              By continuing, you agree to Nexora's{" "}
              <a href="#" className="text-slate-400 underline hover:text-white">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-slate-400 underline hover:text-white">
                Privacy Policy
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
