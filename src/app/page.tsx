"use client";

import { useState } from "react";
import PromptForm from "@/components/PromptForm";
import ResultsList, { ScoutResult } from "@/components/ResultsList";

type ApiSuccess = {
  query: string;
  budget?: number | null;
  results: ScoutResult[];
  grounded: boolean;
};

type ApiError = { error: string };

export default function Home() {
  const [results, setResults] = useState<ScoutResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [budget, setBudget] = useState<number | null>(null);

  async function handleSearch(query: string) {
    const trimmed = query.trim();
    setError(null);
    setHasSearched(true);

    if (!trimmed) {
      setResults([]);
      setBudget(null);
      setError("Please type a travel request before searching.");
      return;
    }

    setLoading(true);
    setResults([]);
    setBudget(null);

    try {
      const res = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = (await res.json()) as ApiSuccess | ApiError;

      if (!res.ok) {
        setError("error" in data ? data.error : "Something went wrong.");
        return;
      }

      const ok = data as ApiSuccess;
      setResults(ok.results);
      setBudget(ok.budget ?? null);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Smart Travel Scout
          </h1>
          <p className="text-gray-600 mt-2">
             Describe your ideal travel experience and we’ll match it from our curated inventory.
          </p>

          {budget !== null && !loading && (
            <p className="mt-2 text-sm text-gray-700">
              Detected budget: <span className="font-medium">${budget}</span>
            </p>
          )}
        </header>

        <PromptForm onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-6 text-gray-600">
            AI is thinking… matching your request to the inventory.
          </div>
        )}

        {!loading && hasSearched && !error && results.length === 0 && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-gray-700">
            No matches found. Try changing your budget or adding keywords like
            “beach”, “history”, or “nature”.
          </div>
        )}

        <ResultsList results={results} />
      </div>
    </main>
  );
}