import { z } from "zod";

export const AccountScoreZod = z.object({
  fit_score: z.number().int().min(0).max(100),
  why_now: z.string().min(1),
  key_reasons: z.array(z.string().min(1)).max(12),
  missing_data: z.array(z.string().min(1)).max(12),
  next_best_actions: z.array(z.string().min(1)).max(10),
  talk_track: z.string().min(1),
  outreach: z.object({
    email_1: z.string().min(1),
    call_opener: z.string().min(1),
    voicemail: z.string().min(1),
    linkedin_note: z.string().min(1),
  }),
});

export type AccountScore = z.infer<typeof AccountScoreZod>;
