// engine.js - self-drawn, semi-realistic driving scenes (first-person view from inside a car). No DVSA material.
(function () {
  var W = 640, H = 360, HOR0 = 165, F = 560, CAMH = 1.25, CAMX = -1.75, HOR = HOR0;
  var noisePat = null;

  function P(x, z, cz) { var d = z - cz; return { sx: W / 2 + (x - CAMX) * F / d, gy: HOR + CAMH * F / d, k: F / d }; }
  function hex(c) { c = c.replace("#", ""); if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]; return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)]; }
  function shade(c, f) { var r = hex(c).map(function (v) { return Math.max(0, Math.min(255, Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f)))); }); return "rgb(" + r[0] + "," + r[1] + "," + r[2] + ")"; }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function poly(ctx, fill, pts) { ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fill(); }
  function quad(ctx, col, x1, x2, z1, z2, cz) { var a = P(x1, z1, cz), b = P(x2, z1, cz), c = P(x2, z2, cz), d = P(x1, z2, cz); poly(ctx, col, [[a.sx, a.gy], [b.sx, b.gy], [c.sx, c.gy], [d.sx, d.gy]]); }
  // a wall facing the road: plane at x, from z1 to z2, heights y1..y2
  function wall(ctx, col, x, z1, z2, y1, y2, cz) {
    if (z2 - cz < 1.2) return; if (z1 - cz < 1.2) z1 = cz + 1.2;
    var a = P(x, z1, cz), b = P(x, z2, cz);
    poly(ctx, col, [[a.sx, a.gy - y1 * a.k], [b.sx, b.gy - y1 * b.k], [b.sx, b.gy - y2 * b.k], [a.sx, a.gy - y2 * a.k]]);
  }
  function vgrad(ctx, y0, y1, c0, c1) { var g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; }
  function shadow(ctx, p, w) { ctx.fillStyle = "rgba(0,0,0,.33)"; ctx.beginPath(); ctx.ellipse(p.sx, p.gy, w * 0.62 * p.k, Math.max(1, 0.13 * w * p.k * 0.6), 0, 0, 7); ctx.fill(); }
  // shaded block: front face of a box standing at (x,z), width w, height h, lifted y0
  function block(ctx, col, x, z, w, h, cz, y0) {
    var p = P(x, z, cz); if (p.k <= 0) return; y0 = y0 || 0;
    var top = p.gy - (h + y0) * p.k, bot = p.gy - y0 * p.k;
    ctx.fillStyle = vgrad(ctx, top, bot, shade(col, 0.18), shade(col, -0.25)); ctx.fillRect(p.sx - w * p.k / 2, top, w * p.k, h * p.k);
  }
  function blink(t) { return Math.floor(t * 2.5) % 2 === 0; }
  function glow(ctx, x, y, r, c) { var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }

  // ---------- vehicles ----------
  function car(ctx, col, x, z, cz, brake, ind, t, front) {
    var p = P(x, z, cz), k = p.k, gy = p.gy, sx = p.sx; if (k <= 0) return;
    shadow(ctx, p, 2.0);
    // wheels
    ctx.fillStyle = "#0c0c0c"; ctx.fillRect(sx - 0.82 * k, gy - 0.38 * k, 0.3 * k, 0.38 * k); ctx.fillRect(sx + 0.52 * k, gy - 0.38 * k, 0.3 * k, 0.38 * k);
    // body lower
    var g = vgrad(ctx, gy - 1.0 * k, gy - 0.2 * k, shade(col, 0.28), shade(col, -0.32));
    poly(ctx, g, [[sx - 0.9 * k, gy - 0.25 * k], [sx - 0.92 * k, gy - 0.78 * k], [sx - 0.84 * k, gy - 0.98 * k], [sx + 0.84 * k, gy - 0.98 * k], [sx + 0.92 * k, gy - 0.78 * k], [sx + 0.9 * k, gy - 0.25 * k]]);
    // bumper
    ctx.fillStyle = vgrad(ctx, gy - 0.4 * k, gy - 0.12 * k, shade(col, -0.25), shade("#000000", 0.1)); ctx.fillRect(sx - 0.88 * k, gy - 0.4 * k, 1.76 * k, 0.24 * k);
    // cabin
    poly(ctx, vgrad(ctx, gy - 1.5 * k, gy - 0.95 * k, shade(col, 0.35), shade(col, -0.05)), [[sx - 0.8 * k, gy - 0.97 * k], [sx - 0.62 * k, gy - 1.46 * k], [sx + 0.62 * k, gy - 1.46 * k], [sx + 0.8 * k, gy - 0.97 * k]]);
    // glass
    var gg = vgrad(ctx, gy - 1.42 * k, gy - 1.02 * k, "#6e8aa6", "#1b242e");
    poly(ctx, gg, [[sx - 0.68 * k, gy - 1.02 * k], [sx - 0.54 * k, gy - 1.4 * k], [sx + 0.54 * k, gy - 1.4 * k], [sx + 0.68 * k, gy - 1.02 * k]]);
    if (front) {
      ctx.fillStyle = "#121212"; ctx.fillRect(sx - 0.5 * k, gy - 0.62 * k, 1.0 * k, 0.22 * k);
      [-1, 1].forEach(function (s) { ctx.fillStyle = "#fffbe6"; ctx.fillRect(sx + (s < 0 ? -0.86 : 0.5) * k, gy - 0.78 * k, 0.36 * k, 0.18 * k); });
    } else {
      [-1, 1].forEach(function (s) {
        var lx = sx + (s < 0 ? -0.9 : 0.54) * k, ly = gy - 0.8 * k;
        ctx.fillStyle = brake ? "#ff2a2a" : "#8b1a1a"; ctx.fillRect(lx, ly, 0.36 * k, 0.17 * k);
        if (brake) glow(ctx, lx + 0.18 * k, ly + 0.08 * k, 0.55 * k, "rgba(255,40,40,.55)");
      });
      if (ind && blink(t)) { ctx.fillStyle = "#ffa500"; ctx.fillRect(sx + (ind === "l" ? -0.9 : 0.62) * k, gy - 0.6 * k, 0.28 * k, 0.12 * k); }
      ctx.fillStyle = "#f2dd4a"; ctx.fillRect(sx - 0.26 * k, gy - 0.58 * k, 0.52 * k, 0.13 * k);
      if (k > 38) { ctx.fillStyle = "#222"; ctx.font = Math.round(0.1 * k) + "px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("AB21 XYZ", sx, gy - 0.515 * k); }
    }
  }
  function person(ctx, col, x, z, cz, h, cane, t, moving) {
    var p = P(x, z, cz), k = p.k * h / 1.75, sx = p.sx, gy = p.gy; if (p.k <= 0) return;
    shadow(ctx, p, 0.9 * h / 1.75);
    var ph = moving ? Math.sin(t * 7 + x * 3) : 0, sw = 0.12 * ph;
    ctx.fillStyle = "#2a2f3a"; ctx.fillRect(sx - 0.17 * k + sw * k, gy - 0.9 * k, 0.15 * k, 0.9 * k); ctx.fillRect(sx + 0.02 * k - sw * k, gy - 0.9 * k, 0.15 * k, 0.9 * k);
    ctx.fillStyle = "#111"; ctx.fillRect(sx - 0.18 * k + sw * k, gy - 0.05 * k, 0.18 * k, 0.05 * k); ctx.fillRect(sx + 0.02 * k - sw * k, gy - 0.05 * k, 0.18 * k, 0.05 * k);
    ctx.fillStyle = vgrad(ctx, gy - 1.5 * k, gy - 0.85 * k, shade(col, 0.25), shade(col, -0.3)); ctx.fillRect(sx - 0.24 * k, gy - 1.5 * k, 0.48 * k, 0.68 * k);
    ctx.fillStyle = shade(col, -0.2); ctx.fillRect(sx - 0.32 * k, gy - 1.46 * k, 0.1 * k, 0.55 * k + sw * k * 2); ctx.fillRect(sx + 0.22 * k, gy - 1.46 * k, 0.1 * k, 0.55 * k - sw * k * 2);
    ctx.fillStyle = "#d9a37c"; ctx.beginPath(); ctx.arc(sx, gy - 1.62 * k, 0.12 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#2a1c12"; ctx.beginPath(); ctx.arc(sx, gy - 1.66 * k, 0.12 * k, Math.PI, 0); ctx.fill();
    if (cane) { ctx.strokeStyle = "#f5f5f5"; ctx.lineWidth = Math.max(1.5, 0.035 * k); ctx.beginPath(); ctx.moveTo(sx + 0.3 * k, gy - 0.8 * k); ctx.lineTo(sx + 0.7 * k, gy); ctx.stroke(); ctx.strokeStyle = "#d33"; ctx.beginPath(); ctx.moveTo(sx + 0.55 * k, gy - 0.25 * k); ctx.lineTo(sx + 0.7 * k, gy); ctx.stroke(); }
  }
  function windowsRow(ctx, sx, gy, k, x0, x1, y0, y1) {
    var g = vgrad(ctx, gy - y1 * k, gy - y0 * k, "#8fb0cc", "#33424f"); ctx.fillStyle = g; ctx.fillRect(sx + x0 * k, gy - y1 * k, (x1 - x0) * k, (y1 - y0) * k);
  }
  function bus(ctx, x, z, cz, ind, t) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return;
    shadow(ctx, p, 3.2);
    ctx.fillStyle = vgrad(ctx, gy - 3.2 * k, gy, "#e04a45", "#8d1b1b"); ctx.fillRect(sx - 1.25 * k, gy - 3.2 * k, 2.5 * k, 3.2 * k);
    windowsRow(ctx, sx, gy, k, -1.1, 1.1, 2.0, 2.9); windowsRow(ctx, sx, gy, k, -1.1, 1.1, 1.1, 1.8);
    ctx.fillStyle = "#cfcfcf"; ctx.fillRect(sx - 1.25 * k, gy - 0.9 * k, 2.5 * k, 0.12 * k);
    ctx.fillStyle = "#111"; ctx.fillRect(sx - 1.2 * k, gy - 0.5 * k, 0.45 * k, 0.5 * k); ctx.fillRect(sx + 0.75 * k, gy - 0.5 * k, 0.45 * k, 0.5 * k);
    ctx.fillStyle = "#b11"; ctx.fillRect(sx - 1.15 * k, gy - 0.8 * k, 0.25 * k, 0.15 * k); ctx.fillRect(sx + 0.9 * k, gy - 0.8 * k, 0.25 * k, 0.15 * k);
    ctx.fillStyle = "#f2dd4a"; ctx.fillRect(sx - 0.25 * k, gy - 0.62 * k, 0.5 * k, 0.13 * k);
    if (ind && blink(t)) { ctx.fillStyle = "#ffa500"; ctx.fillRect(sx + 0.95 * k, gy - 1.0 * k, 0.28 * k, 0.16 * k); glow(ctx, sx + 1.1 * k, gy - 0.92 * k, 0.5 * k, "rgba(255,165,0,.5)"); }
  }
  function lorry(ctx, x, z, cz, ind, t) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return;
    shadow(ctx, p, 3.2);
    ctx.fillStyle = vgrad(ctx, gy - 3.6 * k, gy - 0.6 * k, "#f3f4f6", "#b4b8be"); ctx.fillRect(sx - 1.25 * k, gy - 3.6 * k, 2.5 * k, 3.0 * k);
    ctx.fillStyle = "#6b7280"; ctx.fillRect(sx - 1.25 * k, gy - 3.6 * k, 2.5 * k, 0.1 * k); ctx.fillRect(sx - 0.02 * k, gy - 3.5 * k, 0.04 * k, 2.9 * k);
    ctx.fillStyle = "#3a3d44"; ctx.fillRect(sx - 1.2 * k, gy - 0.6 * k, 2.4 * k, 0.35 * k);
    ctx.fillStyle = "#c21"; ctx.fillRect(sx - 1.2 * k, gy - 0.95 * k, 0.28 * k, 0.2 * k); ctx.fillRect(sx + 0.92 * k, gy - 0.95 * k, 0.28 * k, 0.2 * k);
    ctx.fillStyle = "#f2dd4a"; ctx.fillRect(sx - 0.3 * k, gy - 0.5 * k, 0.6 * k, 0.15 * k);
    ctx.fillStyle = "#0c0c0c"; ctx.fillRect(sx - 1.15 * k, gy - 0.5 * k, 0.45 * k, 0.5 * k); ctx.fillRect(sx + 0.7 * k, gy - 0.5 * k, 0.45 * k, 0.5 * k);
    if (ind && blink(t)) { ctx.fillStyle = "#ffa500"; ctx.fillRect(sx - 1.25 * k, gy - 1.2 * k, 0.3 * k, 0.22 * k); glow(ctx, sx - 1.1 * k, gy - 1.1 * k, 0.55 * k, "rgba(255,165,0,.5)"); }
  }
  function tractor(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return;
    shadow(ctx, p, 2.2);
    ctx.fillStyle = "#0c0c0c"; ctx.fillRect(sx - 1.1 * k, gy - 1.5 * k, 0.5 * k, 1.5 * k); ctx.fillRect(sx + 0.6 * k, gy - 1.5 * k, 0.5 * k, 1.5 * k);
    ctx.fillStyle = vgrad(ctx, gy - 2.6 * k, gy - 0.5 * k, "#2f9e4f", "#14532d"); ctx.fillRect(sx - 0.7 * k, gy - 2.6 * k, 1.4 * k, 2.1 * k);
    ctx.fillStyle = vgrad(ctx, gy - 2.4 * k, gy - 1.5 * k, "#9fbbd3", "#344452"); ctx.fillRect(sx - 0.55 * k, gy - 2.4 * k, 1.1 * k, 0.9 * k);
    ctx.fillStyle = "#ffa500"; if (blink(2)) ctx.fillRect(sx - 0.2 * k, gy - 2.75 * k, 0.4 * k, 0.12 * k);
  }
  function bike(ctx, x, z, cz, t) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return; shadow(ctx, p, 0.8);
    ctx.strokeStyle = "#111"; ctx.lineWidth = Math.max(1, 0.06 * k); ctx.beginPath(); ctx.arc(sx, gy - 0.36 * k, 0.36 * k, 0, 7); ctx.stroke();
    ctx.strokeStyle = "#555"; ctx.lineWidth = Math.max(1, 0.03 * k); ctx.beginPath(); ctx.moveTo(sx, gy - 0.36 * k); ctx.lineTo(sx, gy - 0.95 * k); ctx.stroke();
    var sw = 0.08 * Math.sin(t * 8);
    ctx.fillStyle = "#2a2f3a"; ctx.fillRect(sx - 0.17 * k + sw * k, gy - 0.95 * k, 0.12 * k, 0.5 * k); ctx.fillRect(sx + 0.05 * k - sw * k, gy - 0.95 * k, 0.12 * k, 0.5 * k);
    ctx.fillStyle = vgrad(ctx, gy - 1.6 * k, gy - 0.9 * k, "#fcd34d", "#d97706"); ctx.fillRect(sx - 0.22 * k, gy - 1.6 * k, 0.44 * k, 0.72 * k);
    ctx.fillStyle = "#d9a37c"; ctx.beginPath(); ctx.arc(sx, gy - 1.72 * k, 0.12 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#1d4ed8"; ctx.beginPath(); ctx.arc(sx, gy - 1.74 * k, 0.14 * k, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#e11"; ctx.fillRect(sx - 0.04 * k, gy - 0.5 * k, 0.08 * k, 0.1 * k);
  }
  function moto(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return; shadow(ctx, p, 0.8);
    ctx.fillStyle = "#0c0c0c"; ctx.fillRect(sx - 0.07 * k, gy - 0.7 * k, 0.14 * k, 0.7 * k);
    ctx.fillStyle = vgrad(ctx, gy - 1.5 * k, gy - 0.7 * k, "#4b5563", "#1f2937"); ctx.fillRect(sx - 0.26 * k, gy - 1.45 * k, 0.52 * k, 0.75 * k);
    ctx.fillStyle = "#c21"; ctx.fillRect(sx - 0.2 * k, gy - 0.95 * k, 0.4 * k, 0.1 * k);
    ctx.fillStyle = "#1a1a1a"; ctx.beginPath(); ctx.arc(sx, gy - 1.62 * k, 0.17 * k, 0, 7); ctx.fill(); ctx.fillStyle = "#6b7280"; ctx.fillRect(sx - 0.1 * k, gy - 1.65 * k, 0.2 * k, 0.06 * k);
  }
  function dog(ctx, x, z, cz, t) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return; shadow(ctx, p, 0.8);
    var sw = Math.sin(t * 14) * 0.08;
    ctx.fillStyle = "#6b3f1d"; ctx.fillRect(sx - 0.34 * k, gy - 0.55 * k, 0.68 * k, 0.32 * k);
    ctx.fillRect(sx - 0.3 * k + sw * k, gy - 0.25 * k, 0.08 * k, 0.25 * k); ctx.fillRect(sx + 0.22 * k - sw * k, gy - 0.25 * k, 0.08 * k, 0.25 * k);
    ctx.beginPath(); ctx.arc(sx + 0.38 * k, gy - 0.6 * k, 0.13 * k, 0, 7); ctx.fill(); ctx.fillRect(sx - 0.42 * k, gy - 0.55 * k, 0.1 * k, 0.05 * k);
  }
  function horse(ctx, x, z, cz, t) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return; shadow(ctx, p, 1.0);
    ctx.fillStyle = vgrad(ctx, gy - 1.5 * k, gy - 0.8 * k, "#9a5a2a", "#5a3318"); ctx.fillRect(sx - 0.36 * k, gy - 1.5 * k, 0.72 * k, 0.8 * k);
    ctx.fillStyle = "#4a2a14"; ctx.fillRect(sx - 0.3 * k, gy - 0.8 * k, 0.12 * k, 0.8 * k); ctx.fillRect(sx + 0.18 * k, gy - 0.8 * k, 0.12 * k, 0.8 * k);
    ctx.fillRect(sx - 0.12 * k, gy - 1.95 * k, 0.24 * k, 0.55 * k);
    ctx.fillStyle = vgrad(ctx, gy - 2.3 * k, gy - 1.5 * k, "#e04a45", "#8d1b1b"); ctx.fillRect(sx - 0.18 * k, gy - 2.3 * k, 0.36 * k, 0.75 * k);
    ctx.fillStyle = "#d9a37c"; ctx.beginPath(); ctx.arc(sx, gy - 2.45 * k, 0.12 * k, 0, 7); ctx.fill(); ctx.fillStyle = "#1e3a8a"; ctx.beginPath(); ctx.arc(sx, gy - 2.47 * k, 0.14 * k, Math.PI, 0); ctx.fill();
  }
  function cone(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return; shadow(ctx, p, 0.5);
    poly(ctx, vgrad(ctx, p.gy - 0.75 * k, p.gy, "#ff9a3c", "#e0580c"), [[p.sx - 0.19 * k, p.gy], [p.sx + 0.19 * k, p.gy], [p.sx + 0.05 * k, p.gy - 0.75 * k], [p.sx - 0.05 * k, p.gy - 0.75 * k]]);
    ctx.fillStyle = "#f5f5f5"; ctx.fillRect(p.sx - 0.11 * k, p.gy - 0.45 * k, 0.22 * k, 0.1 * k);
    ctx.fillStyle = "#222"; ctx.fillRect(p.sx - 0.22 * k, p.gy - 0.03 * k, 0.44 * k, 0.03 * k);
  }
  function tlight(ctx, x, z, cz, st) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return;
    ctx.fillStyle = "#2b2b2b"; ctx.fillRect(sx - 0.05 * k, gy - 3.4 * k, 0.1 * k, 3.4 * k);
    ctx.fillStyle = "#151515"; ctx.fillRect(sx - 0.21 * k, gy - 4.35 * k, 0.42 * k, 1.05 * k);
    var cols = { r: "#ff2a2a", a: "#ffb300", g: "#22d35a" };
    [["r", 4.2], ["a", 3.85], ["g", 3.5]].forEach(function (c) { var on = st === c[0]; ctx.fillStyle = on ? cols[c[0]] : "#2d2d2d"; ctx.beginPath(); ctx.arc(sx, gy - c[1] * k, 0.09 * k, 0, 7); ctx.fill(); if (on) glow(ctx, sx, gy - c[1] * k, 0.5 * k, c[0] === "r" ? "rgba(255,40,40,.55)" : c[0] === "a" ? "rgba(255,180,0,.5)" : "rgba(40,255,100,.5)"); });
  }
  function barrier(ctx, x, z, cz, down, t) {
    var a = P(x, z, cz), b = P(x + (x < 0 ? 3.4 : -3.4), z, cz); if (a.k <= 0) return;
    ctx.fillStyle = vgrad(ctx, a.gy - 1.8 * a.k, a.gy, "#f5f5f5", "#9ca3af"); ctx.fillRect(a.sx - 0.1 * a.k, a.gy - 1.8 * a.k, 0.2 * a.k, 1.8 * a.k);
    if (down > 0.02) {
      var y1 = a.gy - 1.8 * a.k * (1 - down) - 0.95 * a.k * down, ex = a.sx + (b.sx - a.sx) * down;
      ctx.strokeStyle = "#dc2626"; ctx.lineWidth = Math.max(2, 0.14 * a.k); ctx.beginPath(); ctx.moveTo(a.sx, a.gy - 1.5 * a.k); ctx.lineTo(ex, y1); ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.setLineDash([a.k * 0.4, a.k * 0.4]); ctx.stroke(); ctx.setLineDash([]);
    }
    var on = Math.floor(t * 2) % 2 === (x < 0 ? 0 : 1); ctx.fillStyle = on ? "#ff2a2a" : "#4a1010"; ctx.beginPath(); ctx.arc(a.sx, a.gy - 2.1 * a.k, 0.17 * a.k, 0, 7); ctx.fill(); if (on) glow(ctx, a.sx, a.gy - 2.1 * a.k, 0.7 * a.k, "rgba(255,40,40,.5)");
  }
  function patrol(ctx, x, z, cz, t) {
    person(ctx, "#facc15", x, z, cz, 1.75, false, t, false);
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#555"; ctx.fillRect(p.sx + 0.3 * k, p.gy - 2.45 * k, 0.06 * k, 1.7 * k);
    ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(p.sx + 0.33 * k, p.gy - 2.65 * k, 0.33 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.fillRect(p.sx + 0.12 * k, p.gy - 2.7 * k, 0.42 * k, 0.1 * k);
  }
  function ambu(ctx, x, z, cz, t) {
    var p = P(x, z, cz), k = p.k, sx = p.sx, gy = p.gy; if (k <= 0) return; shadow(ctx, p, 2.6);
    ctx.fillStyle = vgrad(ctx, gy - 2.4 * k, gy, "#ffffff", "#c8ccd2"); ctx.fillRect(sx - 1.05 * k, gy - 2.4 * k, 2.1 * k, 2.4 * k);
    ctx.fillStyle = "#d4e800"; ctx.fillRect(sx - 1.05 * k, gy - 1.3 * k, 2.1 * k, 0.2 * k); ctx.fillStyle = "#1ba84a"; ctx.fillRect(sx - 1.05 * k, gy - 1.08 * k, 2.1 * k, 0.12 * k);
    ctx.fillStyle = vgrad(ctx, gy - 2.2 * k, gy - 1.5 * k, "#8aa9c4", "#2e3e4c"); ctx.fillRect(sx - 0.7 * k, gy - 2.2 * k, 1.4 * k, 0.62 * k);
    var on = Math.floor(t * 4) % 2 === 0;
    ctx.fillStyle = on ? "#4c8dff" : "#1e3a8a"; ctx.fillRect(sx - 0.85 * k, gy - 2.55 * k, 0.55 * k, 0.15 * k); ctx.fillStyle = on ? "#1e3a8a" : "#4c8dff"; ctx.fillRect(sx + 0.3 * k, gy - 2.55 * k, 0.55 * k, 0.15 * k);
    glow(ctx, on ? sx - 0.57 * k : sx + 0.57 * k, gy - 2.48 * k, 1.5 * k, "rgba(70,130,255,.6)");
    ctx.fillStyle = "#0c0c0c"; ctx.fillRect(sx - 0.95 * k, gy - 0.4 * k, 0.4 * k, 0.4 * k); ctx.fillRect(sx + 0.55 * k, gy - 0.4 * k, 0.4 * k, 0.4 * k);
  }
  function sign20(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#8b8f95"; ctx.fillRect(p.sx - 0.04 * k, p.gy - 2.7 * k, 0.08 * k, 2.7 * k);
    ctx.fillStyle = "#d4151b"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 3.0 * k, 0.5 * k, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 3.0 * k, 0.38 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#111"; ctx.font = "bold " + Math.max(8, Math.round(0.42 * k)) + "px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("20", p.sx, p.gy - 3.0 * k);
  }
  function beacon(ctx, x, z, cz, t) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    for (var i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? "#111" : "#f4f4f4"; ctx.fillRect(p.sx - 0.05 * k, p.gy - (i + 1) * 0.4 * k, 0.1 * k, 0.4 * k); }
    var on = blink(t); ctx.fillStyle = on ? "#ffa500" : "#9a5a05"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 2.6 * k, 0.17 * k, 0, 7); ctx.fill(); if (on) glow(ctx, p.sx, p.gy - 2.6 * k, 0.6 * k, "rgba(255,165,0,.5)");
  }

  // ---------- scenery ----------
  var BRICK = ["#9c4a32", "#b0623f", "#a8553a", "#8a3f2c"], RENDER = ["#d8cdb5", "#cbd5d8", "#e0d3b8", "#bfc9b6"], ROOF = ["#4a4f58", "#5a4a44", "#3f444c"], DOORS = ["#264d3a", "#7a1f1f", "#1f3b6b", "#2d2d2d"];
  function house(ctx, side, k0, cz) {
    var x = side * 9, z1 = k0 * 8, z2 = z1 + 8, r = hash(k0 * 2 + (side > 0 ? 1 : 0));
    var col = r < 0.5 ? BRICK[Math.floor(r * 8) % 4] : RENDER[Math.floor(r * 8) % 4], H2 = 6.2 + hash(k0 + 9) * 0.6;
    if (z2 - cz < 1.5) return;
    wall(ctx, col, x, z1, z2, 0, H2, cz);
    wall(ctx, shade(col, -0.25), x, z1, z2, 0, 0.35, cz);                 // darker base
    wall(ctx, ROOF[k0 & 1 ? 1 : 0], x, z1, z2, H2, H2 + 0.7, cz);         // roof edge
    wall(ctx, shade(col, -0.35), x, z1, z2, H2 - 0.3, H2, cz);            // eaves shadow
    [1.3, 4.0].forEach(function (y) { [1.0, 5.4].forEach(function (u) {
      var a = P(x, z1 + u, cz); if (z1 + u - cz < 1.5) return;
      wall(ctx, "#f4f4f2", x, z1 + u - 0.07, z1 + u + 1.27, y - 0.07, y + 1.57, cz);
      wall(ctx, "#27323d", x, z1 + u, z1 + u + 1.2, y, y + 1.5, cz);
      wall(ctx, "rgba(150,190,225,.5)", x, z1 + u, z1 + u + 1.2, y + 0.75, y + 1.5, cz);
    }); });
    wall(ctx, DOORS[Math.floor(hash(k0 + 3) * 4)], x, z1 + 3.4, z1 + 4.4, 0, 2.15, cz);
    wall(ctx, shade(col, -0.45), x, z1 + 3.2, z1 + 4.6, 2.15, 2.3, cz);
    if (hash(k0 + 5) > 0.5) wall(ctx, shade(col, -0.35), x, z1 + 6.2, z1 + 7.0, H2 + 0.7, H2 + 1.9, cz);   // chimney
    // front garden wall / hedge
    var gx = side * 7.4, hedge = hash(k0 + 7) > 0.5;
    wall(ctx, hedge ? "#3f6b34" : "#a85f43", gx, z1, z1 + 3.2, 0, hedge ? 1.2 : 0.8, cz); wall(ctx, hedge ? "#3f6b34" : "#a85f43", gx, z1 + 4.6, z2, 0, hedge ? 1.2 : 0.8, cz);
  }
  function tree(ctx, x, z, cz, seed) {
    if (z - cz < 16) return; var p = P(x, z, cz), k = p.k; if (k <= 0 || p.sx < -300 || p.sx > W + 300) return;
    shadow(ctx, p, 2.5);
    ctx.fillStyle = vgrad(ctx, p.gy - 3 * k, p.gy, "#6b4a2b", "#3a2616"); ctx.fillRect(p.sx - 0.18 * k, p.gy - 3.2 * k, 0.36 * k, 3.2 * k);
    for (var i = 0; i < 7; i++) {
      var ox = (hash(seed + i) - 0.5) * 2.6, oy = 3.6 + hash(seed + i + 20) * 2.6, r = 1.1 + hash(seed + i + 40) * 0.7;
      var g = ctx.createRadialGradient(p.sx + ox * k - 0.3 * r * k, p.gy - oy * k - 0.3 * r * k, 0.1 * r * k, p.sx + ox * k, p.gy - oy * k, r * k);
      g.addColorStop(0, "#6aa84f"); g.addColorStop(1, "#2a5a26"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.sx + ox * k, p.gy - oy * k, r * k, 0, 7); ctx.fill();
    }
  }
  function lamp(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#4b5058"; ctx.fillRect(p.sx - 0.05 * k, p.gy - 6.5 * k, 0.1 * k, 6.5 * k); ctx.fillRect(p.sx - (x < 0 ? 0 : 0.9) * k, p.gy - 6.5 * k, 0.9 * k, 0.1 * k);
    ctx.fillStyle = "#e8e2c8"; ctx.fillRect(p.sx + (x < 0 ? 0.55 : -0.9) * k, p.gy - 6.45 * k, 0.35 * k, 0.12 * k);
  }

  function roadFill(ctx, env) {
    var g = vgrad(ctx, HOR, H, env.night ? "#1c1f26" : "#8a8e95", env.night ? "#0f1115" : "#2e3036");
    return g;
  }
  function getNoise() {
    if (noisePat) return noisePat;
    var c = document.createElement("canvas"); c.width = c.height = 128; var x = c.getContext("2d");
    for (var i = 0; i < 1400; i++) { var v = Math.floor(hash(i) * 255); x.fillStyle = "rgba(" + v + "," + v + "," + v + "," + (0.25 + hash(i + 5000) * 0.4) + ")"; x.fillRect(hash(i + 900) * 128, hash(i + 1700) * 128, 1 + hash(i + 33) * 1.5, 1 + hash(i + 77) * 1.5); }
    noisePat = c; return c;
  }

  function draw(ctx, clip, t) {
    var cz = clip.cam ? clip.cam(t) : clip.speed * t, env = clip.env || {}, night = env.night, fog = env.fog;
    HOR = HOR0 + Math.sin(t * 9) * 0.7 + Math.sin(t * 3.1) * 0.5;
    // sky
    var sky = ctx.createLinearGradient(0, 0, 0, HOR);
    if (night) { sky.addColorStop(0, "#050816"); sky.addColorStop(1, "#1a2038"); } else if (fog) { sky.addColorStop(0, "#c4cbd1"); sky.addColorStop(1, "#dfe3e6"); } else { sky.addColorStop(0, "#4b87cf"); sky.addColorStop(0.7, "#9cc6ea"); sky.addColorStop(1, "#d6e6f2"); }
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HOR + 2);
    if (!night) { ctx.fillStyle = fog ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.62)"; for (var ci = 0; ci < 6; ci++) { var cx = ((ci * 173 + 60 - cz * 0.4 * (1 + ci % 3)) % (W + 240) + W + 240) % (W + 240) - 120, cy = 25 + (ci * 41) % 80; ctx.beginPath(); ctx.ellipse(cx, cy, 70, 14, 0, 0, 7); ctx.ellipse(cx + 40, cy - 6, 45, 12, 0, 0, 7); ctx.ellipse(cx - 35, cy - 3, 40, 10, 0, 0, 7); ctx.fill(); } }
    // distant treeline
    ctx.fillStyle = night ? "#0a140c" : fog ? "#b9c2bb" : "#6f8f78"; ctx.beginPath(); ctx.moveTo(0, HOR + 2);
    for (var tx = 0; tx <= W; tx += 8) ctx.lineTo(tx, HOR - 6 - hash(Math.floor(tx / 8) + 400) * 12 - Math.sin(tx / 70) * 5); ctx.lineTo(W, HOR + 2); ctx.fill();
    // ground
    ctx.fillStyle = vgrad(ctx, HOR, H, night ? "#14261a" : "#7fa764", night ? "#0c180f" : "#4f7a3e"); ctx.fillRect(0, HOR, W, H - HOR);
    // pavements with kerb
    var pav = vgrad(ctx, HOR, H, night ? "#3a3a3c" : "#c9c5bb", night ? "#2a2a2c" : "#8f8b82");
    quad(ctx, pav, -7.4, -3.5, cz + 1.2, cz + 300, cz); quad(ctx, pav, 3.5, 7.4, cz + 1.2, cz + 300, cz);
    for (var zz = Math.floor(cz / 1.2) * 1.2; zz < cz + 45; zz += 1.2) { quad(ctx, "rgba(0,0,0,.13)", -7.4, -3.5, zz, zz + 0.05, cz); quad(ctx, "rgba(0,0,0,.13)", 3.5, 7.4, zz, zz + 0.05, cz); }
    quad(ctx, "#d9d6cf", -3.62, -3.45, cz + 1.2, cz + 300, cz); quad(ctx, "#d9d6cf", 3.45, 3.62, cz + 1.2, cz + 300, cz);
    quad(ctx, "rgba(0,0,0,.35)", -3.45, -3.38, cz + 1.2, cz + 300, cz); quad(ctx, "rgba(0,0,0,.35)", 3.38, 3.45, cz + 1.2, cz + 300, cz);
    // road
    var rg = roadFill(ctx, env), rf = env.wet ? vgrad(ctx, HOR, H, "#7d8691", "#20242b") : rg;
    quad(ctx, rf, -3.4, 3.4, cz + 1.2, cz + 300, cz);
    if (clip.side) quad(ctx, rf, 3.4, 9, clip.side.z - 4, clip.side.z + 5, cz);
    // tarmac texture (scrolls with speed)
    ctx.save(); ctx.beginPath(); var a1 = P(-3.4, cz + 1.2, cz), a2 = P(3.4, cz + 1.2, cz), a3 = P(3.4, cz + 300, cz), a4 = P(-3.4, cz + 300, cz);
    ctx.moveTo(a1.sx, a1.gy); ctx.lineTo(a2.sx, a2.gy); ctx.lineTo(a3.sx, a3.gy); ctx.lineTo(a4.sx, a4.gy); ctx.closePath(); ctx.clip();
    ctx.globalAlpha = night ? 0.1 : 0.22; ctx.translate(0, (cz * 38) % 128); ctx.fillStyle = ctx.createPattern(getNoise(), "repeat"); ctx.fillRect(0, -128, W, H + 256); ctx.restore();
    // worn centre strip and tyre tracks
    quad(ctx, "rgba(0,0,0,.10)", -2.6, -1.9, cz + 1.2, cz + 120, cz); quad(ctx, "rgba(0,0,0,.10)", -1.5, -0.9, cz + 1.2, cz + 120, cz);
    // markings
    quad(ctx, "rgba(245,245,245,.92)", -3.2, -3.1, cz + 1.2, cz + 300, cz);
    if (clip.center === "double") { quad(ctx, "#f3f3f3", -0.2, -0.1, cz + 1.2, cz + 300, cz); quad(ctx, "#f3f3f3", 0.1, 0.2, cz + 1.2, cz + 300, cz); }
    else for (var d = Math.floor(cz / 6) * 6; d < cz + 200; d += 6) quad(ctx, "rgba(245,245,245,.92)", -0.08, 0.08, Math.max(d, cz + 1.2), d + 3, cz);
    (clip.marks || []).forEach(function (m) {
      if (m.t === "zebra") for (var xx = -3.2; xx < 3.3; xx += 0.9) quad(ctx, "rgba(245,245,245,.95)", xx, xx + 0.5, m.z, m.z + 2.8, cz);
      if (m.t === "stop") quad(ctx, "rgba(245,245,245,.95)", -3.2, 0, m.z, m.z + 0.4, cz);
    });
    var list = [], kk, k0 = Math.floor(cz / 8) - 1;
    for (kk = k0; kk < k0 + 22; kk++) { (function (kk) { list.push({ z: kk * 8 + 8, f: function () { house(ctx, -1, kk, cz); house(ctx, 1, kk, cz); } }); })(kk); }
    for (kk = Math.floor(cz / 18); kk < Math.floor(cz / 18) + 10; kk++) { (function (kk) { list.push({ z: kk * 18 + 6, f: function () { tree(ctx, kk % 2 ? -4.9 : 4.9, kk * 18 + 6, cz, kk * 7); } }); })(kk); }
    for (kk = Math.floor(cz / 25); kk < Math.floor(cz / 25) + 8; kk++) { (function (kk) { list.push({ z: kk * 25 + 12, f: function () { lamp(ctx, kk % 2 ? -3.9 : 3.9, kk * 25 + 12, cz); } }); })(kk); }
    (clip.marks || []).forEach(function (m) { if (m.t === "zebra") list.push({ z: m.z, f: function () { beacon(ctx, -3.9, m.z, cz, t); beacon(ctx, 3.9, m.z, cz, t); } }); });
    (clip.parked || []).forEach(function (pk) { list.push({ z: pk.z, f: function () { car(ctx, pk.c, -2.6, pk.z, cz, false, null, t); if (pk.door) { var o = pk.door(t); if (o > 0) { var p = P(-1.7 + o * 0.45, pk.z, cz); ctx.fillStyle = vgrad(ctx, p.gy - 1.3 * p.k, p.gy - 0.3 * p.k, shade(pk.c, 0.3), shade(pk.c, -0.3)); ctx.fillRect(p.sx - 0.06 * p.k, p.gy - 1.3 * p.k, (0.1 + o * 0.9) * p.k, 1.0 * p.k); } } } }); });
    clip.objs.forEach(function (o) {
      var p = o.pos(t); if (!p) return;
      list.push({ z: p.z, f: function () {
        var p0 = o.pos(Math.max(0, t - 0.12)), mv = p0 && (Math.abs(p0.x - p.x) + Math.abs(p0.z - p.z) > 0.012);
        switch (o.t) {
          case "car": car(ctx, o.c, p.x, p.z, cz, o.brake && o.brake(t), null, t); break;
          case "ocar": car(ctx, o.c, p.x, p.z, cz, false, null, t, true); break;
          case "ped": person(ctx, o.c, p.x, p.z, cz, 1.75, o.cane, t, mv); break;
          case "kid": person(ctx, o.c || "#2563eb", p.x, p.z, cz, 1.1, false, t, mv || o.t === "kid"); break;
          case "ball": var pb = P(p.x, p.z, cz); if (pb.k > 0) { shadow(ctx, pb, 0.4); var bg = ctx.createRadialGradient(pb.sx - 0.06 * pb.k, pb.gy - 0.32 * pb.k, 0.02 * pb.k, pb.sx, pb.gy - 0.24 * pb.k, 0.24 * pb.k); bg.addColorStop(0, "#ffd0a0"); bg.addColorStop(1, "#d9480f"); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(pb.sx, pb.gy - 0.24 * pb.k, 0.24 * pb.k, 0, 7); ctx.fill(); } break;
          case "bus": bus(ctx, p.x, p.z, cz, o.ind && o.ind(t), t); break;
          case "bike": bike(ctx, p.x, p.z, cz, t); break;
          case "moto": moto(ctx, p.x, p.z, cz); break;
          case "lorry": lorry(ctx, p.x, p.z, cz, o.ind, t); break;
          case "tractor": tractor(ctx, p.x, p.z, cz); break;
          case "dog": dog(ctx, p.x, p.z, cz, t); break;
          case "horse": horse(ctx, p.x, p.z, cz, t); break;
          case "cone": cone(ctx, p.x, p.z, cz); break;
          case "tl": tlight(ctx, p.x, p.z, cz, o.st(t)); break;
          case "barrier": barrier(ctx, p.x, p.z, cz, o.down(t), t); break;
          case "patrol": patrol(ctx, p.x, p.z, cz, t); break;
          case "ambu": ambu(ctx, p.x, p.z, cz, t); break;
          case "sign20": sign20(ctx, p.x, p.z, cz); break;
        }
      } });
    });
    list.sort(function (a, b) { return b.z - a.z; });
    var maxd = fog ? 48 : 400;
    list.forEach(function (o) { var d = o.z - cz; if (d > 1.5 && d < maxd) { ctx.globalAlpha = Math.max(0.35, 1 - Math.max(0, d - 70) / 260); o.f(); ctx.globalAlpha = 1; } });
    // atmosphere
    var hz = ctx.createLinearGradient(0, HOR - 40, 0, HOR + 70); hz.addColorStop(0, "rgba(220,232,242,0)"); hz.addColorStop(0.45, night ? "rgba(40,50,80,.25)" : "rgba(225,235,244,.5)"); hz.addColorStop(1, "rgba(225,235,244,0)"); ctx.fillStyle = hz; ctx.fillRect(0, HOR - 40, W, 110);
    if (fog) { var g = ctx.createLinearGradient(0, HOR - 60, 0, HOR + 120); g.addColorStop(0, "rgba(218,223,227,.97)"); g.addColorStop(1, "rgba(218,223,227,.25)"); ctx.fillStyle = g; ctx.fillRect(0, HOR - 60, W, 190); ctx.fillStyle = "rgba(218,223,227,.38)"; ctx.fillRect(0, 0, W, H); }
    if (env.wet) { var wg = ctx.createLinearGradient(0, HOR, 0, H); wg.addColorStop(0, "rgba(200,220,240,.35)"); wg.addColorStop(1, "rgba(200,220,240,0)"); ctx.fillStyle = wg; ctx.fillRect(0, HOR, W, H - HOR); ctx.fillStyle = "rgba(60,70,85,.18)"; ctx.fillRect(0, 0, W, H); }
    if (env.rain) { ctx.strokeStyle = "rgba(225,235,255,.5)"; ctx.lineWidth = 1; for (var i = 0; i < 110; i++) { var rx = (i * 97 + t * 160 * (1 + (i % 3) * 0.2)) % (W + 40), ry = (i * 53 + t * 560) % H; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 5, ry + 15); ctx.stroke(); }
      for (var j = 0; j < 22; j++) { var dx = hash(j) * W, dy = (hash(j + 70) * H + t * 6 * (1 + hash(j) )) % H; glow(ctx, dx, dy, 5, "rgba(230,240,255,.45)"); } }
    if (night) {
      ctx.fillStyle = "rgba(0,0,24,.58)"; ctx.fillRect(0, 0, W, H);
      var beam = ctx.createLinearGradient(0, H, 0, HOR); beam.addColorStop(0, "rgba(255,245,205,.38)"); beam.addColorStop(1, "rgba(255,245,205,0)");
      ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(120, H); ctx.lineTo(W / 2 - 25, HOR + 4); ctx.lineTo(W / 2 + 25, HOR + 4); ctx.lineTo(520, H); ctx.fill();
      clip.objs.forEach(function (o) {
        if (o.t !== "ocar") return; var p = o.pos(t), q = P(p.x, p.z, cz); if (q.k <= 0) return;
        var r = Math.min(300, 1.4 * q.k + 14), y = q.gy - 0.7 * q.k;
        glow(ctx, q.sx - 0.7 * q.k, y, r, "rgba(255,255,238,.95)"); glow(ctx, q.sx + 0.7 * q.k, y, r, "rgba(255,255,238,.95)");
      });
    }
    // inside of the car
    ctx.fillStyle = vgrad(ctx, H - 62, H, "#2b2d33", "#0d0e10");
    ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, H - 20); ctx.quadraticCurveTo(160, H - 46, 320, H - 52); ctx.quadraticCurveTo(480, H - 46, W, H - 20); ctx.lineTo(W, H); ctx.fill();
    var bl = ctx.createLinearGradient(0, H - 52, 0, H - 30); bl.addColorStop(0, "rgba(180,200,225,.30)"); bl.addColorStop(1, "rgba(180,200,225,0)"); ctx.fillStyle = bl;
    ctx.beginPath(); ctx.moveTo(120, H - 38); ctx.quadraticCurveTo(320, H - 56, 520, H - 38); ctx.lineTo(500, H - 30); ctx.quadraticCurveTo(320, H - 46, 140, H - 30); ctx.fill();
    ctx.fillStyle = "#101114"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(54, 0); ctx.lineTo(14, H * 0.62); ctx.lineTo(0, H * 0.7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W - 54, 0); ctx.lineTo(W - 14, H * 0.62); ctx.lineTo(W, H * 0.7); ctx.fill();
    ctx.fillStyle = vgrad(ctx, 0, 12, "#0b0c0e", "rgba(11,12,14,0)"); ctx.fillRect(0, 0, W, 12);
    ctx.fillStyle = "#17181b"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(284, 0, 76, 24, [0, 0, 8, 8]) : ctx.rect(284, 0, 76, 24); ctx.fill();
    ctx.fillStyle = vgrad(ctx, 0, 20, "#8ea3b5", "#3f4c58"); ctx.fillRect(290, 0, 64, 17);
    var vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.32)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    if (!night && !fog) { ctx.fillStyle = "rgba(255,238,200,.05)"; ctx.fillRect(0, 0, W, H); }
  }
  window.HZ = { draw: draw, W: W, H: H };
})();
