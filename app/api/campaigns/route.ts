import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceFromRequest } from "@/lib/security/workspaceToken";

export async function GET(req: Request) {
  const auth = await requireWorkspaceFromRequest(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });

  const campaigns = await prisma.campaign.findMany({
    where: { workspaceId: auth.workspace.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ ok: true, campaigns });
}

export async function POST(req: Request) {
  const auth = await requireWorkspaceFromRequest(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });

  const body = await req.json();
  const user = await prisma.user.findFirst({ where: { workspaceId: auth.workspace.id } });
  if (!user) return NextResponse.json({ ok: false, error: "No user in workspace" }, { status: 400 });

  const c = await prisma.campaign.create({
    data: {
      workspaceId: auth.workspace.id,
      ownerId: user.id,
      name: body.name ?? "New Campaign",
      cron: body.cron ?? "0 7 * * 1-5",
      timezone: body.timezone ?? "America/Chicago",
      zipList: body.zipList ?? "",
      signalType: body.signalType ?? "NEW_BUSINESS_REGISTRATION",
      promptConfig: body.promptConfig ?? { states: ["MO","KS"] },
      status: body.status ?? "ACTIVE",
    },
  });
  return NextResponse.json({ ok: true, campaign: c });
}
