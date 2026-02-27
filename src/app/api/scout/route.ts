import { NextResponse } from "next/server";
import { INVENTORY } from "@/data/inventory";
import { callGemini } from "@/lib/gemini";
import { ScoutResponseSchema } from "@/lib/schema";
import { extractBudget } from "@/lib/query";

/**
 * Builds the strict system prompt.
 * The AI must ONLY reference items from INVENTORY.
 */
function buildPrompt(userQuery: string): string {
  return `
You are Smart Travel Scout.

CRITICAL RULES:
- You MUST only recommend items from the INVENTORY provided below.
- You MUST NOT invent destinations, titles, or IDs.
- Return ONLY valid JSON. No markdown. No extra text.

OUTPUT FORMAT:
{
  "matches": [
    { "id": number, "reason": string }
  ]
}

MATCHING RULES:
- Respect user budget if mentioned.
- Prefer tag overlap (beach, surfing, history, etc).
- Consider location if specified.
- If ambiguous, return up to 3 relevant matches.
- If nothing matches, return: { "matches": [] }

USER QUERY:
${userQuery}

INVENTORY:
${JSON.stringify(INVENTORY)}
`;
}

/**
 * Extracts JSON safely from model output.
 */
function safeJsonParse(text: string) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Model did not return valid JSON.");
  }

  const jsonString = text.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonString);
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid travel request." },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(query.trim());
    const rawText = await callGemini(prompt);

    const parsedJson = safeJsonParse(rawText);

    // Zod validation boundary
    const validated = ScoutResponseSchema.parse(parsedJson);
    const budget = extractBudget(query.trim());

    // Grounding safeguard (remove invalid IDs)
    const inventoryMap = new Map(INVENTORY.map((item) => [item.id, item]));

    const groundedResults = validated.matches
      .filter((m) => inventoryMap.has(m.id))
      .map((m) => ({
        item: inventoryMap.get(m.id)!,
        reason: m.reason,
      }))
      .filter(({ item }) => (budget ? item.price <= budget : true));
    return NextResponse.json({
      query,
      budget,
      results: groundedResults,
      grounded: true,
    });
    
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
