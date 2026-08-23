"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Sparkles,
  PenLine,
  Calendar,
  BarChart3,
  Search,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Audit", href: "/audit", icon: Activity },
  { label: "Optimization", href: "/optimization", icon: Sparkles },
  { label: "Content", href: "/content", icon: PenLine },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Benchmark", href: "/benchmark", icon: BarChart3 },
];

const secondaryNav = [
  { label: "AI Assistant", href: "/assistant", icon: HelpCircle },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

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

    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("company_id");
    localStorage.removeItem("onboarding_entreprise");
    localStorage.removeItem("onboarding_dirigeant");
    localStorage.removeItem("linkedin_data");
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

      <div className="mb-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.08] px-3 py-2 text-[13px] text-white/45">
        <Search size={14} />
        Search...
      </div>

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
          RS
        </div>
        <div className="flex-1">
          <div className="text-[12px] font-medium">Ruben Septimus</div>
          <div className="text-[10px] text-white/50">Pro Plan</div>
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