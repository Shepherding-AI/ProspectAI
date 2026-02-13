import { Nav } from "../_components/Nav";
import { prisma } from "@/lib/db";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({ take: 50, orderBy: { updatedAt: "desc" } });

  return (
    <div className="container">
      <Nav />
      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <h1 className="h1">Campaigns</h1>
            <p className="h2">Multi-signal schedules that produce ranked account intel.</p>
          </div>
          <span className="pill">MO + KS enabled</span>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Cron</th>
              <th>Zips</th>
              <th>Next run</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700 }}>{c.name}</td>
                <td><span className="pill">{c.status}</span></td>
                <td className="small">{c.cron}</td>
                <td className="small">{c.zipList}</td>
                <td className="small">{c.nextRunAt ? new Date(c.nextRunAt).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="small" style={{ marginTop: 12 }}>
          In Railway: run <code>npm run prisma:migrate:deploy</code> as a pre-deploy command, then run services:
          <code> npm run start</code> (web), <code>npm run worker</code> (worker), and a cron job calling <code>npm run scheduler:once</code>.
        </p>
      </div>
    </div>
  );
}
