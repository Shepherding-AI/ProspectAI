import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "@/lib/jobs/redis";
import { logger } from "@/lib/logger";
import { runCampaign } from "./processors/runCampaign";
import { enrichAccount } from "./processors/enrichAccount";
import { scoreAccount } from "./processors/scoreAccount";
import { notifyNewLead } from "./processors/notify";

logger.info("Worker starting...");

new Worker("campaign:run", async (job) => {
  await runCampaign(job.data.campaignId);
}, { connection });

new Worker("account:enrich", async (job) => {
  await enrichAccount(job.data.accountId);
}, { connection });

new Worker("account:score", async (job) => {
  await scoreAccount(job.data.accountId, job.data.campaignId);
}, { connection });

new Worker("notify:send", async (job) => {
  const { workspaceId, userEmail, accountId, campaignId } = job.data;
  await notifyNewLead(workspaceId, userEmail, accountId, campaignId);
}, { connection });

logger.info("Worker ready.");
