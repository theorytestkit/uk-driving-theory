// UK Driving Theory in your language - main app
// Needs questions.js (chapters, questions) and glossary.js (words and pictures) loaded first.

const LANGS = [
  { code: "hi", label: "हिन्दी (Hindi)", ready: true },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", ready: true },
  { code: "ur", label: "اردو (Urdu)", ready: true },
  { code: "bn", label: "বাংলা (Bengali)", ready: true },
  { code: "te", label: "తెలుగు (Telugu)", ready: true },
  { code: "mr", label: "मराठी (Marathi)", ready: false },
  { code: "ml", label: "മലയാളം (Malayalam)", ready: false },
  { code: "ta", label: "தமிழ் (Tamil)", ready: false }
];

const TXT = {
  en: { progress: "Your progress", correctOf: "{a} / {b} correct", back: "← Back", qOf: "Question {a} / {b}", right: "Correct!", wrong: "Wrong", correctIs: "Correct answer:", next: "Next question", seeResult: "See result", done: "Practice complete!", score: "Score", correctLbl: "Correct", wrongLbl: "Wrong", backToChapters: "Back to chapters", again: "Practise again", retryWrong: "Practise my wrong answers", language: "Language", tapWords: "Tap blue dotted words to see their meaning and picture.", close: "Close", reset: "Reset progress", resetConfirm: "Really delete all your progress?", soon: "Coming soon", words: "Road words", wordsTitle: "Road words", great: "Very good!", tryMore: "Good try, keep practising!", noQ: "Coming soon" },
  hi: { progress: "आपकी प्रगति", correctOf: "{a} / {b} सही", back: "← वापस", qOf: "सवाल {a} / {b}", right: "सही जवाब!", wrong: "गलत जवाब", correctIs: "सही जवाब:", next: "अगला सवाल", seeResult: "नतीजा देखें", done: "अभ्यास पूरा!", score: "स्कोर", correctLbl: "सही", wrongLbl: "गलत", backToChapters: "अध्यायों पर वापस", again: "दोबारा अभ्यास करें", retryWrong: "मेरे गलत सवाल दोबारा करें", language: "भाषा", tapWords: "नीले बिंदीदार शब्द पर टैप करके उसका मतलब और चित्र देखें।", close: "बंद करें", reset: "प्रगति मिटाएँ", resetConfirm: "क्या पक्का सारी प्रगति मिटानी है?", soon: "जल्द आ रहा है", words: "सड़क के शब्द", wordsTitle: "सड़क के शब्द", great: "बहुत बढ़िया!", tryMore: "अच्छी कोशिश, अभ्यास करते रहो!", noQ: "जल्द आ रहा है" },
  pa: { progress: "ਤੁਹਾਡੀ ਤਰੱਕੀ", correctOf: "{a} / {b} ਸਹੀ", back: "← ਵਾਪਸ", qOf: "ਸਵਾਲ {a} / {b}", right: "ਸਹੀ ਜਵਾਬ!", wrong: "ਗ਼ਲਤ ਜਵਾਬ", correctIs: "ਸਹੀ ਜਵਾਬ:", next: "ਅਗਲਾ ਸਵਾਲ", seeResult: "ਨਤੀਜਾ ਵੇਖੋ", done: "ਅਭਿਆਸ ਪੂਰਾ!", score: "ਸਕੋਰ", correctLbl: "ਸਹੀ", wrongLbl: "ਗ਼ਲਤ", backToChapters: "ਅਧਿਆਵਾਂ ਤੇ ਵਾਪਸ", again: "ਦੁਬਾਰਾ ਅਭਿਆਸ ਕਰੋ", retryWrong: "ਮੇਰੇ ਗ਼ਲਤ ਸਵਾਲ ਦੁਬਾਰਾ ਕਰੋ", language: "ਭਾਸ਼ਾ", tapWords: "ਨੀਲੇ ਬਿੰਦੀਦਾਰ ਸ਼ਬਦ ਉੱਤੇ ਟੈਪ ਕਰਕੇ ਉਸਦਾ ਮਤਲਬ ਅਤੇ ਤਸਵੀਰ ਵੇਖੋ।", close: "ਬੰਦ ਕਰੋ", reset: "ਤਰੱਕੀ ਮਿਟਾਓ", resetConfirm: "ਕੀ ਪੱਕਾ ਸਾਰੀ ਤਰੱਕੀ ਮਿਟਾਉਣੀ ਹੈ?", soon: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ", words: "ਸੜਕ ਦੇ ਸ਼ਬਦ", wordsTitle: "ਸੜਕ ਦੇ ਸ਼ਬਦ", great: "ਬਹੁਤ ਵਧੀਆ!", tryMore: "ਚੰਗੀ ਕੋਸ਼ਿਸ਼, ਅਭਿਆਸ ਕਰਦੇ ਰਹੋ!", noQ: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ" },
  ur: { progress: "آپ کی پیش رفت", correctOf: "{a} / {b} درست", back: "← واپس", qOf: "سوال {a} / {b}", right: "درست جواب!", wrong: "غلط جواب", correctIs: "درست جواب:", next: "اگلا سوال", seeResult: "نتیجہ دیکھیں", done: "مشق مکمل!", score: "اسکور", correctLbl: "درست", wrongLbl: "غلط", backToChapters: "ابواب پر واپس", again: "دوبارہ مشق کریں", retryWrong: "میرے غلط سوال دوبارہ کریں", language: "زبان", tapWords: "نیلے نقطہ دار لفظ پر ٹیپ کر کے اس کا مطلب اور تصویر دیکھیں۔", close: "بند کریں", reset: "پیش رفت مٹائیں", resetConfirm: "کیا آپ واقعی ساری پیش رفت مٹانا چاہتے ہیں؟", soon: "جلد آ رہا ہے", words: "سڑک کے الفاظ", wordsTitle: "سڑک کے الفاظ", great: "بہت خوب!", tryMore: "اچھی کوشش، مشق جاری رکھیں!", noQ: "جلد آ رہا ہے" },
  bn: { progress: "আপনার অগ্রগতি", correctOf: "{a} / {b} সঠিক", back: "← ফিরে যান", qOf: "প্রশ্ন {a} / {b}", right: "সঠিক উত্তর!", wrong: "ভুল উত্তর", correctIs: "সঠিক উত্তর:", next: "পরের প্রশ্ন", seeResult: "ফলাফল দেখুন", done: "অনুশীলন শেষ!", score: "স্কোর", correctLbl: "সঠিক", wrongLbl: "ভুল", backToChapters: "অধ্যায়ে ফিরে যান", again: "আবার অনুশীলন করুন", retryWrong: "আমার ভুল প্রশ্নগুলো আবার করুন", language: "ভাষা", tapWords: "নীল ডটেড শব্দে ট্যাপ করে তার মানে ও ছবি দেখুন।", close: "বন্ধ করুন", reset: "অগ্রগতি মুছুন", resetConfirm: "আপনি কি নিশ্চিত সব অগ্রগতি মুছে ফেলতে চান?", soon: "শীঘ্রই আসছে", words: "সড়কের শব্দ", wordsTitle: "সড়কের শব্দ", great: "খুব ভালো!", tryMore: "ভালো চেষ্টা, অনুশীলন চালিয়ে যান!", noQ: "শীঘ্রই আসছে" },
  te: { progress: "మీ పురోగతి", correctOf: "{a} / {b} సరైనవి", back: "← వెనుకకు", qOf: "ప్రశ్న {a} / {b}", right: "సరైన సమాధానం!", wrong: "తప్పు సమాధానం", correctIs: "సరైన సమాధానం:", next: "తదుపరి ప్రశ్న", seeResult: "ఫలితం చూడండి", done: "సాధన పూర్తయింది!", score: "స్కోరు", correctLbl: "సరైనవి", wrongLbl: "తప్పులు", backToChapters: "అధ్యాయాలకు తిరిగి", again: "మళ్ళీ సాధన చేయండి", retryWrong: "నా తప్పు ప్రశ్నలు మళ్ళీ చేయండి", language: "భాష", tapWords: "నీలి చుక్కల పదాన్ని నొక్కి దాని అర్థం, చిత్రం చూడండి.", close: "మూసివేయండి", reset: "పురోగతి తొలగించండి", resetConfirm: "మీరు నిజంగా మొత్తం పురోగతిని తొలగించాలా?", soon: "త్వరలో వస్తుంది", words: "రహదారి పదాలు", wordsTitle: "రహదారి పదాలు", great: "చాలా బాగుంది!", tryMore: "మంచి ప్రయత్నం, సాధన కొనసాగించండి!", noQ: "త్వరలో వస్తుంది" }
};

