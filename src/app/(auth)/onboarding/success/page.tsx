"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import { getCompanyData } from "@/lib/companyStorage";

export default function OnboardingSuccess() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("your company");
  const [managerCompleted, setManagerCompleted] = useState(false);

  useEffect(() => {
    // FIX: these used to read the old plain global keys directly.
    // companyStorage.ts's namespacing migration moved both to
    // "onboarding_entreprise:{company_id}" / "onboarding_dirigeant:{company_id}"
    // — nothing writes to the old keys anymore, so this always silently
    // fell back to "your company" and managerCompleted=false.
    const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
    if (!companyId) return;

    const entrepriseRaw = getCompanyData("onboarding_entreprise", companyId);
    if (entrepriseRaw) {
      try {
        const entreprise = JSON.parse(entrepriseRaw);
        if (entreprise.nom) setCompanyName(entreprise.nom);
      } catch (err) {
        console.warn("Could not parse stored entreprise:", err);
      }
    }

    const dirigeantRaw = getCompanyData("onboarding_dirigeant", companyId);
    if (dirigeantRaw) {
      try {
        const dirigeant = JSON.parse(dirigeantRaw);
        setManagerCompleted(dirigeant.present === true);
      } catch (err) {
        console.warn("Could not parse stored dirigeant:", err);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md">

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Step 4 of 4</span>
            <span>100% complete</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-full rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">You are all set, {companyName}</h1>
          <p className="mt-2 text-sm text-slate-500">
            We have got what we need to run your first LinkedIn audit.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef4fa]">
                🏢
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800">Company profile</div>
                <div className="text-xs text-slate-400">Logo, description, services added</div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                Complete
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                👤
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800">Manager profile</div>
                <div className="text-xs text-slate-400">
                  {managerCompleted ? "Added during onboarding" : "Skipped — add anytime in Settings"}
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                  managerCompleted
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {managerCompleted ? "Complete" : "Skipped"}
              </span>
            </div>
          </div>

          {!managerCompleted && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4 text-left">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                Since the manager profile was skipped, your maximum possible score is capped at <strong>70%</strong>. Add it later to unlock the full score.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => router.push("/audit")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f1c33] py-3 text-sm font-semibold text-white hover:bg-[#1a2f50]"
            >
              <Zap className="h-4 w-4" />
              Run my first audit
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}