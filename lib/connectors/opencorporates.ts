import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export type NewBizCandidate = {
  name: string;
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  occurredAt?: string;
  source: string;
  sourceId?: string;
  raw: any;
};

type Jurisdiction = "us_mo" | "us_ks";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url: string, tries = 3) {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "ai-pipeline-intel/1.0" } });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text.slice(0, 200)}`);
      }
      return await res.json();
    } catch (e) {
      lastErr = e;
      const backoff = 400 * Math.pow(2, i) + Math.floor(Math.random() * 250);
      logger.warn({ err: String(e), backoff }, "OpenCorporates request failed, retrying");
      await sleep(backoff);
    }
  }
  throw lastErr;
}

export async function fetchNewBusinessesOpenCorporates(params: {
  jurisdictions: Jurisdiction[];
  since?: Date;
  until?: Date;
}): Promise<NewBizCandidate[]> {
  if (!env.OPENCORPORATES_API_TOKEN) {
    throw new Error("Missing OPENCORPORATES_API_TOKEN");
  }

  const token = env.OPENCORPORATES_API_TOKEN;
  const since = params.since ? params.since.toISOString().slice(0, 10) : undefined;
  const until = params.until ? params.until.toISOString().slice(0, 10) : undefined;

  const out: NewBizCandidate[] = [];

  for (const j of params.jurisdictions) {
    // OpenCorporates companies search endpoint (documented).
    // We use incorporation_date range when possible.
    const q = new URLSearchParams();
    q.set("api_token", token);
    q.set("jurisdiction_code", j);
    q.set("per_page", "50");
    if (since) q.set("incorporation_date", since);
    // Note: Some OpenCorporates params vary; this is a best-effort V1.
    // You can swap to official params per your plan level and endpoint support.
    const url = `https://api.opencorporates.com/v0.4/companies/search?${q.toString()}`;

    const json = await fetchJson(url, 3);
    const companies = json?.results?.companies ?? [];

    for (const item of companies) {
      const c = item?.company;
      if (!c?.name) continue;

      out.push({
        name: c.name,
        occurredAt: c.incorporation_date ? new Date(c.incorporation_date).toISOString() : undefined,
        source: "OpenCorporates",
        sourceId: c.company_number ? `${j}:${c.company_number}` : undefined,
        raw: item,
      });
    }
  }

  // if 'until' provided, filter locally (best-effort)
  if (until) {
    const untilD = new Date(until + "T23:59:59.999Z");
    return out.filter((x) => !x.occurredAt || new Date(x.occurredAt) <= untilD);
  }
  return out;
}