const MEAN = { hi: "अर्थ", pa: "ਮਤਲਬ", ur: "مطلب", bn: "অর্থ", te: "అర్థం" };
// ---------- saved progress (kept on this phone / computer) ----------
let save = { lang: null, correct: {}, wrong: {}, meaning: true };
try {
  const old = JSON.parse(localStorage.getItem("save") || "null");
  if (old) { save.lang = old.lang || null; save.correct = old.correct || {}; save.wrong = old.wrong || {}; if (old.meaning === false) save.meaning = false; }
} catch (e) {}
if (save.lang && !LANGS.some(l => l.code === save.lang && l.ready)) save.lang = null;
function store() { try { localStorage.setItem("save", JSON.stringify(save)); } catch (e) {} }

const $ = (id) => document.getElementById(id);
const lang = () => save.lang || "hi";
const tx = (k, a, b) => {
  let s = (TXT[lang()] && TXT[lang()][k]) || TXT.en[k] || k;
  return s.replace("{a}", a).replace("{b}", b);
};
const dirOf = (l) => (l === "ur" ? "rtl" : "ltr");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nameOf = (c) => (c.names && c.names[lang()]) || c.name;

// turn known road words into tappable blue dotted words
function linkify(text) {
  return esc(text).replace(KW_RE, (m) => {
    const id = kwId(m);
    return id ? '<span class="kw" data-k="' + id + '">' + m + "</span>" : m;
  });
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- screens ----------
let cur = "welcome", prevScreen = "home";
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  $(id).classList.remove("hidden");
  cur = id;
  window.scrollTo(0, 0);
}
function refresh() {
  document.documentElement.lang = lang();
  document.querySelectorAll(".langBtn").forEach(b => {
    const l = LANGS.find(x => x.code === lang());
    b.textContent = "🌐 " + (l ? l.label.split(" (")[0] : "");
  });
  if (cur === "home") showHome();
  else if (cur === "practice") renderPractice();
  else if (cur === "words") showWords();
  if (!$("popup").classList.contains("hidden") && popId) openWord(popId);
}

