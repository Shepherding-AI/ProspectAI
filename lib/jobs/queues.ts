import { Queue } from "bullmq";
import { connection } from "@/lib/jobs/redis";

export const queues = {
campaignRun: new Queue("campaign-run", { connection }),
accountEnrich: new Queue("account-enrich", { connection }),
accountScore: new Queue("account-score", { connection }),
notifySend: new Queue("notify-send", { connection }),
reminderCheck: new Queue("reminder-check", { connection }),
};
