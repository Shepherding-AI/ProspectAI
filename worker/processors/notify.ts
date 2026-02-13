import { prisma } from "@/lib/db";
import { recordNotification } from "@/lib/notify/notify";

export async function notifyNewLead(workspaceId: string, userEmail: string, accountId: string, campaignId: string) {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  await recordNotification({
    workspaceId,
    userEmail,
    channel: "inapp",
    payload: { type: "NEW_LEAD", accountId, campaignId, accountName: account?.name },
  });
}