// ---------- language list (can be opened any time) ----------
function showLanguages() {
  if (cur !== "langs") prevScreen = cur;
  const box = $("langList");
  box.innerHTML = "";
  LANGS.forEach(l => {
    const b = document.createElement("button");
    b.className = "item" + (l.ready ? "" : " soon");
    b.textContent = l.label + (l.ready ? (save.lang === l.code ? "  ✓" : "") : " - Coming soon");
    if (l.ready) b.onclick = () => {
      save.lang = l.code; store();
      const goto = prevScreen === "welcome" || prevScreen === "langs" ? "home" : prevScreen;
      cur = goto; show(goto); refresh();
    };
    box.appendChild(b);
  });
  $("langBack").classList.toggle("hidden", !save.lang);
  show("langs");
}
$("langBack").onclick = () => { show(prevScreen === "welcome" ? "home" : prevScreen); refresh(); };
$("startBtn").onclick = () => { prevScreen = "welcome"; showLanguages(); };
document.querySelectorAll(".langBtn").forEach(b => { b.onclick = showLanguages; });

// ---------- home ----------
function showHome() {
  const total = questions.length;
  const done = questions.filter(q => save.correct[q.id]).length;
  $("progressTitle").textContent = tx("progress");
  $("progressText").textContent = tx("correctOf", done, total);
  $("progressFill").style.width = (total ? (done / total) * 100 : 0) + "%";
  const list = $("chapterList");
  list.innerHTML = "";
  chapters.forEach(c => {
    const qs = questions.filter(q => q.chapter === c.id);
    const d = qs.filter(q => save.correct[q.id]).length;
    const b = document.createElement("button");
    b.className = "item" + (qs.length ? "" : " soon");
    b.innerHTML = "<b>" + c.id + ". " + esc(c.name) + '</b><small dir="' + dirOf(lang()) + '">' + esc(nameOf(c)) + " · " + (qs.length ? d + " / " + qs.length : tx("soon")) + '</small><div class="bar"><div style="background:var(--green);height:100%;width:' + (qs.length ? (d / qs.length) * 100 : 0) + '%"></div></div>';
    if (qs.length) b.onclick = () => startPractice(c.id, false);
    list.appendChild(b);
  });
  $("wordsBtn").textContent = "📖 " + tx("words");
  $("resetBtn").textContent = tx("reset");
  show("home");
}
$("resetBtn").onclick = () => {
  if (confirm(tx("resetConfirm"))) { save.correct = {}; save.wrong = {}; store(); showHome(); }
};
$("wordsBtn").onclick = showWords;

