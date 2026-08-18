"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Zap } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const posts = [
  { day: 3, title: "ERP Migration Case Study", type: "Case Study", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { day: 7, title: "Thought Leadership Post", type: "Publication", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { day: 14, title: "Q3 Industry Trends", type: "Carousel", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { day: 18, title: "Client Testimonial", type: "Publication", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { day: 21, title: "Product Update", type: "Announcement", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { day: 28, title: "Team Spotlight", type: "Publication", color: "bg-purple-100 text-purple-700 border-purple-200" },
];

export default function CalendarPage() {
  const [month, setMonth] = useState(9); // October
  const [year] = useState(2026);
  const [view, setView] = useState<"month" | "week">("month");

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Calendar</p>
          <h1 className="text-2xl font-bold text-slate-900">Editorial Calendar</h1>
          <p className="mt-1 text-sm text-slate-500">Plan and schedule your LinkedIn content.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex overflow-hidden rounded-xl border border-slate-200">
            {(["30d", "60d", "90d"] as const).map((d) => (
              <button key={d} className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 border-r border-slate-200 last:border-0">
                {d}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1a2f50]">
            <Plus className="h-4 w-4" /> Add post
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3f6a94]">
            <Zap className="h-4 w-4" /> AI Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Mini calendar + upcoming */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">{MONTHS[month]} {year}</span>
              <div className="flex gap-1">
                <button onClick={() => setMonth(m => m === 0 ? 11 : m - 1)} className="rounded-lg p-1 hover:bg-slate-100">
                  <ChevronLeft className="h-4 w-4 text-slate-400" />
                </button>
                <button onClick={() => setMonth(m => m === 11 ? 0 : m + 1)} className="rounded-lg p-1 hover:bg-slate-100">
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} className="py-1 text-[10px] font-bold text-slate-300">{d}</div>
              ))}
              {cells.map((day, i) => {
                const hasPost = day && posts.some(p => p.day === day);
                return (
                  <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-medium mx-auto
                    ${!day ? "" : hasPost ? "bg-[#4a7aa8] text-white font-bold" : "text-slate-600 hover:bg-slate-100 cursor-pointer"}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Upcoming posts</h3>
            <div className="flex flex-col gap-2">
              {posts.slice(0, 4).map((post, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-800 truncate">{post.title}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${post.color}`}>{post.type}</span>
                    <span className="text-[10px] text-slate-400">Oct {post.day}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main calendar grid */}
        <div className="col-span-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMonth(m => m === 0 ? 11 : m - 1)} className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50">
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </button>
              <h2 className="text-base font-bold text-slate-900">{MONTHS[month]} {year}</h2>
              <button onClick={() => setMonth(m => m === 11 ? 0 : m + 1)} className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50">
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              {(["month", "week"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-xs font-semibold capitalize border-r border-slate-200 last:border-0 transition-colors ${view === v ? "bg-[#0f1c33] text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 border-l border-t border-slate-100">
            {DAYS.map((d) => (
              <div key={d} className="border-b border-r border-slate-100 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              const dayPosts = day ? posts.filter(p => p.day === day) : [];
              return (
                <div key={i} className={`min-h-[90px] border-b border-r border-slate-100 p-2 ${!day ? "bg-slate-50/40" : "hover:bg-slate-50/60 cursor-pointer"}`}>
                  {day && (
                    <>
                      <span className={`text-xs font-bold ${dayPosts.length > 0 ? "text-[#4a7aa8]" : "text-slate-400"}`}>
                        {day}
                      </span>
                      <div className="mt-1 flex flex-col gap-1">
                        {dayPosts.map((post, pi) => (
                          <div key={pi} className={`truncate rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${post.color}`}>
                            {post.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}