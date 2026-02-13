import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function enrichAccount(accountId: string) {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) return;

  // Production-ready hook point: add Clearbit/PeopleDataLabs/ZoomInfo-like enrichment here.
  // For V1 we just create a snapshot and mark ENRICHED.
  await prisma.enrichmentSnapshot.create({
    data: {
      accountId,
      source: "v1_stub",
      data: { note: "Enrichment connector not configured yet", website_guess: null },
      confidence: 0,
    },
  });

  await prisma.account.update({ where: { id: accountId }, data: { stage: "ENRICHED" } });
  logger.info({ accountId }, "Account enriched (stub)");
}
