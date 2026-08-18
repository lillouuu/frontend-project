"use client";

import Link from "next/link";
import {
  BarChart3,
  Users,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const stats = [
  {
    label: "LinkedIn Score",
    value: "63",
    sub: "/ 100",
    badge: "Intermediate",
    badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: BarChart3,
    link: "/audit",
    linkLabel: "View audit",
  },
  {
    label: "Followers",
    value: "670",
    sub: "+60 this month",
    badge: "Live",
    badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: Users,
    link: null,
    linkLabel: null,
  },
  {
    label: "Engagement Rate",
    value: "3.2%",
    sub: "+0.4% vs last month",
    badge: "Active",
    badgeStyle: "bg-sky-50 text-sky-700 border border-sky-200",
    icon: TrendingUp,
    link: null,
    linkLabel: null,
  },
  {
    label: "Posts this month",
    value: "4",
    sub: "Target: 8",
    badge: "Below target",
    badgeStyle: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: Activity,
    link: "/content",
    linkLabel: "Generate content",
  },
];

const recommendations = [
  {
    level: "CRITICAL",
    text: "Complete the manager profile — title, bio, experience and skills are all missing",
    href: "/optimization",
    style: "text-rose-700 bg-rose-50 border-rose-200",
    dot: "bg-rose-500",
  },
  {
    level: "IMPORTANT",
    text: "Publish content regularly as the company manager to build personal branding",
    href: "/content",
    style: "text-amber-700 bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    level: "OPTIMIZATION",
    text: "Add differentiating elements to the company description",
    href: "/optimization",
    style: "text-emerald-700 bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
];

const categories = [
  { name: "Company page", score: 100, color: "bg-emerald-500" },
  { name: "Activity & engagement", score: 50, color: "bg-amber-500" },
  { name: "Manager profile", score: 0, color: "bg-rose-500" },
  { name: "Manager / company alignment", score: 0, color: "bg-rose-500" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">

      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Dashboard</p>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, 3LM Solutions</h1>
          <p className="mt-1 text-sm text-slate-500">Here's your LinkedIn presence overview for today.</p>
        </div>
        <Link
          href="/audit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a2f50]"
        >
          <Zap className="h-4 w-4" />
          Run Audit
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="mb-1 flex items-end gap-1">
                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                {stat.sub && <span className="mb-1 text-xs text-slate-400">{stat.sub}</span>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${stat.badgeStyle}`}>
                  {stat.badge}
                </span>
                {stat.link && (
                  <Link href={stat.link} className="flex items-center gap-1 text-xs font-semibold text-[#4a7aa8] hover:underline">
                    {stat.linkLabel}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-6">

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Score breakdown</h2>
                <p className="text-xs text-slate-400">Performance across all audit categories</p>
              </div>
              <Link href="/audit" className="flex items-center gap-1 text-xs font-semibold text-[#4a7aa8] hover:underline">
                Full report <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {categories.map((cat, i) => (
                <div key={i}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{cat.name}</span>
                    <span className="font-bold text-slate-900">{cat.score}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${cat.color} transition-all duration-700`} style={{ width: `${cat.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Priority recommendations</h2>
                <p className="text-xs text-slate-400">Actions ranked by impact on your score</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">3 pending</span>
            </div>
            <div className="flex flex-col gap-3">
              {recommendations.map((rec, i) => (
                <Link
                  key={i}
                  href={rec.href}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-100/60"
                >
                  <div className={`h-2 w-2 flex-shrink-0 rounded-full ${rec.dot}`} />
                  <span className={`flex-shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${rec.style}`}>
                    {rec.level}
                  </span>
                  <span className="flex-1 text-sm text-slate-700">{rec.text}</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-slate-900">Quick actions</h2>
            <div className="flex flex-col gap-2">
              {[
                { href: "/optimization", icon: CheckCircle2, label: "Optimize my page" },
                { href: "/content", icon: Zap, label: "Generate content" },
                { href: "/benchmark", icon: BarChart3, label: "Compare competitors" },
                { href: "/audit", icon: RefreshCw, label: "Run new audit" },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4fa]">
                      <Icon className="h-4 w-4 text-[#4a7aa8]" />
                    </div>
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Last audit</h2>
              <span className="text-xs text-slate-400">Jul 22, 2026</span>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path stroke="#f1f5f9" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path stroke="#f59e0b" strokeDasharray="63, 100" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-base font-black text-slate-900">63</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Intermediate</div>
                <div className="text-xs text-slate-400">Global score</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/60 p-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-500" />
              <span className="text-xs font-medium text-rose-700">Manager profile is empty — caps your score at 70%</span>
            </div>
            <Link
              href="/audit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View full report <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}