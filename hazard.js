// hazard.js - Hazard Perception practice with animated (self-drawn) clips. No DVSA material is used.
(function () {
  var W = 640, H = 360;
  var CLIPS = [
    { id: "child", title: "Ball in a quiet street", dur: 11.5, speed: 9, ws: 6.0, we: 8.6,
      why: "A ball rolling out between parked cars means a child may follow it. The hazard starts developing when the ball appears. Slow down and cover the brake.",
      parked: [{ z: 62, c: "#3b6ea8" }, { z: 70, c: "#a33" }, { z: 88, c: "#d8d8d8" }, { z: 96, c: "#444" }],
      objs: [
        { t: "ball", pos: function (t) { return t < 6 ? null : { x: -3.4 + 1.2 * (t - 6), z: 80 }; } },
        { t: "kid", pos: function (t) { return t < 7.4 ? null : { x: -3.6 + 1.5 * (t - 7.4), z: 80.5 }; } }
      ] },
    { id: "junction", title: "Car at a side road", dur: 10.5, speed: 10, ws: 5.6, we: 8.3,
      why: "The car waiting at the junction starts to creep forward. It may pull out in front of you. The hazard starts when the driver begins to move out, not when they are already in the road.",
      parked: [], side: { z: 85, x: 4 },
      objs: [{ t: "car", c: "#2f8f5b", pos: function (t) { var p = t < 5.6 ? 0 : Math.min(1, (t - 5.6) / 3); return { x: 5.6 - 5.4 * p, z: 85 }; } }] },
    { id: "bus", title: "Pedestrian behind a bus", dur: 10.5, speed: 9, ws: 5.2, we: 8.4,
      why: "A bus is stopped at the bus stop and people often cross in front of or behind it. You cannot see the road past the bus. Slow down as a person starts to step out.",
      parked: [], objs: [
        { t: "ped", c: "#c0392b", pos: function (t) { return t < 5 ? { x: -4.4, z: 84 } : { x: -4.4 + 1.4 * (t - 5), z: 84 }; } },
        { t: "bus", pos: function () { return { x: -2.6, z: 80 }; } }
      ] },
    { id: "cyclist", title: "Cyclist and parked car", dur: 10, speed: 9, ws: 4.8, we: 7.4,
      why: "The cyclist must pass the parked car, so they will move out into your lane. The hazard starts when the cyclist begins to move out. Give them room and be ready to slow.",
      parked: [{ z: 72, c: "#7a4fa3" }],
      objs: [{ t: "bike", pos: function (t) { var p = t < 4.8 ? 0 : Math.min(1, (t - 4.8) / 2.4); return { x: -2.9 + 1.5 * p, z: 45 + 5 * t }; } }] },
    { id: "brake", title: "Car ahead brakes", dur: 9.5, speed: 9, ws: 6.0, we: 8.2,
      why: "The brake lights of the car ahead come on and it slows down quickly. The hazard starts as soon as the brake lights show. Ease off the accelerator and keep a safe gap.",
      parked: [], objs: [{ t: "car", c: "#555", brake: function (t) { return t >= 6; }, pos: function (t) { var z = 28 + 9 * t; if (t > 6) { var d = Math.min(t - 6, 3); z = 28 + 54 + 9 * d - 1.5 * d * d; } return { x: -1.75, z: z }; } }] }
  ];

  var css = document.createElement("style");
  css.textContent =
    "#hazard .hc{display:block;width:100%;max-width:640px;border-radius:10px;background:#8ec5ff;touch-action:manipulation}" +
    "#hazard .hflag{display:block;width:100%;max-width:640px;margin:10px auto;padding:18px;font-size:1.2rem;background:#dc2626;color:#fff;border:0;border-radius:12px;font-weight:bold}" +
    "#hazard .htl{position:relative;height:14px;background:#d9dee8;border-radius:7px;margin:8px 0;overflow:visible}" +
    "#hazard .htl i{position:absolute;top:0;left:0;height:100%;background:#1d4ed8;border-radius:7px}" +
    "#hazard .htl b{position:absolute;top:-4px;width:3px;height:22px;background:#dc2626}" +
    "#hazard .htl u{position:absolute;top:0;height:100%;background:rgba(22,163,74,.45);text-decoration:none}" +
    "#hazard .hrow{display:flex;justify-content:space-between;align-items:center;gap:8px}";
  document.head.appendChild(css);

  var scr = document.createElement("div");
  scr.id = "hazard"; scr.className = "screen hidden";
  document.body.appendChild(scr);

  var btn = document.createElement("button");
  btn.id = "hazBtn"; btn.className = "item";
  var anchor = document.getElementById("histBtn");
  if (anchor) anchor.after(btn);
  function hazLabel() {
    var b = (save.haz = save.haz || {}), n = CLIPS.length, tried = 0, sum = 0;
    CLIPS.forEach(function (c) { if (b[c.id] != null) { tried++; sum += b[c.id]; } });
    var prog = Math.round(tried / n * 100), acc = tried ? Math.round(sum / (tried * 5) * 100) : 0;
    btn.innerHTML = "🎥 <b>Hazard Perception</b><small>" + prog + "% progress, " + acc + "% accuracy · " + tried + " of " + n + " clips</small>";
  }
  hazLabel();
  var oldHome = window.showHome;
  window.showHome = function () { hazLabel(); return oldHome.apply(this, arguments); };
  btn.onclick = list;

  function best() { return (save.haz = save.haz || {}); }

  function list() {
    var b = best(), tot = 0, h = '<div class="top"><button id="hBack" class="link">← Home</button></div><h2>Hazard Perception</h2>';
    h += '<p class="note">Watch the clip. Tap the red button the moment you see something developing that may need you to slow down or change direction. Faster = higher score (5 to 1). Do not tap again and again, that scores 0. Clips are animated and drawn from scratch.</p>';
    CLIPS.forEach(function (c, i) {
      var s = b[c.id]; if (s != null) tot += s;
      h += '<button class="item" data-i="' + i + '"><b>' + (i + 1) + ". " + c.title + "</b><small>" + (s != null ? "Best: " + s + " / 5" : "Not tried yet") + "</small></button>";
    });
    h += '<p class="note">Total best: ' + tot + " / " + CLIPS.length * 5 + "</p>";
    scr.innerHTML = h; show("hazard");
    document.getElementById("hBack").onclick = showHome;
    scr.querySelectorAll("button[data-i]").forEach(function (x) { x.onclick = function () { play(+x.dataset.i); }; });
  }

  var raf = null;
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }

  function play(i) {
    stop();
    var clip = CLIPS[i], clicks = [], t0 = null, done = false;
    scr.innerHTML = '<div class="top"><button id="hBack" class="link">← Clips</button></div>' +
      '<div class="hrow"><b>' + clip.title + '</b><small id="hT"></small></div>' +
      '<canvas id="hCv" class="hc" width="' + W + '" height="' + H + '"></canvas>' +
      '<div class="htl" id="hTl"><i id="hFill" style="width:0"></i></div>' +
      '<button id="hFlag" class="hflag">🚩 HAZARD!</button><div id="hRes"></div>';
    document.getElementById("hBack").onclick = function () { stop(); list(); };
    var cv = document.getElementById("hCv"), ctx = cv.getContext("2d");
    var flag = document.getElementById("hFlag"), tl = document.getElementById("hTl"), fill = document.getElementById("hFill");

    function tap() {
      if (done || t0 === null) return;
      var t = (performance.now() - t0) / 1000; clicks.push(t);
      var m = document.createElement("b"); m.style.left = (t / clip.dur * 100) + "%"; tl.appendChild(m);
      flag.style.opacity = ".6"; setTimeout(function () { flag.style.opacity = "1"; }, 120);
    }
    flag.onclick = tap; cv.onpointerdown = tap;

    function finish() {
      done = true; stop();
      var sc = score(clip, clicks);
      var b = best(); if (b[clip.id] == null || sc > b[clip.id]) { b[clip.id] = sc; store(); }
      var u = document.createElement("u"); u.style.left = (clip.ws / clip.dur * 100) + "%"; u.style.width = ((clip.we - clip.ws) / clip.dur * 100) + "%"; tl.appendChild(u);
      flag.style.display = "none";
      var msg = sc === 0 ? (clicks.length >= 6 ? "Too many taps, so the score is 0. Tap only when you see a hazard." : "You did not tap during the hazard.") : sc >= 4 ? "Great, you spotted it early!" : "You spotted it, but a little late.";
      document.getElementById("hRes").innerHTML =
        '<div class="card"><h3>Score: ' + sc + " / 5</h3><p>" + msg + '</p><p>The green part of the bar shows when the hazard was developing. Red lines are your taps.</p><p><b>Why:</b> ' + clip.why + "</p></div>" +
        '<button id="hAgain" class="big">▶ Watch again</button>' + (i + 1 < CLIPS.length ? '<button id="hNext" class="big" style="background:var(--blue)">Next clip →</button>' : "") +
        '<button id="hList" class="item">All clips</button>';
      document.getElementById("hAgain").onclick = function () { play(i); };
      var nx = document.getElementById("hNext"); if (nx) nx.onclick = function () { play(i + 1); };
      document.getElementById("hList").onclick = list;
    }

    function frame(now) {
      if (t0 === null) t0 = now;
      var t = (performance.now() - t0) / 1000;
      if (t >= clip.dur) { draw(ctx, clip, clip.dur); fill.style.width = "100%"; return finish(); }
      draw(ctx, clip, t); fill.style.width = (t / clip.dur * 100) + "%";
      document.getElementById("hT").textContent = Math.max(0, Math.ceil(clip.dur - t)) + " s";
      raf = requestAnimationFrame(frame);
    }
    // first frame, then start on tap of Start
    draw(ctx, clip, 0);
    var st = document.createElement("button"); st.className = "big"; st.textContent = "▶ Start clip"; flag.style.display = "none";
    scr.appendChild(st);
    st.onclick = function () { st.remove(); flag.style.display = "block"; t0 = null; raf = requestAnimationFrame(function (n) { t0 = performance.now(); frame(n); }); };
  }

  function score(clip, clicks) {
    if (clicks.length >= 6) return 0;
    for (var k = 0; k < clicks.length; k++) {
      var c = clicks[k];
      if (c >= clip.ws && c <= clip.we) { var f = (c - clip.ws) / (clip.we - clip.ws); return Math.max(1, 5 - Math.floor(f * 5)); }
    }
    return 0;
  }

  function draw(ctx, clip, t) { window.HZ.draw(ctx, clip, t); }
})();
