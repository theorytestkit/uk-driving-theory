// make_audio.js - makes the audio clips for UK Theory Practice Kit using Google Cloud Text-to-Speech.
//
// Put this file in the SAME folder as index.html, questions1.js ... questions10.js and glossary.js.
// Needs Node.js 18 or newer.
//
// 1) Set your key (once per terminal window):   export GOOGLE_TTS_KEY="paste-your-key-here"
// 2) Look at the cost first:                    node make_audio.js --estimate
// 3) Make a few samples to listen to:           node make_audio.js --sample
//    (then open audio_sample/index.html in Chrome and press play)
// 4) Make everything (can be stopped and started again, it skips finished files):
//                                               node make_audio.js
//
// Options:  --lang=hi,pa     only these languages
//           --voice=Kore     another Chirp 3 HD voice (default Aoede, a female voice)
//           --rpm=120        requests per minute (lower it if you see "429" errors)
//           --out=audio      output folder

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// ---------- settings ----------
const ARGS = {};
process.argv.slice(2).forEach((a) => {
  const m = a.match(/^--([a-z]+)(?:=(.*))?$/);
  if (m) ARGS[m[1]] = m[2] === undefined ? true : m[2];
});
const KEY = process.env.GOOGLE_TTS_KEY || "";
const ENDPOINT = process.env.TTS_ENDPOINT || "https://texttospeech.googleapis.com/v1/text:synthesize";
const VOICE = ARGS.voice || "Aoede"; // female
const RPM = Number(ARGS.rpm || 120);
const CONCURRENCY = 4;
const PRICE_PER_MILLION = 30; // Chirp 3 HD, US dollars
const FREE_PER_MONTH = 1000000;

// Google locale for each of our language codes. ne (Nepali) has no Chirp 3 HD voice, so it is skipped
// and the website keeps using the browser voice for Nepali.
const LOCALE = { en: "en-GB", hi: "hi-IN", pa: "pa-IN", ur: "ur-IN", bn: "bn-IN", te: "te-IN", mr: "mr-IN", ml: "ml-IN", ta: "ta-IN", gu: "gu-IN", ne: null };
const ALL_LANGS = ["en", "hi", "pa", "ur", "bn", "te", "mr", "ml", "ta", "gu", "ne"];
const LABELS = {
  en: ["Option A", "Option B", "Option C", "Option D"],
  hi: ["ए", "बी", "सी", "डी"],
  mr: ["ए", "बी", "सी", "डी"],
  ne: ["ए", "बी", "सी", "डी"],
  pa: ["ਏ", "ਬੀ", "ਸੀ", "ਡੀ"],
  ur: ["اے", "بی", "سی", "ڈی"],
  bn: ["এ", "বি", "সি", "ডি"],
  te: ["ఎ", "బి", "సి", "డి"],
  ml: ["എ", "ബി", "സി", "ഡി"],
  ta: ["ஏ", "பி", "சி", "டி"],
  gu: ["એ", "બી", "સી", "ડી"]
};

// make English abbreviations sound right (same rules as the website)
function enFix(t) {
  return t
    .replace(/\bmph\b/gi, "miles per hour").replace(/\bmm\b/g, "millimetres").replace(/\bcm\b/g, "centimetres")
    .replace(/\bkm\b/g, "kilometres").replace(/\bkg\b/g, "kilograms").replace(/\byds?\b/g, "yards")
    .replace(/\b(MOT|DVLA|DVSA|ABS|HGV|CPR|ISOFIX|LED|UK|PCN|SORN)\b/g, (m) => (m === "SORN" ? "sorn" : m === "ISOFIX" ? "iso fix" : m.split("").join(" ")))
    .replace(/\bV5C\b/g, "V 5 C").replace(/\bM(\d)\b/g, "M $1").replace(/\bA(\d)\b/g, "A $1")
    .replace(/[=→•]/g, ", ");
}
const clean = (t) => enFix(String(t || "")).replace(/\s+/g, " ").trim();

