export const dynamic = "force-dynamic";
import { Nav } from "../_components/Nav";
import { prisma } from "@/lib/db";

export default async function SettingsPage() {
  const profile = await prisma.tenantProfile.findFirst();

  return (
    <div className="container">
      <Nav />
      <div className="grid">
        <div className="card">
          <h1 className="h1">Tenant Profile</h1>
          <p className="h2">This is the brain of your scoring + outreach.</p>
          <div style={{ marginTop: 12 }}>
            <div className="small">Offerings</div>
            <div className="card" style={{ marginTop: 8 }}>{profile?.offerings ?? "—"}</div>
            <div className="small">Ideal Customers</div>
            <div className="card" style={{ marginTop: 8 }}>{profile?.idealCustomers ?? "—"}</div>
            <div className="small">Default Zips</div>
            <div className="card" style={{ marginTop: 8 }}>{profile?.defaultZips ?? "—"}</div>
          </div>
        </div>
        <div className="card">
          <h1 className="h1" style={{ fontSize: 18 }}>Deployment notes</h1>
          <ul className="muted">
            <li>Use separate Railway services: web, worker, and cron scheduler.</li>
            <li>Set env vars on all services: DATABASE_URL, REDIS_URL, OPENAI_API_KEY, AUTH_SECRET.</li>
            <li>Add OPENCORPORATES_API_TOKEN to enable MO/KS connector.</li>
          </ul>
          <p className="small">V1 auth uses x-workspace-token header. Replace with NextAuth/SSO in V1.1.</p>
        </div>
      </div>
    </div>
  );
}
