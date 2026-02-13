import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { id: "ws_demo" },
    update: {},
    create: { id: "ws_demo", name: "Demo Workspace" },
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@local.dev" },
    update: {},
    create: { email: "demo@local.dev", name: "Demo User", workspaceId: workspace.id },
  });

  await prisma.tenantProfile.upsert({
    where: { workspaceId: workspace.id },
    update: {},
    create: {
      workspaceId: workspace.id,
      offerings: "Fiber DIA, SIP Trunking, SD-WAN, Managed Firewall",
      idealCustomers: "SMB, warehouses, multi-site retail, clinics, MDU property management",
      exclusions: "Residential-only, home-based businesses",
      differentiators: "Local engineering, fast installs, strong SLAs, proactive monitoring",
      defaultZips: "64118,64119,66213",
    },
  });

  await prisma.campaign.upsert({
    where: { id: "camp_demo" },
    update: {},
    create: {
      id: "camp_demo",
      workspaceId: workspace.id,
      ownerId: user.id,
      name: "MO+KS New Business Watch",
      status: "ACTIVE",
      cron: "*/15 * * * *",
      timezone: "America/Chicago",
      zipList: "64118,64119,66213",
      signalType: "NEW_BUSINESS_REGISTRATION",
      promptConfig: {
        states: ["MO", "KS"],
        industries: ["warehouse", "medical", "retail", "property management"],
        output: ["fit_score", "why_now", "outreach"],
        tone: "confident, helpful, human, not salesy",
      },
    },
  });

  console.log("Seed complete.");
  console.log("Workspace:", workspace.id);
  console.log("User email:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
