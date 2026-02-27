"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Smart Travel Scout
        </h1>

        <p className="text-gray-600 mb-6">
          Describe your ideal travel experience and let AI find the best match
          from our curated inventory.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. a chilled beach weekend under $100"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            className="rounded-lg bg-black text-white px-4 py-2 hover:bg-gray-800 transition"
          >
            Search
          </button>
        </div>
      </div>
    </main>
  );
}