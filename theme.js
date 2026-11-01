// theme.js - app bar + small touches for the new look. Loaded last.
(function () {
  var link = document.createElement("link"); link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
  var fav = document.createElement("link"); fav.rel = "icon"; fav.href = "favicon.png"; document.head.appendChild(fav);
  var th = document.createElement("link"); th.rel = "stylesheet"; th.href = "theme.css";
  document.head.appendChild(th);

  var CAR = '<svg viewBox="0 0 40 40" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21l3-8a3 3 0 0 1 2.8-2h14.4a3 3 0 0 1 2.8 2l3 8"/><rect x="4" y="21" width="32" height="9" rx="3"/><circle cx="12" cy="25.5" r="1.4" fill="#fff"/><circle cx="28" cy="25.5" r="1.4" fill="#fff"/><path d="M9 30v3M31 30v3"/></svg>';
  var GLOBE = '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>';
  var USER = '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>';

  var bar = document.createElement("div"); bar.id = "appbar";
  bar.innerHTML = '<div class="logo"><span class="lbadge"><img src="logo-icon.png" alt=""></span><div>UK Theory<br>Practice Kit</div></div>' +
    '<button class="chip" id="abLang">' + GLOBE + '<span id="abLangTxt">English</span></button>' +
    '<button class="prof" id="abProf" title="Log out">' + USER + '</button>';
  document.body.insertBefore(bar, document.body.firstChild);

  document.getElementById("abLang").onclick = function () { var b = document.querySelector(".langBtn"); if (b) b.click(); };
  document.getElementById("abProf").onclick = function () {
    var o = document.getElementById("authOut");
    if (o && window.confirm("Log out?")) o.click();
  };

  // welcome title
  var h1 = document.querySelector("#welcome h1"); if (h1) h1.textContent = "Welcome to UK Theory Practice Kit!";

  // home greeting + banner
  var home = document.getElementById("home");
  if (home) {
    var hello = document.createElement("div"); hello.id = "homeHello";
    hello.innerHTML = "<h2>Hello Learner! 👋</h2><p>Let's keep going towards your goal.</p>";
    home.insertBefore(hello, home.firstChild);
    var ban = document.createElement("div"); ban.id = "homeBanner";
    ban.innerHTML = "<span>🏆</span><div>Know the rules. Drive safely. Pass with ease.</div><img src=\"car.webp\" alt=\"\">";
    home.appendChild(ban);
    // keep the hub right after the greeting
    var fix = function () { var hub = document.getElementById("hub"); if (hub && hub.previousElementSibling !== hello && hub.parentNode === home) hello.after(hub); };
    new MutationObserver(fix).observe(home, { childList: true });
  }

  // London skyline at the bottom of a few screens
  var SKY = '<svg viewBox="0 0 352 70" preserveAspectRatio="xMidYMax slice" fill="currentColor"><path d="M0 70V52h14v-8h10v8h8V40h12v12h10V46h8v6h12V30h4v-8h2v-6h2v6h2v8h4v22h10V44h14v8h8V36l7-8 7 8v16h10V48h6v4h16V38h10v14h8V22h6V10l3-8 3 8v12h6v30h10V44h12v8h8V30a14 14 0 0 1 28 0v22h6V40h10v12h12V46h10v6h10V36h8v16h12v-8h10v8h14v18z"/><circle cx="296" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M296 16v28M282 30h28M286 20l20 20M306 20l-20 20" stroke="currentColor" stroke-width="1.2"/></svg>';
  ["welcome", "langs", "home"].forEach(function (id) {
    var s = document.getElementById(id); if (!s) return;
    var d = document.createElement("div"); d.className = "skyline"; d.innerHTML = SKY; s.appendChild(d);
    new MutationObserver(function () { if (s.lastElementChild !== d) s.appendChild(d); }).observe(s, { childList: true });
  });

  // ring: show the percentage instead of an emoji
  function rings() {
    document.querySelectorAll("#hub .ring").forEach(function (r) {
      var c = r.querySelectorAll("circle")[1], i = r.querySelector("i"); if (!c || !i) return;
      var da = (c.getAttribute("stroke-dasharray") || "0 1").split(/[ ,]+/).map(parseFloat);
      var pct = Math.round(da[0] / (da[1] || 1) * 100); if (isNaN(pct)) return;
      if (!r.dataset.ic) { r.dataset.ic = i.textContent; var e = document.createElement("div"); e.className = "hicon"; e.textContent = i.textContent; r.parentNode.insertBefore(e, r); }
      i.textContent = Math.max(0, Math.min(100, pct)) + "%";
    });
  }

  // language chip text + selected language card
  function sync() {
    var b = document.querySelector(".langBtn"), t = document.getElementById("abLangTxt");
    if (b && t) { var s = (b.textContent || "").replace(/🌐/g, "").trim();
      try { var L = (window.LANGS || LANGS).filter(function (x) { return x.code === save.lang; })[0]; if (L) s = L.label.replace(/\s*\(.*\)\s*$/, ""); else s = "Language"; } catch (e) {} if (s && t.textContent !== s) t.textContent = s; }
    document.querySelectorAll("#langList .item").forEach(function (i) { i.classList.toggle("sel", /✓/.test(i.textContent)); });
  }
  setInterval(function () { sync(); rings(); }, 500); sync();
})();