// ---------- practice ----------
let chapterId = 0, set = [], index = 0, score = 0, wrongNow = [];
let answered = false, chosen = -1, order = [], correctPos = 0, finished = false;

function startPractice(id, onlyWrong) {
  chapterId = id;
  const qs = questions.filter(q => q.chapter === id);
  if (onlyWrong) set = shuffle(wrongNow.slice());
  else set = shuffle(qs.filter(q => !save.correct[q.id])).concat(shuffle(qs.filter(q => save.correct[q.id])));
  index = 0; score = 0; wrongNow = []; finished = false;
  newQuestion();
  show("practice");
  renderPractice();
}
function newQuestion() {
  const q = set[index];
  answered = false; chosen = -1;
  order = shuffle(q.options.map((_, i) => i)); // options are mixed up every time
  correctPos = order.indexOf(q.answer);
}
function renderPractice() {
  const ch = chapters.find(c => c.id === chapterId);
  $("backBtn").textContent = tx("back");
  $("chapName").textContent = ch ? ch.id + ". " + ch.name + " · " + nameOf(ch) : "";
  $("chapName").dir = "auto";
  $("tapHint").textContent = tx("tapWords");
  $("tapHint").dir = dirOf(lang());
  if (finished) { renderResult(); return; }
  $("result").classList.add("hidden");
  const q = set[index];
  $("count").textContent = tx("qOf", index + 1, set.length);
  $("qFill").style.width = ((index + (answered ? 1 : 0)) / set.length) * 100 + "%";
  const sb = $("signBox");
  if (q.sign) { sb.innerHTML = signSvg(q.sign); sb.classList.remove("hidden"); } else { sb.innerHTML = ""; sb.classList.add("hidden"); }
  const trn = q.tr && q.tr[lang()];
  const mb = $("meaningBtn");
  if (trn) { mb.classList.remove("hidden"); mb.textContent = "🌐 " + MEAN[lang()] + (save.meaning ? " ✓" : ""); } else mb.classList.add("hidden");
  const showM = !!(trn && save.meaning);
  const mq = $("questionMeaning");
  if (showM) { mq.textContent = trn.q; mq.dir = dirOf(lang()); mq.lang = lang(); mq.classList.remove("hidden"); } else { mq.textContent = ""; mq.classList.add("hidden"); }
  $("questionText").innerHTML = linkify(q.q);
  $("tapHint").classList.remove("hidden");
  const box = $("answers");
  box.innerHTML = "";
  box.classList.remove("hidden");
  order.forEach((optIndex, pos) => {
    const d = document.createElement("div");
    d.className = "answer";
    d.setAttribute("role", "button");
    d.tabIndex = 0;
    let mark = "";
    if (answered) {
      d.classList.add("locked");
      if (pos === correctPos) { d.classList.add("right"); mark = " ✓"; }
      else if (pos === chosen) { d.classList.add("wrong"); mark = " ✗"; }
    }
    d.innerHTML = '<span class="letter">' + "ABCD"[pos] + ".</span><span>" + linkify(q.options[optIndex]) + mark +
      (showM ? '<span class="omean" dir="' + dirOf(lang()) + '" lang="' + lang() + '">' + esc(trn.o[optIndex]) + "</span>" : "") + "</span>";
    d.onclick = () => choose(pos);
    d.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(pos); } };
    box.appendChild(d);
  });
  const ex = $("explain"), next = $("nextBtn");
  if (answered) {
    const ok = chosen === correctPos;
    const l = lang();
    ex.innerHTML = '<div class="verdict ' + (ok ? "good" : "bad") + '" dir="' + dirOf(l) + '">' + (ok ? "✓ " + tx("right") : "✗ " + tx("wrong")) + "</div>" +
      '<div dir="' + dirOf(l) + '"><b>' + tx("correctIs") + "</b></div><div>" + "ABCD"[correctPos] + ". " + linkify(q.options[q.answer]) + "</div><hr>" +
      '<div dir="' + dirOf(l) + '" lang="' + l + '">' + linkify(q.exp[l] || "") + "</div>";
    ex.classList.remove("hidden");
    next.textContent = index === set.length - 1 ? tx("seeResult") : tx("next");
    next.classList.remove("hidden");
  } else { ex.classList.add("hidden"); next.classList.add("hidden"); }
}
$("meaningBtn").onclick = () => { save.meaning = !save.meaning; store(); renderPractice(); };
function choose(pos) {
  if (answered) return;
  const q = set[index];
  answered = true; chosen = pos;
  if (pos === correctPos) { score++; save.correct[q.id] = true; delete save.wrong[q.id]; }
  else { save.wrong[q.id] = true; wrongNow.push(q); }
  store();
  renderPractice();
  $("explain").scrollIntoView({ behavior: "smooth", block: "nearest" });
}
$("nextBtn").onclick = () => {
  index++;
  if (index < set.length) { newQuestion(); renderPractice(); window.scrollTo(0, 0); }
  else { finished = true; renderPractice(); }
};
function renderResult() {
  const n = set.length, pct = n ? Math.round((score / n) * 100) : 0;
  ["count", "signBox", "questionText", "tapHint", "answers", "explain", "nextBtn"].forEach(i => $(i).classList.add("hidden"));
  $("qFill").style.width = "100%";
  const r = $("result");
  r.classList.remove("hidden");
  r.innerHTML = '<div class="resultbox"><h3>' + esc(tx("done")) + '</h3><div class="score">' + score + " / " + n + "</div><p>" + esc(pct >= 86 ? tx("great") : tx("tryMore")) + '</p><div class="stats"><div><b>' + score + "</b><br>" + esc(tx("correctLbl")) + "</div><div><b>" + (n - score) + "</b><br>" + esc(tx("wrongLbl")) + "</div><div><b>" + pct + "%</b><br>" + esc(tx("score")) + "</div></div>" +
    (wrongNow.length ? '<button class="big" id="rWrong">' + esc(tx("retryWrong")) + "</button>" : "") +
    '<button class="big" id="rAgain">' + esc(tx("again")) + '</button><button class="big" id="rHome" style="background:var(--blue)">' + esc(tx("backToChapters")) + "</button></div>";
  if ($("rWrong")) $("rWrong").onclick = () => startPractice(chapterId, true);
  $("rAgain").onclick = () => startPractice(chapterId, false);
  $("rHome").onclick = showHome;
}
$("backBtn").onclick = showHome;

