import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceFromRequest } from "@/lib/security/workspaceToken";

export async function GET(req: Request) {
  const auth = await requireWorkspaceFromRequest(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });

  const accounts = await prisma.account.findMany({
    where: { workspaceId: auth.workspace.id },
    orderBy: [{ updatedAt: "desc" }],
    take: 50,
    include: { signals: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return NextResponse.json({ ok: true, accounts });
}
