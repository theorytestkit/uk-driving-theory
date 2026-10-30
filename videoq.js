// videoq.js - shows the animated scene above a "Video clips" question (questions that have a `scene` field).
(function () {
  var wrap = null, raf = null, shownId = null, t0 = 0, played = false;
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
  function removeWrap() { stop(); if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap); wrap = null; shownId = null; }
  function start(clip, cv) {
    stop(); var ctx = cv.getContext("2d"); t0 = performance.now(); played = false;
    function frame() {
      if (!document.body.contains(cv) || (typeof cur !== "undefined" && cur !== "practice")) { raf = null; return; }
      var t = (performance.now() - t0) / 1000;
      if (t >= clip.dur) { window.HZ.draw(ctx, clip, clip.dur); played = true; raf = null; var rb = wrap && wrap.querySelector("button"); if (rb) rb.style.display = ""; return; }
      window.HZ.draw(ctx, clip, t); raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }
  var orig = window.renderPractice;
  window.renderPractice = function () {
    var r = orig.apply(this, arguments);
    var q = (typeof set !== "undefined" && typeof index !== "undefined" && !finished) ? set[index] : null;
    if (!q || !q.scene || !window.SCENES || !window.SCENES[q.scene] || !window.HZ) { removeWrap(); return r; }
    if (wrap && shownId === q.id) return r;           // same question (e.g. after answering): keep the picture
    removeWrap();
    var clip = window.SCENES[q.scene];
    wrap = document.createElement("div");
    wrap.style.cssText = "margin:8px 0";
    wrap.innerHTML = '<canvas width="640" height="360" style="display:block;width:100%;max-width:640px;border-radius:10px;background:#8ec5ff"></canvas>' +
      '<button type="button" class="pill" style="display:none;margin-top:6px">▶ Replay</button>';
    var anchor = document.getElementById("signBox");
    anchor.parentNode.insertBefore(wrap, anchor);
    var cv = wrap.querySelector("canvas");
    wrap.querySelector("button").onclick = function () { this.style.display = "none"; start(clip, cv); };
    shownId = q.id;
    start(clip, cv);
    return r;
  };
  var oldShow = window.show;
  window.show = function (id) { if (id !== "practice") removeWrap(); return oldShow.apply(this, arguments); };
})();
