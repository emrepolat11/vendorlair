import { useEffect, useMemo, useState } from "react";

const SUPABASE_URL = "https://zbubciohzssmunwdbdch.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidWJjaW9oenNzbXVud2RiZGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjE0MzMsImV4cCI6MjA5NzUzNzQzM30._mxfvMKXn6GxCQdNawfh33wcE91LoHg8WJ4NSLkCSjc";
const DEFAULT_NOTICE_DAYS = 90;

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const end = new Date(`${dateStr}T12:00:00`);
  const now = new Date();
  return Math.ceil((end - now) / 86400000);
}

function decisionDate(expiry, noticeDays = DEFAULT_NOTICE_DAYS) {
  if (!expiry) return null;
  const d = new Date(`${expiry}T12:00:00`);
  d.setDate(d.getDate() - noticeDays);
  return d;
}

function health(v) {
  const decision = decisionDate(v.contract_expiry);
  const decisionDays = decision ? Math.ceil((decision - new Date()) / 86400000) : null;
  if ((decisionDays !== null && decisionDays < 0) || (v.contract_expiry && daysUntil(v.contract_expiry) < 0)) {
    return { label: "Action required", color: "#FF6B6B" };
  }
  if ((decisionDays !== null && decisionDays <= 60) || !v.poc_name || !v.category) {
    return { label: "Attention needed", color: "#F59F00" };
  }
  return { label: "Healthy", color: "#69DB7C" };
}

function csvEscape(value) {
  const s = value == null ? "" : String(value);
  return `"${s.replaceAll('"', '""')}"`;
}

export default function PreviewEnhancements() {
  const [vendors, setVendors] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    let session;
    try { session = JSON.parse(localStorage.getItem("vl_session") || "null"); } catch { session = null; }
    if (!session?.token || !session?.user?.id) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/vendors?user_id=eq.${session.user.id}&order=created_at.desc`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.token}`,
        },
      });
      if (!res.ok) throw new Error("Could not load vendor data");
      setVendors(await res.json());
    } catch (e) {
      setError(e.message || "Could not load vendor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    const id = window.setInterval(load, 15000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(id);
    };
  }, []);

  const summary = useMemo(() => {
    const rows = vendors.map(v => ({ ...v, _health: health(v), _decision: decisionDate(v.contract_expiry) }));
    return {
      rows,
      action: rows.filter(v => v._health.label === "Action required").length,
      attention: rows.filter(v => v._health.label === "Attention needed").length,
      healthy: rows.filter(v => v._health.label === "Healthy").length,
    };
  }, [vendors]);

  const exportCsv = () => {
    const headers = ["Vendor","Status","Health","Category","Country","City","Contact","Contact email","Contract start","Contract expiry","Decision needed by (90d default)","Rating","Notes"];
    const lines = [headers.map(csvEscape).join(",")];
    summary.rows.forEach(v => {
      lines.push([
        v.name, v.status, v._health.label, v.category, v.country, v.city,
        v.poc_name, v.poc_email, v.contract_start, v.contract_expiry,
        v._decision ? v._decision.toISOString().slice(0,10) : "", v.rating, v.notes,
      ].map(csvEscape).join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendorlair-vendors-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  let session = null;
  try { session = JSON.parse(localStorage.getItem("vl_session") || "null"); } catch {}
  if (!session?.token) return null;

  return (
    <>
      <button onClick={() => { setOpen(v => !v); load(); }} style={{
        position: "fixed", right: 20, bottom: 20, zIndex: 3000,
        background: "#6C63FF", color: "#fff", border: "none", borderRadius: 999,
        padding: "11px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12,
        fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,.45)",
      }}>
        Action Centre {summary.action > 0 ? `· ${summary.action}` : ""}
      </button>

      {open && (
        <div className="vl-action-centre-panel" style={{
          position: "fixed", right: 20, bottom: 72, zIndex: 2999, width: "min(420px, calc(100vw - 28px))",
          maxHeight: "72vh", overflowY: "auto", background: "#111118",
          border: "1px solid rgba(255,255,255,.10)", borderRadius: 16,
          boxShadow: "0 28px 70px rgba(0,0,0,.55)", padding: 18,
          color: "#F0EDE6", fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 23, fontWeight: 700 }}>Needs your attention</div>
            <button onClick={exportCsv} disabled={!vendors.length} style={{ background: "rgba(108,99,255,.14)", border: "1px solid rgba(108,99,255,.35)", color: "#B6B0FF", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 11 }}>Export CSV</button>
          </div>
          <div style={{ fontSize: 10, color: "rgba(240,237,230,.35)", marginBottom: 14 }}>Preview uses a 90-day default notice period. No contract data is changed.</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 15 }}>
            {[
              ["Action", summary.action, "#FF6B6B"],
              ["Attention", summary.attention, "#F59F00"],
              ["Healthy", summary.healthy, "#69DB7C"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ background: "rgba(255,255,255,.035)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 10, color: "rgba(240,237,230,.4)" }}>{label}</div>
                <div style={{ fontSize: 23, fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>

          {loading && !vendors.length && <div style={{ color: "rgba(240,237,230,.45)", fontSize: 12 }}>Loading…</div>}
          {error && <div style={{ color: "#FF8787", fontSize: 12 }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {summary.rows
              .filter(v => v._health.label !== "Healthy")
              .sort((a,b) => (a._decision?.getTime() || Infinity) - (b._decision?.getTime() || Infinity))
              .map(v => {
                const h = v._health;
                const missing = [!v.poc_name && "contact", !v.category && "category"].filter(Boolean);
                const decision = v._decision ? v._decision.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;
                return (
                  <div key={v.id} style={{ border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: 11, background: "rgba(255,255,255,.025)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: h.color, whiteSpace: "nowrap" }}>{h.label}</div>
                    </div>
                    {decision && <div style={{ fontSize: 11, color: "rgba(240,237,230,.62)", marginTop: 4 }}>Decision needed by {decision} <span style={{ color: "rgba(240,237,230,.28)" }}>(90d default)</span></div>}
                    {v.contract_expiry && <div style={{ fontSize: 10, color: "rgba(240,237,230,.34)", marginTop: 2 }}>Contract expires {new Date(`${v.contract_expiry}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>}
                    {missing.length > 0 && <div style={{ fontSize: 10, color: "rgba(240,237,230,.34)", marginTop: 2 }}>Missing {missing.join(" and ")}</div>}
                  </div>
                );
              })}
            {!loading && !error && summary.rows.filter(v => v._health.label !== "Healthy").length === 0 && (
              <div style={{ padding: 12, border: "1px solid rgba(105,219,124,.15)", background: "rgba(105,219,124,.05)", borderRadius: 10, color: "#69DB7C", fontSize: 12 }}>Nothing urgent right now.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
