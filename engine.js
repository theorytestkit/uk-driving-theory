// engine.js - tiny self-drawn driving scenes (first-person view). Used by hazard.js and videoq.js. No DVSA material.
(function () {
  var W = 640, H = 360, HOR = 165, F = 560, CAMH = 1.25, CAMX = -1.75;
  function P(x, z, cz) { var d = z - cz; return { sx: W / 2 + (x - CAMX) * F / d, gy: HOR + CAMH * F / d, k: F / d }; }
  function quad(ctx, col, x1, x2, z1, z2, cz) {
    var a = P(x1, z1, cz), b = P(x2, z1, cz), c = P(x2, z2, cz), d = P(x1, z2, cz);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(a.sx, a.gy); ctx.lineTo(b.sx, b.gy); ctx.lineTo(c.sx, c.gy); ctx.lineTo(d.sx, d.gy); ctx.closePath(); ctx.fill();
  }
  function box(ctx, col, x, z, w, h, cz, y0) {
    var p = P(x, z, cz); if (p.k <= 0) return; y0 = y0 || 0;
    ctx.fillStyle = col; ctx.fillRect(p.sx - w * p.k / 2, p.gy - (h + y0) * p.k, w * p.k, h * p.k);
  }
  function circ(ctx, col, x, z, y, r, cz) {
    var p = P(x, z, cz); if (p.k <= 0) return;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.sx, p.gy - y * p.k, r * p.k, 0, 7); ctx.fill();
  }
  function wheels(ctx, p, w) { var k = p.k; ctx.fillStyle = "#111"; ctx.fillRect(p.sx - (w / 2) * k, p.gy - 0.3 * k, 0.3 * k, 0.3 * k); ctx.fillRect(p.sx + (w / 2 - 0.3) * k, p.gy - 0.3 * k, 0.3 * k, 0.3 * k); }
  function blink(t) { return Math.floor(t * 2.5) % 2 === 0; }

  function car(ctx, col, x, z, cz, brake, ind, t, front) {
    var p = P(x, z, cz), k = p.k, gy = p.gy; if (k <= 0) return;
    ctx.fillStyle = col; ctx.fillRect(p.sx - 0.9 * k, gy - 0.95 * k, 1.8 * k, 0.95 * k);
    ctx.fillStyle = "#9bb7d4"; ctx.fillRect(p.sx - 0.6 * k, gy - 1.5 * k, 1.2 * k, 0.55 * k);
    ctx.fillStyle = col; ctx.fillRect(p.sx - 0.7 * k, gy - 1.55 * k, 1.4 * k, 0.08 * k);
    if (front) {
      ctx.fillStyle = "#fffbe0"; ctx.fillRect(p.sx - 0.85 * k, gy - 0.8 * k, 0.32 * k, 0.2 * k); ctx.fillRect(p.sx + 0.53 * k, gy - 0.8 * k, 0.32 * k, 0.2 * k);
    } else {
      ctx.fillStyle = brake ? "#ff2a2a" : "#7a1515"; ctx.fillRect(p.sx - 0.85 * k, gy - 0.8 * k, 0.28 * k, 0.16 * k); ctx.fillRect(p.sx + 0.57 * k, gy - 0.8 * k, 0.28 * k, 0.16 * k);
      if (brake) { ctx.fillStyle = "rgba(255,40,40,.35)"; ctx.beginPath(); ctx.arc(p.sx - 0.71 * k, gy - 0.72 * k, 0.4 * k, 0, 7); ctx.arc(p.sx + 0.71 * k, gy - 0.72 * k, 0.4 * k, 0, 7); ctx.fill(); }
    }
    if (ind && blink(t)) { ctx.fillStyle = "#ffa500"; var ix = ind === "l" ? -0.9 : 0.62; ctx.fillRect(p.sx + ix * k, gy - 0.6 * k, 0.28 * k, 0.16 * k); }
    wheels(ctx, p, 1.7);
  }
  function person(ctx, col, x, z, cz, h, cane) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#333"; ctx.fillRect(p.sx - 0.12 * h * k, p.gy - 0.45 * h * k, 0.24 * h * k, 0.45 * h * k);
    ctx.fillStyle = col; ctx.fillRect(p.sx - 0.17 * h * k, p.gy - 0.82 * h * k, 0.34 * h * k, 0.4 * h * k);
    ctx.fillStyle = "#e0ac82"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 0.9 * h * k, 0.09 * h * k, 0, 7); ctx.fill();
    if (cane) { ctx.strokeStyle = "#fff"; ctx.lineWidth = Math.max(1.5, 0.04 * k); ctx.beginPath(); ctx.moveTo(p.sx + 0.2 * h * k, p.gy - 0.5 * h * k); ctx.lineTo(p.sx + 0.6 * h * k, p.gy); ctx.stroke(); ctx.strokeStyle = "#d33"; ctx.beginPath(); ctx.moveTo(p.sx + 0.45 * h * k, p.gy - 0.2 * h * k); ctx.lineTo(p.sx + 0.6 * h * k, p.gy); ctx.stroke(); }
  }
  function bus(ctx, x, z, cz, ind, t) {
    box(ctx, "#c62828", x, z, 2.5, 3.1, cz);
    var p = P(x, z, cz), k = p.k;
    ctx.fillStyle = "#cfe3f5"; ctx.fillRect(p.sx - 1.1 * k, p.gy - 2.7 * k, 2.2 * k, 0.9 * k); ctx.fillRect(p.sx - 1.1 * k, p.gy - 1.5 * k, 2.2 * k, 0.8 * k);
    ctx.fillStyle = "#111"; ctx.fillRect(p.sx - 1.1 * k, p.gy - 0.35 * k, 0.4 * k, 0.35 * k); ctx.fillRect(p.sx + 0.7 * k, p.gy - 0.35 * k, 0.4 * k, 0.35 * k);
    if (ind && blink(t)) { ctx.fillStyle = "#ffa500"; ctx.fillRect(p.sx + 0.95 * k, p.gy - 0.9 * k, 0.3 * k, 0.2 * k); }
  }
  function lorry(ctx, x, z, cz, ind, t) {
    box(ctx, "#e5e7eb", x, z, 2.5, 3.6, cz);
    var p = P(x, z, cz), k = p.k;
    ctx.fillStyle = "#9ca3af"; ctx.fillRect(p.sx - 1.25 * k, p.gy - 3.6 * k, 2.5 * k, 0.12 * k);
    ctx.fillStyle = "#b91c1c"; ctx.fillRect(p.sx - 1.2 * k, p.gy - 0.8 * k, 0.3 * k, 0.18 * k); ctx.fillRect(p.sx + 0.9 * k, p.gy - 0.8 * k, 0.3 * k, 0.18 * k);
    if (ind && blink(t)) { ctx.fillStyle = "#ffa500"; ctx.fillRect(p.sx - 1.25 * k, p.gy - 1.1 * k, 0.3 * k, 0.22 * k); }
    ctx.fillStyle = "#111"; ctx.fillRect(p.sx - 1.15 * k, p.gy - 0.45 * k, 0.5 * k, 0.45 * k); ctx.fillRect(p.sx + 0.65 * k, p.gy - 0.45 * k, 0.5 * k, 0.45 * k);
  }
  function tractor(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#15803d"; ctx.fillRect(p.sx - 0.7 * k, p.gy - 2.5 * k, 1.4 * k, 1.5 * k);
    ctx.fillStyle = "#9bb7d4"; ctx.fillRect(p.sx - 0.55 * k, p.gy - 2.35 * k, 1.1 * k, 0.9 * k);
    ctx.fillStyle = "#15803d"; ctx.fillRect(p.sx - 0.5 * k, p.gy - 1.1 * k, 1.0 * k, 0.6 * k);
    ctx.fillStyle = "#111"; ctx.fillRect(p.sx - 1.1 * k, p.gy - 1.5 * k, 0.5 * k, 1.5 * k); ctx.fillRect(p.sx + 0.6 * k, p.gy - 1.5 * k, 0.5 * k, 1.5 * k);
  }
  function bike(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k;
    ctx.strokeStyle = "#111"; ctx.lineWidth = Math.max(1, 0.06 * k);
    ctx.beginPath(); ctx.arc(p.sx, p.gy - 0.35 * k, 0.35 * k, 0, 7); ctx.stroke();
    ctx.fillStyle = "#f59e0b"; ctx.fillRect(p.sx - 0.2 * k, p.gy - 1.45 * k, 0.4 * k, 0.7 * k);
    ctx.fillStyle = "#e0ac82"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 1.6 * k, 0.14 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#1e40af"; ctx.fillRect(p.sx - 0.16 * k, p.gy - 1.78 * k, 0.32 * k, 0.12 * k);
  }
  function moto(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#111"; ctx.fillRect(p.sx - 0.1 * k, p.gy - 0.8 * k, 0.2 * k, 0.8 * k);
    ctx.fillStyle = "#374151"; ctx.fillRect(p.sx - 0.25 * k, p.gy - 1.4 * k, 0.5 * k, 0.65 * k);
    ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 1.55 * k, 0.17 * k, 0, 7); ctx.fill();
  }
  function dog(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#92400e"; ctx.fillRect(p.sx - 0.35 * k, p.gy - 0.55 * k, 0.7 * k, 0.35 * k);
    ctx.fillRect(p.sx - 0.3 * k, p.gy - 0.25 * k, 0.1 * k, 0.25 * k); ctx.fillRect(p.sx + 0.2 * k, p.gy - 0.25 * k, 0.1 * k, 0.25 * k);
    ctx.beginPath(); ctx.arc(p.sx + 0.4 * k, p.gy - 0.6 * k, 0.14 * k, 0, 7); ctx.fill();
  }
  function horse(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#7c4a1e"; ctx.fillRect(p.sx - 0.35 * k, p.gy - 1.5 * k, 0.7 * k, 0.8 * k);
    ctx.fillRect(p.sx - 0.3 * k, p.gy - 0.8 * k, 0.12 * k, 0.8 * k); ctx.fillRect(p.sx + 0.18 * k, p.gy - 0.8 * k, 0.12 * k, 0.8 * k);
    ctx.fillRect(p.sx - 0.12 * k, p.gy - 1.9 * k, 0.24 * k, 0.5 * k);
    ctx.fillStyle = "#b91c1c"; ctx.fillRect(p.sx - 0.17 * k, p.gy - 2.2 * k, 0.34 * k, 0.7 * k);
    ctx.fillStyle = "#e0ac82"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 2.35 * k, 0.12 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#1e3a8a"; ctx.fillRect(p.sx - 0.14 * k, p.gy - 2.5 * k, 0.28 * k, 0.1 * k);
  }
  function cone(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(p.sx - 0.18 * k, p.gy); ctx.lineTo(p.sx + 0.18 * k, p.gy); ctx.lineTo(p.sx + 0.05 * k, p.gy - 0.7 * k); ctx.lineTo(p.sx - 0.05 * k, p.gy - 0.7 * k); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.fillRect(p.sx - 0.1 * k, p.gy - 0.4 * k, 0.2 * k, 0.1 * k);
  }
  function tlight(ctx, x, z, cz, st) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#222"; ctx.fillRect(p.sx - 0.05 * k, p.gy - 3.4 * k, 0.1 * k, 3.4 * k);
    ctx.fillRect(p.sx - 0.2 * k, p.gy - 4.3 * k, 0.4 * k, 1.0 * k);
    var cols = { r: "#ff2a2a", a: "#ffb300", g: "#22d35a" }, off = "#3a3a3a";
    [["r", 4.15], ["a", 3.8], ["g", 3.45]].forEach(function (c) { ctx.fillStyle = st === c[0] ? cols[c[0]] : off; ctx.beginPath(); ctx.arc(p.sx, p.gy - c[1] * k, 0.09 * k, 0, 7); ctx.fill(); });
  }
  function barrier(ctx, x, z, cz, down, t, red) {
    var a = P(x, z, cz), b = P(x + (x < 0 ? 3.4 : -3.4), z, cz); if (a.k <= 0) return;
    ctx.fillStyle = "#e5e7eb"; ctx.fillRect(a.sx - 0.1 * a.k, a.gy - 1.8 * a.k, 0.2 * a.k, 1.8 * a.k);
    if (down > 0.02) {
      var y1 = a.gy - 1.8 * a.k * (1 - down) - 0.9 * a.k * down, ex = a.sx + (b.sx - a.sx) * down;
      ctx.strokeStyle = "#dc2626"; ctx.lineWidth = Math.max(2, 0.14 * a.k); ctx.beginPath(); ctx.moveTo(a.sx, a.gy - 1.5 * a.k); ctx.lineTo(ex, y1); ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.setLineDash([a.k * 0.4, a.k * 0.4]); ctx.stroke(); ctx.setLineDash([]);
    }
    if (red) { var on = Math.floor(t * 2) % 2 === (x < 0 ? 0 : 1); ctx.fillStyle = on ? "#ff2a2a" : "#4a1010"; ctx.beginPath(); ctx.arc(a.sx, a.gy - 2.1 * a.k, 0.17 * a.k, 0, 7); ctx.fill(); }
  }
  function patrol(ctx, x, z, cz) {
    person(ctx, "#facc15", x, z, cz, 1.75);
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#555"; ctx.fillRect(p.sx + 0.28 * k, p.gy - 2.4 * k, 0.06 * k, 1.6 * k);
    ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(p.sx + 0.31 * k, p.gy - 2.6 * k, 0.32 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.fillRect(p.sx + 0.12 * k, p.gy - 2.66 * k, 0.38 * k, 0.1 * k);
  }
  function ambu(ctx, x, z, cz, t) {
    box(ctx, "#f8fafc", x, z, 2.1, 2.3, cz);
    var p = P(x, z, cz), k = p.k;
    ctx.fillStyle = "#22c55e"; ctx.fillRect(p.sx - 1.05 * k, p.gy - 1.2 * k, 2.1 * k, 0.25 * k);
    ctx.fillStyle = "#9bb7d4"; ctx.fillRect(p.sx - 0.7 * k, p.gy - 2.1 * k, 1.4 * k, 0.6 * k);
    var on = Math.floor(t * 4) % 2 === 0;
    ctx.fillStyle = on ? "#3b82f6" : "#1e3a8a"; ctx.fillRect(p.sx - 0.8 * k, p.gy - 2.45 * k, 0.5 * k, 0.15 * k);
    ctx.fillStyle = on ? "#1e3a8a" : "#3b82f6"; ctx.fillRect(p.sx + 0.3 * k, p.gy - 2.45 * k, 0.5 * k, 0.15 * k);
    if (on) { ctx.fillStyle = "rgba(59,130,246,.3)"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 2.4 * k, 1.4 * k, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#111"; ctx.fillRect(p.sx - 0.95 * k, p.gy - 0.35 * k, 0.4 * k, 0.35 * k); ctx.fillRect(p.sx + 0.55 * k, p.gy - 0.35 * k, 0.4 * k, 0.35 * k);
  }
  function sign20(ctx, x, z, cz) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    ctx.fillStyle = "#888"; ctx.fillRect(p.sx - 0.04 * k, p.gy - 2.6 * k, 0.08 * k, 2.6 * k);
    ctx.fillStyle = "#d00"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 2.9 * k, 0.5 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 2.9 * k, 0.38 * k, 0, 7); ctx.fill();
    ctx.fillStyle = "#111"; ctx.font = "bold " + Math.max(8, 0.42 * k) + "px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("20", p.sx, p.gy - 2.9 * k);
  }
  function beacon(ctx, x, z, cz, t) {
    var p = P(x, z, cz), k = p.k; if (k <= 0) return;
    for (var i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? "#111" : "#fff"; ctx.fillRect(p.sx - 0.05 * k, p.gy - (i + 1) * 0.4 * k, 0.1 * k, 0.4 * k); }
    ctx.fillStyle = blink(t) ? "#ffa500" : "#b45309"; ctx.beginPath(); ctx.arc(p.sx, p.gy - 2.6 * k, 0.17 * k, 0, 7); ctx.fill();
  }

  function draw(ctx, clip, t) {
    var cz = clip.cam ? clip.cam(t) : clip.speed * t, env = clip.env || {}, night = env.night, fog = env.fog;
    ctx.fillStyle = night ? "#0b1030" : fog ? "#cfd6dc" : "#8ec5ff"; ctx.fillRect(0, 0, W, HOR);
    ctx.fillStyle = night ? "#16301a" : fog ? "#aeb8a8" : "#7fae6a"; ctx.fillRect(0, HOR, W, H - HOR);
    var list = [], zi, maxd = fog ? 48 : 999;
    for (zi = Math.floor(cz / 14) * 14 + 14; zi < cz + 160; zi += 14) {
      var n = zi / 14;
      list.push({ z: zi, f: function (z, n) { return function () {
        box(ctx, ["#b5651d", "#c9b79c", "#a8a29e", "#9a3412"][((n % 4) + 4) % 4], -11, z, 9, 6 + (n % 3) * 1.5, cz);
        box(ctx, ["#d6c7a8", "#b45309", "#cbd5e1", "#a16207"][((n + 1) % 4 + 4) % 4], 11, z, 9, 6 + ((n + 1) % 3) * 1.5, cz);
        circ(ctx, "#2d6a30", -6.2, z + 7, 3.2, 1.5, cz); box(ctx, "#5b3a1e", -6.2, z + 7, 0.3, 2, cz);
      }; }(zi, n) });
    }
    var roadCol = env.wet ? "#2b2f38" : "#3d3f45";
    quad(ctx, "#cfcfcf", -8, -3.5, cz + 1.2, cz + 220, cz); quad(ctx, "#cfcfcf", 3.5, 8, cz + 1.2, cz + 220, cz);
    quad(ctx, roadCol, -3.5, 3.5, cz + 1.2, cz + 220, cz);
    if (clip.side) quad(ctx, roadCol, 3.5, 9, clip.side.z - 4, clip.side.z + 5, cz);
    quad(ctx, "#fff", -3.5, -3.4, cz + 1.2, cz + 220, cz);
    if (clip.center === "double") { quad(ctx, "#fff", -0.2, -0.1, cz + 1.2, cz + 220, cz); quad(ctx, "#fff", 0.1, 0.2, cz + 1.2, cz + 220, cz); }
    else for (var d = Math.floor(cz / 6) * 6; d < cz + 200; d += 6) quad(ctx, "#fff", -0.07, 0.07, Math.max(d, cz + 1.2), d + 3, cz);
    (clip.marks || []).forEach(function (m) {
      if (m.t === "zebra") { for (var xx = -3.2; xx < 3.4; xx += 0.9) quad(ctx, "#fff", xx, xx + 0.5, m.z, m.z + 2.8, cz); list.push({ z: m.z, f: function () { beacon(ctx, -4, m.z, cz, t); beacon(ctx, 4, m.z, cz, t); } }); }
      if (m.t === "stop") quad(ctx, "#fff", -3.5, 0, m.z, m.z + 0.4, cz);
    });
    (clip.parked || []).forEach(function (pk) { list.push({ z: pk.z, f: function () { car(ctx, pk.c, -2.6, pk.z, cz, false, null, t); if (pk.door) { var o = pk.door(t); if (o > 0) box(ctx, pk.c, -1.65 + o * 0.5, pk.z, 0.12 + o * 1.0, 0.9, cz, 0.35); } } }); });
    clip.objs.forEach(function (o) {
      var p = o.pos(t); if (!p) return;
      list.push({ z: p.z, f: function () {
        switch (o.t) {
          case "car": car(ctx, o.c, p.x, p.z, cz, o.brake && o.brake(t), null, t); break;
          case "ocar": car(ctx, o.c, p.x, p.z, cz, false, null, t, true); break;
          case "ped": person(ctx, o.c, p.x, p.z, cz, 1.75, o.cane); break;
          case "kid": person(ctx, o.c || "#2563eb", p.x, p.z, cz, 1.1); break;
          case "ball": circ(ctx, "#f97316", p.x, p.z, 0.15, 0.24, cz); break;
          case "bus": bus(ctx, p.x, p.z, cz, o.ind && o.ind(t), t); break;
          case "bike": bike(ctx, p.x, p.z, cz); break;
          case "moto": moto(ctx, p.x, p.z, cz); break;
          case "lorry": lorry(ctx, p.x, p.z, cz, o.ind, t); break;
          case "tractor": tractor(ctx, p.x, p.z, cz); break;
          case "dog": dog(ctx, p.x, p.z, cz); break;
          case "horse": horse(ctx, p.x, p.z, cz); break;
          case "cone": cone(ctx, p.x, p.z, cz); break;
          case "tl": tlight(ctx, p.x, p.z, cz, o.st(t)); break;
          case "barrier": barrier(ctx, p.x, p.z, cz, o.down(t), t, true); break;
          case "patrol": patrol(ctx, p.x, p.z, cz); break;
          case "ambu": ambu(ctx, p.x, p.z, cz, t); break;
          case "sign20": sign20(ctx, p.x, p.z, cz); break;
        }
      } });
    });
    list.sort(function (a, b) { return b.z - a.z; });
    list.forEach(function (o) { if (o.z - cz > 2 && o.z - cz < maxd) o.f(); });
    if (fog) { var g = ctx.createLinearGradient(0, HOR - 40, 0, HOR + 90); g.addColorStop(0, "rgba(215,220,225,.95)"); g.addColorStop(1, "rgba(215,220,225,.2)"); ctx.fillStyle = g; ctx.fillRect(0, HOR - 40, W, 130); ctx.fillStyle = "rgba(215,220,225,.35)"; ctx.fillRect(0, 0, W, H); }
    if (env.rain) { ctx.strokeStyle = "rgba(220,230,255,.55)"; ctx.lineWidth = 1; for (var i = 0; i < 90; i++) { var rx = (i * 97 + t * 160 * (1 + (i % 3) * 0.2)) % (W + 40), ry = (i * 53 + t * 520) % H; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 6, ry + 16); ctx.stroke(); } }
    if (night) {
      ctx.fillStyle = "rgba(0,0,25,.62)"; ctx.fillRect(0, 0, W, H);
      var beam = ctx.createLinearGradient(0, H, 0, HOR); beam.addColorStop(0, "rgba(255,245,200,.35)"); beam.addColorStop(1, "rgba(255,245,200,0)");
      ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(150, H); ctx.lineTo(W / 2 - 20, HOR); ctx.lineTo(W / 2 + 20, HOR); ctx.lineTo(490, H); ctx.fill();
      clip.objs.forEach(function (o) {
        if (o.t !== "ocar") return; var p = o.pos(t), q = P(p.x, p.z, cz); if (q.k <= 0) return;
        var r = Math.min(260, 1.2 * q.k + 12), gr = ctx.createRadialGradient(q.sx, q.gy - 0.7 * q.k, 2, q.sx, q.gy - 0.7 * q.k, r);
        gr.addColorStop(0, "rgba(255,255,235,.95)"); gr.addColorStop(0.35, "rgba(255,250,200,.55)"); gr.addColorStop(1, "rgba(255,250,200,0)");
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(q.sx, q.gy - 0.7 * q.k, r, 0, 7); ctx.fill();
      });
    }
    ctx.fillStyle = "#222"; ctx.beginPath(); ctx.moveTo(150, H); ctx.lineTo(210, H - 38); ctx.lineTo(430, H - 38); ctx.lineTo(490, H); ctx.fill();
  }
  window.HZ = { draw: draw, W: W, H: H };
})();