// ---------- load the website data ----------
function loadData() {
  const dir = process.cwd();
  const ctx = { window: {}, document: {}, localStorage: {}, console };
  vm.createContext(ctx);
  let qfiles = [];
  for (let i = 1; i <= 10; i++) if (fs.existsSync(path.join(dir, "questions" + i + ".js"))) qfiles.push("questions" + i + ".js");
  if (!qfiles.length && fs.existsSync(path.join(dir, "questions.js"))) qfiles = ["questions.js"];
  if (!qfiles.length || !fs.existsSync(path.join(dir, "glossary.js"))) {
    console.error("I cannot find questions1.js ... and glossary.js here. Put make_audio.js in the same folder as them.");
    process.exit(1);
  }
  let code = qfiles.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n");
  code += "\n;this.__Q = questions;";
  vm.runInContext(code, ctx);
  vm.runInContext(fs.readFileSync(path.join(dir, "glossary.js"), "utf8") + "\n;this.__W = WORDS;", ctx);
  return { questions: ctx.__Q, words: ctx.__W };
}

// ---------- list of clips to make ----------
function buildJobs(data, langs, onlyFirst) {
  const jobs = [];
  const add = (lang, name, text) => { text = clean(text); if (text) jobs.push({ lang, name, file: lang + "/" + name + ".mp3", text }); };
  const qs = onlyFirst ? data.questions.slice(0, onlyFirst) : data.questions;
  const ws = onlyFirst ? data.words.slice(0, 1) : data.words;
  langs.forEach((L) => {
    LABELS[L].forEach((t, i) => add(L, "L" + i, t));
    qs.forEach((q) => {
      if (L === "en") {
        add(L, "q" + q.id, q.q);
        q.options.forEach((o, i) => add(L, "o" + q.id + "_" + i, o));
      } else {
        const t = q.tr && q.tr[L];
        if (!t) return;
        add(L, "q" + q.id, t.q);
        t.o.forEach((o, i) => add(L, "o" + q.id + "_" + i, o));
        if (q.exp && q.exp[L]) add(L, "e" + q.id, q.exp[L]);
      }
    });
    ws.forEach((w) => {
      if (L === "en") add(L, "w" + w.id, w.en);
      else {
        const n = (w.n && w.n[L]) || "", x = (w.x && w.x[L]) || "";
        add(L, "w" + w.id, n + ". " + x);
      }
    });
  });
  return jobs;
}

// ---------- calling Google ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function synth(job) {
  const loc = LOCALE[job.lang];
  const body = {
    input: { text: job.text },
    voice: { languageCode: loc, name: loc + "-Chirp3-HD-" + VOICE },
    audioConfig: { audioEncoding: "MP3" }
  };
  let wait = 3000;
  for (let attempt = 1; attempt <= 6; attempt++) {
    let res;
    try {
      res = await fetch(ENDPOINT + "?key=" + encodeURIComponent(KEY), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } catch (e) { await sleep(wait); wait *= 2; continue; }
    if (res.ok) {
      const j = await res.json();
      return Buffer.from(j.audioContent, "base64");
    }
    const txt = (await res.text()).slice(0, 300);
    if (res.status === 429 || res.status >= 500) { await sleep(wait); wait *= 2; continue; }
    const err = new Error("HTTP " + res.status + ": " + txt);
    err.fatal = res.status === 400 && /voice|language/i.test(txt) ? "voice" : (res.status === 403 || res.status === 401 ? "key" : false);
    throw err;
  }
  throw new Error("too many retries");
}

