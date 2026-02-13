import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { queues } from "@/lib/jobs/queues";
import { fetchNewBusinessCandidates } from "@/lib/connectors/newBiz";
import { canonicalizeCompanyKey } from "@/lib/normalize/canonical";

export async function runCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { workspace: { include: { tenantProfile: true } }, owner: true },
  });
  if (!campaign) return;

  if (!campaign.workspace.tenantProfile) {
    logger.warn({ campaignId }, "No tenantProfile; skipping");
    return;
  }

  const zipList = campaign.zipList.split(",").map(z => z.trim()).filter(Boolean);
  const now = new Date();
  const since = campaign.lastRunAt ?? new Date(Date.now() - 1000 * 60 * 60 * 24 * 7); // 7d back for first run

  const states = (campaign.promptConfig as any)?.states ?? ["MO","KS"];
  const candidates = await fetchNewBusinessCandidates({
    zipList,
    states,
    since,
    until: now,
  });

  let created = 0;

  for (const c of candidates) {
    const canonicalKey = canonicalizeCompanyKey({ name: c.name, address1: c.address1 ?? null, zip: c.zip ?? null });

    const account = await prisma.account.upsert({
      where: { workspaceId_canonicalKey: { workspaceId: campaign.workspaceId, canonicalKey } },
      update: {
        name: c.name,
        address1: c.address1 ?? undefined,
        city: c.city ?? undefined,
        state: c.state ?? undefined,
        zip: c.zip ?? undefined,
      },
      create: {
        workspaceId: campaign.workspaceId,
        name: c.name,
        address1: c.address1,
        city: c.city,
        state: c.state,
        zip: c.zip,
        canonicalKey,
      },
    });

    await prisma.signalEvent.create({
      data: {
        workspaceId: campaign.workspaceId,
        campaignId: campaign.id,
        accountId: account.id,
        type: campaign.signalType,
        occurredAt: c.occurredAt ? new Date(c.occurredAt) : null,
        source: c.source,
        sourceId: c.sourceId,
        raw: c.raw,
      },
    });

    created++;

    await queues.accountEnrich.add("enrich", { accountId: account.id }, { attempts: 3, backoff: { type: "exponential", delay: 500 } });
    await queues.accountScore.add("score", { accountId: account.id, campaignId: campaign.id }, { attempts: 3, backoff: { type: "exponential", delay: 800 } });
  }

  logger.info({ campaignId, created, candidates: candidates.length }, "Campaign run complete");
}
