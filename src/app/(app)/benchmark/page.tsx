"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, Building2 } from "lucide-react";
import { useBenchmark } from "@/hooks/useBenchmark";

const CRITERE_LABELS: Record<string, string> = {
  frequence_publication: "Fréquence de publication",
  engagement: "Taux d'engagement",
  strategie_editoriale: "Stratégie éditoriale",
  branding: "Branding",
  positionnement: "Positionnement",
  mots_cles: "Mots-clés",
};

export default function BenchmarkPage() {
  const {
    candidates,
    loading,
    error,
    yourCompanyId,
    setYourCompanyId,
    result,
    running,
    runError,
    runBenchmark,
  } = useBenchmark();

  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);

  const toggleCompetitor = (id: string) => {
    setSelectedCompetitors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading your companies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-8 py-6 font-sans">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  // A "competitor" here is another company under YOUR OWN account with its
  // own completed audit — there is no real external LinkedIn lookup
  // anywhere in this system. See useBenchmark for why.
  const otherCompanies = candidates.filter((c) => c.id !== yourCompanyId);
  const eligibleCompetitors = otherCompanies.filter((c) => c.latestAuditId);

  return (
    <div className="min-h-screen bg-white px-8 py-6 font-sans">
      <div className="mb-8">
        <p className="mb-1 text-xs font-medium text-slate-400">Workspace / Benchmark</p>
        <h1 className="text-2xl font-bold text-slate-900">Competitive Benchmark</h1>
        <p className="mt-1 text-sm text-slate-500">
          Compare one of your companies against others you've onboarded and audited.
        </p>
      </div>

      {candidates.length < 2 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <Building2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">You need a second company first</h3>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">
            Benchmark compares your company against another company under your own account —
            there's no way to look up a real external competitor's LinkedIn page in this system.
            Onboard a second company (even a test one) and run an audit on it, then come back here.
          </p>
          <p className="mx-auto mt-2 max-w-md text-[11px] text-amber-600">
            Heads up: onboarding a second company will make it your active company everywhere
            else in the app (Dashboard, Audit, Content) until you switch back.
          </p>
          <Link
            href="/onboarding/company"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1a2f50]"
          >
            Onboard a second company
          </Link>
        </div>
      ) : eligibleCompetitors.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Your other {otherCompanies.length === 1 ? "company needs" : "companies need"} an audit first
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">
            {otherCompanies.map((c) => c.name).join(", ")} {otherCompanies.length === 1 ? "has" : "have"} no
            completed audit yet. Make {otherCompanies.length === 1 ? "it" : "one"} your active company,
            run an audit, then return here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Your company
            </label>
            <select
              value={yourCompanyId ?? ""}
              onChange={(e) => {
                setYourCompanyId(e.target.value);
                setSelectedCompetitors([]);
              }}
              className="mt-1 w-full max-w-sm rounded-xl border border-slate-200 p-2.5 text-sm font-medium outline-none focus:border-[#4a7aa8]"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Compare against
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {otherCompanies.map((c) => {
                const hasAudit = Boolean(c.latestAuditId);
                const selected = selectedCompetitors.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={!hasAudit}
                    onClick={() => toggleCompetitor(c.id)}
                    title={hasAudit ? undefined : "No completed audit yet"}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      !hasAudit
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                        : selected
                        ? "border-[#c9dcec] bg-[#eef4fa] text-[#2a6ba0]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {c.name} {!hasAudit && "(no audit yet)"}
                  </button>
                );
              })}
            </div>

            {runError && <p className="mt-3 text-xs font-medium text-rose-600">{runError}</p>}

            <button
              onClick={() => runBenchmark(selectedCompetitors)}
              disabled={running || selectedCompetitors.length === 0}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f1c33] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2f50] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running && <RefreshCw className="h-4 w-4 animate-spin" />}
              {running ? "Running benchmark..." : "Run Benchmark"}
            </button>
          </div>

          {result && (
            <>
              <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Overall benchmark score
                </h3>
                <p className="mt-1 text-4xl font-bold text-slate-900">
                  {result.resultat.score_benchmark ?? "—"}
                  <span className="text-lg font-medium text-slate-400">/100</span>
                </p>
              </div>

              <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Score by criterion</h3>
                <div className="flex flex-col gap-4">
                  {Object.entries(result.resultat.scores_par_critere).map(([code, score]) => (
                    <div key={code}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          {CRITERE_LABELS[code] ?? score.libelle}
                        </span>
                        <span className="text-slate-500">
                          You: <strong className="text-slate-900">{score.entreprise ?? "—"}%</strong>
                          {" · "}
                          Avg: <strong className="text-slate-900">{score.moyenne_concurrents ?? "—"}%</strong>
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#4a7aa8]"
                            style={{ width: `${score.entreprise ?? 0}%` }}
                          />
                        </div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-slate-400"
                            style={{ width: `${score.moyenne_concurrents ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <TrendingUp className="h-4 w-4" /> Points forts
                  </h3>
                  {result.resultat.points_forts.length === 0 ? (
                    <p className="text-xs text-emerald-700">Aucun point fort identifié.</p>
                  ) : (
                    <ul className="space-y-2 text-xs text-emerald-800">
                      {result.resultat.points_forts.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-800">
                    <TrendingDown className="h-4 w-4" /> Points faibles
                  </h3>
                  {result.resultat.points_faibles.length === 0 ? (
                    <p className="text-xs text-rose-700">Aucun point faible identifié.</p>
                  ) : (
                    <ul className="space-y-2 text-xs text-rose-800">
                      {result.resultat.points_faibles.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {result.resultat.recommandations.length > 0 && (
                <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold text-slate-900">Recommandations</h3>
                  <div className="flex flex-col gap-2.5">
                    {result.resultat.recommandations.map((r, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border p-4 text-xs ${
                          r.priorite === "CRITIQUE"
                            ? "border-rose-100 bg-rose-50/40"
                            : r.priorite === "IMPORTANTE"
                            ? "border-amber-100 bg-amber-50/40"
                            : "border-emerald-100 bg-emerald-50/40"
                        }`}
                      >
                        <span className="font-bold uppercase tracking-wide text-slate-500">
                          {r.priorite}
                        </span>
                        <p className="mt-1 font-semibold text-slate-800">{r.action}</p>
                        <p className="mt-1 text-slate-500">{r.raison}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}