import { logger } from "@/lib/logger";
import { fetchNewBusinessesOpenCorporates, type NewBizCandidate } from "./opencorporates";

export async function fetchNewBusinessCandidates(params: {
  zipList: string[];
  states: ("MO" | "KS")[];
  since?: Date;
  until?: Date;
}): Promise<NewBizCandidate[]> {
  const jurisdictions = params.states.map((s) => (s === "MO" ? "us_mo" : "us_ks")) as ("us_mo" | "us_ks")[];
  const results = await fetchNewBusinessesOpenCorporates({ jurisdictions, since: params.since, until: params.until });

  // OpenCorporates doesn't reliably include ZIP in search results. We'll keep candidates and
  // use enrichment to pull address/zip (next phase). For V1, we still create account+signal.
  logger.info({ count: results.length, states: params.states }, "Fetched new business candidates");
  return results;
}
