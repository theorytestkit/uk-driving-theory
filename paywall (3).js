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
      '<img src="' + ((window.IMG && IMG.logo) || "logo.png") + '" alt="UK Theory Test Kit" style="width:240px;max-width:80%;display:block;margin:0 0 10px">' +
      '<div id="pwDemo" style="display:none;background:#E6F5F3;color:#14817A;border-radius:12px;padding:12px 14px;margin:0 0 14px;font-weight:600"></div>' +
      '<h2 style="margin:0 0 4px;color:#142B4A;font-size:1.5rem">Get the full course</h2>' +
      '<p style="margin:0 0 16px;color:#555">Unlock everything with one payment. No subscription.</p>' +
      '<div style="background:#fff;border-radius:14px;padding:18px;box-shadow:0 2px 10px #0001">' +
      '<div style="font-weight:700;color:#142B4A;margin-bottom:6px">What you get</div>' +
      '<ul style="margin:0 0 14px;padding-left:20px;line-height:1.55;color:#222;font-size:15px">' +
      '<li style="list-style:none;margin-left:-20px;padding:2px 0"><span style="color:#1B9A91;font-weight:700">✔</span> <b>785 practice questions</b> in all 15 chapters, each with an explanation</li>' +
      '<li style="list-style:none;margin-left:-20px;padding:2px 0"><span style="color:#1B9A91;font-weight:700">✔</span> Meanings and <b>audio</b> in 10 South Asian languages and English</li>' +
      '<li style="list-style:none;margin-left:-20px;padding:2px 0"><span style="color:#1B9A91;font-weight:700">✔</span> <b>Study notes</b> for every chapter</li>' +
      '<li style="list-style:none;margin-left:-20px;padding:2px 0"><span style="color:#1B9A91;font-weight:700">✔</span> <b>Quick tests</b> (20 questions) and full <b>mock tests</b> (50 questions, 57 minutes), like the real test</li>' +
      '<li style="list-style:none;margin-left:-20px;padding:2px 0"><span style="color:#1B9A91;font-weight:700">✔</span> <b>14 hazard perception clips</b> with scoring</li>' +
      '<li style="list-style:none;margin-left:-20px;padding:2px 0"><span style="color:#1B9A91;font-weight:700">✔</span> <b>Road words</b> dictionary with pictures</li>' +
      '<li style="list-style:none;margin-left:-20px;padding:2px 0"><span style="color:#1B9A91;font-weight:700">✔</span> Your progress is saved, use it on any device</li></ul>' +
      '<img src="' + ((window.IMG && IMG.gift) || "gift.png") + '" alt="" style="float:right;width:92px;margin:-4px -4px 0 6px">' +
      '<div style="font-size:15px;color:#777">Normal price <s id="pwList">£20</s></div>' +
      '<div style="font-size:34px;font-weight:700;color:#142B4A" id="pwPrice">£15</div>' +
      '<div style="font-size:13px;color:#14541f;background:#FFF1C2;display:inline-block;padding:3px 10px;border-radius:8px;margin-bottom:12px" id="pwTag">Launch offer · one-time payment</div>' +
      '<input id="pwCoupon" placeholder="Coupon code (if you have one)" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #ccd;border-radius:8px;font-size:15px;text-transform:uppercase">' +
      '<button id="pwApply" style="margin-top:8px;padding:9px 14px;border:1px solid #142B4A;background:#fff;color:#142B4A;border-radius:8px;font-size:14px">Apply coupon</button>' +
      '<div id="pwMsg" style="min-height:20px;margin:10px 0;font-size:14px;color:#c0392b"></div>' +
      '<button id="pwPay" style="width:100%;padding:14px;border:0;background:#142B4A;color:#fff;border-radius:12px;font-size:17px;font-weight:600">Pay now</button>' +
      '<p style="font-size:12px;color:#777;margin:12px 0 0">Secure card payment by Stripe (Visa, Mastercard, Apple Pay, Google Pay). By paying you agree to the <a href="terms.html" target="_blank">Terms</a> and <a href="refund.html" target="_blank">Refund policy</a>. Questions: <a href="contact.html" target="_blank">Contact</a>.</p>' +
      '</div>' +
      '<p style="text-align:center;margin-top:16px"><a href="#" id="pwOut" style="color:#666;font-size:13px">Log out</a></p></div>';
    document.body.appendChild(box);
    $("pwApply").onclick = function () { quote(); };
    $("pwPay").onclick = pay;
    $("pwOut").onclick = function (e) { e.preventDefault(); window.sbClient.auth.signOut().then(function () { location.reload(); }); };
    return box;
  }

  async function call(body) {
    var r = await window.sbClient.functions.invoke("stripe-checkout", { body: body });
    if (r.error) {
      var m = "Something went wrong. Please try again.";
      try { var st = r.error.context && r.error.context.status; var j = await r.error.context.json(); m = (j.error || j.message || j.msg || m) + (st ? " (code " + st + ")" : ""); } catch (e) { m = m + " (" + (r.error.message || "no details") + ")"; }
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
    var btn = $("pwPay"); btn.disabled = true; btn.textContent = "Opening secure payment…";
    $("pwMsg").style.color = "#c0392b"; $("pwMsg").textContent = "";
    try {
      var d = await call({ coupon: $("pwCoupon").value.trim() });
      if (d.paid) return unlock();
      if (!d.url) throw new Error("Could not start the payment. Please try again.");
      location.href = d.url;   // Stripe's secure payment page; it comes back to the site after paying
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
    if (/[?&]paid=1/.test(location.search)) {      // just came back from Stripe
      build(); box.style.display = "block"; document.body.style.overflow = "hidden";
      $("pwPay").style.display = "none";
      try { history.replaceState(null, "", location.pathname); } catch (e) {}
      return waitPaid();
    }
    // Payment page comes last: after the welcome page and language choice.
    function show() {
      build();
      if (demoDone() && $("pwDemo").style.display !== "block") { $("pwDemo").style.display = "block"; $("pwDemo").textContent = "You've finished the free demo. Get full access to keep practising."; } box.style.display = "block"; document.body.style.overflow = "hidden";
      if (owner && !$("pwClose")) {
        var c = document.createElement("p"); c.id = "pwClose"; c.style.cssText = "text-align:center";
        c.innerHTML = '<a href="#" style="color:#c0392b;font-size:13px">Close (test mode, owner only)</a>';
        c.firstChild.onclick = function (e) { e.preventDefault(); unlock(); };
        box.firstChild.appendChild(c);
      }
      quote();
    }
    window.__pwShow = show;
    function ready() { try { return langChosen() && cur !== "langs" && cur !== "welcome"; } catch (e) { return langChosen(); } }
    function go() { if (test || demoDone()) show(); else startDemo(); }
    if (test || ready()) return go();
    clearInterval(tick);
    tick = setInterval(function () { if (ready()) { clearInterval(tick); go(); } }, 800);
  }

  // ---------- free demo: 20 questions (one from each chapter, then a few more) ----------
  var DEMO_N = 20, demo = false, demoBar = null;
  function getSave() { try { return JSON.parse(localStorage.getItem("save") || "{}"); } catch (e) { return {}; } }
  function demoDone() { try { return !!(save && save.demoDone) || !!getSave().demoDone; } catch (e) { return !!getSave().demoDone; } }
  function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // Same 20 questions for everyone, in the same order:
  // the first question of every chapter, then the second question of the first chapters.
  function pickDemo() {
    var byCh = {};
    questions.slice().sort(function (x, y) { return x.id - y.id; }).forEach(function (q) { (byCh[q.chapter] = byCh[q.chapter] || []).push(q); });
    var ids = chapters.map(function (c) { return c.id; }).filter(function (id) { return byCh[id] && byCh[id].length; });
    var pick = [];
    ids.forEach(function (id) { pick.push(byCh[id][0]); });
    for (var k = 0; pick.length < DEMO_N && k < ids.length; k++) if (byCh[ids[k]][1]) pick.push(byCh[ids[k]][1]);
    return pick.slice(0, DEMO_N);
  }
  function startDemo() {
    demo = true;
    if (!demoBar) {
      demoBar = document.createElement("div"); demoBar.id = "demoBar";
      demoBar.style.cssText = "background:#E6F5F3;color:#14817A;border-radius:12px;padding:10px 14px;margin:8px 0 4px;font-weight:600;font-size:.92rem";
      var pr = document.getElementById("practice"); pr.insertBefore(demoBar, pr.firstChild);
    }
    var st = document.createElement("style"); st.id = "demoCss";
    st.textContent = "body.demo #backBtn,body.demo #hub,body.demo .bigcard{display:none!important}";
    document.head.appendChild(st); document.body.classList.add("demo");
    set = pickDemo(); chapterId = 0; index = 0; score = 0; wrongNow = []; finished = false;
    newQuestion(); cur = "practice"; show("practice"); renderPractice();
  }
  function endDemo() {
    demo = false; document.body.classList.remove("demo");
    if (demoBar) demoBar.style.display = "none";
    try { save.demoDone = true; store(); } catch (e) {}
    build();
    var d = $("pwDemo"); d.style.display = "block";
    d.innerHTML = "🎉 Free demo finished! You got <b>" + score + " / " + set.length + "</b> right.<br><span style='font-weight:400'>The real test pass mark is 43 out of 50 (86%). Keep practising with the full course.</span>";
    if (window.__pwShow) window.__pwShow();
  }
  var origRender = window.renderPractice;
  window.renderPractice = function () {
    var r = origRender.apply(this, arguments);
    if (demo) {
      if (finished) { endDemo(); return r; }
      if (demoBar) { demoBar.style.display = "block"; demoBar.innerHTML = "Free demo · question " + (index + 1) + " of " + set.length + "<br><span style='font-weight:400'>Try the course in your language. Then get full access.</span>"; }
    }
    return r;
  };
  // never leave the demo for the home screen
  var origShow = window.show;
  window.show = function (id) {
    if (demo && id !== "practice" && id !== "langs") { return origShow.call(this, "practice"); }
    return origShow.apply(this, arguments);
  };

  document.addEventListener("authed", check);
  if (window.sbClient && window.sbUid) check();
})();
