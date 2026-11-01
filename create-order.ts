// Supabase Edge Function: create-order
// Checks the user is logged in, applies a coupon if given, and creates a Razorpay order.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: u, error } = await admin.auth.getUser(token);
    if (error || !u.user) return json({ error: "Please log in again." }, 401);
    const uid = u.user.id;

    const { data: p } = await admin.from("purchases").select("paid").eq("user_id", uid).maybeSingle();
    if (p?.paid) return json({ paid: true });

    const body = await req.json().catch(() => ({}));
    const currency = Deno.env.get("CURRENCY") || "GBP";
    let amount = Number(Deno.env.get("PRICE_MINOR") || "1500");   // launch price in pence
    const list = Number(Deno.env.get("LIST_PRICE_MINOR") || "2000");
    let coupon: string | null = null;
    const c = String(body.coupon || "").trim().toUpperCase();
    if (c) {
      const { data: cp } = await admin.from("coupons").select("*").eq("code", c).eq("active", true).maybeSingle();
      if (!cp) return json({ error: "This coupon is not valid." }, 400);
      amount = cp.amount_minor; coupon = c;
    }
    if (body.check) return json({ amount, currency, list, coupon });

    const keyId = Deno.env.get("RAZORPAY_KEY_ID")!, keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Basic " + btoa(keyId + ":" + keySecret) },
      body: JSON.stringify({ amount, currency, receipt: uid.slice(0, 30), notes: { user_id: uid, coupon: coupon || "" } })
    });
    const o = await r.json();
    if (!r.ok) return json({ error: o?.error?.description || "Could not start the payment." }, 502);
    return json({ order_id: o.id, amount, currency, key_id: keyId, email: u.user.email || "" });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
