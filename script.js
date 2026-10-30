// UK Driving Theory in your language - main app
// Needs questions.js (chapters, questions) and glossary.js (words and pictures) loaded first.

const LANGS = [
  { code: "hi", label: "हिन्दी (Hindi)", ready: true },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", ready: true },
  { code: "ur", label: "اردو (Urdu)", ready: true },
  { code: "bn", label: "বাংলা (Bengali)", ready: true },
  { code: "te", label: "తెలుగు (Telugu)", ready: true },
  { code: "mr", label: "मराठी (Marathi)", ready: true },
  { code: "ml", label: "മലയാളം (Malayalam)", ready: true },
  { code: "ta", label: "தமிழ் (Tamil)", ready: true },
  { code: "gu", label: "ગુજરાતી (Gujarati)", ready: true },
  { code: "ne", label: "नेपाली (Nepali)", ready: true }
];

const TXT = {
  en: { progress: "Your progress", correctOf: "{a} / {b} correct", back: "← Back", qOf: "Question {a} / {b}", right: "Correct!", wrong: "Wrong", correctIs: "Correct answer:", next: "Next question", seeResult: "See result", done: "Practice complete!", score: "Score", correctLbl: "Correct", wrongLbl: "Wrong", backToChapters: "Back to chapters", again: "Practise again", retryWrong: "Practise my wrong answers", language: "Language", tapWords: "Tap blue dotted words to see their meaning and picture.", close: "Close", reset: "Reset progress", resetConfirm: "Really delete all your progress?", soon: "Coming soon", words: "Road words", wordsTitle: "Road words", great: "Very good!", tryMore: "Good try, keep practising!", noQ: "Coming soon" },
  hi: { progress: "आपकी प्रगति", correctOf: "{a} / {b} सही", back: "← वापस", qOf: "सवाल {a} / {b}", right: "सही जवाब!", wrong: "गलत जवाब", correctIs: "सही जवाब:", next: "अगला सवाल", seeResult: "नतीजा देखें", done: "अभ्यास पूरा!", score: "स्कोर", correctLbl: "सही", wrongLbl: "गलत", backToChapters: "अध्यायों पर वापस", again: "दोबारा अभ्यास करें", retryWrong: "मेरे गलत सवाल दोबारा करें", language: "भाषा", tapWords: "नीले बिंदीदार शब्द पर टैप करके उसका मतलब और चित्र देखें।", close: "बंद करें", reset: "प्रगति मिटाएँ", resetConfirm: "क्या पक्का सारी प्रगति मिटानी है?", soon: "जल्द आ रहा है", words: "सड़क के शब्द", wordsTitle: "सड़क के शब्द", great: "बहुत बढ़िया!", tryMore: "अच्छी कोशिश, अभ्यास करते रहो!", noQ: "जल्द आ रहा है" },
  pa: { progress: "ਤੁਹਾਡੀ ਤਰੱਕੀ", correctOf: "{a} / {b} ਸਹੀ", back: "← ਵਾਪਸ", qOf: "ਸਵਾਲ {a} / {b}", right: "ਸਹੀ ਜਵਾਬ!", wrong: "ਗ਼ਲਤ ਜਵਾਬ", correctIs: "ਸਹੀ ਜਵਾਬ:", next: "ਅਗਲਾ ਸਵਾਲ", seeResult: "ਨਤੀਜਾ ਵੇਖੋ", done: "ਅਭਿਆਸ ਪੂਰਾ!", score: "ਸਕੋਰ", correctLbl: "ਸਹੀ", wrongLbl: "ਗ਼ਲਤ", backToChapters: "ਅਧਿਆਵਾਂ ਤੇ ਵਾਪਸ", again: "ਦੁਬਾਰਾ ਅਭਿਆਸ ਕਰੋ", retryWrong: "ਮੇਰੇ ਗ਼ਲਤ ਸਵਾਲ ਦੁਬਾਰਾ ਕਰੋ", language: "ਭਾਸ਼ਾ", tapWords: "ਨੀਲੇ ਬਿੰਦੀਦਾਰ ਸ਼ਬਦ ਉੱਤੇ ਟੈਪ ਕਰਕੇ ਉਸਦਾ ਮਤਲਬ ਅਤੇ ਤਸਵੀਰ ਵੇਖੋ।", close: "ਬੰਦ ਕਰੋ", reset: "ਤਰੱਕੀ ਮਿਟਾਓ", resetConfirm: "ਕੀ ਪੱਕਾ ਸਾਰੀ ਤਰੱਕੀ ਮਿਟਾਉਣੀ ਹੈ?", soon: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ", words: "ਸੜਕ ਦੇ ਸ਼ਬਦ", wordsTitle: "ਸੜਕ ਦੇ ਸ਼ਬਦ", great: "ਬਹੁਤ ਵਧੀਆ!", tryMore: "ਚੰਗੀ ਕੋਸ਼ਿਸ਼, ਅਭਿਆਸ ਕਰਦੇ ਰਹੋ!", noQ: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ" },
  ur: { progress: "آپ کی پیش رفت", correctOf: "{a} / {b} درست", back: "← واپس", qOf: "سوال {a} / {b}", right: "درست جواب!", wrong: "غلط جواب", correctIs: "درست جواب:", next: "اگلا سوال", seeResult: "نتیجہ دیکھیں", done: "مشق مکمل!", score: "اسکور", correctLbl: "درست", wrongLbl: "غلط", backToChapters: "ابواب پر واپس", again: "دوبارہ مشق کریں", retryWrong: "میرے غلط سوال دوبارہ کریں", language: "زبان", tapWords: "نیلے نقطہ دار لفظ پر ٹیپ کر کے اس کا مطلب اور تصویر دیکھیں۔", close: "بند کریں", reset: "پیش رفت مٹائیں", resetConfirm: "کیا آپ واقعی ساری پیش رفت مٹانا چاہتے ہیں؟", soon: "جلد آ رہا ہے", words: "سڑک کے الفاظ", wordsTitle: "سڑک کے الفاظ", great: "بہت خوب!", tryMore: "اچھی کوشش، مشق جاری رکھیں!", noQ: "جلد آ رہا ہے" },
  bn: { progress: "আপনার অগ্রগতি", correctOf: "{a} / {b} সঠিক", back: "← ফিরে যান", qOf: "প্রশ্ন {a} / {b}", right: "সঠিক উত্তর!", wrong: "ভুল উত্তর", correctIs: "সঠিক উত্তর:", next: "পরের প্রশ্ন", seeResult: "ফলাফল দেখুন", done: "অনুশীলন শেষ!", score: "স্কোর", correctLbl: "সঠিক", wrongLbl: "ভুল", backToChapters: "অধ্যায়ে ফিরে যান", again: "আবার অনুশীলন করুন", retryWrong: "আমার ভুল প্রশ্নগুলো আবার করুন", language: "ভাষা", tapWords: "নীল ডটেড শব্দে ট্যাপ করে তার মানে ও ছবি দেখুন।", close: "বন্ধ করুন", reset: "অগ্রগতি মুছুন", resetConfirm: "আপনি কি নিশ্চিত সব অগ্রগতি মুছে ফেলতে চান?", soon: "শীঘ্রই আসছে", words: "সড়কের শব্দ", wordsTitle: "সড়কের শব্দ", great: "খুব ভালো!", tryMore: "ভালো চেষ্টা, অনুশীলন চালিয়ে যান!", noQ: "শীঘ্রই আসছে" },
  te: { progress: "మీ పురోగతి", correctOf: "{a} / {b} సరైనవి", back: "← వెనుకకు", qOf: "ప్రశ్న {a} / {b}", right: "సరైన సమాధానం!", wrong: "తప్పు సమాధానం", correctIs: "సరైన సమాధానం:", next: "తదుపరి ప్రశ్న", seeResult: "ఫలితం చూడండి", done: "సాధన పూర్తయింది!", score: "స్కోరు", correctLbl: "సరైనవి", wrongLbl: "తప్పులు", backToChapters: "అధ్యాయాలకు తిరిగి", again: "మళ్ళీ సాధన చేయండి", retryWrong: "నా తప్పు ప్రశ్నలు మళ్ళీ చేయండి", language: "భాష", tapWords: "నీలి చుక్కల పదాన్ని నొక్కి దాని అర్థం, చిత్రం చూడండి.", close: "మూసివేయండి", reset: "పురోగతి తొలగించండి", resetConfirm: "మీరు నిజంగా మొత్తం పురోగతిని తొలగించాలా?", soon: "త్వరలో వస్తుంది", words: "రహదారి పదాలు", wordsTitle: "రహదారి పదాలు", great: "చాలా బాగుంది!", tryMore: "మంచి ప్రయత్నం, సాధన కొనసాగించండి!", noQ: "త్వరలో వస్తుంది" },
  mr: { progress: "तुमची प्रगती", correctOf: "{a} / {b} बरोबर", back: "← मागे", qOf: "प्रश्न {a} / {b}", right: "बरोबर उत्तर!", wrong: "चुकीचे उत्तर", correctIs: "बरोबर उत्तर:", next: "पुढचा प्रश्न", seeResult: "निकाल पाहा", done: "सराव पूर्ण!", score: "गुण", correctLbl: "बरोबर", wrongLbl: "चूक", backToChapters: "प्रकरणांकडे परत", again: "पुन्हा सराव करा", retryWrong: "माझे चुकलेले प्रश्न पुन्हा सोडवा", language: "भाषा", tapWords: "निळ्या ठिपक्यांच्या शब्दावर टॅप करून त्याचा अर्थ आणि चित्र पाहा.", close: "बंद करा", reset: "प्रगती पुसा", resetConfirm: "खरंच सगळी प्रगती पुसायची आहे का?", soon: "लवकरच येत आहे", words: "रस्त्याचे शब्द", wordsTitle: "रस्त्याचे शब्द", great: "खूप छान!", tryMore: "चांगला प्रयत्न, सराव करत राहा!", noQ: "लवकरच येत आहे" },
  ml: { progress: "നിങ്ങളുടെ പുരോഗതി", correctOf: "{a} / {b} ശരി", back: "← പിന്നോട്ട്", qOf: "ചോദ്യം {a} / {b}", right: "ശരിയായ ഉത്തരം!", wrong: "തെറ്റായ ഉത്തരം", correctIs: "ശരിയായ ഉത്തരം:", next: "അടുത്ത ചോദ്യം", seeResult: "ഫലം കാണുക", done: "പരിശീലനം പൂർത്തിയായി!", score: "സ്കോർ", correctLbl: "ശരി", wrongLbl: "തെറ്റ്", backToChapters: "അധ്യായങ്ങളിലേക്ക് മടങ്ങുക", again: "വീണ്ടും പരിശീലിക്കുക", retryWrong: "ഞാൻ തെറ്റിച്ച ചോദ്യങ്ങൾ വീണ്ടും ചെയ്യുക", language: "ഭാഷ", tapWords: "നീല ഡോട്ടുള്ള വാക്കിൽ ടാപ്പ് ചെയ്ത് അർത്ഥവും ചിത്രവും കാണുക.", close: "അടയ്ക്കുക", reset: "പുരോഗതി മായ്ക്കുക", resetConfirm: "എല്ലാ പുരോഗതിയും ശരിക്കും മായ്ക്കണോ?", soon: "ഉടൻ വരുന്നു", words: "റോഡ് വാക്കുകൾ", wordsTitle: "റോഡ് വാക്കുകൾ", great: "വളരെ നന്നായി!", tryMore: "നല്ല ശ്രമം, പരിശീലനം തുടരുക!", noQ: "ഉടൻ വരുന്നു" },
  ta: { progress: "உங்கள் முன்னேற்றம்", correctOf: "{a} / {b} சரி", back: "← பின்செல்", qOf: "கேள்வி {a} / {b}", right: "சரியான பதில்!", wrong: "தவறான பதில்", correctIs: "சரியான பதில்:", next: "அடுத்த கேள்வி", seeResult: "முடிவைப் பார்", done: "பயிற்சி முடிந்தது!", score: "மதிப்பெண்", correctLbl: "சரி", wrongLbl: "தவறு", backToChapters: "அத்தியாயங்களுக்குத் திரும்பு", again: "மீண்டும் பயிற்சி செய்", retryWrong: "நான் தவறவிட்ட கேள்விகளை மீண்டும் செய்", language: "மொழி", tapWords: "நீல புள்ளியுள்ள வார்த்தையைத் தொட்டு அர்த்தத்தையும் படத்தையும் பாருங்கள்.", close: "மூடு", reset: "முன்னேற்றத்தை அழி", resetConfirm: "எல்லா முன்னேற்றத்தையும் உண்மையில் அழிக்கவா?", soon: "விரைவில் வரும்", words: "சாலை வார்த்தைகள்", wordsTitle: "சாலை வார்த்தைகள்", great: "மிகவும் நன்று!", tryMore: "நல்ல முயற்சி, தொடர்ந்து பயிற்சி செய்யுங்கள்!", noQ: "விரைவில் வரும்" },
  gu: { progress: "તમારી પ્રગતિ", correctOf: "{a} / {b} સાચા", back: "← પાછા", qOf: "પ્રશ્ન {a} / {b}", right: "સાચો જવાબ!", wrong: "ખોટો જવાબ", correctIs: "સાચો જવાબ:", next: "આગળનો પ્રશ્ન", seeResult: "પરિણામ જુઓ", done: "પ્રેક્ટિસ પૂરી!", score: "સ્કોર", correctLbl: "સાચા", wrongLbl: "ખોટા", backToChapters: "chapters પર પાછા", again: "ફરી પ્રેક્ટિસ કરો", retryWrong: "જે ચૂક્યા તે ફરી કરો", language: "ભાષા", tapWords: "વાદળી ટપકાંવાળા શબ્દ પર ટેપ કરો, અર્થ અને ચિત્ર જુઓ.", close: "બંધ કરો", reset: "પ્રગતિ ભૂંસો", resetConfirm: "ખરેખર બધી પ્રગતિ ભૂંસવી છે?", soon: "જલ્દી આવશે", words: "રોડ શબ્દો", wordsTitle: "રોડ શબ્દો", great: "ખૂબ સરસ!", tryMore: "સારો પ્રયાસ, પ્રેક્ટિસ ચાલુ રાખો!", noQ: "જલ્દી આવશે" },
  ne: { progress: "तपाईंको प्रगति", correctOf: "{a} / {b} सही", back: "← पछाडि", qOf: "प्रश्न {a} / {b}", right: "सही उत्तर!", wrong: "गलत उत्तर", correctIs: "सही उत्तर:", next: "अर्को प्रश्न", seeResult: "नतिजा हेर्नुहोस्", done: "अभ्यास सकियो!", score: "स्कोर", correctLbl: "सही", wrongLbl: "गलत", backToChapters: "chapters मा फर्कनुहोस्", again: "फेरि अभ्यास गर्नुहोस्", retryWrong: "गल्ती भएका फेरि गर्नुहोस्", language: "भाषा", tapWords: "निलो थोप्ला भएको शब्दमा ट्याप गर्नुहोस्, अर्थ र चित्र हेर्नुहोस्।", close: "बन्द गर्नुहोस्", reset: "प्रगति मेटाउनुहोस्", resetConfirm: "साँच्चै सबै प्रगति मेटाउने?", soon: "छिट्टै आउँछ", words: "सडक शब्द", wordsTitle: "सडक शब्द", great: "धेरै राम्रो!", tryMore: "राम्रो प्रयास, अभ्यास जारी राख्नुहोस्!", noQ: "छिट्टै आउँछ" }
};

