"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/lib/api/account";

// UNCONFIRMED: the exact link format the reset email actually sends isn't
// known — email_utils.py (which builds that link) wasn't available when
// this was written. This assumes the standard convention, a "token" query
// param (?token=xxx). If the real email links to something else (e.g. a
// path segment), update this to match.
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is missing its token — please use the link from your email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "This link is invalid or has expired — request a new one from the login page."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2 text-slate-700">
          <Sparkles className="h-5 w-5 text-[#4a7aa8]" />
          <span className="text-sm font-semibold">LinkedIn AI Advisor</span>
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
            <h2 className="text-base font-bold text-slate-900">Password reset</h2>
            <p className="mt-2 text-sm text-slate-500">
              Your password has been changed. You'll need to sign in again everywhere — resetting
              revokes all existing sessions.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 w-full rounded-lg bg-[#4a7aa8] py-2.5 text-sm font-semibold text-white hover:bg-[#3f6a94]"
            >
              Go to login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-base font-bold text-slate-900">Set a new password</h2>
            <p className="mt-1 text-xs text-slate-500">Choose a new password for your account.</p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#4a7aa8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
              />
              <p className="text-xs text-slate-400">Must be at least 8 characters.</p>

              {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#4a7aa8] py-2.5 text-sm font-semibold text-white hover:bg-[#3f6a94] disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>

            <Link href="/login" className="mt-4 block text-center text-xs font-medium text-[#4a7aa8]">
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}