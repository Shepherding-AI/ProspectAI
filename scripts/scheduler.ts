import "dotenv/config";
import cronParser from "cron-parser";
import { prisma } from "@/lib/db";
import { queues } from "@/lib/jobs/queues";
import { logger } from "@/lib/logger";

function computeNextRun(cron: string, tz: string) {
  const interval = cronParser.parseExpression(cron, { tz });
  return interval.next().toDate();
}

async function main() {
  const now = new Date();

  const due = await prisma.campaign.findMany({
    where: {
      status: "ACTIVE",
      OR: [{ nextRunAt: null }, { nextRunAt: { lte: now } }],
    },
    take: 100,
  });

  for (const c of due) {
    await queues.campaignRun.add("run", { campaignId: c.id }, { removeOnComplete: 500, removeOnFail: 500, attempts: 3 });
    const nextRunAt = computeNextRun(c.cron, c.timezone);
    await prisma.campaign.update({ where: { id: c.id }, data: { lastRunAt: now, nextRunAt } });
  }

  logger.info({ due: due.length }, "Scheduler tick complete");
  process.exit(0);
}

main().catch((e) => {
  logger.error({ err: String(e) }, "Scheduler failed");
  process.exit(1);
});
