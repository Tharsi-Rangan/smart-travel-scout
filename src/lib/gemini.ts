import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Ensures required environment variables exist.
 * Fail fast if GEMINI_API_KEY is missing.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const genAI = new GoogleGenerativeAI(requireEnv("GEMINI_API_KEY"));

/**
 * Calls Gemini with a prompt.
 * We keep temperature at 0 for determinism and reduced hallucination.
 */
export async function callGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}