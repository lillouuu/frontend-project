"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Globe, Plus, X, Loader2 } from "lucide-react";
import { createCompany } from "@/lib/api/company";
import { setCompanyData } from "@/lib/companyStorage";

// ---------------------------------------------------------------------------
// On submit, this now calls the real POST /api/companies/create endpoint
// (confirmed to exist per the backend README) and stores the real
// company_id it returns. The request payload shape is a GUESS — see
// types/company.ts for details — so field names may need correcting once
// you can see the actual schema.
//
// If the call fails (backend not running, wrong field names, etc.), it
// falls back to a local-only ID so onboarding doesn't hard-block your
// testing — same fallback philosophy as everything else built today.
// The full "entreprise" shape (matching the extraction schema) still gets
// saved to localStorage either way, since useAudit's linkedin_data reads
// from there regardless of whether the company was created server-side.
// ---------------------------------------------------------------------------

export default function OnboardingCompany() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<string[]>(["Data Quality"]);
  const [serviceInput, setServiceInput] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hasCta, setHasCta] = useState(true);
  const [ctaType, setCtaType] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const addService = () => {
    if (serviceInput.trim()) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const entreprise = {
      nom: companyName,
      url_linkedin: linkedinUrl || null,
      logo: { present: !!logoFile, url: null },
      banniere: { present: !!bannerFile, url: null },
      slogan,
      description,
      services,
      cta: hasCta ? { present: true, type: ctaType || null, url: ctaUrl || null } : { present: false, type: null, url: null },
      coordonnees: {
        site_web: website || null,
        telephone: phone || null,
        email: email || null,
        adresse: address || null,
      },
      secteur: null,
      taille: null,
      specialites: [],
      nombre_abonnes: null,
      publications: [],
    };

    let companyId: string;
    try {
      // Backend only stores name + linkedin_url — the rest of the form
      // data (slogan, description, services, etc.) lives in `entreprise`
      // below, saved to localStorage for the audit's linkedin_data.
      const created = await createCompany({
        name: companyName,
        linkedin_url: linkedinUrl || null,
      });
      companyId = created.id;
    } catch (err) {
      console.warn("Company creation failed, using local fallback ID:", err);
      // Note: a 400 here can also mean "Company name already exists" —
      // the backend checks uniqueness on `name` globally, not per-account.
      // Worth surfacing that distinction to the user if it keeps happening.
      setSubmitError(
        "Couldn't save to the backend (unreachable, or this company name is already taken) — continuing locally so you can keep testing."
      );
      companyId = localStorage.getItem("company_id") || `local-${Date.now()}`;
    }

    localStorage.setItem("company_id", companyId);
    setCompanyData("onboarding_entreprise", companyId, JSON.stringify(entreprise));

    router.push("/onboarding/manager");
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-white p-6 py-12">
      <div className="w-full max-w-xl">

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Step 2 of 4</span>
            <span>50% complete</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/2 rounded-full bg-[#4a7aa8]" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <span className="mb-2 inline-block rounded-full bg-[#eef4fa] px-3 py-1 text-xs font-semibold text-[#4a7aa8]">
              Step 2 of 4
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Your Company on LinkedIn</h1>
            <p className="mt-1 text-sm text-slate-500">
              This data is used to calculate your LinkedIn score accurately.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="border-b border-slate-100 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Identity
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Company name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. 3lm solutions"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Logo <span className="text-rose-500">*</span>
                </label>
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                  />
                  <Plus className="mb-1 h-5 w-5" />
                  {logoFile ? logoFile.name : "Upload logo"}
                </label>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Banner <span className="text-rose-500">*</span>
                </label>
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                  />
                  <Plus className="mb-1 h-5 w-5" />
                  {bannerFile ? bannerFile.name : "Upload banner"}
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Slogan <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="e.g. Data integration at the service of your growth"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                LinkedIn URL <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/company/..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Content
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your company activity, target clients, value proposition and key services..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Services <span className="text-rose-500">*</span>
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

            <div className="border-b border-slate-100 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Contact & CTA
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Website <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+216 ..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Address <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tunis, Tunisia..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">Does your LinkedIn page have a CTA button?</span>
              <button
                type="button"
                onClick={() => setHasCta(!hasCta)}
                className={`relative h-6 w-11 rounded-full transition-colors ${hasCta ? "bg-[#4a7aa8]" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${hasCta ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>

            {hasCta && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">CTA type</label>
                  <input
                    type="text"
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value)}
                    placeholder="e.g. Visit website"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">CTA URL</label>
                  <input
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]"
                  />
                </div>
              </div>
            )}

            {submitError && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                {submitError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f1c33] py-3 text-sm font-semibold text-white hover:bg-[#1a2f50] disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}