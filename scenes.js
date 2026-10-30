// scenes.js - the 27 animated scenes used by the "Video clips" chapter (chapter 15).
(function () {
  function lerp(a, b, t0, t1, t) { var p = Math.max(0, Math.min(1, (t - t0) / (t1 - t0))); return a + (b - a) * p; }
  var S = {};
  S.zebra_wait = { dur: 7.25, speed: 8, marks: [{ t: "zebra", z: 80 }], objs: [
    { t: "ped", c: "#c0392b", pos: function () { return { x: -4.3, z: 79 }; } },
    { t: "kid", c: "#2563eb", pos: function () { return { x: -4.9, z: 79.5 }; } }] };
  S.zebra_on = { dur: 7.25, speed: 8, marks: [{ t: "zebra", z: 80 }], objs: [
    { t: "ped", c: "#c0392b", pos: function (t) { return { x: lerp(-3.8, 3.2, 0.5, 6.5, t), z: 79.5 }; } },
    { t: "ped", c: "#0f766e", pos: function (t) { return { x: lerp(-4.6, 2.4, 0.5, 6.5, t), z: 80.5 }; } }] };
  S.red = { dur: 6.5, speed: 9, marks: [{ t: "stop", z: 72 }], objs: [
    { t: "tl", pos: function () { return { x: -4.2, z: 75 }; }, st: function (t) { return t < 2 ? "g" : t < 3.2 ? "a" : "r"; } },
    { t: "tl", pos: function () { return { x: 4.2, z: 75 }; }, st: function (t) { return t < 2 ? "g" : t < 3.2 ? "a" : "r"; } }] };
  S.amber = { dur: 5.2, speed: 9, marks: [{ t: "stop", z: 62 }], objs: [
    { t: "tl", pos: function () { return { x: -4.2, z: 65 }; }, st: function (t) { return t < 2.4 ? "g" : "a"; } },
    { t: "tl", pos: function () { return { x: 4.2, z: 65 }; }, st: function (t) { return t < 2.4 ? "g" : "a"; } }] };
  S.ball = { dur: 7, speed: 9, parked: [{ z: 62, c: "#3b6ea8" }, { z: 70, c: "#a33" }, { z: 88, c: "#d8d8d8" }, { z: 96, c: "#444" }], objs: [
    { t: "ball", pos: function (t) { return t < 3.8 ? null : { x: -3.4 + 1.2 * (t - 3.8), z: 80 }; } }] };
  S.cyclist = { dur: 7.8, speed: 9, parked: [{ z: 72, c: "#7a4fa3" }], objs: [
    { t: "bike", pos: function (t) { return { x: lerp(-2.9, -1.4, 4.2, 6.6, t), z: 45 + 5 * t }; } }] };
  S.brake = { dur: 8.3, speed: 9, objs: [{ t: "car", c: "#555", brake: function (t) { return t >= 6; }, pos: function (t) { var z = 28 + 9 * t; if (t > 6) { var d = Math.min(t - 6, 3); z = 82 + 9 * d - 1.5 * d * d; } return { x: -1.75, z: z }; } }] };
  S.junction = { dur: 7, speed: 10, side: { z: 85, x: 4 }, objs: [{ t: "car", c: "#2f8f5b", pos: function (t) { var p = t < 5.6 ? 0 : Math.min(1, (t - 5.6) / 3); return { x: 5.6 - 5.4 * p, z: 85 }; } }] };
  S.bus_ped = { dur: 7.2, speed: 9, objs: [
    { t: "ped", c: "#c0392b", pos: function (t) { return { x: t < 5 ? -4.4 : -4.4 + 1.4 * (t - 5), z: 84 }; } },
    { t: "bus", pos: function () { return { x: -2.6, z: 80 }; } }] };
  S.bus_pull = { dur: 7, speed: 9, objs: [{ t: "bus", ind: function (t) { return t > 1.5; }, pos: function (t) { return { x: lerp(-2.6, -1.4, 4, 7, t), z: 78 + (t > 4 ? (t - 4) * 1.2 : 0) }; } }] };
  S.fog = { dur: 6, speed: 8, env: { fog: true }, objs: [{ t: "car", c: "#555", brake: function () { return false; }, pos: function (t) { return { x: -1.75, z: 38 + 8 * t }; } }] };
  S.wet = { dur: 6, speed: 9, env: { wet: true, rain: true }, objs: [{ t: "car", c: "#2f4f8f", brake: function () { return false; }, pos: function (t) { return { x: -1.75, z: 46 + 9 * t }; } }] };
  S.night = { dur: 6, speed: 8, env: { night: true }, objs: [{ t: "ocar", c: "#777", pos: function (t) { return { x: 1.75, z: 150 - 14 * t }; } }] };
  S.cones = { dur: 6.5, speed: 9, objs: [[-3.2, 72], [-2.7, 78], [-2.2, 84], [-1.7, 90], [-1.2, 96], [-0.9, 102], [-0.9, 108], [-0.9, 114]].map(function (c) { return { t: "cone", pos: function () { return { x: c[0], z: c[1] }; } }; }) };
  S.dog = { dur: 6.2, speed: 9, objs: [{ t: "dog", pos: function (t) { return t < 3.3 ? null : { x: -4.6 + 3 * (t - 3.3), z: 72 }; } }] };
  S.horse = { dur: 6.5, speed: 9, objs: [{ t: "horse", pos: function (t) { return { x: -2.9, z: 66 + 2.2 * t }; } }] };
  S.level = { dur: 6.5, speed: 9, objs: [
    { t: "barrier", pos: function () { return { x: -3.8, z: 85 }; }, down: function (t) { return lerp(0, 1, 2.3, 3.6, t); } },
    { t: "barrier", pos: function () { return { x: 3.8, z: 85 }; }, down: function (t) { return lerp(0, 1, 2.3, 3.6, t); } }] };
  S.patrol = { dur: 6.8, speed: 8, objs: [
    { t: "patrol", pos: function (t) { return { x: lerp(-4.3, -1.4, 1.5, 3, t), z: 68 }; } },
    { t: "kid", c: "#e11d48", pos: function () { return { x: -5.0, z: 70 }; } },
    { t: "kid", c: "#16a34a", pos: function () { return { x: -5.6, z: 70.5 }; } }] };
  S.door = { dur: 6, speed: 9, parked: [{ z: 70, c: "#3b6ea8", door: function (t) { return lerp(0, 1, 2.6, 4.4, t); } }], objs: [] };
  S.lorry = { dur: 6, speed: 9, objs: [{ t: "lorry", ind: "l", pos: function (t) { return { x: lerp(-2.0, -0.7, 2, 5, t), z: 55 + 7 * t }; } }] };
  S.moto = { dur: 6, speed: 9, side: { z: 85, x: 4 }, objs: [{ t: "moto", pos: function (t) { return { x: t < 3.5 ? 5.6 : lerp(5.6, 0.6, 3.5, 5.5, t), z: 85 }; } }] };
  S.zone20 = { dur: 6.5, speed: 8, parked: [{ z: 56, c: "#7a4fa3" }, { z: 64, c: "#a33" }], objs: [
    { t: "sign20", pos: function () { return { x: -4.5, z: 62 }; } },
    { t: "kid", c: "#f59e0b", pos: function (t) { return { x: -4.8 + 0.5 * Math.sin(t * 2), z: 70 }; } },
    { t: "kid", c: "#2563eb", pos: function (t) { return { x: -5.4 + 0.5 * Math.cos(t * 2), z: 72 }; } }] };
  S.stick = { dur: 6, speed: 8, objs: [{ t: "ped", c: "#475569", cane: true, pos: function (t) { return { x: lerp(-4.4, -2.6, 2.4, 6, t), z: 62 }; } }] };
  S.narrow = { dur: 5.5, speed: 8, parked: [{ z: 52, c: "#3b6ea8" }, { z: 60, c: "#a33" }, { z: 68, c: "#d8d8d8" }], objs: [{ t: "ocar", c: "#2f8f5b", pos: function (t) { return { x: 1.2, z: 120 - 10 * t }; } }] };
  S.tractor = { dur: 6.5, speed: 9, center: "double", objs: [{ t: "tractor", pos: function (t) { return { x: -1.8, z: 52 + 5 * t }; } }] };
  S.green_ped = { dur: 5.5, speed: 8, marks: [{ t: "stop", z: 56 }], objs: [
    { t: "tl", pos: function () { return { x: -4.2, z: 58 }; }, st: function () { return "g"; } },
    { t: "ped", c: "#c0392b", pos: function (t) { return { x: lerp(-3.8, 3, 0.5, 6, t), z: 63 }; } },
    { t: "ped", c: "#0f766e", pos: function (t) { return { x: lerp(-4.6, 2.2, 0.5, 6, t), z: 64 }; } }] };
  S.ambu = { dur: 6, speed: 9, objs: [
    { t: "ambu", pos: function () { return { x: -2.6, z: 75 }; } },
    { t: "ped", c: "#16a34a", pos: function (t) { return { x: lerp(-4.2, -1.2, 3, 5, t), z: 70 }; } }] };
  window.SCENES = S;
})();
