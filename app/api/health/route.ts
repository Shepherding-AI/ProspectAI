import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const ws = await prisma.workspace.count();
  return NextResponse.json({ ok: true, workspaces: ws });
}
