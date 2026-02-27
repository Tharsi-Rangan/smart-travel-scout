/**
 * Extracts a budget value from a user query, e.g. "$100" -> 100.
 * Returns null if no budget is present.
 */
export function extractBudget(query: string): number | null {
  // matches $100, $ 100, under $100, below $100 etc.
  const match = query.match(/\$\s*(\d{1,6})/);
  if (!match) return null;

  const value = Number(match[1]);
  if (Number.isNaN(value) || value <= 0) return null;

  return value;
}