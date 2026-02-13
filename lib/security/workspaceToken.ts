import { z } from "zod";
import { prisma } from "@/lib/db";

const TokenSchema = z.string().min(10).max(200);

export async function requireWorkspaceFromRequest(req: Request) {
  const token = req.headers.get("x-workspace-token") ?? "";
  const parsed = TokenSchema.safeParse(token);
  if (!parsed.success) {
    return { ok: false as const, error: "Missing or invalid x-workspace-token" };
  }
  const workspace = await prisma.workspace.findFirst({ where: { id: parsed.data } });
  if (!workspace) {
    return { ok: false as const, error: "Workspace token not recognized" };
  }
  return { ok: true as const, workspace };
}
