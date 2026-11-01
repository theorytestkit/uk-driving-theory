// Paywall: after login, if the user has not paid, cover the whole app with a payment screen.
(function () {
  var box = null, busy = false, pollT = null;
  function $(id) { return document.getElementById(id); }
  function money(m, c) { return (c === "GBP" ? "£" : c + " ") + (m / 100).toFixed(m % 100 ? 2 : 0); }

  function build() {
    if (box) return box;
    box = document.createElement("div");
    box.id = "payWall";
    box.style.cssText = "position:fixed;inset:0;z-index:99999;background:#f4f6fb;overflow:auto;display:none;font-family:Poppins,system-ui,sans-serif";
    box.innerHTML =
      '<div style="max-width:440px;margin:0 auto;padding:28px 18px">' +
      '<img src="logo.png" alt="UK Theory Practice Kit" style="width:240px;max-width:80%;display:block;margin:0 0 10px">' +
      '<p style="margin:0 0 18px;color:#555">Unlock everything with one payment. No subscription.</p>' +
      '<div style="background:#fff;border-radius:14px;padding:18px;box-shadow:0 2px 10px #0001">' +
      '<ul style="margin:0 0 14px;padding-left:20px;line-height:1.7;color:#222">' +
      '<li style="list-style:none;margin-left:-20px"><span style="color:#1B9A91;font-weight:700">✔</span> Full question bank with explanations</li><li style="list-style:none;margin-left:-20px"><span style="color:#1B9A91;font-weight:700">✔</span> Meanings and audio in 10 South Asian languages</li>' +
      '<li style="list-style:none;margin-left:-20px"><span style="color:#1B9A91;font-weight:700">✔</span> Study notes, quick tests and mock tests</li><li style="list-style:none;margin-left:-20px"><span style="color:#1B9A91;font-weight:700">✔</span> 14 Hazard Perception clips</li></ul>' +
      '<img src="gift.png" alt="" style="float:right;width:92px;margin:-4px -4px 0 6px">' +
      '<div style="font-size:15px;color:#777">Normal price <s id="pwList">£20</s></div>' +
      '<div style="font-size:34px;font-weight:700;color:#142B4A" id="pwPrice">£15</div>' +
      '<div style="font-size:13px;color:#14541f;background:#FFF1C2;display:inline-block;padding:3px 10px;border-radius:8px;margin-bottom:12px" id="pwTag">Launch offer · one-time payment</div>' +
      '<input id="pwCoupon" placeholder="Coupon code (if you have one)" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #ccd;border-radius:8px;font-size:15px;text-transform:uppercase">' +
      '<button id="pwApply" style="margin-top:8px;padding:9px 14px;border:1px solid #142B4A;background:#fff;color:#142B4A;border-radius:8px;font-size:14px">Apply coupon</button>' +
      '<div id="pwMsg" style="min-height:20px;margin:10px 0;font-size:14px;color:#c0392b"></div>' +
      '<button id="pwPay" style="width:100%;padding:14px;border:0;background:#142B4A;color:#fff;border-radius:12px;font-size:17px;font-weight:600">Pay now</button>' +
      '<p style="font-size:12px;color:#777;margin:12px 0 0">Secure payment by Razorpay (cards, UPI and more). By paying you agree to the <a href="terms.html" target="_blank">Terms</a> and <a href="refund.html" target="_blank">Refund policy</a>. Questions: <a href="contact.html" target="_blank">Contact</a>.</p>' +
      '</div>' +
      '<p style="text-align:center;margin-top:16px"><a href="#" id="pwOut" style="color:#666;font-size:13px">Log out</a></p></div>';
    document.body.appendChild(box);
    $("pwApply").onclick = function () { quote(); };
    $("pwPay").onclick = pay;
    $("pwOut").onclick = function (e) { e.preventDefault(); window.sbClient.auth.signOut().then(function () { location.reload(); }); };
    return box;
  }

  async function call(body) {
    var r = await window.sbClient.functions.invoke("create-order", { body: body });
    if (r.error) {
      var m = "Something went wrong. Please try again.";
      try { var j = await r.error.context.json(); if (j.error) m = j.error; } catch (e) {}
      throw new Error(m);
    }
    return r.data;
  }

  async function quote() {
    var c = $("pwCoupon").value.trim();
    $("pwMsg").style.color = "#c0392b"; $("pwMsg").textContent = "";
    try {
      var d = await call({ check: true, coupon: c });
      $("pwList").textContent = money(d.list, d.currency);
      $("pwPrice").textContent = money(d.amount, d.currency);
      $("pwTag").textContent = d.coupon ? "Coupon applied · one-time payment" : "Launch offer · one-time payment";
      if (d.coupon) { $("pwMsg").style.color = "#2a8a3a"; $("pwMsg").textContent = "Coupon applied ✓"; }
    } catch (e) { $("pwMsg").textContent = e.message; }
  }

  async function pay() {
    if (busy) return; busy = true;
    var btn = $("pwPay"); btn.disabled = true; btn.textContent = "Please wait…";
    $("pwMsg").style.color = "#c0392b"; $("pwMsg").textContent = "";
    try {
      var d = await call({ coupon: $("pwCoupon").value.trim() });
      if (d.paid) return unlock();
      if (!window.Razorpay) throw new Error("Payment window could not load. Check your internet and refresh.");
      var rz = new window.Razorpay({
        key: d.key_id, order_id: d.order_id, amount: d.amount, currency: d.currency,
        name: "UK Theory Practice Kit", description: "One-time access", prefill: { email: d.email },
        theme: { color: "#142B4A" },
        handler: function () { waitPaid(); },
        modal: { ondismiss: function () { busy = false; btn.disabled = false; btn.textContent = "Pay now"; } }
      });
      rz.on("payment.failed", function (r) {
        $("pwMsg").textContent = (r && r.error && r.error.description) || "Payment failed. Please try again.";
        busy = false; btn.disabled = false; btn.textContent = "Pay now";
      });
      rz.open();
    } catch (e) {
      $("pwMsg").textContent = e.message; busy = false; btn.disabled = false; btn.textContent = "Pay now";
    }
  }

  async function isPaid() {
    var r = await window.sbClient.from("purchases").select("paid").eq("user_id", window.sbUid).maybeSingle();
    return !!(r.data && r.data.paid);
  }

  function waitPaid() {
    $("pwMsg").style.color = "#2a8a3a"; $("pwMsg").textContent = "Payment received. Unlocking…";
    var n = 0;
    clearInterval(pollT);
    pollT = setInterval(async function () {
      n++;
      try { if (await isPaid()) { clearInterval(pollT); unlock(); } } catch (e) {}
      if (n > 40) { clearInterval(pollT); $("pwMsg").textContent = "Taking longer than usual. Refresh in a minute, or contact us if you were charged."; }
    }, 3000);
  }

  function unlock() { if (box) box.style.display = "none"; document.body.style.overflow = ""; }

  var OWNERS = ["taranjit.darapur@gmail.com", "saab8715@gmail.com"];   // these emails always get in free (for testing)
  var tick = null;

  function langChosen() {
    try { return !!JSON.parse(localStorage.getItem("save") || "{}").lang; } catch (e) { return false; }
  }

  async function check() {
    var email = "";
    try { var g = await window.sbClient.auth.getSession(); email = ((g.data.session && g.data.session.user.email) || "").toLowerCase(); } catch (e) {}
    var owner = OWNERS.indexOf(email) >= 0;
    var test = /[?&]paytest=1/.test(location.search);
    if (owner && !test) return;                       // owner: site is open, no payment page
    if (!test) {
      try { if (await isPaid()) return; } catch (e) { return; }
    }
    // Payment page comes last: after the welcome page and language choice.
    function show() {
      build(); box.style.display = "block"; document.body.style.overflow = "hidden";
      if (owner && !$("pwClose")) {
        var c = document.createElement("p"); c.id = "pwClose"; c.style.cssText = "text-align:center";
        c.innerHTML = '<a href="#" style="color:#c0392b;font-size:13px">Close (test mode, owner only)</a>';
        c.firstChild.onclick = function (e) { e.preventDefault(); unlock(); };
        box.firstChild.appendChild(c);
      }
      quote();
    }
    if (test || langChosen()) return show();
    clearInterval(tick);
    tick = setInterval(function () { if (langChosen()) { clearInterval(tick); show(); } }, 800);
  }

  document.addEventListener("authed", check);
  if (window.sbClient && window.sbUid) check();
})();
