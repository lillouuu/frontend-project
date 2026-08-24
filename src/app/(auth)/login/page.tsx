"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, BarChart3, PenLine, Calendar, Eye, EyeOff, Loader2 } from "lucide-react";
import { getMyCompanies } from "@/lib/api/company";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Fallback to absolute backend URL if env vars are missing
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_AUTH_API_URL ||
      "http://localhost:8000";

    try {
      if (mode === "signup") {
        // 1. Create the user account
        const registerRes = await fetch(`${baseUrl}/api/users/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: fullName,
            email: username,
            password: password,
            account_name: accountName,
          }),
        });

        if (!registerRes.ok) {
          const errorData = await registerRes.json().catch(() => ({}));
          throw new Error(errorData.detail || "Registration failed. Email might already be taken.");
        }
      }

      // 2. Perform Login (Runs directly for "signin", or auto-runs immediately after "signup")
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const tokenRes = await fetch(`${baseUrl}/api/users/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!tokenRes.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await tokenRes.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      // 3. Route to Onboarding (if fresh account) or Dashboard (if existing company found)
      try {
        const companies = await getMyCompanies();
        if (companies && companies.length > 0) {
          localStorage.setItem("company_id", companies[0].id);
          router.push("/dashboard");
        } else {
          router.push("/onboarding/company");
        }
      } catch (err) {
        console.warn("Could not check existing companies, defaulting to onboarding:", err);
        router.push("/onboarding/company");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-[#e3e6ea] bg-white shadow-sm md:grid-cols-2">
        {/* Left panel */}
        <div className="flex flex-col justify-center bg-[#0f1c33] px-10 py-12 text-white">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4a7aa8]">
              <Sparkles size={18} strokeWidth={2.5} />
            </div>
            <div className="text-lg font-bold leading-tight">
              LinkedIn
              <br />
              AI Advisor
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight">
            Optimize your LinkedIn presence with AI
          </h1>

          <p className="mb-8 text-sm leading-relaxed text-white/60">
            Audit your company page, generate content, and track performance — all in one place.
          </p>

          <div className="flex flex-col gap-2.5">
            <div className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/85">
              <BarChart3 size={13} />
              AI Audit
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/85">
              <PenLine size={13} />
              Content generation
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/85">
              <Calendar size={13} />
              Editorial calendar
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col justify-center px-10 py-12">
          <h2 className="mb-1.5 text-2xl font-semibold text-[#1a2332]">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mb-6 text-sm text-[#6b7280]">
            {mode === "signin"
              ? "Sign in to your account to continue"
              : "Start optimizing your LinkedIn presence today"}
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600">
              {error}
            </div>
          )}

          <div className="mb-6 flex rounded-full border border-[#e3e6ea] bg-[#f5f6f8] p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 ${
                mode === "signin"
                  ? "bg-[#4a7aa8] text-white shadow-sm"
                  : "text-[#4b5563] hover:text-[#1a2332]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200 ${
                mode === "signup"
                  ? "bg-[#4a7aa8] text-white shadow-sm"
                  : "text-[#4b5563] hover:text-[#1a2332]"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1a2332]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-[#d7dbe0] bg-white px-3.5 py-2.5 text-sm text-[#1a2332] placeholder:text-[#9aa2ab] focus:border-[#4a7aa8] focus:outline-none focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1a2332]">
                  Workspace / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. 3LM Solutions"
                  className="w-full rounded-lg border border-[#d7dbe0] bg-white px-3.5 py-2.5 text-sm text-[#1a2332] placeholder:text-[#9aa2ab] focus:border-[#4a7aa8] focus:outline-none focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1a2332]">
                Professional Email
              </label>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@admin.com"
                className="w-full rounded-lg border border-[#d7dbe0] bg-white px-3.5 py-2.5 text-sm text-[#1a2332] placeholder:text-[#9aa2ab] focus:border-[#4a7aa8] focus:outline-none focus:ring-1 focus:ring-[#4a7aa8]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1a2332]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#d7dbe0] bg-white px-3.5 py-2.5 pr-10 text-sm text-[#1a2332] placeholder:text-[#9aa2ab] focus:border-[#4a7aa8] focus:outline-none focus:ring-1 focus:ring-[#4a7aa8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa2ab]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-1 text-xs text-[#9aa2ab]">Must be at least 8 characters.</p>
              )}
            </div>

            {mode === "signin" && (
              <a href="#" className="-mt-2 text-sm font-medium text-[#4a7aa8]">
                Password forgotten?
              </a>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4a7aa8] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3f6a94] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}