"use client";

import { useState } from "react";
import { Plus, ArrowUpRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

const competitors = [
  {
    name: "Talend Solutions",
    isYou: true,
    followers: 670,
    postsPerMonth: 4,
    engagementRate: 3.2,
    managerProfile: false,
    editorialConsistency: "Strong",
    formats: ["Text posts"],
    score: 63,
  },
  {
    name: "DataCorp International",
    isYou: false,
    followers: 12400,
    postsPerMonth: 8,
    engagementRate: 5.1,
    managerProfile: true,
    editorialConsistency: "Strong",
    formats: ["Text", "Video", "Carousel"],
    score: 83,
  },
  {
    name: "Nexalys Conseil",
    isYou: false,
    followers: 890,
    postsPerMonth: 3,
    engagementRate: 2.8,
    managerProfile: true,
    editorialConsistency: "Moderate",
    formats: ["Text posts"],
    score: 71,
  },
];

const insights = [
  { type: "warning", title: "You're behind on posting frequency", text: "DataCorp posts twice as often. Increasing to 6-8 posts/month would close the visibility gap.", },
  { type: "warning", title: "Both competitors have complete manager profiles", text: "Your empty manager profile is your biggest lever for score improvement.", },
  { type: "success", title: "Your editorial consistency is competitive", text: "You match DataCorp on content coherence — ahead of Nexalys. Build on this strength.", },
];

export default function BenchmarkPage() {
  const [adding, setAdding] = useState(false);

  const maxFollowers = Math.max(...competitors.map(c => c.followers));
  const maxPosts = Math.max(...competitors.map(c => c.postsPerMonth));
  const maxEngagement = Math.max(...competitors.map(c => c.engagementRate));

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Benchmark</p>
          <h1 className="text-2xl font-bold text-slate-900">Competitive Benchmark</h1>
          <p className="mt-1 text-sm text-slate-500">Compare your LinkedIn presence against key competitors.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]"
        >
          <Plus className="h-4 w-4" /> Add competitor
        </button>
      </div>

      {/* Competitor chips */}
      <div className="mb-6 flex flex-wrap gap-3">
        {competitors.map((c, i) => (
          <div key={i} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${c.isYou ? "bg-[#eef4fa] border-[#c9dcec] text-[#2a6ba0]" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${c.isYou ? "bg-[#4a7aa8]" : "bg-slate-400"}`}>
              {c.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            {c.name} {c.isYou && "(you)"}
          </div>
        ))}
        {adding && (
          <input
            autoFocus
            onBlur={() => setAdding(false)}
            placeholder="Company LinkedIn URL..."
            className="rounded-full border border-[#4a7aa8] px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#4a7aa8]"
          />
        )}
      </div>

      {/* Comparison table */}
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-3 px-5 text-left text-xs font-bold uppercase tracking-wide text-slate-400 w-48">Metric</th>
              {competitors.map((c, i) => (
                <th key={i} className={`py-3 px-5 text-left text-xs font-bold text-slate-700 ${c.isYou ? "bg-slate-50/80" : ""}`}>
                  {c.name} {c.isYou && <span className="text-[#4a7aa8]">(you)</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "LinkedIn Score", key: "score", suffix: "/100" },
              { label: "Followers", key: "followers" },
              { label: "Posts / month", key: "postsPerMonth" },
              { label: "Engagement rate", key: "engagementRate", suffix: "%" },
              { label: "Manager profile", key: "managerProfile" },
              { label: "Editorial consistency", key: "editorialConsistency" },
            ].map((row, ri) => (
              <tr key={ri} className="border-b border-slate-100 last:border-0">
                <td className="py-3 px-5 text-xs font-semibold text-slate-500">{row.label}</td>
                {competitors.map((c, ci) => {
                  const val = (c as any)[row.key];
                  const isYou = c.isYou;
                  let display: React.ReactNode = val;

                  if (typeof val === "boolean") {
                    display = val
                      ? <span className="text-emerald-600 font-bold">Complete</span>
                      : <span className="text-rose-600 font-bold">Missing</span>;
                  } else if (row.suffix) {
                    display = <span className="font-bold">{val}{row.suffix}</span>;
                  }

                  return (
                    <td key={ci} className={`py-3 px-5 text-sm ${isYou ? "bg-slate-50/80" : ""}`}>
                      {display}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar charts */}
      <div className="mb-6 grid grid-cols-3 gap-5">
        {[
          { title: "Engagement rate", data: competitors.map(c => ({ name: c.name, value: c.engagementRate, max: maxEngagement, isYou: c.isYou })), suffix: "%" },
          { title: "Posts per month", data: competitors.map(c => ({ name: c.name, value: c.postsPerMonth, max: maxPosts, isYou: c.isYou })), suffix: "" },
          { title: "LinkedIn score", data: competitors.map(c => ({ name: c.name, value: c.score, max: 100, isYou: c.isYou })), suffix: "/100" },
        ].map((chart, ci) => (
          <div key={ci} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-900">{chart.title}</h3>
            <div className="flex flex-col gap-3">
              {chart.data.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 truncate text-xs font-medium text-slate-500">{item.name.split(" ")[0]}</div>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.isYou ? "bg-[#4a7aa8]" : "bg-slate-300"}`}
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-12 text-right">{item.value}{chart.suffix}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-slate-900">Key insights</h2>
        <div className="flex flex-col gap-3">
          {insights.map((ins, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${ins.type === "warning" ? "border-rose-100 bg-rose-50/40" : "border-emerald-100 bg-emerald-50/40"}`}>
              <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${ins.type === "warning" ? "bg-rose-100" : "bg-emerald-100"}`}>
                {ins.type === "warning"
                  ? <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                  : <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{ins.title}</div>
                <div className="mt-0.5 text-xs text-slate-500">{ins.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}