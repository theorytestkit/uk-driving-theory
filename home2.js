// home2.js - new home screen: Study and practice / Test yourself / Hazard perception.
// Study = notes only, Practice = questions, Quick test = 20 questions from chapters you choose, Mock test = 50 questions.
(function () {
  var T = {
    en: { sp: "Study and practice", ty: "Test yourself", hp: "Hazard perception", st: "Study", pr: "Practice", qt: "Quick test", mt: "Mock test", prog: "progress", acc: "accuracy", rd: "read", tk: "tests taken", res: "My results", all: "Select all", go: "Continue", pick: "Choose one or more chapters", nx: "Next", pv: "Previous", pg: "Page" },
    hi: { sp: "अध्ययन और अभ्यास", ty: "खुद को परखें", hp: "खतरा पहचान", st: "अध्ययन (नोट्स)", pr: "अभ्यास", qt: "क्विक टेस्ट", mt: "मॉक टेस्ट", prog: "प्रगति", acc: "सटीकता", rd: "पढ़ा", tk: "टेस्ट दिए", res: "मेरे नतीजे", all: "सभी चुनें", go: "आगे बढ़ें", pick: "एक या ज़्यादा चैप्टर चुनें", nx: "आगे", pv: "पीछे", pg: "पेज" },
    pa: { sp: "ਪੜ੍ਹਾਈ ਅਤੇ ਅਭਿਆਸ", ty: "ਆਪਣੇ ਆਪ ਨੂੰ ਪਰਖੋ", hp: "ਖ਼ਤਰੇ ਦੀ ਪਛਾਣ", st: "ਪੜ੍ਹਾਈ (ਨੋਟਸ)", pr: "ਅਭਿਆਸ", qt: "ਕੁਇੱਕ ਟੈਸਟ", mt: "ਮੌਕ ਟੈਸਟ", prog: "ਤਰੱਕੀ", acc: "ਸ਼ੁੱਧਤਾ", rd: "ਪੜ੍ਹਿਆ", tk: "ਟੈਸਟ ਦਿੱਤੇ", res: "ਮੇਰੇ ਨਤੀਜੇ", all: "ਸਭ ਚੁਣੋ", go: "ਅੱਗੇ ਵਧੋ", pick: "ਇੱਕ ਜਾਂ ਵੱਧ ਚੈਪਟਰ ਚੁਣੋ", nx: "ਅੱਗੇ", pv: "ਪਿੱਛੇ", pg: "ਪੰਨਾ" },
    ur: { sp: "مطالعہ اور مشق", ty: "خود کو آزمائیں", hp: "خطرے کی پہچان", st: "مطالعہ (نوٹس)", pr: "مشق", qt: "کوئیک ٹیسٹ", mt: "ماک ٹیسٹ", prog: "پیش رفت", acc: "درستگی", rd: "پڑھا", tk: "ٹیسٹ دیے", res: "میرے نتائج", all: "سب منتخب کریں", go: "آگے بڑھیں", pick: "ایک یا زیادہ باب منتخب کریں", nx: "آگے", pv: "پیچھے", pg: "صفحہ" },
    bn: { sp: "পড়াশোনা ও অনুশীলন", ty: "নিজেকে যাচাই করুন", hp: "বিপদ শনাক্তকরণ", st: "পড়াশোনা (নোট)", pr: "অনুশীলন", qt: "কুইক টেস্ট", mt: "মক টেস্ট", prog: "অগ্রগতি", acc: "নির্ভুলতা", rd: "পড়া হয়েছে", tk: "টেস্ট দেওয়া", res: "আমার ফলাফল", all: "সব বেছে নিন", go: "এগিয়ে যান", pick: "এক বা একাধিক চ্যাপ্টার বেছে নিন", nx: "পরের", pv: "আগের", pg: "পৃষ্ঠা" },
    te: { sp: "అధ్యయనం మరియు సాధన", ty: "మిమ్మల్ని మీరు పరీక్షించుకోండి", hp: "ప్రమాద గుర్తింపు", st: "అధ్యయనం (నోట్స్)", pr: "సాధన", qt: "క్విక్ టెస్ట్", mt: "మాక్ టెస్ట్", prog: "పురోగతి", acc: "ఖచ్చితత్వం", rd: "చదివారు", tk: "టెస్టులు రాశారు", res: "నా ఫలితాలు", all: "అన్నీ ఎంచుకోండి", go: "కొనసాగండి", pick: "ఒకటి లేదా ఎక్కువ చాప్టర్లను ఎంచుకోండి", nx: "తరువాత", pv: "వెనుకకు", pg: "పేజీ" },
    mr: { sp: "अभ्यास आणि सराव", ty: "स्वतःची परीक्षा घ्या", hp: "धोका ओळख", st: "अभ्यास (नोट्स)", pr: "सराव", qt: "क्विक टेस्ट", mt: "मॉक टेस्ट", prog: "प्रगती", acc: "अचूकता", rd: "वाचले", tk: "टेस्ट दिल्या", res: "माझे निकाल", all: "सर्व निवडा", go: "पुढे जा", pick: "एक किंवा अधिक धडे निवडा", nx: "पुढे", pv: "मागे", pg: "पान" },
    ml: { sp: "പഠനവും പരിശീലനവും", ty: "സ്വയം പരീക്ഷിക്കുക", hp: "അപകട തിരിച്ചറിയൽ", st: "പഠനം (നോട്ടുകൾ)", pr: "പരിശീലനം", qt: "ക്വിക്ക് ടെസ്റ്റ്", mt: "മോക്ക് ടെസ്റ്റ്", prog: "പുരോഗതി", acc: "കൃത്യത", rd: "വായിച്ചു", tk: "ടെസ്റ്റുകൾ എഴുതി", res: "എന്റെ ഫലങ്ങൾ", all: "എല്ലാം തിരഞ്ഞെടുക്കുക", go: "തുടരുക", pick: "ഒന്നോ അതിലധികമോ അധ്യായങ്ങൾ തിരഞ്ഞെടുക്കുക", nx: "അടുത്തത്", pv: "മുമ്പത്തെ", pg: "പേജ്" },
    ta: { sp: "படிப்பு மற்றும் பயிற்சி", ty: "உங்களை சோதித்துக்கொள்ளுங்கள்", hp: "ஆபத்து அடையாளம்", st: "படிப்பு (குறிப்புகள்)", pr: "பயிற்சி", qt: "குயிக் டெஸ்ட்", mt: "மாக் டெஸ்ட்", prog: "முன்னேற்றம்", acc: "துல்லியம்", rd: "படித்தது", tk: "எழுதிய தேர்வுகள்", res: "என் முடிவுகள்", all: "அனைத்தையும் தேர்ந்தெடு", go: "தொடரவும்", pick: "ஒன்று அல்லது அதற்கு மேற்பட்ட அத்தியாயங்களைத் தேர்ந்தெடுக்கவும்", nx: "அடுத்து", pv: "முந்தைய", pg: "பக்கம்" },
    gu: { sp: "અભ્યાસ અને પ્રેક્ટિસ", ty: "જાતને ચકાસો", hp: "જોખમની ઓળખ", st: "અભ્યાસ (નોંધ)", pr: "પ્રેક્ટિસ", qt: "ક્વિક ટેસ્ટ", mt: "મોક ટેસ્ટ", prog: "પ્રગતિ", acc: "ચોકસાઈ", rd: "વાંચ્યું", tk: "ટેસ્ટ આપ્યા", res: "મારા પરિણામો", all: "બધું પસંદ કરો", go: "આગળ વધો", pick: "એક અથવા વધુ પ્રકરણ પસંદ કરો", nx: "આગળ", pv: "પાછળ", pg: "પાનું" },
    ne: { sp: "अध्ययन र अभ्यास", ty: "आफूलाई परीक्षण गर्नुहोस्", hp: "जोखिम पहिचान", st: "अध्ययन (नोट्स)", pr: "अभ्यास", qt: "क्विक टेस्ट", mt: "मक टेस्ट", prog: "प्रगति", acc: "शुद्धता", rd: "पढियो", tk: "टेस्ट दिइयो", res: "मेरा नतिजा", all: "सबै छान्नुहोस्", go: "अगाडि बढ्नुहोस्", pick: "एक वा बढी अध्याय छान्नुहोस्", nx: "अगाडि", pv: "पछाडि", pg: "पृष्ठ" }
  };
  var EN = T.en;
  function t(k) { var l = lang(); return (T[l] && T[l][k]) || EN[k]; }
  function nat(k) { return lang() === "en" ? "" : t(k); }

  // ---------- styles ----------
  var css = document.createElement("style");
  css.textContent =
    "#home > .card, #mockBtn, #histBtn, #chapterList, #hazBtn{display:none!important}" +
    ".hrowx{display:flex;align-items:center;gap:14px;width:100%;text-align:left;background:#fff;border:0;border-bottom:1px solid #e3e7ef;padding:14px 6px;cursor:pointer;font:inherit;color:inherit}" +
    ".hrowx:active{background:#f1f4fa}" +
    ".hrowx .hx{flex:1;min-width:0}.hrowx b{display:block;font-size:1.08rem;color:#1b2a6b}" +
    ".hrowx small{display:block;color:#475069;margin-top:2px;line-height:1.3}" +
    ".hrowx .arr{font-size:1.5rem;color:#475069}" +
    ".ring{position:relative;width:54px;height:54px;flex:none}.ring svg{width:54px;height:54px;transform:rotate(-90deg)}" +
    ".ring i{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:1.35rem}" +
    ".bigcard{display:block;width:100%;margin:12px 0 0;padding:16px;border:0;border-radius:10px;color:#fff;font:inherit;font-weight:700;font-size:1.15rem;text-align:left;cursor:pointer}" +
    ".bigcard small{display:block;font-weight:400;font-size:.92rem;margin-top:3px;opacity:.95}" +
    ".infobox{background:#eef3ff;border-radius:10px;padding:10px 12px;margin:10px 0;color:#1b2a6b;line-height:1.4}" +
    ".tq{display:flex;gap:12px;align-items:center;width:100%;text-align:left;background:#fff;border:0;border-bottom:1px solid #e3e7ef;padding:12px 6px;font:inherit;color:inherit;cursor:pointer}" +
    ".tq .bx{width:26px;height:26px;border:2px solid #1b2a6b;border-radius:4px;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700}" +
    ".tq.on .bx{background:#1b2a6b}.tq b{display:block}.tq small{display:block;color:#475069}" +
    ".note-card{background:#fff;border:1px solid #e3e7ef;border-radius:10px;padding:12px;margin:10px 0;line-height:1.45}" +
    ".note-card .nq{font-weight:700;color:#1b2a6b}.note-card .na{color:#157a3c;font-weight:700;margin-top:6px}" +
    ".note-card .nm{margin-top:6px}.note-card .nx{margin-top:8px;padding-top:8px;border-top:1px dashed #cfd6e6}";
  document.head.appendChild(css);

  // ---------- screens ----------
  var views = {};
  function mk(id, render) {
    var d = document.createElement("div"); d.id = id; d.className = "screen hidden"; document.body.appendChild(d);
    views[id] = function () { render(d); show(id); };
    return d;
  }
  function topBar(backFn) {
    var d = document.createElement("div"); d.className = "top";
    var b = document.createElement("button"); b.className = "link"; b.textContent = tx("back"); b.onclick = backFn;
    var p = document.createElement("button"); p.className = "pill langBtn"; p.onclick = showLanguages;
    p.textContent = document.querySelector("#home .langBtn").textContent;
    d.appendChild(b); d.appendChild(p); return d;
  }
  function ring(pct, emoji, color) {
    var C = 2 * Math.PI * 22;
    return '<div class="ring"><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="#dfe3ea" stroke-width="6"/><circle cx="27" cy="27" r="22" fill="none" stroke="' + (color || "#d6001c") + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (C * Math.max(0, Math.min(100, pct)) / 100).toFixed(1) + " " + C.toFixed(1) + '"/></svg><i>' + emoji + "</i></div>";
  }
  function row(emoji, pct, title, key, sub, fn, color) {
    var b = document.createElement("button"); b.className = "hrowx";
    b.innerHTML = ring(pct, emoji, color) + '<div class="hx"><b>' + esc(title) + "</b>" + (nat(key) ? '<small dir="' + dirOf(lang()) + '">' + esc(nat(key)) + "</small>" : "") + "<small>" + esc(sub) + '</small></div><span class="arr">→</span>';
    b.onclick = fn; return b;
  }
  function pa(p, a) { return p + "% " + t("prog") + ", " + a + "% " + t("acc"); }

  // ---------- numbers ----------
  function spStats() {
    var total = questions.length, att = 0, ok = 0;
    questions.forEach(function (q) {
      var c = save.correct[q.id], w = save.wrong[q.id];
      if (c || w) { att++; if (c && !w) ok++; }
    });
    return { prog: total ? Math.round(att / total * 100) : 0, acc: att ? Math.round(ok / att * 100) : 0 };
  }
  function readPct(chId) {
    var qs = questions.filter(function (q) { return q.chapter === chId; }), r = save.read || {};
    var n = qs.filter(function (q) { return r[q.id]; }).length;
    return qs.length ? Math.round(n / qs.length * 100) : 0;
  }
  function readAll() {
    var r = save.read || {}, n = questions.filter(function (q) { return r[q.id]; }).length;
    return questions.length ? Math.round(n / questions.length * 100) : 0;
  }
  function testStats() {
    var all = (save.mocks || []).concat(save.quicks || []);
    var avg = all.length ? Math.round(all.reduce(function (a, r) { return a + r.score / r.total; }, 0) / all.length * 100) : 0;
    return { n: all.length, avg: avg };
  }

  // ---------- home ----------
  function renderHub() {
    var home = document.getElementById("home"), old = document.getElementById("hub");
    if (old) old.remove();
    var hub = document.createElement("div"); hub.id = "hub";
    var sp = spStats(), ts = testStats(), hz = window.hazInfo ? window.hazInfo() : { prog: 0, acc: 0 };
    hub.appendChild(row("📖", sp.prog, EN.sp, "sp", pa(sp.prog, sp.acc), views.hubSP, "#d6001c"));
    hub.appendChild(row("⏱️", ts.avg, EN.ty, "ty", ts.n + " " + t("tk") + ", " + ts.avg + "% " + t("acc"), views.hubTY, "#d6001c"));
    hub.appendChild(row("🚗", hz.prog, EN.hp, "hp", pa(hz.prog, hz.acc), function () { document.getElementById("hazBtn").click(); }, "#d6001c"));
    var top = home.querySelector(".top");
    top.after(hub);
  }

  // ---------- Study and practice ----------
  mk("hubSP", function (d) {
    d.innerHTML = ""; d.appendChild(topBar(showHome));
    var h = document.createElement("h2"); h.textContent = EN.sp; d.appendChild(h);
    if (nat("sp")) { var n = document.createElement("p"); n.className = "note"; n.dir = dirOf(lang()); n.textContent = nat("sp"); d.appendChild(n); }
    var sp = spStats();
    var b1 = document.createElement("button"); b1.className = "bigcard"; b1.style.background = "#1f2f6e";
    b1.innerHTML = EN.st + (nat("st") ? '<small dir="' + dirOf(lang()) + '">' + esc(nat("st")) + "</small>" : "") + "<small>" + readAll() + "% " + t("rd") + "</small>";
    b1.onclick = views.hubStudy;
    var b2 = document.createElement("button"); b2.className = "bigcard"; b2.style.background = "#1f2f6e";
    b2.innerHTML = EN.pr + (nat("pr") ? '<small dir="' + dirOf(lang()) + '">' + esc(nat("pr")) + "</small>" : "") + "<small>" + pa(sp.prog, sp.acc) + "</small>";
    b2.onclick = views.hubPractice;
    d.appendChild(b1); d.appendChild(b2);
  });

  function chapterButtons(d, small, fn) {
    chapters.forEach(function (c) {
      var qs = questions.filter(function (q) { return q.chapter === c.id; });
      if (!qs.length) return;
      var b = document.createElement("button"); b.className = "item";
      b.innerHTML = "<b>" + c.id + ". " + esc(c.name) + '</b><small dir="' + dirOf(lang()) + '">' + esc(nameOf(c)) + " · " + esc(small(c, qs)) + "</small>";
      b.onclick = function () { fn(c); };
      d.appendChild(b);
    });
  }
  mk("hubStudy", function (d) {
    d.innerHTML = ""; d.appendChild(topBar(views.hubSP));
    var h = document.createElement("h2"); h.textContent = EN.st; d.appendChild(h);
    chapterButtons(d, function (c) { return readPct(c.id) + "% " + t("rd"); }, function (c) { notesState.ch = c.id; notesState.page = 0; views.notes(); });
  });
  mk("hubPractice", function (d) {
    d.innerHTML = ""; d.appendChild(topBar(views.hubSP));
    var h = document.createElement("h2"); h.textContent = EN.pr; d.appendChild(h);
    chapterButtons(d, function (c, qs) { var n = qs.filter(function (q) { return save.correct[q.id]; }).length; return n + " / " + qs.length; }, function (c) { startPractice(c.id, false); });
  });

  // ---------- notes (study) ----------
  var notesState = { ch: 0, page: 0 }, PER = 10;
  mk("notes", function (d) {
    var c = chapters.find(function (x) { return x.id === notesState.ch; }), l = lang();
    var qs = questions.filter(function (q) { return q.chapter === notesState.ch; });
    var pages = Math.max(1, Math.ceil(qs.length / PER)), pg = Math.min(notesState.page, pages - 1);
    d.innerHTML = ""; d.appendChild(topBar(views.hubStudy));
    var h = document.createElement("h2"); h.textContent = c ? c.id + ". " + c.name : ""; d.appendChild(h);
    if (c && nat("st")) { var n = document.createElement("p"); n.className = "note"; n.dir = dirOf(l); n.textContent = nameOf(c); d.appendChild(n); }
    var info = document.createElement("p"); info.className = "note"; info.textContent = t("pg") + " " + (pg + 1) + " / " + pages + " · " + readPct(notesState.ch) + "% " + t("rd"); d.appendChild(info);
    save.read = save.read || {};
    qs.slice(pg * PER, pg * PER + PER).forEach(function (q, k) {
      var tr = q.tr && q.tr[l], ex = (q.exp && (q.exp[l] || q.exp.en)) || "";
      var card = document.createElement("div"); card.className = "note-card";
      var html = (q.sign && typeof signSvg === "function" ? '<div class="signbox">' + signSvg(q.sign) + "</div>" : "") + '<div class="nq">' + (pg * PER + k + 1) + ". " + linkify(q.q) + '</div><div class="na">✓ ' + linkify(q.options[q.answer]) + "</div>";
      if (tr && l !== "en") html += '<div class="nm" dir="' + dirOf(l) + '" lang="' + l + '">' + esc(tr.q) + '<br><b>✓ ' + esc(tr.o[q.answer]) + "</b></div>";
      if (ex) html += '<div class="nx" dir="' + dirOf(l) + '" lang="' + l + '">' + linkify(ex) + "</div>";
      card.innerHTML = html;
      if (ex && typeof speakBtn === "function" && synth) card.appendChild(speakBtn(l === "en" ? "Explanation" : (LISTEN[l] || ""), ex, l, [l + "/e" + q.id], "e"));
      d.appendChild(card);
      save.read[q.id] = true;
    });
    store();
    var nav = document.createElement("div"); nav.className = "row";
    var pv = document.createElement("button"); pv.className = "item half"; pv.textContent = "← " + t("pv"); pv.disabled = pg === 0;
    var nx = document.createElement("button"); nx.className = "item half"; nx.textContent = t("nx") + " →"; nx.disabled = pg >= pages - 1;
    pv.onclick = function () { notesState.page = pg - 1; views.notes(); }; nx.onclick = function () { notesState.page = pg + 1; views.notes(); };
    nav.appendChild(pv); nav.appendChild(nx); d.appendChild(nav);
    var pr = document.createElement("button"); pr.className = "big"; pr.textContent = EN.pr + " →"; pr.onclick = function () { startPractice(notesState.ch, false); }; d.appendChild(pr);
  });

  // ---------- Test yourself ----------
  mk("hubTY", function (d) {
    d.innerHTML = ""; d.appendChild(topBar(showHome));
    var h = document.createElement("h2"); h.textContent = EN.ty; d.appendChild(h);
    if (nat("ty")) { var n = document.createElement("p"); n.className = "note"; n.dir = dirOf(lang()); n.textContent = nat("ty"); d.appendChild(n); }
    var q = save.quicks || [], m = save.mocks || [];
    var b1 = document.createElement("button"); b1.className = "bigcard"; b1.style.background = "#e8661f";
    b1.innerHTML = EN.qt + " · 20" + (nat("qt") ? '<small dir="' + dirOf(lang()) + '">' + esc(nat("qt")) + "</small>" : "") + "<small>" + q.length + " " + t("tk") + "</small>";
    b1.onclick = views.quickSel;
    var b2 = document.createElement("button"); b2.className = "bigcard"; b2.style.background = "#e8661f";
    b2.innerHTML = EN.mt + " · 50 · 57 min" + (nat("mt") ? '<small dir="' + dirOf(lang()) + '">' + esc(nat("mt")) + "</small>" : "") + "<small>" + m.length + " " + t("tk") + "</small>";
    b2.onclick = function () { if (questions.length >= 50) startMock(); };
    var b3 = document.createElement("button"); b3.className = "item"; b3.style.marginTop = "12px"; b3.textContent = "📊 " + t("res"); b3.onclick = showMockHistory;
    d.appendChild(b1); d.appendChild(b2); d.appendChild(b3);
  });

  var quickSel = {};
  mk("quickSel", function (d) {
    d.innerHTML = ""; d.appendChild(topBar(views.hubTY));
    var h = document.createElement("h2"); h.textContent = EN.qt + " · 20"; d.appendChild(h);
    var p = document.createElement("p"); p.className = "note"; p.dir = dirOf(lang()); p.textContent = t("pick"); d.appendChild(p);
    var bar = document.createElement("div"); bar.className = "row";
    var all = document.createElement("button"); all.className = "item half"; all.textContent = t("all");
    var go = document.createElement("button"); go.className = "big half"; go.style.margin = "0"; go.textContent = t("go");
    bar.appendChild(all); bar.appendChild(go); d.appendChild(bar);
    var list = document.createElement("div"); d.appendChild(list);
    function draw() {
      list.innerHTML = "";
      chapters.forEach(function (c) {
        var qs = questions.filter(function (q) { return q.chapter === c.id; });
        if (!qs.length) return;
        var b = document.createElement("button"); b.className = "tq" + (quickSel[c.id] ? " on" : "");
        b.innerHTML = '<span class="bx">' + (quickSel[c.id] ? "✓" : "") + '</span><span><b>' + c.id + ". " + esc(c.name) + '</b><small dir="' + dirOf(lang()) + '">' + esc(nameOf(c)) + "</small></span>";
        b.onclick = function () { quickSel[c.id] = !quickSel[c.id]; draw(); };
        list.appendChild(b);
      });
    }
    draw();
    all.onclick = function () { var every = chapters.every(function (c) { return quickSel[c.id] || !questions.some(function (q) { return q.chapter === c.id; }); }); chapters.forEach(function (c) { quickSel[c.id] = !every; }); draw(); };
    go.onclick = function () {
      var ids = chapters.filter(function (c) { return quickSel[c.id]; }).map(function (c) { return c.id; });
      if (!ids.length) { p.style.color = "#d6001c"; p.style.fontWeight = "700"; return; }
      startQuick(ids);
    };
  });

  var QUICK_N = 20, QUICK_SECS = 30 * 60;
  function startQuick(ids) {
    var pool = questions.filter(function (q) { return ids.indexOf(q.chapter) >= 0; });
    var picked = shuffle(pool.slice()).slice(0, QUICK_N);
    mock = {
      quick: true,
      qs: picked.map(function (q) { return { q: q, order: shuffle(q.options.map(function (_, i) { return i; })) }; }),
      ans: picked.map(function () { return -1; }), flag: picked.map(function () { return false; }),
      i: 0, start: Date.now(), end: Date.now() + QUICK_SECS * 1000, done: false
    };
    clearInterval(mockTick);
    mockTick = setInterval(tickMock, 1000);
    show("mock");
    renderMock();
  }

  // quick tests are saved on their own (not in the 50-question mock list)
  var origFinish = window.finishMock;
  window.finishMock = function (timedOut) {
    if (!mock || mock.done || !mock.quick) return origFinish.apply(this, arguments);
    var m = mock; m.done = true; clearInterval(mockTick); stopSpeak();
    var ch = {}, det = [], score = 0;
    m.qs.forEach(function (it, k) {
      var q = it.q, pos = m.ans[k], pick = pos >= 0 ? it.order[pos] : -1, ok = pick === q.answer;
      if (ok) score++;
      if (!ch[q.chapter]) ch[q.chapter] = [0, 0];
      ch[q.chapter][1]++; if (ok) ch[q.chapter][0]++;
      det.push([q.id, pick]);
    });
    var rec = { t: Date.now(), score: score, total: m.qs.length, pass: score >= Math.ceil(m.qs.length * 43 / 50), secs: Math.min(QUICK_SECS, Math.round((Date.now() - m.start) / 1000)), timedOut: !!timedOut, ch: ch, det: det, quick: true };
    save.quicks = [rec].concat(save.quicks || []).slice(0, 40);
    store();
    window.showMockResult(rec, false);
  };
  var origRes = window.showMockResult;
  window.showMockResult = function (rec, fresh) {
    origRes.apply(this, arguments);
    if (!rec || !rec.quick) return;
    var p = document.querySelector("#mock .resultbox p");
    if (p) p.innerHTML = "Quick test · pass mark " + Math.ceil(rec.total * 43 / 50) + " / " + rec.total + " · Time used: " + fmtT(rec.secs) + (rec.timedOut ? " (time ran out)" : "") + "<br><small>" + fmtD(rec.t) + "</small>";
    var rn = document.getElementById("rNew"); if (rn) { rn.textContent = "New quick test"; rn.onclick = views.quickSel; }
    var rh = document.getElementById("rHist"); if (rh) { rh.textContent = EN.ty; rh.onclick = views.hubTY; }
  };

  // ---------- wiring ----------
  var origShow = window.show;
  window.show = function (id) { var r = origShow.apply(this, arguments); if (id === "home") renderHub(); return r; };
  var origRefresh = window.refresh;
  window.refresh = function () { var r = origRefresh.apply(this, arguments); if (views[cur]) views[cur](); return r; };
  var origRP = window.renderPractice;
  window.renderPractice = function () {
    var r = origRP.apply(this, arguments);
    var b = document.getElementById("rHome"); if (b) b.onclick = views.hubPractice;
    return r;
  };
  document.getElementById("backBtn").onclick = function () { views.hubPractice(); };
  document.getElementById("hazBtn").style.display = "none";
  if (cur === "home") renderHub();
})();
