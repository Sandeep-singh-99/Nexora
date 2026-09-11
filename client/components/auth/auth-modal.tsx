"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X, ArrowRight, Lock, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogin, useRegister, getErrorMessage } from "@/hooks/use-auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, initialTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const isPending = loginMutation.isPending || registerMutation.isPending;

  // Sync tab with initialTab when opened
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setTab(initialTab);
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (tab === "signin") {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            setSuccessMessage("Welcome back! Signed in successfully.");
            setTimeout(() => {
              onClose();
              setSuccessMessage(null);
            }, 1200);
          },
          onError: (error) => {
            setErrorMessage(getErrorMessage(error));
          },
        }
      );
    } else {
      registerMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            // Auto login user after registration
            loginMutation.mutate(
              { email, password },
              {
                onSuccess: () => {
                  setSuccessMessage("Account created & signed in successfully!");
                  setTimeout(() => {
                    onClose();
                    setSuccessMessage(null);
                    setEmail("");
                    setPassword("");
                  }, 1200);
                },
                onError: (error) => {
                  setErrorMessage(getErrorMessage(error));
                  setTab("signin");
                },
              }
            );
          },
          onError: (error) => {
            setErrorMessage(getErrorMessage(error));
          },
        }
      );
    }
  };

  const handleTabChange = (newTab: "signin" | "signup") => {
    setTab(newTab);
    setSuccessMessage(null);
    setErrorMessage(null);
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
        {/* Ambient Radial Glow */}
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
            onClick={() => handleTabChange("signin")}
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
            onClick={() => handleTabChange("signup")}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              tab === "signup"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Success Screen */}
        {successMessage ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {tab === "signin" ? "Authenticated!" : "Account Created!"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
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
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
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
                  minLength={8}
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
              disabled={isPending}
              className="w-full justify-center mt-2 py-3 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30"
            >
              {isPending ? (
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

            <p className="mt-4 text-center text-[11px] text-slate-500">
              By continuing, you agree to Nexora&apos;s{" "}
              <a href="#" className="text-slate-400 underline hover:text-white">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-slate-400 underline hover:text-white">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
