import { useState, useEffect } from "react";

const FREE_LIMIT = 10;

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Belize","Benin",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso",
  "Cambodia","Cameroon","Canada","Chile","China","Colombia","Congo","Costa Rica","Croatia",
  "Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece",
  "Guatemala","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kosovo","Kuwait",
  "Kyrgyzstan","Latvia","Lebanon","Libya","Liechtenstein","Lithuania","Luxembourg","Malaysia",
  "Malta","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Nepal","Netherlands","New Zealand","Nicaragua","Nigeria","North Macedonia","Norway","Oman",
  "Pakistan","Palestine","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia",
  "Slovenia","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden",
  "Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Tunisia","Turkey",
  "Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zimbabwe",
];

const CATEGORIES = [
  { label: "Marketing",            emoji: "📣" },
  { label: "Finance",              emoji: "💰" },
  { label: "Legal",                emoji: "⚖️" },
  { label: "Logistics",            emoji: "🚚" },
  { label: "Design",               emoji: "🎨" },
  { label: "Consulting",           emoji: "🧠" },
  { label: "IT Support",           emoji: "🖥️" },
  { label: "Accounting & Tax",     emoji: "🧾" },
  { label: "Payroll",              emoji: "💼" },
  { label: "Advertising & Media",  emoji: "📺" },
  { label: "Real Estate & Office", emoji: "🏢" },
  { label: "Insurance",            emoji: "🛡️" },
  { label: "Energy & Utilities",   emoji: "⚡" },
  { label: "Quality & Compliance", emoji: "✅" },
  { label: "Other",                emoji: "📦" },
];
const CAT_COLORS = {
  Marketing:               { bg:"#FFF0F6", color:"#C2255C", dot:"#E64980" },
  Finance:                 { bg:"#EBFBEE", color:"#2F9E44", dot:"#40C057" },
  Legal:                   { bg:"#FFF9DB", color:"#E67700", dot:"#F59F00" },
  Logistics:               { bg:"#E7F5FF", color:"#1971C2", dot:"#339AF0" },
  Design:                  { bg:"#F8F0FC", color:"#862E9C", dot:"#AE3EC9" },
  Consulting:              { bg:"#F0F4FF", color:"#3451B2", dot:"#4263EB" },
  "IT Support":            { bg:"#E8F8FF", color:"#0C8599", dot:"#15AABF" },
  "Accounting & Tax":      { bg:"#F1FCF4", color:"#1A7F3C", dot:"#2F9E44" },
  Payroll:                 { bg:"#EEF3FF", color:"#3B4AB2", dot:"#5C7CFA" },
  "Advertising & Media":   { bg:"#FFF3FB", color:"#9C2D87", dot:"#CC5DE8" },
  "Real Estate & Office":  { bg:"#FFF8F0", color:"#9C6200", dot:"#F08C00" },
  Insurance:               { bg:"#F0F8FF", color:"#1864AB", dot:"#228BE6" },
  "Energy & Utilities":    { bg:"#FFFCE0", color:"#846B00", dot:"#FAB005" },
  "Quality & Compliance":  { bg:"#EDFCF2", color:"#0F6B3A", dot:"#12B76A" },
  Other:                   { bg:"#F8F9FA", color:"#495057", dot:"#868E96" },
};

const STATUS_OPTIONS = [
  { label: "Active",   color: "#40C057", bg: "rgba(64,192,87,0.12)",  border: "rgba(64,192,87,0.3)"  },
  { label: "Inactive", color: "#868E96", bg: "rgba(134,142,150,0.12)", border: "rgba(134,142,150,0.3)" },
  { label: "On hold",  color: "#F59F00", bg: "rgba(245,159,0,0.12)",  border: "rgba(245,159,0,0.3)"  },
];

// Helper — days until a date (negative = already past)
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
const SUPABASE_URL = "https://zbubciohzssmunwdbdch.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidWJjaW9oenNzbXVud2RiZGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjE0MzMsImV4cCI6MjA5NzUzNzQzM30._mxfvMKXn6GxCQdNawfh33wcE91LoHg8WJ4NSLkCSjc";

async function supabase(method, path, body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${token || SUPABASE_ANON_KEY}`,
    "Prefer": method === "POST" ? "return=representation" : "",
  };
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error_description || "Request failed");
  }
  return res.status === 204 ? null : res.json();
}

async function authRequest(endpoint, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Auth failed");
  return data;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function InitialsAvatar({ name, size = 40, category }) {
  const initials = (name || "??").slice(0, 2).toUpperCase();
  const dot = category ? CAT_COLORS[category]?.dot : undefined;
  const pairs = [
    { bg:"#1a1a2e", color:"#A89FFF" },
    { bg:"#0d1f0d", color:"#6EE7B7" },
    { bg:"#1a0d1a", color:"#D9A0EF" },
    { bg:"#0d1a2e", color:"#60B8FF" },
    { bg:"#1f1a0d", color:"#F59F00" },
    { bg:"#1a0d0d", color:"#FF6B6B" },
  ];
  const pair = pairs[(name || "").charCodeAt(0) % pairs.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      background: pair.bg,
      border: `1px solid ${dot ? dot + "44" : "rgba(255,255,255,0.08)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.28, fontWeight: 800, flexShrink: 0,
      color: dot || pair.color,
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    }}>
      {initials}
    </div>
  );
}

