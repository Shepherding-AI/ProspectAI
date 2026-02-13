import { Nav } from "../_components/Nav";

async function fetchInbox() {
  const token = process.env.WORKSPACE_TOKEN ?? "ws_demo";
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/inbox`, {
    headers: { "x-workspace-token": token },
    cache: "no-store",
  });
  return res.json();
}

export default async function InboxPage() {
  const data = await fetchInbox();
  const accounts = data?.accounts ?? [];

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
                    <div className="small">{[a.city, a.state, a.zip].filter(Boolean).join(", ")}</div>
                  </td>
                  <td>
                    <span className="pill">{a.fitScore ?? "—"}</span>
                  </td>
                  <td className="muted" style={{ maxWidth: 420 }}>
                    {a.aiWhyNow ? a.aiWhyNow.slice(0, 120) + (a.aiWhyNow.length > 120 ? "…" : "") : "—"}
                  </td>
                  <td className="small">
                    {a.signals?.[0]?.source ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="small" style={{ marginTop: 12 }}>
            Tip: run <code>npm run scheduler:once</code> and <code>npm run worker</code> to populate intel.
          </p>
        </div>

        <div className="card">
          <h2 className="h1" style={{ fontSize: 18 }}>How auth works (V1)</h2>
          <p className="muted">
            For production, wire NextAuth/SSO. This V1 “pro” repo uses a Workspace Token header so you can deploy
            quickly and lock down APIs immediately.
          </p>
          <div className="row" style={{ marginTop: 10 }}>
            <div style={{ flex: 1 }}>
              <div className="small">Header required:</div>
              <div className="pill" style={{ marginTop: 6 }}>x-workspace-token</div>
            </div>
          </div>
          <p className="small" style={{ marginTop: 12 }}>
            Set <code>WORKSPACE_TOKEN=ws_demo</code> for local demo or use a real workspace id as token.
          </p>
        </div>
      </div>
    </div>
  );
}
