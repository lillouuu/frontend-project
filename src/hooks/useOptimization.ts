import { useState, useCallback } from "react";
import { createOptimisation, submitOptimizationDecisions } from "@/lib/api/optimization";
import { MOCK_OPTIMIZATION_DATA } from "@/lib/mockOptimizationData";
import type {
  OptimisationRequest,
  OptimisationResponse,
  OptimizationVerdict,
} from "@/types/optimization";

export function useOptimization() {
  const [data, setData] = useState<OptimisationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [decisionSubmitting, setDecisionSubmitting] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [decisionSuccess, setDecisionSuccess] = useState(false);

  const run = useCallback(async (payload: OptimisationRequest) => {
    setLoading(true);
    setError(null);
    setIsFallback(false);
    setDecisionSuccess(false);
    try {
      const result = await createOptimisation(payload);
      setData(result);
      return result;
    } catch (err) {
      console.warn("Optimization fetch failed, falling back to mock data:", err);
      setError(err instanceof Error ? err.message : "Failed to run optimization");
      setData(MOCK_OPTIMIZATION_DATA); // remove this fallback once the backend is reliably reachable
      setIsFallback(true);
      return MOCK_OPTIMIZATION_DATA;
    } finally {
      setLoading(false);
    }
  }, []);

  // The real accept/modify/reject feature. Doesn't fall back to mock data
  // on failure — a fake "success" here would be actively misleading, so it
  // just surfaces the error instead.
  const submitDecision = useCallback(async (verdict: OptimizationVerdict) => {
    setDecisionSubmitting(true);
    setDecisionError(null);
    setDecisionSuccess(false);
    try {
      const results = await submitOptimizationDecisions({ verdicts: [verdict] });
      setDecisionSuccess(true);
      return results;
    } catch (err) {
      console.warn("Submitting optimization decision failed:", err);
      setDecisionError(
        err instanceof Error ? err.message : "Failed to submit decision"
      );
      return null;
    } finally {
      setDecisionSubmitting(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    isFallback,
    run,
    submitDecision,
    decisionSubmitting,
    decisionError,
    decisionSuccess,
  };
}