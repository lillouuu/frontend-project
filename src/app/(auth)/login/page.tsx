"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, BarChart3, PenLine, Calendar, Eye, EyeOff } from "lucide-react";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    /* Changed bg-[#eef1f5] to bg-white below */
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
            Audit your company page, generate content, and track performance
            — all in one place.
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

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-full border border-[#e3e6ea] bg-[#f5f6f8] p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                mode === "signin"
                  ? "bg-[#4a7aa8] text-white"
                  : "text-[#4b5563]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                mode === "signup"
                  ? "bg-[#4a7aa8] text-white"
                  : "text-[#4b5563]"
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
                  placeholder="John Doe"
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
                placeholder="nom@entreprise.com"
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
            </div>

            {mode === "signin" && (
              <a href="#" className="-mt-2 text-sm font-medium text-[#4a7aa8]">
                Password forgotten?
              </a>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[#4a7aa8] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3f6a94]"
            >
              {mode === "signin" ? "Sign in" : "Sign up"}
            </button>

            {mode === "signup" && (
              <p className="text-center text-sm text-[#6b7280]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-medium text-[#4a7aa8]"
                >
                  Sign in
                </button>
              </p>
            )}

            <p className="mt-1 text-center text-xs text-[#9aa2ab]">
              By {mode === "signin" ? "signing in" : "signing up"}, you agree
              to our{" "}
              <a href="#" className="text-[#4a7aa8]">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#4a7aa8]">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}