"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResetPassword, getErrorMessage } from "@/hooks/use-auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetPasswordMutation = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!token) {
      setValidationError("Missing or invalid reset token.");
      return;
    }

    if (newPassword.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    resetPasswordMutation.mutate(
      { token, new_password: newPassword },
      {
        onSuccess: (data) => {
          setSuccessMessage(
            data.message ||
              "Password has been reset successfully. Please log in with your new password."
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0D131D] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 z-10 transition-all">
        {/* Header Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600/30 via-emerald-500/20 to-teal-500/30 border border-emerald-500/30">
            <svg
              width="20"
              height="20"
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
          <span className="text-xl font-bold text-white tracking-tight">
            Nexora AI
          </span>
        </div>

        {!token ? (
          /* Missing Token State */
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
              <XCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Invalid Reset Link</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              No password reset token was provided in the link. Please request a new password reset from the sign-in modal.
            </p>
          </div>
        ) : successMessage ? (
          /* Success Reset State */
          <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                {successMessage}
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/")}
              className="w-full justify-center text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 mt-4"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ) : (
          /* Reset Password Form */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
              <p className="text-xs text-slate-400">
                Enter your new password below.
              </p>
            </div>

            {(validationError || resetPasswordMutation.isError) && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="flex-1">
                  {validationError || getErrorMessage(resetPasswordMutation.error)}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={resetPasswordMutation.isPending}
                className="w-full justify-center py-3 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 mt-2"
              >
                {resetPasswordMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting Password...
                  </span>
                ) : (
                  <span>Reset Password</span>
                )}
              </Button>
            </form>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors underline"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#05070B] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
