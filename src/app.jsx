import { useState, useEffect } from "react";

const FREE_LIMIT = 10;
const CATEGORIES = [
  { label: "Technical",  emoji: "⚙️" },
  { label: "Marketing",  emoji: "📣" },
  { label: "Finance",    emoji: "💰" },
  { label: "Legal",      emoji: "⚖️" },
  { label: "Logistics",  emoji: "🚚" },
  { label: "HR",         emoji: "👥" },
  { label: "Design",     emoji: "🎨" },
  { label: "Operations", emoji: "🏭" },
  { label: "Other",      emoji: "📦" },
];
const CAT_COLORS = {
  Technical:  { bg:"#EEF4FF", color:"#3B5BDB", dot:"#4C6EF5" },
  Marketing:  { bg:"#FFF0F6", color:"#C2255C", dot:"#E64980" },
  Finance:    { bg:"#EBFBEE", color:"#2F9E44", dot:"#40C057" },
  Legal:      { bg:"#FFF9DB", color:"#E67700", dot:"#F59F00" },
  Logistics:  { bg:"#E7F5FF", color:"#1971C2", dot:"#339AF0" },
  HR:         { bg:"#FFF4E6", color:"#D9480F", dot:"#F76707" },
  Design:     { bg:"#F8F0FC", color:"#862E9C", dot:"#AE3EC9" },
  Operations: { bg:"#F4FCE3", color:"#5C940D", dot:"#82C91E" },
  Other:      { bg:"#F8F9FA", color:"#495057", dot:"#868E96" },
};

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

function VLLogo({ size = 36 }) {
  return (
    <div style={{ width:size, height:size, background:"#09090C", borderRadius:8,
      display:"flex", alignItems:"center", justifyContent:"center",
      border:"1px solid rgba(108,99,255,0.4)", flexShrink:0 }}>
      <svg viewBox="0 0 56 40" fill="none" width={size*0.82} height={size*0.6}>
        <polygon points="2,2 10,2 22,34 14,34" fill="#F0EDE6"/>
        <polygon points="30,2 38,2 26,34 18,34" fill="#F0EDE6"/>
        <polygon points="22,34 14,34 22,16 30,34" fill="#09090C"/>
        <ellipse cx="22" cy="33" rx="6" ry="2.5" fill="rgba(108,99,255,0.3)"/>
        <polygon points="19,18 17,26 21,26" fill="#3A3060"/>
        <polygon points="22,15 20,24 24,24" fill="#4A3E80" opacity="0.9"/>
        <polygon points="25,18 23,26 27,26" fill="#3A3060"/>
        <polygon points="42,2 50,2 50,36 42,36" fill="#F0EDE6"/>
        <polygon points="42,36 56,36 56,30 42,30" fill="#F0EDE6"/>
      </svg>
    </div>
  );
}

function LogoAvatar({ domain, name, size = 44 }) {
  const [err, setErr] = useState(false);
  const initials = (name || "??").slice(0, 2).toUpperCase();
  const pairs = [
    { bg:"#FFE8E8", color:"#C92A2A" }, { bg:"#E8F4FF", color:"#1864AB" },
    { bg:"#E8FFF0", color:"#1B7C3D" }, { bg:"#FFF3E8", color:"#BF5C00" },
    { bg:"#F3E8FF", color:"#7048A8" }, { bg:"#E8FFFD", color:"#0B7285" },
  ];
  const pair = pairs[(name || "").charCodeAt(0) % pairs.length];
  const clean = (domain || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (clean && !err) return (
    <img src={`https://logo.clearbit.com/${clean}`} alt={name} onError={() => setErr(true)}
      style={{ width:size, height:size, borderRadius:12, objectFit:"contain",
        background:"#1a1a2e", padding:4, border:"1px solid rgba(255,255,255,0.08)", flexShrink:0,
        boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }} />
  );
  return (
    <div style={{ width:size, height:size, borderRadius:12, background:pair.bg,
      color:pair.color, display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.28, fontWeight:800, flexShrink:0,
      boxShadow:"0 2px 8px rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.08)",
      fontFamily:"'DM Sans',sans-serif" }}>
      {initials}
    </div>
  );
}

function Stars({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:1 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => !readonly && onChange(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{ cursor:readonly?"default":"pointer", fontSize:readonly?13:20,
            color: s<=(hover||value) ? "#F5A623" : "rgba(255,255,255,0.15)",
            transition:"color 0.1s, transform 0.1s",
            transform: !readonly && s<=hover ? "scale(1.3)" : "scale(1)",
            display:"inline-block", userSelect:"none" }}>★</span>
      ))}
    </div>
  );
}

