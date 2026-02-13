import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function recordNotification(params: {
  workspaceId: string;
  userEmail: string;
  channel: "inapp" | "email";
  payload: any;
}) {
  await prisma.notification.create({
    data: {
      workspaceId: params.workspaceId,
      userEmail: params.userEmail,
      channel: params.channel,
      payload: params.payload,
    },
  });
  logger.info({ to: params.userEmail, channel: params.channel }, "Notification recorded");
}
