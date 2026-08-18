"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Plus, X, Info } from "lucide-react";

export default function OnboardingManager() {
  const router = useRouter();
  const [hasManager, setHasManager] = useState(true);
  const [skills, setSkills] = useState<string[]>(["Data Strategy", "Leadership", "AI"]);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState([
    { poste: "CEO & Founder", entreprise: "DataCorp International", date_debut: "2008", date_fin: null },
  ]);

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-xl">

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Step 3 of 4</span>
            <span>75% complete</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-3/4 rounded-full bg-[#4a7aa8]" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <span className="mb-2 inline-block rounded-full bg-[#eef4fa] px-3 py-1 text-xs font-semibold text-[#4a7aa8]">
              Step 3 of 4
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Manager's LinkedIn Profile</h1>
            <p className="mt-1 text-sm text-slate-500">
              The manager's profile accounts for 30% of your LinkedIn score.
            </p>
          </div>

          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              Skipping this step will cap your maximum possible score at <strong>70%</strong>. You can always come back and add it later in Settings.
            </p>
          </div>

          <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">My company has a manager on LinkedIn</span>
            <button
              type="button"
              onClick={() => setHasManager(!hasManager)}
              className={`relative h-6 w-11 rounded-full transition-colors ${hasManager ? "bg-[#4a7aa8]" : "bg-slate-200"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${hasManager ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {hasManager && (
            <form onSubmit={(e) => { e.preventDefault(); router.push("/onboarding/success"); }} className="space-y-5">

              <div className="border-b border-slate-100 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Identity
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input type="text" placeholder="John Doe" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn URL <span className="text-slate-400 font-normal">(optional)</span></label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input type="url" placeholder="linkedin.com/in/..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4a7aa8]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Photo <span className="text-rose-500">*</span></label>
                  <div className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 hover:bg-slate-100">
                    <Plus className="mb-1 h-5 w-5" />
                    Upload photo
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Banner <span className="text-rose-500">*</span></label>
                  <div className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 hover:bg-slate-100">
                    <Plus className="mb-1 h-5 w-5" />
                    Upload banner
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-100 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Profile Content
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Job Title <span className="text-rose-500">*</span></label>
                <input type="text" placeholder="e.g. CEO & Founder | Data Strategy Expert" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Bio / Resume <span className="text-rose-500">*</span></label>
                <textarea rows={3} placeholder="Describe the manager's background, expertise, achievements and vision..." className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a7aa8]" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Skills <span className="text-rose-500">*</span></label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-full bg-[#eef4fa] px-3 py-1 text-xs font-semibold text-[#4a7aa8]">
                      {s}
                      <button type="button" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="+ Add skill"
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#4a7aa8]"
                  />
                  <button type="button" onClick={addSkill} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Add</button>
                </div>
              </div>

              <div className="border-b border-slate-100 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Experiences
              </div>

              {experiences.map((exp, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{exp.poste} · {exp.entreprise}</div>
                    <div className="text-xs text-slate-400">{exp.date_debut} — {exp.date_fin ?? "present"}</div>
                  </div>
                  <button type="button" onClick={() => setExperiences(experiences.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" /> Add Experience
              </button>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => router.back()} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Back</button>
                <button type="submit" className="flex-1 rounded-xl bg-[#0f1c33] py-3 text-sm font-semibold text-white hover:bg-[#1a2f50]">Continue</button>
              </div>

              <button type="button" onClick={() => router.push("/onboarding/success")} className="w-full rounded-xl border border-slate-100 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-50">
                Skip for now
              </button>
            </form>
          )}

          {!hasManager && (
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.back()} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Back</button>
              <button type="button" onClick={() => router.push("/onboarding/success")} className="flex-1 rounded-xl bg-[#0f1c33] py-3 text-sm font-semibold text-white hover:bg-[#1a2f50]">Continue</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}