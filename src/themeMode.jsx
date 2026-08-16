import { useEffect, useState } from "react";

const STORAGE_KEY = "vendorlair-theme";

const lightCss = `
html[data-theme="light"], html[data-theme="light"] body { background:#F7F7FB !important; color:#191922 !important; }
html[data-theme="light"] #root > div { background:#F7F7FB !important; color:#191922 !important; }

html[data-theme="light"] [style*="background: rgb(9, 9, 12)"],
html[data-theme="light"] [style*="background-color: rgb(9, 9, 12)"],
html[data-theme="light"] [style*="background: #09090C"],
html[data-theme="light"] [style*="background-color: #09090C"] { background:#F7F7FB !important; background-color:#F7F7FB !important; }

html[data-theme="light"] [style*="background: rgba(9, 9, 12, 0.9)"],
html[data-theme="light"] [style*="background: rgba(9, 9, 12, 0.90)"],
html[data-theme="light"] [style*="background: rgba(9, 9, 12, 0.8)"],
html[data-theme="light"] [style*="background: rgba(9, 9, 12, 0.80)"] {
  background:rgba(247,247,251,.94) !important;
  background-color:rgba(247,247,251,.94) !important;
  border-color:rgba(25,25,34,.09) !important;
}

html[data-theme="light"] [style*="background: rgb(17, 17, 24)"],
html[data-theme="light"] [style*="background-color: rgb(17, 17, 24)"],
html[data-theme="light"] [style*="background: #111118"],
html[data-theme="light"] [style*="background-color: #111118"] { background:#FFFFFF !important; background-color:#FFFFFF !important; }

html[data-theme="light"] [style*="background: rgb(22, 22, 31)"],
html[data-theme="light"] [style*="background-color: rgb(22, 22, 31)"],
html[data-theme="light"] [style*="background: #16161F"],
html[data-theme="light"] [style*="background-color: #16161F"] { background:#F2F2F7 !important; background-color:#F2F2F7 !important; }

html[data-theme="light"] [style*="background: rgba(255, 255, 255, 0.02)"],
html[data-theme="light"] [style*="background: rgba(255, 255, 255, 0.03)"],
html[data-theme="light"] [style*="background: rgba(255, 255, 255, 0.04)"],
html[data-theme="light"] [style*="background: rgba(255, 255, 255, 0.05)"] { background:rgba(25,25,34,.035) !important; }

html[data-theme="light"] [style*="color: rgb(240, 237, 230)"],
html[data-theme="light"] [style*="color: #F0EDE6"] { color:#191922 !important; }

html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.2)"],
html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.22)"],
html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.25)"],
html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.3)"],
html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.35)"],
html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.4)"],
html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.45)"],
html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.5)"],
html[data-theme="light"] [style*="color: rgba(240, 237, 230, 0.62)"] { color:rgba(25,25,34,.58) !important; }

html[data-theme="light"] [style*="border: 1px solid rgba(255, 255, 255, 0.05)"],
html[data-theme="light"] [style*="border: 1px solid rgba(255, 255, 255, 0.06)"],
html[data-theme="light"] [style*="border: 1px solid rgba(255, 255, 255, 0.07)"],
html[data-theme="light"] [style*="border: 1px solid rgba(255, 255, 255, 0.08)"],
html[data-theme="light"] [style*="border: 1px solid rgba(255, 255, 255, 0.1)"] { border-color:rgba(25,25,34,.10) !important; }

html[data-theme="light"] input,
html[data-theme="light"] textarea,
html[data-theme="light"] select { color:#191922 !important; background:#FFFFFF !important; border-color:rgba(25,25,34,.12) !important; color-scheme:light !important; }
html[data-theme="light"] input::placeholder,
html[data-theme="light"] textarea::placeholder { color:rgba(25,25,34,.35) !important; }

html[data-theme="light"] button[style*="background: transparent"] { color:rgba(25,25,34,.62) !important; border-color:rgba(25,25,34,.12) !important; }
html[data-theme="light"] .vl-action-centre-panel { background:#FFFFFF !important; color:#191922 !important; border-color:rgba(25,25,34,.10) !important; box-shadow:0 28px 70px rgba(31,31,45,.16) !important; }
`;

export default function ThemeMode() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark"; }
    catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) setTheme(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  let loggedIn = false;
  try { loggedIn = !!JSON.parse(localStorage.getItem("vl_session") || "null")?.token; } catch {}

  return (
    <>
      <style>{lightCss}</style>
      <button
        type="button"
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        title={theme === "light" ? "Dark mode" : "Light mode"}
        onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
        style={{
          position:"fixed", right:16, top:loggedIn ? 70 : 14, zIndex:5000,
          width:36, height:36, borderRadius:9, cursor:"pointer",
          border: theme === "light" ? "1px solid rgba(25,25,34,.12)" : "1px solid rgba(255,255,255,.09)",
          background: theme === "light" ? "rgba(255,255,255,.92)" : "rgba(17,17,24,.92)",
          color: theme === "light" ? "#191922" : "#F0EDE6",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
          boxShadow:"0 8px 24px rgba(0,0,0,.12)", backdropFilter:"blur(12px)"
        }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </>
  );
}
