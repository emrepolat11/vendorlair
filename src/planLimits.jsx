import { useEffect, useRef } from "react";

const PAID_VENDOR_LIMIT = 100;
const SUPABASE_URL = "https://zbubciohzssmunwdbdch.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJjaW9oenNzbXVud2RiZGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjE0MzMsImV4cCI6MjA5NzUzNzQzM30._mxfvMKXn6GxCQdNawfh33wcE91LoHg8WJ4NSLkCSjc";

function getSession() {
  try { return JSON.parse(localStorage.getItem("vl_session") || "null"); }
  catch { return null; }
}

export default function PlanLimits() {
  const state = useRef({ isPro: false, vendorCount: 0 });

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    const refresh = async () => {
      const session = getSession();
      if (!session?.token || !session?.user?.id) {
        state.current = { isPro: false, vendorCount: 0 };
        return;
      }
      try {
        const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.token}` };
        const [profileRes, vendorsRes] = await Promise.all([
          originalFetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${session.user.id}&select=is_pro`, { headers }),
          originalFetch(`${SUPABASE_URL}/rest/v1/vendors?user_id=eq.${session.user.id}&select=id`, { headers }),
        ]);
        const profile = profileRes.ok ? await profileRes.json() : [];
        const vendors = vendorsRes.ok ? await vendorsRes.json() : [];
        state.current = { isPro: !!profile?.[0]?.is_pro, vendorCount: vendors.length };
      } catch {
        // Keep the last known state if the check fails.
      }
    };

    refresh();
    const interval = window.setInterval(refresh, 10000);

    window.fetch = async (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url || "";
      const method = (init?.method || (typeof input !== "string" ? input?.method : "GET") || "GET").toUpperCase();
      const isNewVendor = method === "POST" && url.includes("/rest/v1/vendors");

      if (isNewVendor && state.current.isPro && state.current.vendorCount >= PAID_VENDOR_LIMIT) {
        window.alert("You've reached the maximum number of vendors for this plan.");
        return new Response(JSON.stringify({ message: "Vendor limit reached" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const response = await originalFetch(input, init);
      if (isNewVendor && response.ok) {
        state.current.vendorCount += 1;
      }
      return response;
    };

    const onClickCapture = (event) => {
      const button = event.target?.closest?.("button");
      if (!button) return;
      if (button.textContent?.trim().includes("Add vendor") && state.current.isPro && state.current.vendorCount >= PAID_VENDOR_LIMIT) {
        event.preventDefault();
        event.stopPropagation();
        window.alert("You've reached the maximum number of vendors for this plan.");
      }
    };
    document.addEventListener("click", onClickCapture, true);

    const replaceUnlimitedCopy = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue?.includes("unlimited vendors")) node.nodeValue = node.nodeValue.replace("unlimited vendors", "more vendors");
        if (node.nodeValue?.includes("Pro — unlimited")) node.nodeValue = node.nodeValue.replace("Pro — unlimited", "Pro plan");
      }
    };
    replaceUnlimitedCopy();
    const observer = new MutationObserver(replaceUnlimitedCopy);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      window.fetch = originalFetch;
      window.clearInterval(interval);
      document.removeEventListener("click", onClickCapture, true);
      observer.disconnect();
    };
  }, []);

  return null;
}