function Badge({ category }) {
  const c = CAT_COLORS[category] || CAT_COLORS.Other;
  const cat = CATEGORIES.find(x => x.label === category);
  return (
    <span style={{ background:c.bg, color:c.color, padding:"3px 9px 3px 7px",
      borderRadius:20, fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif",
      display:"inline-flex", alignItems:"center", gap:4 }}>
      <span style={{ fontSize:10 }}>{cat?.emoji}</span>{category}
    </span>
  );
}

function UpgradeBanner({ onUpgrade }) {
  return (
    <div style={{ background:"linear-gradient(135deg,rgba(108,99,255,0.2),rgba(116,192,252,0.1))",
      border:"1px solid rgba(108,99,255,0.3)", borderRadius:16, padding:"20px 24px",
      margin:"0 0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
      <div>
        <div style={{ fontWeight:700, fontSize:15, color:"#F0EDE6",
          fontFamily:"'Cormorant Garamond',serif", marginBottom:4 }}>
          You've reached 10 vendors
        </div>
        <div style={{ fontSize:13, color:"rgba(240,237,230,0.55)", fontFamily:"'DM Sans',sans-serif" }}>
          Upgrade to Pro for unlimited vendors — just $3/month.
        </div>
      </div>
      <button onClick={onUpgrade} style={{ background:"#6C63FF", border:"none",
        color:"#fff", padding:"10px 20px", borderRadius:8, fontSize:13,
        fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", whiteSpace:"nowrap" }}>
        Upgrade — $3/mo
      </button>
    </div>
  );
}

function VendorCard({ vendor, onEdit, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div style={{ background:"#111118", border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:16, padding:20, display:"flex", flexDirection:"column", gap:12,
      transition:"border-color 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(108,99,255,0.35)"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
        <LogoAvatar domain={vendor.website} name={vendor.name} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
            fontSize:17, color:"#F0EDE6", lineHeight:1.2 }}>{vendor.name}</div>
          {vendor.website && (
            <a href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
              target="_blank" rel="noreferrer"
              style={{ fontSize:11, color:"rgba(240,237,230,0.35)", textDecoration:"none",
                fontFamily:"'DM Sans',sans-serif" }}>
              {vendor.website.replace(/^https?:\/\//,"")}
            </a>
          )}
          <div style={{ marginTop:6 }}>
            {vendor.category && <Badge category={vendor.category} />}
          </div>
        </div>
      </div>
      {(vendor.city || vendor.country) && (
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:13 }}>📍</span>
          <span style={{ fontSize:12, color:"rgba(240,237,230,0.45)", fontFamily:"'DM Sans',sans-serif" }}>
            {[vendor.city, vendor.country].filter(Boolean).join(", ")}
          </span>
        </div>
      )}
      {(vendor.poc_name || vendor.poc_email || vendor.poc_phone) && (
        <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px",
          display:"flex", flexDirection:"column", gap:3, border:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize:10, color:"rgba(240,237,230,0.3)", fontFamily:"'DM Sans',sans-serif",
            fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>Contact</div>
          {vendor.poc_name && <div style={{ fontSize:13, color:"rgba(240,237,230,0.8)", fontWeight:500,
            fontFamily:"'DM Sans',sans-serif" }}>👤 {vendor.poc_name}</div>}
          {vendor.poc_email && <div style={{ fontSize:12, color:"#6C63FF",
            fontFamily:"'DM Sans',sans-serif" }}>✉️ {vendor.poc_email}</div>}
          {vendor.poc_phone && <div style={{ fontSize:12, color:"rgba(240,237,230,0.35)",
            fontFamily:"'DM Sans',sans-serif" }}>📞 {vendor.poc_phone}</div>}
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginTop:"auto", paddingTop:8, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <Stars value={vendor.rating||0} readonly />
        <div style={{ display:"flex", gap:6 }}>
          {confirm ? (
            <>
              <button onClick={() => setConfirm(false)}
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
                  color:"rgba(240,237,230,0.5)", padding:"5px 10px", borderRadius:6,
                  fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
              <button onClick={() => onDelete(vendor.id)}
                style={{ background:"rgba(250,82,82,0.15)", border:"1px solid rgba(250,82,82,0.3)",
                  color:"#FF6B6B", padding:"5px 10px", borderRadius:6,
                  fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Confirm</button>
            </>
          ) : (
            <>
              <button onClick={() => onEdit(vendor)}
                style={{ background:"rgba(108,99,255,0.15)", border:"1px solid rgba(108,99,255,0.3)",
                  color:"#A89FFF", padding:"5px 12px", borderRadius:6,
                  fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Edit</button>
              <button onClick={() => setConfirm(true)}
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
                  color:"rgba(240,237,230,0.3)", padding:"5px 10px", borderRadius:6,
                  fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>✕</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function VendorModal({ vendor, onClose, onSave, loading }) {
  const [form, setForm] = useState(vendor || {
    name:"", website:"", country:"", city:"",
    poc_name:"", poc_email:"", poc_phone:"", category:"", rating:0
  });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const inp = {
    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:10, color:"#F0EDE6", padding:"11px 14px", fontSize:13, width:"100%",
    outline:"none", fontFamily:"'DM Sans',sans-serif", fontWeight:400,
    boxSizing:"border-box", transition:"border-color 0.15s",
  };
  const lbl = { fontSize:10, color:"rgba(240,237,230,0.4)", fontFamily:"'DM Sans',sans-serif",
    fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6, display:"block" };
  const focus = e => { e.target.style.borderColor="rgba(108,99,255,0.5)"; e.target.style.boxShadow="0 0 0 3px rgba(108,99,255,0.1)"; };
  const blur  = e => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, padding:20, backdropFilter:"blur(8px)" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#111118", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:20, padding:28, width:"100%", maxWidth:460, maxHeight:"90vh",
        overflowY:"auto", display:"flex", flexDirection:"column", gap:14,
        boxShadow:"0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
            fontSize:22, color:"#F0EDE6" }}>
            {vendor ? "Edit Vendor" : "New Vendor"}
          </span>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.08)", color:"rgba(240,237,230,0.5)",
            width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:16,
            display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={lbl}>Company Name *</label>
            <input style={inp} value={form.name} onChange={e=>set("name",e.target.value)} onFocus={focus} onBlur={blur} placeholder="Acme Corp" />
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={lbl}>Website</label>
            <input style={inp} value={form.website} onChange={e=>set("website",e.target.value)} onFocus={focus} onBlur={blur} placeholder="acme.com" />
          </div>
          <div>
            <label style={lbl}>City</label>
            <input style={inp} value={form.city} onChange={e=>set("city",e.target.value)} onFocus={focus} onBlur={blur} placeholder="Berlin" />
          </div>
          <div>
            <label style={lbl}>Country</label>
            <input style={inp} value={form.country} onChange={e=>set("country",e.target.value)} onFocus={focus} onBlur={blur} placeholder="Germany" />
          </div>
        </div>
        <div>
          <label style={lbl}>Category</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {CATEGORIES.map(c => {
              const sel = form.category===c.label;
              const col = CAT_COLORS[c.label];
              return (
                <button key={c.label} onClick={() => set("category", sel?"":c.label)}
                  style={{ background:sel?col.bg:"rgba(255,255,255,0.04)",
                    color:sel?col.color:"rgba(240,237,230,0.45)",
                    border:sel?`1px solid ${col.dot}`:"1px solid rgba(255,255,255,0.08)",
                    padding:"5px 11px", borderRadius:20, cursor:"pointer", fontSize:12,
                    fontFamily:"'DM Sans',sans-serif", fontWeight:500, transition:"all 0.15s",
                    display:"flex", alignItems:"center", gap:4 }}>
                  <span>{c.emoji}</span>{c.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:12, padding:14,
          display:"flex", flexDirection:"column", gap:9, border:"1px solid rgba(255,255,255,0.05)" }}>
          <label style={{...lbl, marginBottom:0}}>Point of Contact</label>
          <input style={inp} value={form.poc_name} onChange={e=>set("poc_name",e.target.value)} onFocus={focus} onBlur={blur} placeholder="Full name" />
          <input style={inp} value={form.poc_email} onChange={e=>set("poc_email",e.target.value)} onFocus={focus} onBlur={blur} placeholder="email@company.com" type="email" />
          <input style={inp} value={form.poc_phone} onChange={e=>set("poc_phone",e.target.value)} onFocus={focus} onBlur={blur} placeholder="+49 123 456 789" />
        </div>
        <div>
          <label style={lbl}>Your Rating</label>
          <Stars value={form.rating||0} onChange={v=>set("rating",v)} />
        </div>
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <button onClick={onClose}
            style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
              color:"rgba(240,237,230,0.45)", padding:12, borderRadius:10, cursor:"pointer",
              fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={() => form.name.trim() && onSave(form)} disabled={loading||!form.name.trim()}
            style={{ flex:2, background:form.name.trim()?"#6C63FF":"rgba(255,255,255,0.05)",
              border:"none", color:form.name.trim()?"#fff":"rgba(240,237,230,0.2)",
              padding:12, borderRadius:10, cursor:form.name.trim()?"pointer":"default",
              fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif",
              boxShadow:form.name.trim()?"0 4px 14px rgba(108,99,255,0.35)":"none",
              opacity:loading?0.7:1 }}>
            {loading ? "Saving..." : vendor ? "Save Changes" : "Add Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const inp = {
    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:10, color:"#F0EDE6", padding:"13px 16px", fontSize:14, width:"100%",
    outline:"none", fontFamily:"'DM Sans',sans-serif",
    boxSizing:"border-box", transition:"border-color 0.15s",
  };
  const focus = e => { e.target.style.borderColor="rgba(108,99,255,0.5)"; e.target.style.boxShadow="0 0 0 3px rgba(108,99,255,0.1)"; };
  const blur  = e => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; };
  const lbl = { fontSize:10, color:"rgba(240,237,230,0.4)", fontFamily:"'DM Sans',sans-serif",
    fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6, display:"block" };
  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const data = await authRequest("token?grant_type=password", { email, password });
        onAuth(data.access_token, data.user);
      } else {
        await authRequest("signup", { email, password, data: { company_name: company } });
        setSuccess("Check your email to confirm your account, then log in.");
        setMode("login");
      }
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };
  return (
    <div style={{ minHeight:"100vh", background:"#09090C", display:"flex",
      flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ position:"fixed", top:0, left:0, right:0, padding:"20px 48px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(9,9,12,0.75)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,255,255,0.07)", zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <VLLogo size={32} />
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700,
            color:"#F0EDE6", letterSpacing:"0.5px" }}>VendorLair</span>
        </a>
      </div>
      <div style={{ width:"100%", maxWidth:400, marginTop:60 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <VLLogo size={52} />
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:28,
            color:"#F0EDE6", letterSpacing:"-0.02em", marginTop:16 }}>
            {mode==="login" ? "Welcome back" : "Create account"}
          </div>
          <div style={{ fontSize:14, color:"rgba(240,237,230,0.45)", marginTop:6, fontWeight:300 }}>
            {mode==="login" ? "Log in to your lair" : "Start tracking your vendors"}
          </div>
        </div>
        <div style={{ background:"#111118", borderRadius:20, padding:28,
          border:"1px solid rgba(255,255,255,0.07)", boxShadow:"0 40px 80px rgba(0,0,0,0.4)" }}>
          {success && (
            <div style={{ background:"rgba(47,158,68,0.12)", border:"1px solid rgba(47,158,68,0.25)",
              borderRadius:10, padding:"12px 16px", color:"#69DB7C", fontSize:13, marginBottom:20 }}>
              ✅ {success}
            </div>
          )}
          {error && (
            <div style={{ background:"rgba(250,82,82,0.12)", border:"1px solid rgba(250,82,82,0.25)",
              borderRadius:10, padding:"12px 16px", color:"#FF6B6B", fontSize:13, marginBottom:20 }}>
              ⚠️ {error}
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {mode==="signup" && (
              <div>
                <label style={lbl}>Company Name</label>
                <input style={inp} value={company} onChange={e=>setCompany(e.target.value)}
                  onFocus={focus} onBlur={blur} placeholder="Acme GmbH" />
              </div>
            )}
            <div>
              <label style={lbl}>Email</label>
              <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)}
                onFocus={focus} onBlur={blur} placeholder="you@company.com"
                onKeyDown={e => e.key==="Enter" && submit()} />
            </div>
            <div>
              <label style={lbl}>Password</label>
              <input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)}
                onFocus={focus} onBlur={blur} placeholder="Min 8 characters"
                onKeyDown={e => e.key==="Enter" && submit()} />
            </div>
            <button onClick={submit} disabled={loading}
              style={{ background:"#6C63FF", border:"none", color:"#fff",
                padding:14, borderRadius:10, fontSize:14, fontWeight:500,
                fontFamily:"'DM Sans',sans-serif", cursor:"pointer", marginTop:4,
                boxShadow:"0 4px 14px rgba(108,99,255,0.35)", opacity:loading?0.7:1 }}>
              {loading ? "Please wait..." : mode==="login" ? "Log in" : "Create account"}
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"rgba(240,237,230,0.35)" }}>
            {mode==="login" ? "No account yet? " : "Already have an account? "}
            <span onClick={() => { setMode(mode==="login"?"signup":"login"); setError(""); setSuccess(""); }}
              style={{ color:"#6C63FF", cursor:"pointer", fontWeight:500 }}>
              {mode==="login" ? "Sign up free" : "Log in"}
            </span>
          </div>
          {mode==="login" && (
            <div style={{ textAlign:"center", marginTop:10, fontSize:12, color:"rgba(240,237,230,0.22)" }}>
              Free up to 10 vendors · $3/month for unlimited
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpgradeModal({ onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:2000, padding:20, backdropFilter:"blur(8px)" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#111118", border:"1px solid rgba(108,99,255,0.3)",
        borderRadius:20, padding:36, width:"100%", maxWidth:380, textAlign:"center",
        boxShadow:"0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize:40, marginBottom:16 }}>⚡</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
          fontSize:26, color:"#F0EDE6", marginBottom:8 }}>Upgrade to Pro</div>
        <div style={{ fontSize:14, color:"rgba(240,237,230,0.45)", fontWeight:300,
          marginBottom:24, lineHeight:1.7 }}>
          You've hit the 10 vendor limit. Upgrade for unlimited vendors and full access.
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
          fontSize:44, color:"#F0EDE6", marginBottom:4 }}>
          $3<span style={{ fontSize:18, color:"rgba(240,237,230,0.4)", fontWeight:400 }}>/month</span>
        </div>
        <div style={{ fontSize:12, color:"rgba(240,237,230,0.3)", marginBottom:28 }}>Cancel anytime</div>
        <button onClick={() => window.open("https://buy.stripe.com/YOUR_STRIPE_LINK","_blank")}
          style={{ background:"#6C63FF", border:"none", color:"#fff",
            padding:"13px 32px", borderRadius:10, fontSize:14, fontWeight:500,
            fontFamily:"'DM Sans',sans-serif", cursor:"pointer", width:"100%",
            boxShadow:"0 4px 14px rgba(108,99,255,0.35)", marginBottom:12 }}>
          Upgrade now — $3/month
        </button>
        <button onClick={onClose}
          style={{ background:"transparent", border:"none", color:"rgba(240,237,230,0.3)",
            fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

function Dashboard({ token, user, onLogout }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const userId = user?.id;

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await supabase("GET",
        `/rest/v1/vendors?user_id=eq.${userId}&order=created_at.desc`, null, token);
      setVendors(data || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const saveVendor = async (form) => {
    if (!isPro && !editing && vendors.length >= FREE_LIMIT) { setShowUpgrade(true); return; }
    setSaving(true);
    try {
      if (editing) {
        await supabase("PATCH", `/rest/v1/vendors?id=eq.${editing.id}`,
          { ...form, user_id: userId }, token);
      } else {
        await supabase("POST", `/rest/v1/vendors`, { ...form, user_id: userId }, token);
      }
      await fetchVendors();
      setShowModal(false); setEditing(null);
    } catch(e) { console.error(e); }
    finally { setSaving(false); }
  };

  const deleteVendor = async (id) => {
    try {
      await supabase("DELETE", `/rest/v1/vendors?id=eq.${id}`, null, token);
      setVendors(v => v.filter(x => x.id !== id));
    } catch(e) { console.error(e); }
  };

  const openAdd = () => {
    if (!isPro && vendors.length >= FREE_LIMIT) { setShowUpgrade(true); return; }
    setEditing(null); setShowModal(true);
  };

  const filtered = vendors.filter(v => {
    const mc = filterCat==="All" || v.category===filterCat;
    const ms = !search || v.name?.toLowerCase().includes(search.toLowerCase()) ||
      (v.city||"").toLowerCase().includes(search.toLowerCase()) ||
      (v.country||"").toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const usedCats = CATEGORIES.filter(c => vendors.some(v => v.category===c.label));
  const atLimit = !isPro && vendors.length >= FREE_LIMIT;

  return (
    <div style={{ minHeight:"100vh", background:"#09090C", fontFamily:"'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ background:"rgba(9,9,12,0.9)", borderBottom:"1px solid rgba(255,255,255,0.07)",
        padding:"0 48px", height:60, display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:100,
        backdropFilter:"blur(16px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <VLLogo size={32} />
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
            fontSize:18, color:"#F0EDE6", letterSpacing:"0.5px" }}>VendorLair</div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:12, color:"rgba(240,237,230,0.35)" }}>
            {vendors.length} vendor{vendors.length!==1?"s":""} · {isPro?"Pro":"Free"}
          </span>
          {!isPro && (
            <button onClick={() => setShowUpgrade(true)}
              style={{ background:"transparent", border:"1px solid rgba(108,99,255,0.4)",
                color:"#A89FFF", padding:"7px 14px", borderRadius:8, fontSize:12,
                fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>⚡ Upgrade</button>
          )}
          <button onClick={openAdd}
            style={{ background:"#6C63FF", border:"none", color:"#fff",
              padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:500,
              fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
              boxShadow:"0 3px 12px rgba(108,99,255,0.35)" }}>+ Add Vendor</button>
          <button onClick={onLogout}
            style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.07)",
              color:"rgba(240,237,230,0.35)", padding:"7px 14px", borderRadius:8,
              fontSize:12, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Log out</button>
        </div>
      </div>
      <div style={{ background:"#09090C", borderBottom:"1px solid rgba(255,255,255,0.05)",
        padding:"10px 48px", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)",
            fontSize:13, color:"rgba(240,237,230,0.3)" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vendors..."
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:8, color:"#F0EDE6", padding:"7px 13px 7px 32px", fontSize:13,
              outline:"none", fontFamily:"'DM Sans',sans-serif", width:190 }} />
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <button onClick={() => setFilterCat("All")}
            style={{ background:filterCat==="All"?"#6C63FF":"transparent",
              border:filterCat==="All"?"none":"1px solid rgba(255,255,255,0.07)",
              color:filterCat==="All"?"#fff":"rgba(240,237,230,0.4)",
              padding:"6px 14px", borderRadius:20, cursor:"pointer",
              fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
            All ({vendors.length})
          </button>
          {usedCats.map(c => {
            const count = vendors.filter(v=>v.category===c.label).length;
            const col = CAT_COLORS[c.label];
            const active = filterCat===c.label;
            return (
              <button key={c.label} onClick={() => setFilterCat(active?"All":c.label)}
                style={{ background:active?col.bg:"transparent",
                  border:active?`1px solid ${col.dot}`:"1px solid rgba(255,255,255,0.07)",
                  color:active?col.color:"rgba(240,237,230,0.4)",
                  padding:"6px 14px", borderRadius:20, cursor:"pointer",
                  fontSize:12, fontFamily:"'DM Sans',sans-serif",
                  display:"flex", alignItems:"center", gap:4 }}>
                <span>{c.emoji}</span>{c.label} ({count})
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding:"28px 48px" }}>
        {atLimit && <UpgradeBanner onUpgrade={() => setShowUpgrade(true)} />}
        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 20px", color:"rgba(240,237,230,0.3)" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
            <div>Loading your vendors...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 20px" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>{vendors.length===0?"🏪":"🔍"}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28,
              fontWeight:700, color:"#F0EDE6", marginBottom:8 }}>
              {vendors.length===0 ? "No vendors yet" : "No results found"}
            </div>
            <div style={{ fontSize:14, color:"rgba(240,237,230,0.4)", marginBottom:24, fontWeight:300 }}>
              {vendors.length===0 ? "Add your first vendor to get started" : "Try a different search or filter"}
            </div>
            {vendors.length===0 && (
              <button onClick={openAdd}
                style={{ background:"#6C63FF", border:"none", color:"#fff",
                  padding:"12px 28px", borderRadius:10, fontSize:14, fontWeight:500,
                  fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                  boxShadow:"0 4px 14px rgba(108,99,255,0.35)" }}>
                Add your first vendor
              </button>
            )}
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {filtered.map(v => (
              <VendorCard key={v.id} vendor={v}
                onEdit={v => { setEditing(v); setShowModal(true); }}
                onDelete={deleteVendor} />
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <VendorModal vendor={editing} onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={saveVendor} loading={saving} />
      )}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      const s = localStorage.getItem("vl_session");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
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
  if (!session) return <AuthScreen onAuth={handleAuth} />;
  return <Dashboard token={session.token} user={session.user} onLogout={handleLogout} />;
}
