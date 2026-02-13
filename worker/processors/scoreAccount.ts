import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { aiScoreAccount } from "@/lib/ai/scoreAccount";

export async function scoreAccount(accountId: string, campaignId: string) {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { workspace: { include: { tenantProfile: true } } },
  });
  if (!account || !campaign?.workspace.tenantProfile) return;

  const signals = await prisma.signalEvent.findMany({
    where: { accountId },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  const result = await aiScoreAccount({
    tenant: campaign.workspace.tenantProfile,
    campaignPromptConfig: campaign.promptConfig,
    account,
    signals,
  });

  if (!result.ok) {
    await prisma.account.update({
      where: { id: accountId },
      data: { aiBrief: { error: result.error, raw: result.raw }, stage: "SCORED" },
    });
    logger.warn({ accountId }, "AI scoring failed validation; stored raw");
    return;
  }

  await prisma.account.update({
    where: { id: accountId },
    data: {
      fitScore: result.data.fit_score,
      aiWhyNow: result.data.why_now,
      aiNextSteps: result.data.next_best_actions,
      aiBrief: result.data,
      stage: "SCORED",
    },
  });

  logger.info({ accountId, fitScore: result.data.fit_score }, "Account scored");
}
