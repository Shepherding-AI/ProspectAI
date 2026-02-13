import { openai } from "@/lib/ai/openai";
import { AccountScoreZod, type AccountScore } from "@/lib/ai/contracts";
import { logger } from "@/lib/logger";

function tryParseJson(text: string) {
  try { return JSON.parse(text); } catch { return null; }
}

export async function aiScoreAccount(input: {
  tenant: any;
  campaignPromptConfig: any;
  account: any;
  signals: any[];
}) : Promise<{ ok: true; data: AccountScore } | { ok: false; raw: string; error: string }> {
  const basePrompt = `
You are a telecom sales intelligence engine.
Return ONLY valid JSON.
Do not invent contact info. If unknown, put it in missing_data.

TENANT OFFERINGS:
${input.tenant.offerings}

IDEAL CUSTOMERS:
${input.tenant.idealCustomers}

EXCLUSIONS:
${input.tenant.exclusions ?? "(none)"}

DIFFERENTIATORS:
${input.tenant.differentiators ?? "(none)"}

CAMPAIGN CONFIG (JSON):
${JSON.stringify(input.campaignPromptConfig)}

ACCOUNT (JSON):
${JSON.stringify(input.account)}

RECENT SIGNALS (JSON):
${JSON.stringify(input.signals)}
`.trim();

  // Attempt 1
  const r1 = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: basePrompt,
  });

  const t1 = r1.output_text ?? "";
  const j1 = tryParseJson(t1);
  const v1 = AccountScoreZod.safeParse(j1);
  if (v1.success) return { ok: true, data: v1.data };

  logger.warn({ issues: v1.success ? [] : v1.error.issues, sample: t1.slice(0, 200) }, "AI output invalid; attempting repair");

  // Repair attempt: ask model to fix JSON only
  const r2 = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Fix this to valid JSON matching the schema keys exactly. Return ONLY JSON.

${t1}`,
  });

  const t2 = r2.output_text ?? "";
  const j2 = tryParseJson(t2);
  const v2 = AccountScoreZod.safeParse(j2);
  if (v2.success) return { ok: true, data: v2.data };

  return { ok: false, raw: t2, error: "AI output failed schema validation" };
}
