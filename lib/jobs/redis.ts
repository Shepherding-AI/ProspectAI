import type { ConnectionOptions } from "bullmq";
import { env } from "@/lib/env";

export const connection: ConnectionOptions = {
  url: env.REDIS_URL,
};
