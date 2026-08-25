"use client";

import { useState, useEffect } from "react";
import { User, Building2, Bell, Users, CreditCard, Sparkles, ChevronRight, Plus, X, Loader2, Check } from "lucide-react";
import { getCurrentUser, updateCurrentUser, changePassword, updateAccountName, getMySubscription } from "@/lib/api/account";
import { getMyCompanies, updateCompany } from "@/lib/api/company";
import { createExecutive, getExecutive, updateExecutive } from "@/lib/api/executive";
import type { CurrentUser, Subscription } from "@/types/currentUser";
import type { Company } from "@/types/company";
import type { Executive } from "@/types/executive";
import { getCompanyData, setCompanyData } from "@/lib/companyStorage";

// ---------------------------------------------------------------------------
// Honest map of what's real vs. cosmetic on this page, confirmed against
// the actual backend schemas (not guessed):
//
// REAL, saves to the database:
//   - Account tab: full_name, email (PATCH /api/users/me), password
//     (PATCH /api/users/me/password)
//   - Company Profile tab: name + LinkedIn URL only (PATCH /api/companies/{id})
//   - Manager Profile tab: full_name, job_title, linkedin_url only
//     (PATCH /api/executives/{id})
//   - Subscription tab: current plan is real (GET /api/accounts/me/subscription)
//
// NOT SUPPORTED ANYWHERE IN THE BACKEND — no endpoint exists at all:
//   - Company slogan/description/services/CTA (backend model doesn't have
//     these fields — same gap as onboarding)
//   - Manager bio (same reason)
//   - AI Brand Voice tab (tone/sector/audience) — no persistence endpoint
//     found in any schema we've seen
//   - Notifications tab — no preferences endpoint exists
//   - Team tab — no self-service team/invite endpoint exists (only an
//     ADMIN-only account listing, not what a normal user needs here)
//   - Subscription upgrade/cancel buttons — changing tier is ADMIN-only
//     server-side (PATCH /api/admin/accounts/{id}/subscription), a normal
//     user has no self-service way to change their own plan
//
// The unsupported sections are visibly marked in the UI (not silently
// broken) so nobody mistakes "looks like a form" for "actually saves".
// ---------------------------------------------------------------------------

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

function NotConnectedBadge() {
  return (
    <span className="ml-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
      Not saved anywhere — lost on refresh
    </span>
  );
}

function LocalOnlyBadge() {
  return (
    <span className="ml-2 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
      Saved locally for your next audit — not in the database
    </span>
  );
}

function SavedToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="ml-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
      <Check className="h-3.5 w-3.5" /> Saved
    </span>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  // --- Real data loaded from the backend ---
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [executive, setExecutive] = useState<Executive | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(setUser).catch((err) => console.warn("Could not load user:", err));
    getMySubscription().then(setSubscription).catch((err) => console.warn("Could not load subscription:", err));

    const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
    if (companyId) {
      getMyCompanies()
        .then((companies) => setCompany(companies.find((c) => c.id === companyId) ?? companies[0] ?? null))
        .catch((err) => console.warn("Could not load company:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    const executiveId = typeof window !== "undefined" ? localStorage.getItem("executive_id") : null;
    if (executiveId) {
      getExecutive(executiveId).then(setExecutive).catch((err) => console.warn("Could not load executive:", err));
    }
  }, []);

  // --- Account tab form state ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setEmail(user.email);
    }
  }, [user]);

  const saveAccount = async () => {
    setAccountSaving(true);
    setAccountError(null);
    setAccountSaved(false);
    try {
      await updateCurrentUser({ full_name: fullName, email });
      if (currentPassword && newPassword) {
        await changePassword({ current_password: currentPassword, new_password: newPassword });
        setCurrentPassword("");
        setNewPassword("");
      }
      setAccountSaved(true);
      setTimeout(() => setAccountSaved(false), 2000);
    } catch (err) {
      setAccountError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setAccountSaving(false);
    }
  };

  // --- Company tab form state ---
  const [companyName, setCompanyName] = useState("");
  const [companyLinkedinUrl, setCompanyLinkedinUrl] = useState("");
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [hasCta, setHasCta] = useState(true);
  const [ctaType, setCtaType] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [companySaving, setCompanySaving] = useState(false);
  const [companySaved, setCompanySaved] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setCompanyName(company.name);
      setCompanyLinkedinUrl(company.linkedin_url || "");
    }
    // Load the rest (slogan, description, services, CTA) from what
    // onboarding saved locally — this is the only place they live.
    const companyIdForLoad = company?.id || localStorage.getItem("company_id") || "";
    const stored = getCompanyData("onboarding_entreprise", companyIdForLoad);
    if (stored) {
      try {
        const entreprise = JSON.parse(stored);
        setSlogan(entreprise.slogan || "");
        setDescription(entreprise.description || "");
        setServices(entreprise.services || []);
        setHasCta(entreprise.cta?.present ?? true);
        setCtaType(entreprise.cta?.type || "");
        setCtaUrl(entreprise.cta?.url || "");
      } catch (err) {
        console.warn("Could not parse stored entreprise data:", err);
      }
    }
  }, [company]);

  const addService = () => {
    if (serviceInput.trim()) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  // Rebuilds the combined linkedin_data blob (entreprise + dirigeant) that
  // useAudit reads, so edits here actually affect the next audit — even
  // though none of this reaches the database.
  const syncLinkedinData = (companyId: string, entreprise: Record<string, unknown>) => {
    const dirigeantRaw = getCompanyData("onboarding_dirigeant", companyId);
    const dirigeant = dirigeantRaw ? JSON.parse(dirigeantRaw) : { present: false };
    setCompanyData("onboarding_entreprise", companyId, JSON.stringify(entreprise));
    setCompanyData(
      "linkedin_data",
      companyId,
      JSON.stringify({ metadata: { version_schema: "1.0" }, entreprise, dirigeant })
    );
  };

  const saveCompany = async () => {
    if (!company) return;
    setCompanySaving(true);
    setCompanyError(null);
    setCompanySaved(false);
    try {
      // Only name + linkedin_url actually persist to the database —
      // slogan, description, services, CTA have nowhere to go server-side,
      // but ARE saved locally so the next audit actually uses them.
      const updated = await updateCompany(company.id, {
        name: companyName,
        linkedin_url: companyLinkedinUrl || null,
      });
      setCompany(updated);

      const existingEntreprise = JSON.parse(getCompanyData("onboarding_entreprise", company.id) || "{}");
      syncLinkedinData(company.id, {
        nom: companyName,
        url_linkedin: companyLinkedinUrl || null,
        slogan,
        description,
        services,
        cta: hasCta
          ? { present: true, type: ctaType || null, url: ctaUrl || null }
          : { present: false, type: null, url: null },
        // logo/banniere/coordonnees aren't editable here — preserved from
        // whatever onboarding originally saved, if anything did.
        logo: existingEntreprise.logo ?? { present: false, url: null },
        banniere: existingEntreprise.banniere ?? { present: false, url: null },
        coordonnees: existingEntreprise.coordonnees ?? {},
        secteur: null,
        taille: null,
        specialites: [],
        nombre_abonnes: null,
        publications: [],
      });

      setCompanySaved(true);
      setTimeout(() => setCompanySaved(false), 2000);
    } catch (err) {
      setCompanyError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setCompanySaving(false);
    }
  };

  // --- Manager tab form state ---
  const [managerAdded, setManagerAdded] = useState(true);
  const [managerName, setManagerName] = useState("");
  const [managerTitle, setManagerTitle] = useState("");
  const [managerBio, setManagerBio] = useState("");
  const [managerLinkedinUrl, setManagerLinkedinUrl] = useState("");
  const [managerSaving, setManagerSaving] = useState(false);
  const [managerSaved, setManagerSaved] = useState(false);
  const [managerError, setManagerError] = useState<string | null>(null);

  useEffect(() => {
    if (executive) {
      setManagerName(executive.full_name);
      setManagerTitle(executive.job_title || "");
      setManagerLinkedinUrl(executive.linkedin_url || "");
    }
    const companyIdForLoad = localStorage.getItem("company_id") || "";
    const stored = getCompanyData("onboarding_dirigeant", companyIdForLoad);
    if (stored) {
      try {
        const dirigeant = JSON.parse(stored);
        setManagerAdded(dirigeant.present ?? true);
        setManagerBio(dirigeant.resume || "");
      } catch (err) {
        console.warn("Could not parse stored dirigeant data:", err);
      }
    }
  }, [executive]);

  const saveManager = async () => {
    // FIX: no longer requires an existing executive record — creates one
    // if this is the first time, using the same company_id onboarding
    // would have used. Needs a company to attach to, though.
    if (!company) {
      setManagerError("No company found — complete Company Profile first, or finish onboarding.");
      return;
    }
    if (!managerName.trim()) {
      setManagerError("Manager name is required.");
      return;
    }
    setManagerSaving(true);
    setManagerError(null);
    setManagerSaved(false);
    try {
      // Only full_name, job_title, linkedin_url persist to the database —
      // bio has nowhere to go server-side, but IS saved locally so the
      // next audit actually reflects it.
      const payload = {
        full_name: managerName,
        job_title: managerTitle || null,
        linkedin_url: managerLinkedinUrl || null,
      };

      let updated: Executive;
      if (executive) {
        updated = await updateExecutive(executive.id, payload);
      } else {
        updated = await createExecutive({ company_id: company.id, ...payload });
        localStorage.setItem("executive_id", updated.id);
      }
      setExecutive(updated);

      const existingDirigeant = JSON.parse(getCompanyData("onboarding_dirigeant", company.id) || "{}");
      const dirigeant = {
        ...existingDirigeant,
        present: managerAdded,
        nom_complet: managerName,
        titre: managerTitle || null,
        resume: managerBio || null,
        url_linkedin: managerLinkedinUrl || null,
      };
      setCompanyData("onboarding_dirigeant", company.id, JSON.stringify(dirigeant));

      const entrepriseRaw = getCompanyData("onboarding_entreprise", company.id);
      const entreprise = entrepriseRaw ? JSON.parse(entrepriseRaw) : null;
      setCompanyData(
        "linkedin_data",
        company.id,
        JSON.stringify({ metadata: { version_schema: "1.0" }, entreprise, dirigeant })
      );

      setManagerSaved(true);
      setTimeout(() => setManagerSaved(false), 2000);
    } catch (err) {
      setManagerError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setManagerSaving(false);
    }
  };

  // --- Fully cosmetic tabs (no backend at all) ---
  const [notifs, setNotifs] = useState({ weekly: true, competitors: true, calendar: false });
  const [aiTone, setAiTone] = useState("professionnel");
  const [aiSector, setAiSector] = useState("");
  const [aiAudience, setAiAudience] = useState("");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

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
          {/* ACCOUNT TAB — fully real */}
          {activeTab === "account" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Account Security</h2>
              <p className="mb-5 text-xs text-slate-400">Your personal credentials and profile details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Professional email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Only needed if changing password"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">New password</label>
                  <input
                    type="password"
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                  />
                </div>
              </div>
              {accountError && <p className="mt-3 text-xs font-semibold text-rose-600">{accountError}</p>}
              <div className="mt-5 flex items-center">
                <button
                  onClick={saveAccount}
                  disabled={accountSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50] disabled:opacity-50"
                >
                  {accountSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save changes
                </button>
                <SavedToast show={accountSaved} />
              </div>
            </div>
          )}

          {/* COMPANY PROFILE TAB — name/URL real, rest cosmetic */}
          {activeTab === "company" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Company Page Details</h2>
              <p className="mb-5 text-xs text-slate-400">Manage data used for your LinkedIn Company Page audit</p>
              {!company && (
                <p className="mb-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  No company found for this account yet — complete onboarding first.
                </p>
              )}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Company Name</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={!company}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8] disabled:bg-slate-50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn URL</label>
                  <input
                    value={companyLinkedinUrl}
                    onChange={(e) => setCompanyLinkedinUrl(e.target.value)}
                    disabled={!company}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8] disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center text-sm font-medium text-slate-700">
                    Slogan <LocalOnlyBadge />
                  </label>
                  <input value={slogan} onChange={(e) => setSlogan(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center text-sm font-medium text-slate-700">
                    Description <LocalOnlyBadge />
                  </label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center text-sm font-medium text-slate-700">
                    Services Offered <LocalOnlyBadge />
                  </label>
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
                  <span className="flex items-center text-sm font-medium text-slate-700">
                    Has Active Call to Action (CTA)? <LocalOnlyBadge />
                  </span>
                  <Toggle on={hasCta} onChange={() => setHasCta(!hasCta)} />
                </div>

                {hasCta && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">CTA Label</label>
                      <input
                        value={ctaType}
                        onChange={(e) => setCtaType(e.target.value)}
                        placeholder="e.g. Visit website"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">CTA Target URL</label>
                      <input
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                      />
                    </div>
                  </div>
                )}
              </div>
              {companyError && <p className="mt-3 text-xs font-semibold text-rose-600">{companyError}</p>}
              <div className="mt-5 flex items-center">
                <button
                  onClick={saveCompany}
                  disabled={companySaving || !company}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50] disabled:opacity-50"
                >
                  {companySaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save changes
                </button>
                <SavedToast show={companySaved} />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Only Company Name and LinkedIn URL are saved to the database — slogan, description,
                services and CTA are saved locally and will be used in your next audit, but aren't
                stored server-side (no backend field exists for them yet).
              </p>
            </div>
          )}

          {/* MANAGER PROFILE TAB — name/title/URL real, bio cosmetic */}
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

              {!executive && !company && (
                <p className="mb-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  No company found yet — complete the Company Profile tab first, then you can add a manager here.
                </p>
              )}
              {!executive && company && (
                <p className="mb-4 text-xs text-sky-700 bg-sky-50 border border-sky-200 rounded-lg p-3">
                  No manager profile yet — fill this in and save to create one.
                </p>
              )}

              {managerAdded && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Manager Name</label>
                      <input
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Job Title / Headline</label>
                      <input
                        value={managerTitle}
                        onChange={(e) => setManagerTitle(e.target.value)}
                        placeholder="e.g. CEO & Founder"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center text-sm font-medium text-slate-700">
                      Manager Summary / Bio <LocalOnlyBadge />
                    </label>
                    <textarea rows={3} value={managerBio} onChange={(e) => setManagerBio(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn Profile URL</label>
                    <input
                      value={managerLinkedinUrl}
                      onChange={(e) => setManagerLinkedinUrl(e.target.value)}
                      placeholder="linkedin.com/in/..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                    />
                  </div>
                </div>
              )}
              {managerError && <p className="mt-3 text-xs font-semibold text-rose-600">{managerError}</p>}
              <div className="mt-5 flex items-center">
                <button
                  onClick={saveManager}
                  disabled={managerSaving || !company}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50] disabled:opacity-50"
                >
                  {managerSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {executive ? "Save changes" : "Create manager profile"}
                </button>
                <SavedToast show={managerSaved} />
              </div>
            </div>
          )}

          {/* AI BRAND VOICE TAB — fully cosmetic, no backend endpoint exists */}
          {activeTab === "ai_voice" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-1 flex items-center">
                <h2 className="text-base font-bold text-slate-900">AI Brand Voice & Context</h2>
                <NotConnectedBadge />
              </div>
              <p className="mb-5 text-xs text-slate-400">
                Controls how the AI rewrites copy and generates post content. No backend endpoint exists to
                persist these yet — changes here are lost on refresh.
              </p>

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
                  <input value={aiSector} onChange={(e) => setAiSector(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Target Audience (Cible Client)</label>
                  <input value={aiAudience} onChange={(e) => setAiAudience(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB — fully cosmetic, no backend endpoint exists */}
          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-1 flex items-center">
                <h2 className="text-base font-bold text-slate-900">Notifications</h2>
                <NotConnectedBadge />
              </div>
              <p className="mb-5 text-xs text-slate-400">No preferences endpoint exists in the backend yet — these toggles don't persist.</p>
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

          {/* TEAM TAB — fully cosmetic, no self-service team endpoint exists */}
          {activeTab === "team" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-1 flex items-center">
                <h2 className="text-base font-bold text-slate-900">Team Workspace</h2>
                <NotConnectedBadge />
              </div>
              <p className="mb-5 text-xs text-slate-400">
                No self-service team/invite endpoint exists in the backend yet. Showing your own account only.
              </p>
              <div className="flex flex-col divide-y divide-slate-100">
                {user && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4a7aa8] text-xs font-bold text-white">
                      {user.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800">{user.full_name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                    <span className="rounded-full bg-[#eef4fa] px-2.5 py-0.5 text-xs font-semibold text-[#2a6ba0]">
                      Owner
                    </span>
                  </div>
                )}
              </div>
              <button disabled className="mt-4 rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                + Invite team member (not available)
              </button>
            </div>
          )}

          {/* SUBSCRIPTION TAB — current plan real, upgrade/cancel are admin-only server-side */}
          {activeTab === "subscription" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-base font-bold text-slate-900">Subscription Plans</h2>
              <p className="mb-5 text-xs text-slate-400">
                {subscription
                  ? `Current plan: ${subscription.plan_tier} — ${subscription.status}`
                  : "Loading your current plan..."}
              </p>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { tier: "DECOUVERTE", label: "Découverte", price: "Free Trial", features: ["Limited Audit", "Basic Optimizations", "5 AI Posts / Mo"] },
                  { tier: "PRO", label: "Offre Pro", price: "$49 / month", features: ["Unlimited Audits", "Full AI Optimization", "AI Assistant Chat", "Editorial Calendar", "Competitor Benchmark"] },
                  { tier: "BUSINESS", label: "Offre Business", price: "$129 / month", features: ["Multi-Company & Managers", "Team Collaboration", "Automated Monitoring", "Advanced PDF Reports"] },
                ].map((plan) => {
                  const isActive = subscription?.plan_tier === plan.tier;
                  return (
                    <div
                      key={plan.tier}
                      className={`rounded-2xl p-5 ${
                        isActive ? "border-2 border-[#4a7aa8] bg-[#f7fafd] shadow-sm" : "border border-slate-200"
                      }`}
                    >
                      {isActive && (
                        <span className="rounded-full bg-[#4a7aa8] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          Active Plan
                        </span>
                      )}
                      <div className="mt-1 text-base font-bold text-slate-900">{plan.label}</div>
                      <div className="text-xs text-slate-500">{plan.price}</div>
                      <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600">
                        {plan.features.map((f) => (
                          <div key={f}>✓ {f}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button disabled className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                  Upgrade plan (not available)
                </button>
                <button disabled className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                  Cancel subscription (not available)
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Changing plans is admin-only on the backend right now — there's no self-service upgrade/cancel
                endpoint a regular user can call.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}