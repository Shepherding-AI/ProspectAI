export const dynamic = "force-dynamic";

import { Nav } from "../_components/Nav";
import { prisma } from "@/lib/db";

export default async function InboxPage() {
  // NOTE: V1 uses a single workspace demo. For true multi-tenant, scope by workspaceId from auth.
  // For now, we pull the most recent accounts (you can add workspace scoping next).
  const accounts = await prisma.account.findMany({
    take: 50,
    orderBy: [{ updatedAt: "desc" }],
    include: {
      signals: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div className="container">
      <Nav />
      <div className="grid">
        <div className="card">
          <div className="cardHeader">
            <div>
              <h1 className="h1">Intel Inbox</h1>
              <p className="h2">New signals ranked into accounts you can act on.</p>
            </div>
            <div className="kpi">
              <div>
                <div className="kpiNum">{accounts.length}</div>
                <div className="kpiLbl">recent accounts</div>
              </div>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Fit</th>
                <th>Why now</th>
                <th>Latest signal</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a: any) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{a.name}</div>
                    <div className="small">
                      {[a.city, a.state, a.zip].filter(Boolean).join(", ")}
                    </div>
                  </td>
                  <td>
                    <span className="pill">{a.fitScore ?? "—"}</span>
                  </td>
                  <td className="muted" style={{ maxWidth: 420 }}>
                    {a.aiWhyNow
                      ? a.aiWhyNow.slice(0, 120) +
                        (a.aiWhyNow.length > 120 ? "…" : "")
                      : "—"}
                  </td>
                  <td className="small">
                    {a.signals?.[0]?.source ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="small" style={{ marginTop: 12 }}>
            Tip: run <code>npm run scheduler:once</code> and{" "}
            <code>npm run worker</code> to populate intel.
          </p>
        </div>

        <div className="card">
          <h2 className="h1" style={{ fontSize: 18 }}>
            Next upgrade (multi-tenant ready)
          </h2>
          <p className="muted">
            Right now this page shows accounts across the database. Next step is
            scoping by <code>workspaceId</code> based on auth (Clerk/NextAuth)
            or the current token gate.
          </p>
          <p className="small" style={{ marginTop: 12 }}>
            After we wire auth, every Prisma query becomes:
            <br />
            <code>where: {"{ workspaceId }"}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
