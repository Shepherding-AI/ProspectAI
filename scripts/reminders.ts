import "dotenv/config";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

// V1 placeholder: implement reminder rules + channel delivery.
// This script is wired so you can run it as a Railway cron job.
async function main() {
  const count = await prisma.reminderRule.count();
  logger.info({ rules: count }, "Reminder tick (placeholder)");
  process.exit(0);
}
main().catch((e) => {
  logger.error({ err: String(e) }, "Reminder tick failed");
  process.exit(1);
});
