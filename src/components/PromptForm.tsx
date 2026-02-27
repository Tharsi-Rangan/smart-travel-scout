"use client";

import { useState } from "react";

type Props = {
  onSearch: (query: string) => void;
  loading: boolean;
};

export default function PromptForm({ onSearch, loading }: Props) {
  const [query, setQuery] = useState("");

  function submit() {
    onSearch(query);
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. chilled beach + surfing under $100"
          className="flex-1 rounded-lg border border-gray-400 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          aria-label="Travel request"
        />
        <button
          onClick={submit}
          disabled={loading}
          className="rounded-lg bg-black text-white px-4 py-2 hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
         Grounding: Results are limited to the available inventory.
      </p>
    </section>
  );
}
