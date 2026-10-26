let save = JSON.parse(localStorage.getItem("save") || '{"lang":null,"correct":{}}');
function store() { localStorage.setItem("save", JSON.stringify(save)); }

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

const languages = [
  { code: "hi", label: "हिन्दी (Hindi)", ready: true },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", ready: false },
  { code: "ur", label: "اردو (Urdu)", ready: false },
  { code: "te", label: "తెలుగు (Telugu)", ready: false },
  { code: "bn", label: "বাংলা (Bengali)", ready: false }
];

function showLanguages() {
  const box = document.getElementById("langList");
  box.innerHTML = "";
  languages.forEach(l => {
    const b = document.createElement("button");
    b.className = "item" + (l.ready ? "" : " soon");
    b.textContent = l.label + (l.ready ? "" : " - Coming soon");
    if (l.ready) b.onclick = () => { save.lang = l.code; store(); showHome(); };
    box.appendChild(b);
  });
  show("langs");
}

function showHome() {
  const total = questions.length;
  const done = Object.keys(save.correct).length;
  document.getElementById("progressText").textContent = done + " / " + total + " correct";
  document.getElementById("progressFill").style.width = (done / total * 100) + "%";
  const list = document.getElementById("chapterList");
  list.innerHTML = "";
  chapters.forEach(c => {
    const qs = questions.filter(q => q.chapter === c.id);
    const d = qs.filter(q => save.correct[q.id]).length;
    const b = document.createElement("button");
    b.className = "item";
    b.innerHTML = "<b>" + c.id + ". " + c.name + "</b><br>" + c.hi + " - " + d + " / " + qs.length;
    b.onclick = () => startPractice(c.id);
    list.appendChild(b);
  });
  show("home");
}

let set = [], index = 0, score = 0;

function startPractice(chapterId) {
  const qs = questions.filter(q => q.chapter === chapterId);
  const unseen = qs.filter(q => !save.correct[q.id]);
  const seen = qs.filter(q => save.correct[q.id]);
  set = unseen.concat(seen).slice(0, 10);
  index = 0; score = 0;
  showQuestion();
  show("practice");
}

function showQuestion() {
  const q = set[index];
  document.getElementById("count").textContent = "Question " + (index + 1) + " / " + set.length;
  document.getElementById("questionText").textContent = q.q;
  document.getElementById("meaningText").textContent = q.hi;
  document.getElementById("meaningText").classList.add("hidden");
  document.getElementById("meaningBtn").classList.remove("hidden");
  document.getElementById("explain").classList.add("hidden");
  document.getElementById("nextBtn").classList.add("hidden");
  const box = document.getElementById("answers");
  box.innerHTML = "";
  q.options.forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "answer";
    b.textContent = "ABCD"[i] + ". " + text;
    b.onclick = () => choose(i);
    box.appendChild(b);
  });
}

function choose(i) {
  const q = set[index];
  const buttons = document.querySelectorAll(".answer");
  buttons.forEach(b => b.disabled = true);
  buttons[q.answer].classList.add("right");
  if (i === q.answer) {
    score++;
    save.correct[q.id] = true;
    buttons[q.answer].textContent += "  ✓";
  } else {
    buttons[i].classList.add("wrong");
    buttons[i].textContent += "  ✗";
  }
  store();
  const ex = document.getElementById("explain");
  ex.textContent = q.exp;
  ex.classList.remove("hidden");
  const next = document.getElementById("nextBtn");
  next.textContent = index === set.length - 1 ? "See result" : "Next question";
  next.classList.remove("hidden");
}

document.getElementById("nextBtn").onclick = () => {
  index++;
  if (index < set.length) { showQuestion(); return; }
  document.getElementById("count").textContent = "Practice complete!";
  document.getElementById("questionText").textContent = "Score: " + score + " / " + set.length;
  document.getElementById("answers").innerHTML = "";
  document.getElementById("explain").classList.add("hidden");
  document.getElementById("nextBtn").classList.add("hidden");
  document.getElementById("meaningBtn").classList.add("hidden");
  document.getElementById("meaningText").classList.add("hidden");
};

document.getElementById("meaningBtn").onclick = () => {
  document.getElementById("meaningText").classList.toggle("hidden");
};
document.getElementById("backBtn").onclick = showHome;
document.getElementById("startBtn").onclick = showLanguages;

if (save.lang) showHome();