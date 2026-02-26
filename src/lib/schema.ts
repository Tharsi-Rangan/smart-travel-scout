import { z } from "zod";

/**
 * The AI is ONLY allowed to return IDs + a short reason.
 * We validate this at the boundary to prevent hallucinations or drift.
 */
export const ScoutResponseSchema = z.object({
  matches: z
    .array(
      z.object({
        id: z.number().int().positive(),
        reason: z.string().min(1).max(200),
      })
    )
    .max(5),
});

export type ScoutResponse = z.infer<typeof ScoutResponseSchema>;