function Stars({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s}
          onClick={() => !readonly && onChange(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            cursor: readonly ? "default" : "pointer",
            fontSize: readonly ? 13 : 20,
            color: s <= (hover || value) ? "#F5A623" : "rgba(255,255,255,0.15)",
            transition: "color 0.1s, transform 0.1s",
            transform: !readonly && s <= hover ? "scale(1.3)" : "scale(1)",
            display: "inline-block", userSelect: "none",
          }}>★</span>
      ))}
    </div>
  );
}

function Badge({ category }) {
  const c = CAT_COLORS[category] || CAT_COLORS.Other;
  const cat = CATEGORIES.find(x => x.label === category);
  return (
    <span style={{
      background: c.bg, color: c.color,
      padding: "3px 9px 3px 7px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      <span style={{ fontSize: 10 }}>{cat?.emoji}</span>{category}
    </span>
  );
}

// ── Stat card used inside Dashboard ────────────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "14px 16px",
    }}>
      <div style={{
        fontSize: 10, color: "rgba(240,237,230,0.35)",
        letterSpacing: "0.07em", textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif", marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontSize: 24, fontWeight: 700, lineHeight: 1,
        color: accent ? "#6C63FF" : "#F0EDE6",
        fontFamily: "'Cormorant Garamond', serif",
      }}>{value}</div>
      {sub && (
        <div style={{
          fontSize: 11, color: "rgba(240,237,230,0.3)",
          marginTop: 4, fontFamily: "'DM Sans', sans-serif",
        }}>{sub}</div>
      )}
    </div>
  );
}

// ── Upgrade Banner ─────────────────────────────────────────────────────────

function UpgradeBanner({ onUpgrade }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(108,99,255,0.15),rgba(116,192,252,0.08))",
      border: "1px solid rgba(108,99,255,0.25)", borderRadius: 14,
      padding: "18px 22px", margin: "0 0 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#F0EDE6", fontFamily: "'Cormorant Garamond', serif", marginBottom: 3 }}>
          You've reached 10 vendors
        </div>
        <div style={{ fontSize: 12, color: "rgba(240,237,230,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
          Upgrade to Pro for unlimited vendors — just $3/month.
        </div>
      </div>
      <button onClick={onUpgrade} style={{
        background: "#6C63FF", border: "none", color: "#fff",
        padding: "9px 18px", borderRadius: 8, fontSize: 12, fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif", cursor: "pointer", whiteSpace: "nowrap",
        boxShadow: "0 4px 14px rgba(108,99,255,0.35)",
      }}>
        Upgrade — $3/mo
      </button>
    </div>
  );
}

// ── Vendor Card ────────────────────────────────────────────────────────────

