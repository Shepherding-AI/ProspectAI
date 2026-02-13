export function Nav() {
  return (
    <div className="nav">
      <div className="navLeft">
        <div style={{ width: 34, height: 34, borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)", display:"grid", placeItems:"center" }}>
          <span style={{ fontWeight: 800 }}>AI</span>
        </div>
        <div>
          <div style={{ fontWeight: 700, lineHeight: 1.1 }}>{process.env.NEXT_PUBLIC_APP_NAME ?? "AI Pipeline Intel"}</div>
          <div className="small">Signals → Accounts → Action</div>
        </div>
        <span className="badge">PRO</span>
      </div>
      <div className="navLinks">
        <a className="link" href="/inbox">Inbox</a>
        <a className="link" href="/accounts">Accounts</a>
        <a className="link" href="/campaigns">Campaigns</a>
        <a className="link" href="/settings">Settings</a>
      </div>
    </div>
  );
}
