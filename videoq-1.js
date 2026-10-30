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
  // ---- the same animation inside the mock test ----
  var mwrap = null, mshown = null, mraf = null;
  function mstop() { if (mraf) cancelAnimationFrame(mraf); mraf = null; }
  function mremove() { mstop(); if (mwrap && mwrap.parentNode) mwrap.parentNode.removeChild(mwrap); mwrap = null; mshown = null; }
  function mstart(clip, cv) {
    mstop(); var ctx = cv.getContext("2d"), t0 = performance.now();
    function frame() {
      if (!document.body.contains(cv) || (typeof cur !== "undefined" && cur !== "mock")) { mraf = null; return; }
      var t = (performance.now() - t0) / 1000;
      if (t >= clip.dur) { window.HZ.draw(ctx, clip, clip.dur); mraf = null; var rb = mwrap && mwrap.querySelector("button"); if (rb) rb.style.display = ""; return; }
      window.HZ.draw(ctx, clip, t); mraf = requestAnimationFrame(frame);
    }
    mraf = requestAnimationFrame(frame);
  }
  var origMock = window.renderMock;
  window.renderMock = function () {
    var r = origMock.apply(this, arguments);
    var q = (typeof mock !== "undefined" && mock && !mock.done) ? mock.qs[mock.i].q : null;
    if (!q || !q.scene || !window.SCENES || !window.SCENES[q.scene] || !window.HZ) { mremove(); return r; }
    var anchor = document.querySelector("#mock #questionText"); if (!anchor) return r;
    if (mwrap && mshown === q.id) { anchor.parentNode.insertBefore(mwrap, anchor); return r; }   // same question: keep the picture running
    mremove();
    var clip = window.SCENES[q.scene];
    mwrap = document.createElement("div"); mwrap.style.cssText = "margin:8px 0";
    mwrap.innerHTML = '<canvas width="640" height="360" style="display:block;width:100%;max-width:640px;border-radius:10px;background:#8ec5ff"></canvas><button type="button" class="pill" style="display:none;margin-top:6px">▶ Replay</button>';
    anchor.parentNode.insertBefore(mwrap, anchor);
    var cv = mwrap.querySelector("canvas");
    mwrap.querySelector("button").onclick = function () { this.style.display = "none"; mstart(clip, cv); };
    mshown = q.id; mstart(clip, cv);
    return r;
  };
  var oldShow = window.show;
  window.show = function (id) { if (id !== "practice") removeWrap(); if (id !== "mock") mremove(); return oldShow.apply(this, arguments); };
})();
