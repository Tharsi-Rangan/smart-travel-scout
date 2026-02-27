"use client";

import { useState } from "react";

type TravelPackage = {
  id: number;
  title: string;
  location: string;
  price: number;
  tags: string[];
};

type ScoutResult = {
  item: TravelPackage;
  reason: string;
};

type ApiSuccess = {
  query: string;
  results: ScoutResult[];
  grounded: boolean;
};

type ApiError = {
  error: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScoutResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function onSearch() {
    const trimmed = query.trim();
    setError(null);
    setHasSearched(true);

    if (!trimmed) {
      setResults([]);
      setError("Please type a travel request before searching.");
      return;
    }

    setLoading(true);
    setResults([]);

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

      setResults((data as ApiSuccess).results);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") onSearch();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Smart Travel Scout
          </h1>
          <p className="text-gray-600 mt-2">
            Describe your ideal travel experience and I’ll match it from our
            inventory only.
          </p>
        </header>

        <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g. chilled beach + surfing under $100"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Travel request"
            />
            <button
              onClick={onSearch}
              disabled={loading}
              className="rounded-lg bg-black text-white px-4 py-2 hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Safety: Results are constrained to the provided inventory (no
            external destinations).
          </p>
        </section>

        {/* Status messages */}
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

        {/* Empty state */}
        {!loading && hasSearched && !error && results.length === 0 && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-gray-700">
            No matches found. Try changing your budget or adding keywords like
            “beach”, “history”, or “nature”.
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <section className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Matches
            </h2>

            {results.map((r) => (
              <div
                key={r.item.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {r.item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {r.item.location} • ${r.item.price}
                    </p>
                  </div>

                  <span className="text-xs rounded-full bg-gray-100 text-gray-800 px-3 py-1">
                    ID {r.item.id}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {r.item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-sm text-gray-800">
                  <span className="font-medium">Why this matches:</span>{" "}
                  {r.reason}
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}