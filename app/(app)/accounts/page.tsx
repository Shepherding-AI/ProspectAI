import { Nav } from "../_components/Nav";
import { prisma } from "@/lib/db";

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({ take: 100, orderBy: { updatedAt: "desc" } });

  return (
    <div className="container">
      <Nav />
      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <h1 className="h1">Accounts</h1>
            <p className="h2">Canonical account records with signal history.</p>
          </div>
          <a className="btn" href="/campaigns">Manage campaigns</a>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Stage</th>
              <th>Fit</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{a.name}</div>
                  <div className="small">{[a.city, a.state, a.zip].filter(Boolean).join(", ")}</div>
                </td>
                <td><span className="pill">{a.stage}</span></td>
                <td><span className="pill">{a.fitScore ?? "—"}</span></td>
                <td className="small">{new Date(a.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
