import { useState, useCallback } from "react";
import { createGeneration } from "@/lib/api/generation";
import { MOCK_GENERATION_DATA } from "@/lib/mockGenerationData";
import type { GenerationRequest, GenerationResponse } from "@/types/generation";

// Unlike useAudit, this doesn't fetch automatically on page load — content
// generation only happens when the user submits the brief form. So instead
// of auto-running, this exposes a `generate(payload)` function the page
// calls from its submit handler.
export function useGeneration() {
  const [data, setData] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const generate = useCallback(async (payload: GenerationRequest) => {
    setLoading(true);
    setError(null);
    setIsFallback(false);
    try {
      const result = await createGeneration(payload);
      setData(result);
      return result;
    } catch (err) {
      console.warn("Generation fetch failed, falling back to mock data:", err);
      setError(err instanceof Error ? err.message : "Failed to generate content");
      setData(MOCK_GENERATION_DATA); // remove this fallback once the backend is reliably reachable
      setIsFallback(true);
      return MOCK_GENERATION_DATA;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, isFallback, generate };
}