function VendorCard({ vendor, onEdit, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const accentColor = vendor.category ? CAT_COLORS[vendor.category]?.dot : "rgba(108,99,255,0.5)";
  const statusOpt = STATUS_OPTIONS.find(s => s.label === (vendor.status || "Active")) || STATUS_OPTIONS[0];
  const expiryDays = daysUntil(vendor.contract_expiry);
  const expiryWarning = expiryDays !== null && expiryDays <= 30;
  const expiryLabel = expiryDays === null ? null
    : expiryDays < 0 ? `Expired ${Math.abs(expiryDays)}d ago`
    : expiryDays === 0 ? "Expires today"
    : `Expires in ${expiryDays}d`;

  return (
    <div
      style={{
        background: "#111118",
        border: `1px solid ${expiryWarning ? "rgba(245,159,0,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14, padding: 18,
        display: "flex", flexDirection: "column", gap: 11,
        transition: "border-color 0.2s, transform 0.2s",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = expiryWarning ? "rgba(245,159,0,0.5)" : "rgba(108,99,255,0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = expiryWarning ? "rgba(245,159,0,0.3)" : "rgba(255,255,255,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Category accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: accentColor, borderRadius: "14px 14px 0 0",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <InitialsAvatar name={vendor.name} size={40} category={vendor.category} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: 16, color: "#F0EDE6", lineHeight: 1.2,
            }}>{vendor.name}</div>
            <span style={{ background: statusOpt.bg, color: statusOpt.color, border: `1px solid ${statusOpt.border}`, padding: "1px 7px", borderRadius: 20, fontSize: 9, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
              {vendor.status || "Active"}
            </span>
          </div>
          {vendor.website && (
            <a
              href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
              target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: "rgba(240,237,230,0.3)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
            >
              {vendor.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          <div style={{ marginTop: 6 }}>
            {vendor.category && <Badge category={vendor.category} />}
          </div>
        </div>
      </div>

      {(vendor.city || vendor.country) && (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 12 }}>📍</span>
          <span style={{ fontSize: 11, color: "rgba(240,237,230,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
            {[vendor.city, vendor.country].filter(Boolean).join(", ")}
          </span>
        </div>
      )}

      {(vendor.poc_name || vendor.poc_email || vendor.poc_phone) && (
        <div style={{
          background: "rgba(255,255,255,0.03)", borderRadius: 9,
          padding: "9px 11px", display: "flex", flexDirection: "column", gap: 3,
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ fontSize: 9, color: "rgba(240,237,230,0.25)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Contact</div>
          {vendor.poc_name  && <div style={{ fontSize: 12, color: "rgba(240,237,230,0.8)", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>👤 {vendor.poc_name}</div>}
          {vendor.poc_email && <div style={{ fontSize: 11, color: "#6C63FF", fontFamily: "'DM Sans', sans-serif" }}>✉️ {vendor.poc_email}</div>}
          {vendor.poc_phone && <div style={{ fontSize: 11, color: "rgba(240,237,230,0.35)", fontFamily: "'DM Sans', sans-serif" }}>📞 {vendor.poc_phone}</div>}
        </div>
      )}

      {(vendor.contract_start || vendor.contract_expiry) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {vendor.contract_start && (
            <div style={{ fontSize: 11, color: "rgba(240,237,230,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
              📅 Started {new Date(vendor.contract_start).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
            </div>
          )}
          {vendor.contract_expiry && (
            <div style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: expiryWarning ? "#F59F00" : "rgba(240,237,230,0.35)", fontWeight: expiryWarning ? 600 : 400 }}>
              {expiryWarning ? "⚠️" : "🔄"} {expiryLabel}
            </div>
          )}
        </div>
      )}

      {vendor.notes && (
        <div style={{ fontSize: 11, color: "rgba(240,237,230,0.4)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, borderLeft: "2px solid rgba(108,99,255,0.3)", paddingLeft: 9, fontStyle: "italic" }}>
          {vendor.notes.length > 100 ? vendor.notes.slice(0, 100) + "…" : vendor.notes}
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: "auto", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <Stars value={vendor.rating || 0} readonly />
        <div style={{ display: "flex", gap: 6 }}>
          {confirm ? (
            <>
              <button onClick={() => setConfirm(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,237,230,0.5)", padding: "4px 9px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              <button onClick={() => onDelete(vendor.id)} style={{ background: "rgba(250,82,82,0.12)", border: "1px solid rgba(250,82,82,0.25)", color: "#FF6B6B", padding: "4px 9px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Confirm</button>
            </>
          ) : (
            <>
              <button onClick={() => onEdit(vendor)} style={{ background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.25)", color: "#A89FFF", padding: "4px 11px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
              <button onClick={() => setConfirm(true)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(240,237,230,0.25)", padding: "4px 9px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Vendor Modal ───────────────────────────────────────────────────────────

function VendorModal({ vendor, onClose, onSave, loading }) {
  const [form, setForm] = useState(vendor || {
    name: "", website: "", country: "", city: "",
    poc_name: "", poc_email: "", poc_phone: "", category: "", rating: 0,
    status: "Active", notes: "", contract_start: "", contract_expiry: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inp = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 9, color: "#F0EDE6", padding: "11px 14px", fontSize: 13, width: "100%",
    outline: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
    boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const lbl = {
    fontSize: 10, color: "rgba(240,237,230,0.4)", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
    marginBottom: 6, display: "block",
  };
  const focus = e => { e.target.style.borderColor = "rgba(108,99,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.1)"; };
  const blur  = e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 26, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 13, boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 22, color: "#F0EDE6" }}>
            {vendor ? "Edit vendor" : "New vendor"}
          </span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,237,230,0.5)", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lbl}>Company name *</label>
            <input style={inp} value={form.name} onChange={e => set("name", e.target.value)} onFocus={focus} onBlur={blur} placeholder="Acme Corp" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lbl}>Website</label>
            <input style={inp} value={form.website} onChange={e => set("website", e.target.value)} onFocus={focus} onBlur={blur} placeholder="acme.com" />
          </div>
          <div>
            <label style={lbl}>City</label>
            <input style={inp} value={form.city} onChange={e => set("city", e.target.value)} onFocus={focus} onBlur={blur} placeholder="Berlin" />
          </div>
          <div>
            <label style={lbl}>Country</label>
            <select
              value={form.country}
              onChange={e => set("country", e.target.value)}
              onFocus={focus}
              onBlur={blur}
              style={{ ...inp, appearance: "none", WebkitAppearance: "none", cursor: "pointer",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(240,237,230,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
                paddingRight: 32,
              }}
            >
              <option value="" style={{ background: "#111118" }}>Select country…</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c} style={{ background: "#111118", color: "#F0EDE6" }}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={lbl}>Category</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {CATEGORIES.map(c => {
              const sel = form.category === c.label;
              const col = CAT_COLORS[c.label];
              return (
                <button key={c.label} onClick={() => set("category", sel ? "" : c.label)}
                  style={{ background: sel ? col.bg : "rgba(255,255,255,0.04)", color: sel ? col.color : "rgba(240,237,230,0.45)", border: sel ? `1px solid ${col.dot}` : "1px solid rgba(255,255,255,0.08)", padding: "5px 11px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{c.emoji}</span>{c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 11, padding: 13, display: "flex", flexDirection: "column", gap: 9, border: "1px solid rgba(255,255,255,0.05)" }}>
          <label style={{ ...lbl, marginBottom: 0 }}>Point of contact</label>
          <input style={inp} value={form.poc_name}  onChange={e => set("poc_name", e.target.value)}  onFocus={focus} onBlur={blur} placeholder="Full name" />
          <input style={inp} value={form.poc_email} onChange={e => set("poc_email", e.target.value)} onFocus={focus} onBlur={blur} placeholder="email@company.com" type="email" />
          <input style={inp} value={form.poc_phone} onChange={e => set("poc_phone", e.target.value)} onFocus={focus} onBlur={blur} placeholder="+49 123 456 789" />
        </div>

        <div>
          <label style={lbl}>Your rating</label>
          <Stars value={form.rating || 0} onChange={v => set("rating", v)} />
        </div>

        <div>
          <label style={lbl}>Status</label>
          <div style={{ display: "flex", gap: 7 }}>
            {STATUS_OPTIONS.map(s => {
              const sel = (form.status || "Active") === s.label;
              return (
                <button key={s.label} onClick={() => set("status", s.label)}
                  style={{ background: sel ? s.bg : "rgba(255,255,255,0.04)", color: sel ? s.color : "rgba(240,237,230,0.45)", border: sel ? `1px solid ${s.border}` : "1px solid rgba(255,255,255,0.08)", padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.15s" }}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 11, padding: 13, display: "flex", flexDirection: "column", gap: 9, border: "1px solid rgba(255,255,255,0.05)" }}>
          <label style={{ ...lbl, marginBottom: 0 }}>Contract dates</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ ...lbl, marginBottom: 4 }}>Start date</label>
              <input type="date" style={{ ...inp, colorScheme: "dark" }} value={form.contract_start || ""} onChange={e => set("contract_start", e.target.value)} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ ...lbl, marginBottom: 4 }}>Expiry date</label>
              <input type="date" style={{ ...inp, colorScheme: "dark" }} value={form.contract_expiry || ""} onChange={e => set("contract_expiry", e.target.value)} onFocus={focus} onBlur={blur} />
            </div>
          </div>
        </div>

        <div>
          <label style={lbl}>Notes</label>
          <textarea
            value={form.notes || ""}
            onChange={e => set("notes", e.target.value)}
            onFocus={focus} onBlur={blur}
            placeholder="Internal notes about this vendor…"
            rows={3}
            style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,237,230,0.45)", padding: 12, borderRadius: 9, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
          <button onClick={() => form.name.trim() && onSave(form)} disabled={loading || !form.name.trim()}
            style={{ flex: 2, background: form.name.trim() ? "#6C63FF" : "rgba(255,255,255,0.05)", border: "none", color: form.name.trim() ? "#fff" : "rgba(240,237,230,0.2)", padding: 12, borderRadius: 9, cursor: form.name.trim() ? "pointer" : "default", fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", boxShadow: form.name.trim() ? "0 4px 14px rgba(108,99,255,0.35)" : "none", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving…" : vendor ? "Save changes" : "Add vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Auth Screen ────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const inp = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 9, color: "#F0EDE6", padding: "13px 16px", fontSize: 14, width: "100%",
    outline: "none", fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const lbl = { fontSize: 10, color: "rgba(240,237,230,0.4)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" };
  const focus = e => { e.target.style.borderColor = "rgba(108,99,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.1)"; };
  const blur  = e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; };

  const switchMode = (next) => { setMode(next); setError(""); setSuccess(""); };

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const data = await authRequest("token?grant_type=password", { email, password });
        onAuth(data.access_token, data.user);
      } else if (mode === "signup") {
        await authRequest("signup", { email, password, data: { company_name: company } });
        setSuccess("Check your email to confirm your account, then log in.");
        setMode("login");
      } else if (mode === "reset") {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.msg || "Request failed"); }
        setSuccess("If that email is registered, a reset link is on its way.");
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(9,9,12,0.80)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F0EDE6", letterSpacing: "0.5px" }}>VendorLair</span>
        </a>
      </div>

      <div style={{ width: "100%", maxWidth: 400, marginTop: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 28, color: "#F0EDE6", letterSpacing: "-0.02em", marginTop: 16 }}>
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
          </div>
          <div style={{ fontSize: 14, color: "rgba(240,237,230,0.45)", marginTop: 6, fontWeight: 300 }}>
            {mode === "login" ? "Log in to your lair" : mode === "signup" ? "Start tracking your vendors" : "We'll send you a reset link"}
          </div>
        </div>

        <div style={{ background: "#111118", borderRadius: 18, padding: 26, border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
          {success && (
            <div style={{ background: "rgba(47,158,68,0.10)", border: "1px solid rgba(47,158,68,0.22)", borderRadius: 9, padding: "11px 14px", color: "#69DB7C", fontSize: 13, marginBottom: 18 }}>
              ✅ {success}
            </div>
          )}
          {error && (
            <div style={{ background: "rgba(250,82,82,0.10)", border: "1px solid rgba(250,82,82,0.22)", borderRadius: 9, padding: "11px 14px", color: "#FF6B6B", fontSize: 13, marginBottom: 18 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {mode === "signup" && (
              <div>
                <label style={lbl}>Company name</label>
                <input style={inp} value={company} onChange={e => setCompany(e.target.value)} onFocus={focus} onBlur={blur} placeholder="Acme GmbH" />
              </div>
            )}
            <div>
              <label style={lbl}>Email</label>
              <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={focus} onBlur={blur} placeholder="you@company.com" onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
            {mode !== "reset" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Password</label>
                  {mode === "login" && (
                    <span onClick={() => switchMode("reset")} style={{ fontSize: 11, color: "#6C63FF", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Forgot password?
                    </span>
                  )}
                </div>
                <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} onFocus={focus} onBlur={blur} placeholder="Min 8 characters" onKeyDown={e => e.key === "Enter" && submit()} />
              </div>
            )}
            <button onClick={submit} disabled={loading} style={{ background: "#6C63FF", border: "none", color: "#fff", padding: 14, borderRadius: 9, fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", marginTop: 2, boxShadow: "0 4px 14px rgba(108,99,255,0.35)", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait…" : mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send reset link"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "rgba(240,237,230,0.35)" }}>
            {mode === "reset" ? "Remembered it? " : mode === "login" ? "No account yet? " : "Already have an account? "}
            <span onClick={() => switchMode(mode === "signup" ? "login" : "login")} style={{ color: "#6C63FF", cursor: "pointer", fontWeight: 500 }}>
              {mode === "reset" ? "Back to log in" : mode === "login" ? "Sign up free" : "Log in"}
            </span>
          </div>
          {mode === "login" && (
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "rgba(240,237,230,0.22)" }}>
              Free up to 10 vendors · $3/month for unlimited
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Upgrade Modal ──────────────────────────────────────────────────────────

function UpgradeModal({ onClose, trigger }) {
  const hitLimit = trigger === "limit";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20, backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#111118", border: "1px solid rgba(108,99,255,0.28)", borderRadius: 18, padding: 34, width: "100%", maxWidth: 380, textAlign: "center", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 38, marginBottom: 14 }}>⚡</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 26, color: "#F0EDE6", marginBottom: 8 }}>Upgrade to Pro</div>
        <div style={{ fontSize: 14, color: "rgba(240,237,230,0.45)", fontWeight: 300, marginBottom: 22, lineHeight: 1.7 }}>
          {hitLimit
            ? "You've reached the 10 vendor limit on the free plan. Upgrade to add unlimited vendors."
            : "Get unlimited vendors and full access for just $3/month. Cancel anytime."}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 44, color: "#F0EDE6", marginBottom: 4 }}>
          $3<span style={{ fontSize: 18, color: "rgba(240,237,230,0.4)", fontWeight: 400 }}>/month</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(240,237,230,0.3)", marginBottom: 26 }}>Cancel anytime</div>
        <button onClick={() => window.open("https://buy.stripe.com/7sY28rbXz0w65B0cPBc3m00", "_blank")}
          style={{ background: "#6C63FF", border: "none", color: "#fff", padding: "13px 32px", borderRadius: 9, fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", width: "100%", boxShadow: "0 4px 14px rgba(108,99,255,0.35)", marginBottom: 11 }}>
          Upgrade now — $3/month
        </button>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(240,237,230,0.3)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

function Dashboard({ token, user, onLogout }) {
  const [vendors, setVendors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [filterCat, setFilterCat]     = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch]           = useState("");
  const [sortBy, setSortBy]           = useState("newest");
  const [viewMode, setViewMode]       = useState("grid");
  const [showUpgrade, setShowUpgrade] = useState(null);
  const [isPro, setIsPro]             = useState(false);
  const userId = user?.id;

  useEffect(() => {
    fetchVendors();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Check if user just came back from Stripe
      const params = new URLSearchParams(window.location.search);
      if (params.get("upgraded") === "true") {
        // Mark as Pro in Supabase
        await supabase("PATCH", `/rest/v1/profiles?id=eq.${userId}`,
          { is_pro: true }, token);
        // Clean the URL
        window.history.replaceState(null, "", window.location.pathname);
        setIsPro(true);
        return;
      }
      // Otherwise fetch existing profile
      const data = await supabase("GET",
        `/rest/v1/profiles?id=eq.${userId}&select=is_pro`, null, token);
      if (data && data[0]) setIsPro(!!data[0].is_pro);
    } catch (e) { console.error(e); }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await supabase("GET", `/rest/v1/vendors?user_id=eq.${userId}&order=created_at.desc`, null, token);
      setVendors(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const saveVendor = async (form) => {
    if (!isPro && !editing && vendors.length >= FREE_LIMIT) { setShowUpgrade("limit"); return; }
    // Duplicate detection
    const duplicate = vendors.find(v =>
      v.name.trim().toLowerCase() === form.name.trim().toLowerCase() && v.id !== editing?.id
    );
    if (duplicate && !window.confirm(`A vendor named "${duplicate.name}" already exists. Add anyway?`)) return;
    setSaving(true);
    try {
      if (editing) {
        await supabase("PATCH", `/rest/v1/vendors?id=eq.${editing.id}`, { ...form, user_id: userId }, token);
      } else {
        await supabase("POST", `/rest/v1/vendors`, { ...form, user_id: userId }, token);
      }
      await fetchVendors();
      setShowModal(false); setEditing(null);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const exportCSV = () => {
    const cols = ["name","website","category","status","city","country","poc_name","poc_email","poc_phone","rating","contract_start","contract_expiry","notes"];
    const header = cols.join(",");
    const rows = filtered.map(v =>
      cols.map(c => `"${(v[c] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "vendorlair-export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const deleteVendor = async (id) => {
    try {
      await supabase("DELETE", `/rest/v1/vendors?id=eq.${id}`, null, token);
      setVendors(v => v.filter(x => x.id !== id));
    } catch (e) { console.error(e); }
  };

  const openAdd = () => {
    if (!isPro && vendors.length >= FREE_LIMIT) { setShowUpgrade("limit"); return; }
    setEditing(null); setShowModal(true);
  };

  const filtered = vendors
    .filter(v => {
      const mc  = filterCat === "All" || v.category === filterCat;
      const ms  = filterStatus === "All" || (v.status || "Active") === filterStatus;
      const q   = search.toLowerCase();
      const mq  = !search ||
        v.name?.toLowerCase().includes(q) ||
        (v.city || "").toLowerCase().includes(q) ||
        (v.country || "").toLowerCase().includes(q) ||
        (v.poc_name || "").toLowerCase().includes(q) ||
        (v.poc_email || "").toLowerCase().includes(q) ||
        (v.notes || "").toLowerCase().includes(q);
      return mc && ms && mq;
    })
    .sort((a, b) => {
      if (sortBy === "name-az")   return a.name.localeCompare(b.name);
      if (sortBy === "name-za")   return b.name.localeCompare(a.name);
      if (sortBy === "rating")    return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "expiry")    return (a.contract_expiry || "9999") < (b.contract_expiry || "9999") ? -1 : 1;
      return 0; // newest — already ordered by created_at.desc from Supabase
    });

  const usedCats = CATEGORIES.filter(c => vendors.some(v => v.category === c.label));
  const atLimit  = !isPro && vendors.length >= FREE_LIMIT;

  // Stats
  const avgRating = vendors.length
    ? (vendors.reduce((s, v) => s + (v.rating || 0), 0) / vendors.length).toFixed(1)
    : "—";
  const topVendor = [...vendors].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  const catCount  = new Set(vendors.map(v => v.category).filter(Boolean)).size;

  return (
    <div style={{ minHeight: "100vh", background: "#09090C", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* ── Top bar ── */}
      <div style={{ background: "rgba(9,9,12,0.90)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 18, color: "#F0EDE6", letterSpacing: "0.5px" }}>VendorLair</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: isPro ? "#A89FFF" : "rgba(240,237,230,0.3)", background: isPro ? "rgba(108,99,255,0.15)" : "rgba(255,255,255,0.04)", border: isPro ? "1px solid rgba(108,99,255,0.3)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "3px 10px" }}>
            {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} · {isPro ? "⚡ Pro" : "Free"}
          </span>
          {!isPro && (
            <button onClick={() => setShowUpgrade("voluntary")} style={{ background: "transparent", border: "1px solid rgba(108,99,255,0.35)", color: "#A89FFF", padding: "6px 13px", borderRadius: 7, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>⚡ Upgrade</button>
          )}
          <button onClick={openAdd} style={{ background: "#6C63FF", border: "none", color: "#fff", padding: "7px 16px", borderRadius: 7, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", boxShadow: "0 3px 12px rgba(108,99,255,0.35)" }}>+ Add vendor</button>
          <button onClick={onLogout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(240,237,230,0.3)", padding: "6px 13px", borderRadius: 7, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Log out</button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: "#09090C", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "10px 32px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(240,237,230,0.3)" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors, contacts…"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, color: "#F0EDE6", padding: "7px 12px 7px 30px", fontSize: 12, outline: "none", fontFamily: "'DM Sans', sans-serif", width: 200 }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => setFilterCat("All")}
              style={{ background: filterCat === "All" ? "#6C63FF" : "transparent", border: filterCat === "All" ? "none" : "1px solid rgba(255,255,255,0.07)", color: filterCat === "All" ? "#fff" : "rgba(240,237,230,0.4)", padding: "5px 13px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>
              All ({vendors.length})
            </button>
            {usedCats.map(c => {
              const count  = vendors.filter(v => v.category === c.label).length;
              const col    = CAT_COLORS[c.label];
              const active = filterCat === c.label;
              return (
                <button key={c.label} onClick={() => setFilterCat(active ? "All" : c.label)}
                  style={{ background: active ? col.bg : "transparent", border: active ? `1px solid ${col.dot}` : "1px solid rgba(255,255,255,0.07)", color: active ? col.color : "rgba(240,237,230,0.4)", padding: "5px 13px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{c.emoji}</span>{c.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Status filter */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, color: "rgba(240,237,230,0.6)", padding: "6px 10px", fontSize: 11, outline: "none", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
            <option value="All">All statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, color: "rgba(240,237,230,0.6)", padding: "6px 10px", fontSize: 11, outline: "none", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
            <option value="newest">Newest first</option>
            <option value="name-az">Name A–Z</option>
            <option value="name-za">Name Z–A</option>
            <option value="rating">Highest rated</option>
            <option value="expiry">Expiry soonest</option>
          </select>

          {/* Export CSV */}
          <button onClick={exportCSV} title="Export to CSV"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(240,237,230,0.5)", padding: "6px 11px", borderRadius: 7, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            ⬇ Export
          </button>

          {/* View toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, overflow: "hidden" }}>
            <button onClick={() => setViewMode("grid")} title="Grid view"
              style={{ background: viewMode === "grid" ? "rgba(108,99,255,0.2)" : "transparent", border: "none", color: viewMode === "grid" ? "#A89FFF" : "rgba(240,237,230,0.3)", padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="0.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
            </button>
            <button onClick={() => setViewMode("list")} title="List view"
              style={{ background: viewMode === "list" ? "rgba(108,99,255,0.2)" : "transparent", border: "none", color: viewMode === "list" ? "#A89FFF" : "rgba(240,237,230,0.3)", padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="1.5" width="12" height="1.5" rx="0.75" stroke="currentColor" strokeWidth="1.2"/><rect x="0.5" y="5.75" width="12" height="1.5" rx="0.75" stroke="currentColor" strokeWidth="1.2"/><rect x="0.5" y="10" width="12" height="1.5" rx="0.75" stroke="currentColor" strokeWidth="1.2"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding: "24px 32px" }}>

        {/* Stats row */}
        {vendors.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            <StatCard label="Total vendors" value={vendors.length} sub={isPro ? "Pro — unlimited" : `${FREE_LIMIT - vendors.length} slot${FREE_LIMIT - vendors.length !== 1 ? "s" : ""} left`} />
            <StatCard label="Categories" value={catCount || "—"} sub={usedCats.map(c => c.label).join(" · ") || "None yet"} />
            <StatCard label="Top rated" value={topVendor ? topVendor.name : "—"} sub={topVendor ? `${"★".repeat(topVendor.rating || 0)} ${topVendor.category || ""}` : "Add vendors to see"} />
            <StatCard label="Avg rating" value={avgRating} accent sub="across all vendors" />
          </div>
        )}

        {atLimit && <UpgradeBanner onUpgrade={() => setShowUpgrade("limit")} />}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(240,237,230,0.3)" }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>⏳</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Loading your vendors…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>{vendors.length === 0 ? "🏪" : "🔍"}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#F0EDE6", marginBottom: 8 }}>
              {vendors.length === 0 ? "No vendors yet" : "No results found"}
            </div>
            <div style={{ fontSize: 14, color: "rgba(240,237,230,0.4)", marginBottom: 22, fontWeight: 300 }}>
              {vendors.length === 0 ? "Add your first vendor to get started" : "Try a different search or filter"}
            </div>
            {vendors.length === 0 && (
              <button onClick={openAdd} style={{ background: "#6C63FF", border: "none", color: "#fff", padding: "11px 26px", borderRadius: 9, fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", boxShadow: "0 4px 14px rgba(108,99,255,0.35)" }}>
                Add your first vendor
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ fontSize: 11, color: "rgba(240,237,230,0.25)", marginBottom: 14, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
              {filtered.length} vendor{filtered.length !== 1 ? "s" : ""}
              {filterCat !== "All" ? ` · ${filterCat}` : ""}
              {filterStatus !== "All" ? ` · ${filterStatus}` : ""}
            </div>

            {viewMode === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
                {filtered.map(v => (
                  <VendorCard key={v.id} vendor={v}
                    onEdit={v => { setEditing(v); setShowModal(true); }}
                    onDelete={deleteVendor} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                {filtered.map((v, i) => {
                  const statusOpt = STATUS_OPTIONS.find(s => s.label === (v.status || "Active")) || STATUS_OPTIONS[0];
                  const expiryDays = daysUntil(v.contract_expiry);
                  const expiryWarning = expiryDays !== null && expiryDays <= 30;
                  const accentColor = v.category ? CAT_COLORS[v.category]?.dot : "rgba(108,99,255,0.5)";
                  return (
                    <div key={v.id} style={{ background: "#111118", borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", padding: "11px 16px", display: "flex", alignItems: "center", gap: 12, position: "relative", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#16161F"}
                      onMouseLeave={e => e.currentTarget.style.background = "#111118"}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: accentColor }} />
                      <InitialsAvatar name={v.name} size={30} category={v.category} />
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, color: "#F0EDE6", minWidth: 120 }}>{v.name}</div>
                      {v.website && <div style={{ fontSize: 10, color: "rgba(240,237,230,0.3)", fontFamily: "'DM Sans', sans-serif", minWidth: 100 }}>{v.website.replace(/^https?:\/\//, "")}</div>}
                      {v.category && <Badge category={v.category} />}
                      <span style={{ background: statusOpt.bg, color: statusOpt.color, border: `1px solid ${statusOpt.border}`, padding: "1px 7px", borderRadius: 20, fontSize: 9, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{v.status || "Active"}</span>
                      {(v.city || v.country) && <div style={{ fontSize: 10, color: "rgba(240,237,230,0.35)", fontFamily: "'DM Sans', sans-serif", minWidth: 100 }}>📍 {[v.city, v.country].filter(Boolean).join(", ")}</div>}
                      {v.contract_expiry && <div style={{ fontSize: 10, color: expiryWarning ? "#F59F00" : "rgba(240,237,230,0.3)", fontFamily: "'DM Sans', sans-serif", fontWeight: expiryWarning ? 600 : 400 }}>{expiryWarning ? "⚠️ " : "🔄 "}{new Date(v.contract_expiry).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</div>}
                      <Stars value={v.rating || 0} readonly />
                      <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
                        <button onClick={() => { setEditing(v); setShowModal(true); }} style={{ background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.25)", color: "#A89FFF", padding: "3px 10px", borderRadius: 5, fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                        <button onClick={() => deleteVendor(v.id)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(240,237,230,0.25)", padding: "3px 8px", borderRadius: 5, fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <VendorModal vendor={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={saveVendor} loading={saving} />
      )}
      {showUpgrade && <UpgradeModal trigger={showUpgrade} onClose={() => setShowUpgrade(null)} />}
    </div>
  );
}

// ── Set New Password Screen ────────────────────────────────────────────────

function SetNewPasswordScreen({ accessToken, onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const inp = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 9, color: "#F0EDE6", padding: "13px 16px", fontSize: 14, width: "100%",
    outline: "none", fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const lbl = { fontSize: 10, color: "rgba(240,237,230,0.4)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" };
  const focus = e => { e.target.style.borderColor = "rgba(108,99,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.1)"; };
  const blur  = e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; };

  const submit = async () => {
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Update failed"); }
      setSuccess(true);
      setTimeout(onDone, 2500);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "0 48px", height: 64, display: "flex", alignItems: "center", background: "rgba(9,9,12,0.80)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", zIndex: 100 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F0EDE6", letterSpacing: "0.5px" }}>VendorLair</span>
      </div>

      <div style={{ width: "100%", maxWidth: 400, marginTop: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 28, color: "#F0EDE6", letterSpacing: "-0.02em", marginTop: 16 }}>
            Set new password
          </div>
          <div style={{ fontSize: 14, color: "rgba(240,237,230,0.45)", marginTop: 6, fontWeight: 300 }}>
            Choose a strong password for your account
          </div>
        </div>

        <div style={{ background: "#111118", borderRadius: 18, padding: 26, border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>✅</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F0EDE6", marginBottom: 8 }}>Password updated</div>
              <div style={{ fontSize: 13, color: "rgba(240,237,230,0.4)" }}>Redirecting you to log in…</div>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: "rgba(250,82,82,0.10)", border: "1px solid rgba(250,82,82,0.22)", borderRadius: 9, padding: "11px 14px", color: "#FF6B6B", fontSize: 13, marginBottom: 18 }}>
                  ⚠️ {error}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <div>
                  <label style={lbl}>New password</label>
                  <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} onFocus={focus} onBlur={blur} placeholder="Min 8 characters" onKeyDown={e => e.key === "Enter" && submit()} />
                </div>
                <div>
                  <label style={lbl}>Confirm password</label>
                  <input style={inp} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} onFocus={focus} onBlur={blur} placeholder="Repeat your password" onKeyDown={e => e.key === "Enter" && submit()} />
                </div>
                <button onClick={submit} disabled={loading} style={{ background: "#6C63FF", border: "none", color: "#fff", padding: 14, borderRadius: 9, fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", marginTop: 2, boxShadow: "0 4px 14px rgba(108,99,255,0.35)", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Saving…" : "Update password"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      const s = localStorage.getItem("vl_session");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  // Detect Supabase recovery token in URL hash
  const [recoveryToken, setRecoveryToken] = useState(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    if (params.get("type") === "recovery") {
      return params.get("access_token");
    }
    return null;
  });

  const handleAuth = (token, user) => {
    const s = { token, user };
    localStorage.setItem("vl_session", JSON.stringify(s));
    setSession(s);
  };
  const handleLogout = () => {
    localStorage.removeItem("vl_session");
    setSession(null);
  };
  const handlePasswordUpdated = () => {
    // Clear the hash and go to login
    window.history.replaceState(null, "", window.location.pathname);
    setRecoveryToken(null);
  };

  if (recoveryToken) return <SetNewPasswordScreen accessToken={recoveryToken} onDone={handlePasswordUpdated} />;
  if (!session) return <AuthScreen onAuth={handleAuth} />;
  return <Dashboard token={session.token} user={session.user} onLogout={handleLogout} />;
}