// ---------- road words (keywords) ----------
let popId = null;
function openWord(id) {
  const w = WORD_BY_ID[id];
  if (!w) return;
  popId = id;
  const l = lang();
  $("popPic").innerHTML = diagramSvg(w.d);
  $("popTerm").textContent = w.en;
  $("popName").textContent = w.n[l] || "";
  $("popName").dir = dirOf(l);
  $("popMeaning").textContent = w.x[l] || "";
  $("popMeaning").dir = dirOf(l);
  $("popMeaning").lang = l;
  $("popClose").textContent = tx("close");
  $("popup").classList.remove("hidden");
}
function closeWord() { popId = null; $("popup").classList.add("hidden"); }
$("popClose").onclick = closeWord;
$("popup").addEventListener("click", (e) => { if (e.target === $("popup")) closeWord(); });
// tapping a blue dotted word anywhere opens its meaning (and never answers the question by mistake)
document.addEventListener("click", (e) => {
  const k = e.target.closest && e.target.closest(".kw");
  if (!k) return;
  e.preventDefault(); e.stopPropagation();
  openWord(k.dataset.k);
}, true);

function showWords() {
  $("wordsBack").textContent = tx("back");
  $("wordsTitle").textContent = tx("wordsTitle");
  renderWordList();
  show("words");
}
function renderWordList() {
  const q = $("wordSearch").value.trim().toLowerCase();
  const l = lang();
  const box = $("wordList");
  box.innerHTML = "";
  WORDS.slice().sort((a, b) => a.en.localeCompare(b.en)).forEach(w => {
    const nm = w.n[l] || "";
    if (q && w.en.toLowerCase().indexOf(q) < 0 && nm.toLowerCase().indexOf(q) < 0) return;
    const b = document.createElement("button");
    b.className = "item";
    b.innerHTML = "<b>" + esc(w.en) + '</b><small dir="' + dirOf(l) + '">' + esc(nm) + "</small>";
    b.onclick = () => openWord(w.id);
    box.appendChild(b);
  });
}
$("wordSearch").oninput = renderWordList;
$("wordsBack").onclick = showHome;

// ---------- start ----------
if (save.lang) { refresh(); showHome(); } else { show("welcome"); }
