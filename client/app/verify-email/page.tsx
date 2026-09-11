"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useVerifyEmail,
  useResendVerification,
  getErrorMessage,
} from "@/hooks/use-auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const verifyEmailMutation = useVerifyEmail();
  const resendMutation = useResendVerification();

  const [resendEmail, setResendEmail] = useState("");
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  // Prevent double invocation in React Strict Mode
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (token && !hasCalledRef.current) {
      hasCalledRef.current = true;
      verifyEmailMutation.mutate({ token });
    }
  }, [token]);

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    setResendSuccess(null);
    resendMutation.mutate(
      { email: resendEmail },
      {
        onSuccess: (data) => {
          setResendSuccess(
            data.message || "Verification link sent. Please check your inbox."
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
            <h2 className="text-xl font-bold text-white">Invalid Verification Link</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              No verification token was provided in the link. Please check your email link or request a new verification token below.
            </p>
          </div>
        ) : verifyEmailMutation.isPending ? (
          /* Loading Verification State */
          <div className="text-center py-8 space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying Your Email</h2>
            <p className="text-xs text-slate-400">
              Please wait while we confirm your verification token with Nexora server...
            </p>
          </div>
        ) : verifyEmailMutation.isSuccess ? (
          /* Success Verification State */
          <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                {verifyEmailMutation.data.message ||
                  "Your email address has been verified successfully. You can now log in to your account."}
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/")}
              className="w-full justify-center text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 mt-4"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ) : (
          /* Error Verification State */
          <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
              <XCircle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Verification Failed</h2>
              <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                {getErrorMessage(verifyEmailMutation.error)}
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                If you already clicked this link earlier, your email may already be verified. Try signing in!
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/")}
              className="w-full justify-center text-white font-medium bg-white/10 hover:bg-white/15 border border-white/10 mb-2"
            >
              <span>Try Signing In</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            {/* Resend Verification Form */}
            <div className="pt-4 border-t border-white/10 text-left">
              <h3 className="text-xs font-semibold text-slate-300 mb-2">
                Need a new verification link?
              </h3>
              {resendSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resendSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3">
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={resendMutation.isPending}
                    className="w-full justify-center py-2.5 text-xs text-slate-950 font-semibold"
                  >
                    {resendMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Sending Link...
                      </span>
                    ) : (
                      <span>Resend Verification Email</span>
                    )}
                  </Button>
                </form>
              )}
            </div>
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#05070B] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
