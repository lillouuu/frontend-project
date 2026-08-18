"use client";

import { useState } from "react";
import { User, Building2, Bell, Users, CreditCard, Sparkles, ChevronRight, Plus, X } from "lucide-react";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "company", label: "Company Profile", icon: Building2 },
  { id: "manager", label: "Manager Profile", icon: User },
  { id: "ai_voice", label: "AI Brand Voice", icon: Sparkles },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
  { id: "subscription", label: "Subscription", icon: CreditCard },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
        on ? "justify-end bg-[#4a7aa8]" : "justify-start bg-slate-200"
      }`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow" />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [notifs, setNotifs] = useState({ weekly: true, competitors: true, calendar: false });
  const [managerAdded, setManagerAdded] = useState(true);

  // Company State
  const [services, setServices] = useState<string[]>(["Data Quality", "ETL", "Cloud Governance"]);
  const [serviceInput, setServiceInput] = useState("");
  const [hasCta, setHasCta] = useState(true);

  // AI Brand Voice State
  const [aiTone, setAiTone] = useState("professionnel");

  const addService = () => {
    if (serviceInput.trim()) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8">
        <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Settings</p>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account, company profile, AI tone, and subscription.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Settings Nav */}
        <div className="col-span-1">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-slate-100 font-semibold text-slate-900"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="col-span-3 flex flex-col gap-5">
          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Account Security</h2>
              <p className="mb-5 text-xs text-slate-400">Your personal credentials and profile details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                  <input defaultValue="Ruben Septimus" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Professional email</label>
                  <input defaultValue="ruben@3lmsolutions.com" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                  <input type="password" defaultValue="••••••••••••" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
              </div>
              <button className="mt-5 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]">
                Save changes
              </button>
            </div>
          )}

          {/* COMPANY PROFILE TAB */}
          {activeTab === "company" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Company Page Details</h2>
              <p className="mb-5 text-xs text-slate-400">Manage data used for your LinkedIn Company Page audit</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Company Name</label>
                  <input defaultValue="3LM Solutions" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Slogan</label>
                  <input defaultValue="Data integration at the service of your growth" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                  <textarea rows={3} defaultValue="3LM Solutions accompanies companies in data integration and governance." className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn URL</label>
                  <input defaultValue="https://linkedin.com/company/3lm-solutions" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Services Offered</label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {services.map((s, i) => (
                      <span key={i} className="flex items-center gap-1 rounded-full bg-[#eef4fa] px-3 py-1 text-xs font-semibold text-[#4a7aa8]">
                        {s}
                        <button type="button" onClick={() => setServices(services.filter((_, idx) => idx !== i))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                      placeholder="+ Add service"
                      className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#4a7aa8]"
                    />
                    <button type="button" onClick={addService} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">Has Active Call to Action (CTA)?</span>
                  <Toggle on={hasCta} onChange={() => setHasCta(!hasCta)} />
                </div>

                {hasCta && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">CTA Label</label>
                      <input defaultValue="Visit website" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">CTA Target URL</label>
                      <input defaultValue="https://3lmsolutions.com" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                    </div>
                  </div>
                )}
              </div>
              <button className="mt-5 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]">
                Save changes
              </button>
            </div>
          )}

          {/* MANAGER PROFILE TAB */}
          {activeTab === "manager" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Manager (Dirigeant) Profile</h2>
              <p className="mb-5 text-xs text-slate-400">Accountable for 30% of your total LinkedIn score evaluation</p>
              
              <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-700">Include Manager in Audit Score</div>
                  <div className="text-xs text-slate-400">{managerAdded ? "Active — Evaluating full company + executive presence" : "Disabled — Score will evaluate company page only"}</div>
                </div>
                <Toggle on={managerAdded} onChange={() => setManagerAdded(!managerAdded)} />
              </div>

              {managerAdded && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Manager Name</label>
                      <input defaultValue="Alexandre Chen" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Job Title / Headline</label>
                      <input defaultValue="CEO & Founder at 3LM Solutions | Keynote speaker" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Manager Summary / Bio</label>
                    <textarea rows={3} defaultValue="Serial entrepreneur in data governance with 15+ years of strategic leadership." className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn Profile URL</label>
                    <input defaultValue="https://linkedin.com/in/alexandre-chen" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                  </div>
                </div>
              )}
              <button className="mt-5 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]">
                Save changes
              </button>
            </div>
          )}

          {/* AI BRAND VOICE TAB */}
          {activeTab === "ai_voice" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">AI Brand Voice & Context</h2>
              <p className="mb-5 text-xs text-slate-400">Controls how the AI rewrites copy and generates post content</p>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Desired Tone (ton_souhaite)</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                  >
                    <option value="professionnel">Professionnel (Recommended)</option>
                    <option value="expert">Expert & Authoritative</option>
                    <option value="engageant">Engageant & Accessible</option>
                    <option value="inspirant">Inspirant & Visionnaire</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Target Industry / Sector</label>
                  <input defaultValue="Data Governance & IT Consulting" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Target Audience (Cible Client)</label>
                  <input defaultValue="CTOs, CIOs, Data Directors in Mid-Market & Enterprise (PME/ETI)" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
              </div>

              <button className="mt-5 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]">
                Save changes
              </button>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Notifications</h2>
              <p className="mb-5 text-xs text-slate-400">Choose what you want to be alerted about</p>
              <div className="flex flex-col divide-y divide-slate-100">
                {[
                  { key: "weekly", label: "Weekly performance summary", hint: "A recap of your score, engagement, and follower growth" },
                  { key: "competitors", label: "Competitor activity alerts", hint: "Notify me when a tracked competitor posts or changes strategy" },
                  { key: "calendar", label: "Content calendar reminders", hint: "Get reminded before a scheduled post is due" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-700">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.hint}</div>
                    </div>
                    <Toggle
                      on={notifs[item.key as keyof typeof notifs]}
                      onChange={() => setNotifs({ ...notifs, [item.key]: !notifs[item.key as keyof typeof notifs] })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === "team" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Team Workspace</h2>
              <p className="mb-5 text-xs text-slate-400">Manage people with access to this workspace</p>
              <div className="flex flex-col divide-y divide-slate-100">
                {[
                  { initials: "RS", name: "Ruben Septimus", email: "ruben@3lmsolutions.com", role: "Owner" },
                  { initials: "LM", name: "Léa Martin", email: "lea@3lmsolutions.com", role: "Editor" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center gap-3 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4a7aa8] text-xs font-bold text-white">
                      {member.initials}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800">{member.name}</div>
                      <div className="text-xs text-slate-400">{member.email}</div>
                    </div>
                    <span className="rounded-full bg-[#eef4fa] px-2.5 py-0.5 text-xs font-semibold text-[#2a6ba0]">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]">
                + Invite team member
              </button>
            </div>
          )}

          {/* SUBSCRIPTION TAB */}
          {activeTab === "subscription" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Subscription Plans</h2>
              <p className="mb-5 text-xs text-slate-400">Manage your plan tiers and limits</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <div className="text-base font-bold text-slate-900">Découverte</div>
                  <div className="text-xs text-slate-500">Free Trial</div>
                  <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600">
                    <div>✓ Limited Audit</div>
                    <div>✓ Basic Optimizations</div>
                    <div>✓ 5 AI Posts / Mo</div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#4a7aa8] bg-[#f7fafd] p-5 shadow-sm">
                  <span className="rounded-full bg-[#4a7aa8] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Active Plan</span>
                  <div className="mt-1 text-base font-bold text-slate-900">Offre Pro</div>
                  <div className="text-xs text-slate-500">$49 / month</div>
                  <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600">
                    <div>✓ Unlimited Audits</div>
                    <div>✓ Full AI Optimization</div>
                    <div>✓ AI Assistant Chat</div>
                    <div>✓ Editorial Calendar</div>
                    <div>✓ Competitor Benchmark</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <div className="text-base font-bold text-slate-900">Offre Business</div>
                  <div className="text-xs text-slate-500">$129 / month</div>
                  <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600">
                    <div>✓ Multi-Company & Managers</div>
                    <div>✓ Team Collaboration</div>
                    <div>✓ Automated Monitoring</div>
                    <div>✓ Advanced PDF Reports</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50]">
                  Upgrade to Business
                </button>
                <button className="rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                  Cancel subscription
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}