async function run(jobs, outDir) {
  const todo = jobs.filter((j) => { const f = path.join(outDir, j.file); return !(fs.existsSync(f) && fs.statSync(f).size > 200); });
  console.log("Clips needed: " + jobs.length + ", already done: " + (jobs.length - todo.length) + ", to make now: " + todo.length);
  if (!todo.length) return [];
  const gap = 60000 / RPM;
  let next = 0, done = 0, lastStart = 0;
  const failed = [];
  let stop = false;
  const t0 = Date.now();
  async function worker() {
    while (!stop) {
      const i = next++;
      if (i >= todo.length) return;
      const job = todo[i];
      const now = Date.now();
      const startAt = Math.max(now, lastStart + gap);
      lastStart = startAt;
      if (startAt > now) await sleep(startAt - now);
      try {
        const buf = await synth(job);
        const f = path.join(outDir, job.file);
        fs.mkdirSync(path.dirname(f), { recursive: true });
        fs.writeFileSync(f, buf);
      } catch (e) {
        failed.push(job.file + "  " + e.message);
        if (e.fatal === "key") { console.error("\nGoogle refused the key (" + e.message + "). Check the key and that Text-to-Speech API is switched on."); stop = true; }
        if (e.fatal === "voice" && failed.length >= 5 && done === 0) { console.error("\nGoogle does not accept this voice: " + e.message); stop = true; }
      }
      done++;
      if (done % 50 === 0 || done === todo.length) {
        const mins = (Date.now() - t0) / 60000;
        const left = ((todo.length - done) / Math.max(done / mins, 0.01));
        console.log(done + " / " + todo.length + " done, about " + Math.round(left) + " minutes left");
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return failed;
}

// ---------- main ----------
(async () => {
  const data = loadData();
  let langs = ALL_LANGS.slice();
  if (ARGS.lang) langs = String(ARGS.lang).split(",").map((s) => s.trim());
  const skipped = langs.filter((l) => !LOCALE[l]);
  langs = langs.filter((l) => LOCALE[l]);
  if (skipped.length) console.log("Skipped (no Google voice): " + skipped.join(", ") + " - the website keeps using the browser voice there.");

  if (ARGS.estimate) {
    console.log("\nCharacters and cost (Chirp 3 HD, $" + PRICE_PER_MILLION + " per million characters):");
    let total = 0;
    langs.forEach((L) => {
      const c = buildJobs(data, [L]).reduce((a, j) => a + [...j.text].length, 0);
      total += c;
      console.log("  " + L + ": " + c.toLocaleString() + " characters, " + buildJobs(data, [L]).length + " clips");
    });
    const full = (total / 1e6) * PRICE_PER_MILLION;
    const free = (Math.max(total - FREE_PER_MONTH, 0) / 1e6) * PRICE_PER_MILLION;
    console.log("\nTotal: " + total.toLocaleString() + " characters");
    console.log("Cost with no free allowance: about $" + full.toFixed(0));
    console.log("Cost if the free " + FREE_PER_MONTH.toLocaleString() + " characters of the month are used: about $" + free.toFixed(0));
    console.log("Check the current price on Google's pricing page before you start.");
    return;
  }

  if (!KEY) { console.error('First set your key:  export GOOGLE_TTS_KEY="paste-your-key-here"'); process.exit(1); }

  if (ARGS.sample) {
    const out = ARGS.out || "audio_sample";
    const jobs = buildJobs(data, langs, 3);
    console.log("Making samples (3 questions per language)...");
    const failed = await run(jobs, out);
    const rows = langs.map((L) => {
      const items = jobs.filter((j) => j.lang === L && fs.existsSync(path.join(out, j.file))).map((j) =>
        "<div><small>" + j.name + "</small> " + j.text.replace(/</g, "&lt;") + '<br><audio controls preload="none" src="' + j.file + '"></audio></div>').join("\n");
      return "<h2>" + L + "</h2>\n" + items;
    }).join("\n");
    fs.writeFileSync(path.join(out, "index.html"), '<!DOCTYPE html><meta charset="utf-8"><title>Audio samples</title><body style="font-family:sans-serif;max-width:700px;margin:auto;padding:10px">' + rows);
    console.log("\nDone. Open  " + path.join(out, "index.html") + "  in Chrome and press play on each one.");
    if (failed.length) { fs.writeFileSync("audio_errors.txt", failed.join("\n")); console.log(failed.length + " clips failed. See audio_errors.txt (first one: " + failed[0] + ")"); }
    return;
  }

  const out = ARGS.out || "audio";
  const jobs = buildJobs(data, langs);
  const failed = await run(jobs, out);
  if (failed.length) {
    fs.writeFileSync("audio_errors.txt", failed.join("\n"));
    console.log("\n" + failed.length + " clips failed. See audio_errors.txt. Run the same command again to retry only those.");
  } else {
    console.log("\nAll clips are ready in the folder: " + out);
  }
})().catch((e) => { console.error(e); process.exit(1); });