const MEAN = { hi: "अर्थ", pa: "ਮਤਲਬ", ur: "مطلب", bn: "অর্থ", te: "అర్థం", mr: "अर्थ", ml: "അർത്ഥം", ta: "பொருள்", gu: "અર્થ", ne: "अर्थ" };
// ---------- saved progress (kept on this phone / computer) ----------
let save = { lang: null, correct: {}, wrong: {}, meaning: true, mocks: [] };
try {
  const old = JSON.parse(localStorage.getItem("save") || "null");
  if (old) { save.mocks = Array.isArray(old.mocks) ? old.mocks : []; save.lang = old.lang || null; save.correct = old.correct || {}; save.wrong = old.wrong || {}; if (old.meaning === false) save.meaning = false; }
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
  stopSpeak();
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  $(id).classList.remove("hidden");
  cur = id;
  window.scrollTo(0, 0);
}
function refresh() {
  document.documentElement.lang = lang();
  document.querySelectorAll(".langBtn").forEach(b => {
    const l = LANGS.find(x => x.code === lang());
    b.textContent = "🌐 " + (CHOOSE[lang()] || (l ? l.label.split(" (")[0] : ""));
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

// ---------- read aloud (browser voices) ----------
// English words inside a native-language text are spoken with an English voice,
// the native parts with the language's own voice.
const synth = window.speechSynthesis || null;
let speakingBtn = null, speakRun = 0;
// ---------- ready-made audio clips (optional) ----------
// Clips live in the folder AUDIO_BASE (for example "audio/en/q12.mp3").
// If a clip is missing, the browser voice is used instead, so nothing breaks.
// If you store the audio somewhere else, change only this one line.
const AUDIO_BASE = "https://pub-56c658e461114a5fa2988083f0f8f754.r2.dev/";
const AUDIO_LANGS = ["en", "hi", "pa", "ur", "bn", "te", "mr", "ml", "ta", "gu"];
const player = new Audio();
player.preload = "auto";
function playClips(clips, btn, run, fallback) {
  let k = 0, started = false;
  const finish = () => { if (run === speakRun) { btn.classList.remove("on"); speakingBtn = null; } };
  player.onplaying = () => { started = true; };
  const next = () => {
    if (run !== speakRun) return;
    if (k >= clips.length) { finish(); return; }
    player.onended = next;
    player.onerror = () => { if (run !== speakRun) return; if (!started) { player.onerror = null; fallback(); } else next(); };
    player.src = AUDIO_BASE + clips[k++] + ".mp3";
    const pr = player.play();
    if (pr && pr.catch) pr.catch(() => { if (run !== speakRun) return; if (!started) { player.onerror = null; fallback(); } else next(); });
  };
  next();
}
const LISTEN = { hi: "अपनी भाषा में सुनें", pa: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸੁਣੋ", ur: "اپنی زبان میں سنیں", bn: "নিজের ভাষায় শুনুন", te: "మీ భాషలో వినండి", mr: "तुमच्या भाषेत ऐका", ml: "നിങ്ങളുടെ ഭാഷയിൽ കേൾക്കുക", ta: "உங்கள் மொழியில் கேளுங்கள்", gu: "તમારી ભાષામાં સાંભળો", ne: "आफ्नो भाषामा सुन्नुहोस्" };
const CHOOSE = { hi: "अपनी भाषा चुनें", pa: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ", ur: "اپنی زبان چنیں", bn: "আপনার ভাষা বেছে নিন", te: "మీ భాషను ఎంచుకోండి", mr: "तुमची भाषा निवडा", ml: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക", ta: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்", gu: "તમારી ભાષા પસંદ કરો", ne: "आफ्नो भाषा रोज्नुहोस्" };
const LNAME = { hi: "Hindi", pa: "Punjabi", ur: "Urdu", bn: "Bengali", te: "Telugu", mr: "Marathi", ml: "Malayalam", ta: "Tamil", gu: "Gujarati", ne: "Nepali" };
const VOICE_PREF = {
  en: ["en-GB", "en-US", "en-IN", "en-AU", "en"],
  hi: ["hi-IN"], pa: ["pa-IN", "hi-IN"], ur: ["ur-PK", "ur-IN", "hi-IN"], bn: ["bn-IN", "bn-BD"],
  te: ["te-IN"], mr: ["mr-IN", "hi-IN"], ml: ["ml-IN"], ta: ["ta-IN", "ta-LK"], gu: ["gu-IN", "hi-IN"], ne: ["ne-NP", "hi-IN"]
};
const allVoices = () => { try { return synth ? (synth.getVoices() || []) : []; } catch (e) { return []; } };
const normL = (l) => (l || "").replace("_", "-").toLowerCase();
const FEM_RE = /female|woman|zira|hazel|susan|samantha|victoria|karen|moira|tessa|fiona|libby|sonia|serena|aria|jenny|heera|kalpana|swara|neerja|swarnim|hemkala|sapna/i;
const MALE_RE = /\bmale\b|david|mark|george|daniel|james|ryan|guy|hemant|ravi|madhur|prabhat|rishi|ethan|thomas|oliver/i;
const bestV = (list) => {
  const good = (a) => a.find(v => /google|natural|online|neural/i.test(v.name)) || a[0];
  const fem = list.filter(v => FEM_RE.test(v.name));
  if (fem.length) return good(fem);
  const nonMale = list.filter(v => !MALE_RE.test(v.name));
  return good(nonMale.length ? nonMale : list);
};
function pickVoice(code) {
  const vs = allVoices();
  if (!vs.length) return null;
  for (const tag of (VOICE_PREF[code] || [code])) {
    const t = normL(tag);
    let m = vs.filter(v => normL(v.lang) === t);
    if (!m.length && t.indexOf("-") < 0) m = vs.filter(v => normL(v.lang).startsWith(t));
    if (m.length) return { v: bestV(m), fb: tag.slice(0, 2) !== code };
  }
  const m = vs.filter(v => normL(v.lang).startsWith(code + "-") || normL(v.lang) === code);
  return m.length ? { v: bestV(m), fb: false } : null;
}
function stopSpeak() {
  speakRun++;
  try { player.onended = null; player.onerror = null; player.onplaying = null; player.pause(); } catch (e) {}
  try { if (synth) synth.cancel(); } catch (e) {}
  if (speakingBtn) speakingBtn.classList.remove("on");
  speakingBtn = null;
}
// make English abbreviations sound right
function enFix(t) {
  return t
    .replace(/\bmph\b/gi, "miles per hour").replace(/\bmm\b/g, "millimetres").replace(/\bcm\b/g, "centimetres")
    .replace(/\bkm\b/g, "kilometres").replace(/\bkg\b/g, "kilograms").replace(/\byds?\b/g, "yards")
    .replace(/\b(MOT|DVLA|DVSA|ABS|HGV|CPR|ISOFIX|LED|UK|PCN|SORN)\b/g, (m) => m === "SORN" ? "sorn" : m === "ISOFIX" ? "iso fix" : m.split("").join(" "))
    .replace(/\bV5C\b/g, "V 5 C").replace(/\bM(\d)\b/g, "M $1").replace(/\bA(\d)\b/g, "A $1")
    .replace(/[=→•]/g, ", ");
}
// split a mixed text into English parts and native parts
const LAT_RE = /(?:\d[\d.,]*\s*)?[A-Za-z][A-Za-z0-9'’&\/\-]*(?:\s+[A-Za-z0-9][A-Za-z0-9'’&\/\-]*)*/g;
function segments(text, code) {
  if (code === "en") return [{ e: true, t: text }];
  const out = [];
  let last = 0, m;
  LAT_RE.lastIndex = 0;
  while ((m = LAT_RE.exec(text))) {
    if (m.index > last) out.push({ e: false, t: text.slice(last, m.index) });
    out.push({ e: true, t: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ e: false, t: text.slice(last) });
  return out.filter(p => /[\p{L}\p{N}]/u.test(p.t));
}
function chunks(t) {
  const res = [];
  t.split(/(?<=[.!?।۔])\s+/).forEach(s => {
    s = s.trim();
    while (s.length > 180) {
      let cut = s.lastIndexOf(" ", 180); if (cut < 60) cut = 180;
      res.push(s.slice(0, cut)); s = s.slice(cut).trim();
    }
    if (s) res.push(s);
  });
  return res;
}
// remove punctuation marks so the voice never says "full stop" etc. Decimal points (3.5) stay.
function cleanSpeech(t) {
  return t
    .replace(/(\d)\.(?=\d)/g, "$1\u0001")
    .replace(/[.\u0964\u06D4!?;:\u2026"\u201C\u201D()\[\]{}]/g, " ")
    .replace(/\u0001/g, ".")
    .replace(/\s*,\s*(,\s*)+/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}
// option letters spoken in the language's own script, so the same voice says them
const OPT_LABELS = {
  en: ["A", "B", "C", "D"],
  hi: ["\u090F", "\u092C\u0940", "\u0938\u0940", "\u0921\u0940"],
  mr: ["\u090F", "\u092C\u0940", "\u0938\u0940", "\u0921\u0940"],
  ne: ["\u090F", "\u092C\u0940", "\u0938\u0940", "\u0921\u0940"],
  pa: ["\u0A0F", "\u0A2C\u0A40", "\u0A38\u0A40", "\u0A21\u0A40"],
  ur: ["\u0627\u06D2", "\u0628\u06CC", "\u0633\u06CC", "\u0688\u06CC"],
  bn: ["\u098F", "\u09AC\u09BF", "\u09B8\u09BF", "\u09A1\u09BF"],
  te: ["\u0C0E", "\u0C2C\u0C3F", "\u0C38\u0C3F", "\u0C21\u0C3F"],
  ml: ["\u0D0E", "\u0D2C\u0D3F", "\u0D38\u0D3F", "\u0D21\u0D3F"],
  ta: ["\u0B8F", "\u0BAA\u0BBF", "\u0B9A\u0BBF", "\u0B9F\u0BBF"],
  gu: ["\u0A8F", "\u0AAC\u0AC0", "\u0AB8\u0AC0", "\u0AA1\u0AC0"]
};
function spokenQuestion(q, opts, code) {
  const L = OPT_LABELS[code] || OPT_LABELS.en;
  return q + ". " + opts.map((o, p) => L[p] + ", " + o).join(". ");
}
function setMsg(btn, m) { const e = btn && btn._msg; if (e) { e.textContent = m; e.classList.toggle("hidden", !m); } }
function waitVoices(cb) {
  if (allVoices().length) return cb();
  let done = false;
  const go = () => { if (!done) { done = true; cb(); } };
  try { synth.onvoiceschanged = go; } catch (e) {}
  setTimeout(go, 1500);
}
function speak(text, code, btn, clips) {
  if (clips && AUDIO_BASE && AUDIO_LANGS.indexOf(code) >= 0) {
    const wasOn = btn.classList.contains("on");
    stopSpeak();
    if (wasOn) return;
    setMsg(btn, "");
    const run = speakRun;
    btn.classList.add("on"); speakingBtn = btn;
    playClips(clips, btn, run, () => {
      if (run !== speakRun) return;
      btn.classList.remove("on"); speakingBtn = null;
      speakBrowser(text, code, btn);
    });
    return;
  }
  speakBrowser(text, code, btn);
}
function speakBrowser(text, code, btn) {
  const wasOn = btn.classList.contains("on");
  stopSpeak();
  if (wasOn) return;
  if (!synth) { setMsg(btn, "This browser cannot read aloud. Try Chrome."); return; }
  setMsg(btn, "");
  const run = speakRun;
  btn.classList.add("on"); speakingBtn = btn;
  waitVoices(() => {
    if (run !== speakRun) return;
    const have = allVoices().length > 0;
    const en = pickVoice("en");
    const nat = code === "en" ? null : pickVoice(code);
    if (code !== "en" && have && !nat) {
      setMsg(btn, "No " + LNAME[code] + " voice on this device. Phone Chrome (Android) usually has it. On a Chromebook or laptop, add the " + LNAME[code] + " voice in the device settings.");
      btn.classList.remove("on"); speakingBtn = null; return;
    }
    if (nat && nat.fb) setMsg(btn, LNAME[code] + " voice not found, so a Hindi voice is used.");
    const parts = [];
    segments(text, code).forEach(s => {
      const vv = s.e ? (en && en.v) : (nat && nat.v);
      const lng = s.e ? "en-GB" : (nat && nat.v ? nat.v.lang : code);
      const body = s.e ? enFix(s.t) : s.t.replace(/[=→•]/g, ", ");
      chunks(body).forEach(c => { c = cleanSpeech(c); if (/[\p{L}\p{N}]/u.test(c)) parts.push({ t: c, v: vv, lang: lng, rate: s.e ? 0.95 : 0.9 }); });
    });
    let k = 0;
    const finish = () => { if (run === speakRun) { btn.classList.remove("on"); speakingBtn = null; } };
    const next = () => {
      if (run !== speakRun) return;
      if (k >= parts.length) { finish(); return; }
      const p = parts[k++];
      const u = new SpeechSynthesisUtterance(p.t);
      if (p.v) u.voice = p.v;
      u.lang = p.lang; u.rate = p.rate;
      u.onend = next;
      u.onerror = () => next();
      try { synth.resume(); } catch (e) {}
      synth.speak(u);
    };
    setTimeout(next, 80);
  });
}
// once a speaker button is tapped, the same kind of audio plays by itself on the next questions
const AUTO = { q: null, e: null };
function autoStart(w, kind, code) { if (w && w._go && AUTO[kind] === code) w._go(); }
function speakBtn(label, text, code, clips, kind) {
  const w = document.createElement("span");
  w.className = "spkw";
  const b = document.createElement("button");
  b.className = "speakbtn"; b.textContent = "🔊 " + label; b.type = "button";
  const m = document.createElement("small");
  m.className = "speakmsg hidden";
  b._msg = m;
  b.onclick = () => { if (kind) AUTO[kind] = b.classList.contains("on") ? null : code; speak(text, code, b, clips); };
  w._go = () => speak(text, code, b, clips);
  w.appendChild(b); w.appendChild(m);
  return w;
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
  stopSpeak();
  const sr = $("speakRow"); sr.innerHTML = "";
  if (synth) {
    const enText = spokenQuestion(q.q, order.map(oi => q.options[oi]), "en");
    const clipsFor = (L, withLabels) => [L + "/q" + q.id].concat(...order.map((oi, p) => [L + "/L" + p, L + "/o" + q.id + "_" + oi]));
    const enW = speakBtn("English", enText, "en", clipsFor("en"), "q");
    sr.appendChild(enW);
    let nW = null;
    const tq = q.tr && q.tr[lang()];
    if (tq && lang() !== "en") { nW = speakBtn(LISTEN[lang()], spokenQuestion(tq.q, order.map(oi => tq.o[oi]), lang()), lang(), clipsFor(lang()), "q"); sr.appendChild(nW); }
    if (!answered) { autoStart(enW, "q", "en"); if (nW) autoStart(nW, "q", lang()); }
    sr.classList.remove("hidden");
  } else sr.classList.add("hidden");
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
    if (synth && q.exp[l]) { const ew = speakBtn(LISTEN[l] || "", q.exp[l], l, [l + "/e" + q.id], "e"); ex.appendChild(ew); autoStart(ew, "e", l); }
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
  stopSpeak();
  const ps = $("popSpeak"); ps.innerHTML = "";
  if (synth && (w.n[l] || w.x[l])) ps.appendChild(speakBtn(LISTEN[l] || "", w.en + ". " + (w.n[l] || "") + ". " + (w.x[l] || ""), l, ["en/w" + w.id, l + "/w" + w.id]));
  $("popup").classList.remove("hidden");
}
function closeWord() { stopSpeak(); popId = null; $("popup").classList.add("hidden"); }
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


// ---------- mock test (English only, 50 random questions, 57 minutes) ----------
const MOCK_N = 50, MOCK_SECS = 57 * 60, MOCK_PASS = 43;
let mock = null, mockTick = null;
const QBYID = {};
questions.forEach(q => { QBYID[q.id] = q; });
const fmtT = (s) => { s = Math.max(0, s); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
const fmtD = (t) => { try { return new Date(t).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return ""; } };
const chName = (id) => { const c = chapters.find(x => x.id === id); return c ? c.id + ". " + c.name : "Chapter " + id; };

function startMock() {
  const picked = shuffle(questions.filter(q => !q.scene)).slice(0, Math.min(MOCK_N, questions.length));
  mock = {
    qs: picked.map(q => ({ q: q, order: shuffle(q.options.map((_, i) => i)) })),
    ans: picked.map(() => -1), flag: picked.map(() => false),
    i: 0, start: Date.now(), end: Date.now() + MOCK_SECS * 1000, done: false
  };
  clearInterval(mockTick);
  mockTick = setInterval(tickMock, 1000);
  show("mock");
  renderMock();
}
function tickMock() {
  if (!mock || mock.done) { clearInterval(mockTick); return; }
  const left = Math.round((mock.end - Date.now()) / 1000);
  const el = $("mockTime");
  if (el) { el.textContent = fmtT(left); el.classList.toggle("low", left <= 300); }
  if (left <= 0) finishMock(true);
}
function renderMock() {
  if (!mock || mock.done) return;
  const m = mock, it = m.qs[m.i], q = it.q, n = m.qs.length;
  const left = Math.round((m.end - Date.now()) / 1000);
  const answered = m.ans.filter(a => a >= 0).length;
  const rv = m.rev, atFirst = rv ? m.ri === 0 : m.i === 0, atLast = rv ? m.ri === rv.length - 1 : m.i === n - 1;
  const newQ = m.spokenFor !== m.i;
  if (newQ) { stopSpeak(); m.spokenFor = m.i; }
  let h = '<div class="top"><button id="mExit" class="link">✕ Exit</button><div class="mtimer' + (left <= 300 ? " low" : "") + '">⏱ <span id="mockTime">' + fmtT(left) + "</span></div></div>";
  if (rv) h += '<p id="count">🚩 Flagged question ' + (m.ri + 1) + " of " + rv.length + " (question " + (m.i + 1) + ")</p>";
  else h += '<p id="count">Question ' + (m.i + 1) + " of " + n + " · answered " + answered + "</p>";
  h += '<div class="bar"><div id="qFill" style="width:' + (rv ? (m.ri + 1) / rv.length : (m.i + 1) / n) * 100 + '%"></div></div>';
  if (q.sign) h += '<div class="signbox">' + signSvg(q.sign) + "</div>";
  h += '<h3 id="questionText">' + esc(q.q) + "</h3>";
  h += '<div id="mSpeak" class="speakrow"></div>';
  it.order.forEach((oi, pos) => {
    h += '<div class="answer' + (m.ans[m.i] === pos ? " sel" : "") + '" role="button" tabindex="0" data-p="' + pos + '"><span class="letter">' + "ABCD"[pos] + ".</span><span>" + esc(q.options[oi]) + "</span></div>";
  });
  h += '<div class="row mnav"><button id="mPrev" class="item half"' + (atFirst ? " disabled" : "") + '>← Previous</button><button id="mFlag" class="item half">' + (m.flag[m.i] ? "🚩 Flagged" : "⚑ Flag") + '</button><button id="mNext" class="item half"' + (atLast ? " disabled" : "") + ">Next →</button></div>";
  h += '<button id="mFinish" class="big">Finish test</button>';
  $("mock").innerHTML = h;
  const sw = speakBtn("English", spokenQuestion(q.q, it.order.map(oi => q.options[oi]), "en"), "en", ["en/q" + q.id].concat(...it.order.map((oi, p) => ["en/L" + p, "en/o" + q.id + "_" + oi])), "q");
  $("mSpeak").appendChild(sw);
  if (newQ) autoStart(sw, "q", "en");
  document.querySelectorAll("#mock .answer").forEach(d => {
    const pick = () => { m.ans[m.i] = +d.dataset.p; renderMock(); };
    d.onclick = pick;
    d.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } };
  });
  const go = (d) => {
    if (rv) { const r = m.ri + d; if (r >= 0 && r < rv.length) { m.ri = r; m.i = rv[r]; } }
    else { const k = m.i + d; if (k >= 0 && k < n) m.i = k; }
    renderMock(); window.scrollTo(0, 0);
  };
  $("mPrev").onclick = () => go(-1);
  $("mNext").onclick = () => go(1);
  $("mFlag").onclick = () => { m.flag[m.i] = !m.flag[m.i]; renderMock(); };
  $("mExit").onclick = () => { if (confirm("Leave the test? Your answers will be lost.")) { m.done = true; clearInterval(mockTick); stopSpeak(); showHome(); } };
  $("mFinish").onclick = () => {
    const fl = [];
    m.flag.forEach((f, k) => { if (f) fl.push(k); });
    if (!m.rev && fl.length) { askFlagged(fl); return; }
    confirmFinish();
  };
}
function confirmFinish() {
  const m = mock; if (!m || m.done) return;
  const un = m.ans.filter(a => a < 0).length;
  if (confirm(un ? un + " question(s) not answered. Finish the test now?" : "Finish the test now?")) finishMock(false);
}
// at the end: ask if the flagged questions should be looked at again
function askFlagged(fl) {
  const m = mock; if (!m || m.done) return;
  stopSpeak();
  let h = '<div class="top"><button id="fBack" class="link">← Back to the test</button></div>';
  h += '<div class="resultbox"><h3>🚩 You flagged ' + fl.length + " question" + (fl.length > 1 ? "s" : "") + "</h3><p>Do you want to look at them again before you finish?</p></div>";
  h += '<button id="fRev" class="big">Yes, review my flagged questions</button>';
  h += '<button id="fFin" class="big" style="background:var(--blue)">No, finish the test</button>';
  $("mock").innerHTML = h;
  $("fBack").onclick = () => { m.spokenFor = -1; renderMock(); };
  $("fRev").onclick = () => { m.rev = fl; m.ri = 0; m.i = fl[0]; m.spokenFor = -1; renderMock(); window.scrollTo(0, 0); };
  $("fFin").onclick = confirmFinish;
}
function finishMock(timedOut) {
  if (!mock || mock.done) return;
  const m = mock; m.done = true; clearInterval(mockTick); stopSpeak();
  const ch = {}, det = [];
  let score = 0;
  m.qs.forEach((it, k) => {
    const q = it.q, pos = m.ans[k];
    const pick = pos >= 0 ? it.order[pos] : -1;
    const ok = pick === q.answer;
    if (ok) score++;
    if (!ch[q.chapter]) ch[q.chapter] = [0, 0];
    ch[q.chapter][1]++; if (ok) ch[q.chapter][0]++;
    det.push([q.id, pick]);
  });
  const rec = { t: Date.now(), score: score, total: m.qs.length, pass: score >= MOCK_PASS, secs: Math.min(MOCK_SECS, Math.round((Date.now() - m.start) / 1000)), timedOut: !!timedOut, ch: ch, det: det };
  save.mocks = [rec].concat(save.mocks || []).slice(0, 40);
  store();
  showMockResult(rec, true);
}
function reviewHtml(rec, onlyWrong) {
  let h = "";
  rec.det.forEach((d, k) => {
    const q = QBYID[d[0]];
    if (!q) return;
    const ok = d[1] === q.answer;
    if (onlyWrong && ok) return;
    h += '<div class="card rv"><b>' + (k + 1) + ". " + esc(q.q) + "</b>";
    h += '<div class="' + (d[1] < 0 ? "muted" : "badtxt") + '">' + (ok ? "" : "Your answer: " + (d[1] >= 0 ? esc(q.options[d[1]]) : "not answered")) + "</div>";
    h += '<div class="goodtxt">Correct: ' + esc(q.options[q.answer]) + "</div>";
    const l = lang();
    if (!ok && q.exp && q.exp[l]) h += '<div class="rvx" dir="' + dirOf(l) + '" lang="' + l + '">' + esc(q.exp[l]) + "</div>";
    if (!ok) h += '<div class="speakrow rvs" data-q="' + q.id + '"></div>';
    h += "</div>";
  });
  return h || '<p class="note">Nothing wrong. Well done!</p>';
}
function fillReviewSpeak() {
  const l = lang();
  document.querySelectorAll("#mock .rvs").forEach(row => {
    const q = QBYID[+row.dataset.q];
    if (!q || row.childNodes.length) return;
    row.appendChild(speakBtn("English", spokenQuestion(q.q, q.options, "en"), "en", ["en/q" + q.id].concat(...q.options.map((o, i) => ["en/L" + i, "en/o" + q.id + "_" + i]))));
    if (l !== "en" && q.exp && q.exp[l]) row.appendChild(speakBtn(LISTEN[l] || "", q.exp[l], l, [l + "/e" + q.id]));
    else if (l === "en" && q.exp && q.exp.en) row.appendChild(speakBtn("Explanation", q.exp.en, "en", ["en/e" + q.id]));
  });
}
function chBars(chMap) {
  const rows = Object.keys(chMap).map(id => ({ id: +id, r: chMap[id][0], t: chMap[id][1] })).filter(x => x.t).sort((a, b) => a.r / a.t - b.r / b.t);
  return rows.map(x => {
    const pc = Math.round((x.r / x.t) * 100);
    return '<div class="cbar"><div class="cl"><span>' + esc(chName(x.id)) + "</span><b>" + x.r + "/" + x.t + " · " + pc + '%</b></div><div class="bar"><div style="background:' + (pc >= 86 ? "var(--green)" : pc >= 60 ? "#f59e0b" : "var(--red)") + ";height:100%;width:" + pc + '%"></div></div></div>';
  }).join("");
}
function showMockResult(rec, fresh) {
  const wrongN = rec.total - rec.score;
  let h = '<div class="top"><button id="rHome2" class="link">← Home</button></div><div class="resultbox">';
  h += "<h3>" + (rec.pass ? "✅ PASS" : "❌ FAIL") + "</h3>";
  h += '<div class="score">' + rec.score + " / " + rec.total + "</div>";
  h += "<p>Pass mark: " + MOCK_PASS + " / " + MOCK_N + " · Time used: " + fmtT(rec.secs) + (rec.timedOut ? " (time ran out)" : "") + "<br><small>" + fmtD(rec.t) + "</small></p></div>";
  h += "<h3>By chapter (weakest first)</h3>" + chBars(rec.ch);
  h += "<h3>Wrong or unanswered (" + wrongN + ")</h3>" + reviewHtml(rec, true);
  h += '<button id="rNew" class="big">New mock test</button><button id="rHist" class="big" style="background:var(--blue)">My results</button>';
  $("mock").innerHTML = h;
  fillReviewSpeak();
  $("rHome2").onclick = showHome;
  $("rNew").onclick = startMock;
  $("rHist").onclick = showMockHistory;
  show("mock");
}
function showMockHistory() {
  const list = save.mocks || [];
  let h = '<div class="top"><button id="hHome" class="link">← Home</button></div><h2>My mock test results</h2>';
  if (!list.length) h += '<p class="note">No mock tests yet. Take your first one!</p>';
  else {
    const avg = Math.round(list.reduce((a, r) => a + r.score, 0) / list.length * 10) / 10;
    const passN = list.filter(r => r.pass).length;
    h += '<div class="stats"><div><b>' + list.length + "</b><br>Tests</div><div><b>" + avg + "</b><br>Avg score</div><div><b>" + passN + "</b><br>Passed</div></div>";
    const tot = {};
    list.forEach(r => Object.keys(r.ch).forEach(id => { if (!tot[id]) tot[id] = [0, 0]; tot[id][0] += r.ch[id][0]; tot[id][1] += r.ch[id][1]; }));
    h += "<h3>All tests together: weak chapters first</h3>" + chBars(tot);
    h += "<h3>Every test</h3>";
    list.forEach((r, k) => {
      h += '<button class="item hist" data-k="' + k + '"><b>' + r.score + " / " + r.total + " · " + (r.pass ? "✅ Pass" : "❌ Fail") + "</b><small>" + fmtD(r.t) + " · " + fmtT(r.secs) + "</small></button>";
    });
  }
  h += '<button id="hNew" class="big">New mock test</button>';
  $("mock").innerHTML = h;
  $("hHome").onclick = showHome;
  $("hNew").onclick = startMock;
  document.querySelectorAll("#mock .hist").forEach(b => { b.onclick = () => showMockResult(save.mocks[+b.dataset.k], false); });
  show("mock");
}
$("mockBtn").onclick = () => { if (questions.length < 50) return; startMock(); };
$("histBtn").onclick = showMockHistory;

// ---------- start ----------
if (save.lang) { refresh(); showHome(); } else { show("welcome"); }
