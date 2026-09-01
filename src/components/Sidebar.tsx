"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Sparkles,
  PenLine,
  Calendar,
  BarChart3,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
  Radar,
} from "lucide-react";
import { getCurrentUser, getMySubscription } from "@/lib/api/account";
import { getMyCompanies } from "@/lib/api/company";
import { ApiError } from "@/lib/apiClient";
import type { Company } from "@/types/company";

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Audit", href: "/audit", icon: Activity },
  { label: "Optimization", href: "/optimization", icon: Sparkles },
  { label: "Content", href: "/content", icon: PenLine },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Benchmark", href: "/benchmark", icon: BarChart3 },
  { label: "Veille", href: "/veille", icon: Radar },
];

const secondaryNav = [
  { label: "AI Assistant", href: "/assistant", icon: HelpCircle },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Loading...");
  const [planLabel, setPlanLabel] = useState("");
  const [initials, setInitials] = useState("··");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string>("");

  useEffect(() => {
    setActiveCompanyId(localStorage.getItem("company_id") || "");
    getMyCompanies()
      .then(setCompanies)
      .catch((err) => console.warn("Could not load companies:", err));
  }, []);

  // FIX: previously there was nowhere in the entire app that showed which
  // company was "active", or any way to change it other than re-running
  // onboarding (which silently overwrites company_id with zero warning).
  // This makes the active company always visible and explicitly switchable.
  const handleSwitchCompany = (companyId: string) => {
    localStorage.setItem("company_id", companyId);
    // Full reload rather than router.push: every page's hooks read
    // company_id fresh on their own mount, and several (useAudit,
    // useDashboard, useBenchmark...) don't listen for storage changes —
    // a reload is the simplest way to guarantee everything re-fetches for
    // the newly selected company instead of showing stale data.
    window.location.href = "/dashboard";
  };

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setDisplayName(user.full_name);
        setInitials(
          user.full_name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        );
      })
      .catch((err) => {
        // FIX: useRequireAuth only checks that a token STRING exists, not
        // that it's still valid — an expired token used to pass that check,
        // render the whole page, then every real call 401d and silently
        // fell back to "Unknown user" / mock data instead of ever sending
        // the person back to login. This call already happens on every
        // protected page (Sidebar renders everywhere), so it doubles as
        // the real validity check we don't otherwise have.
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          router.replace("/login");
          return;
        }
        console.warn("Could not load current user:", err);
        setDisplayName("Unknown user");
        setInitials("?");
      });

    getMySubscription()
      .then((sub) => setPlanLabel(`${sub.plan_tier} Plan`))
      .catch((err) => {
        console.warn("Could not load subscription:", err);
        setPlanLabel("");
      });
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    // Confirmed against the real backend: POST /api/users/logout revokes
    // the refresh token server-side. It expects { refresh_token } in the
    // body and returns 204. Best-effort — if it fails (backend down,
    // token already invalid), we still clear local state and log out on
    // the frontend regardless, since staying "logged in" locally with a
    // dead session helps no one.
    const refreshToken = localStorage.getItem("refresh_token");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    if (refreshToken) {
      try {
        await fetch(`${baseUrl}/api/users/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (err) {
        console.warn("Server-side logout failed, clearing local session anyway:", err);
      }
    }

    // FIX: only clear session-specific pointers now. The old code also
    // cleared onboarding_entreprise/onboarding_dirigeant/linkedin_data —
    // those are now namespaced per company_id (see lib/companyStorage.ts),
    // so they should survive logout and be recovered automatically when
    // the same account logs back in. Clearing them here defeated that.
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("company_id");
    localStorage.removeItem("executive_id");
    router.push("/login");
  };

  return (
    // Fixed to the viewport: this sidebar never scrolls, only <main> does.
    <aside className="sticky top-0 flex h-screen w-56 flex-shrink-0 flex-col bg-[#0f1c33] px-4 py-5 text-white">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4a7aa8]">
          <Sparkles size={16} strokeWidth={2.5} />
        </div>
        <div className="text-[13px] font-semibold leading-tight">
          LinkedIn
          <br />
          AI Advisor
        </div>
      </div>

      {companies.length > 0 && (
        <div className="mb-4">
          <div className="mb-1 ml-1 text-[10px] font-semibold uppercase tracking-wide text-white/35">
            Active company
          </div>
          <select
            value={activeCompanyId}
            onChange={(e) => handleSwitchCompany(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.08] px-2.5 py-2 text-[13px] font-medium text-white outline-none [&>option]:bg-[#0f1c33]"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-2 ml-2 text-[10px] font-semibold uppercase tracking-wide text-white/35">
        Menu
      </div>

      <nav className="flex flex-col gap-0.5">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/[0.06]"
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="my-3 h-px bg-white/10" />

      <nav className="flex flex-col gap-0.5">
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/[0.06]"
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 pt-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4a7aa8] text-[11px] font-semibold">
          {initials}
        </div>
        <div className="flex-1">
          <div className="text-[12px] font-medium">{displayName}</div>
          <div className="text-[10px] text-white/50">{planLabel}</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/50 hover:text-white/90 transition-colors"
          aria-label="Log out"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}