// Supabase Edge Function: razorpay-webhook   (turn OFF "Verify JWT" for this one)
// Razorpay calls this after a payment. We check the signature, then mark the user as paid.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

Deno.serve(async (req) => {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") || "";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (!secret || hex !== sig) return new Response("bad signature", { status: 400 });

  const ev = JSON.parse(raw);
  if (ev.event === "order.paid") {
    const order = ev.payload?.order?.entity, pay = ev.payload?.payment?.entity;
    const uid = order?.notes?.user_id;
    if (uid) {
      const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await admin.from("purchases").upsert({
        user_id: uid, paid: true, amount: order.amount_paid ?? order.amount, currency: order.currency,
        coupon: order.notes?.coupon || null, razorpay_order_id: order.id, razorpay_payment_id: pay?.id || null
      });
      if (order.notes?.coupon) {
        const { data: cp } = await admin.from("coupons").select("uses").eq("code", order.notes.coupon).maybeSingle();
        if (cp) await admin.from("coupons").update({ uses: (cp.uses || 0) + 1 }).eq("code", order.notes.coupon);
      }
    }
  }
  return new Response("ok");
});
