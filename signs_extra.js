// signs_extra.js - more road signs, lights and road markings (drawn from scratch as simple shapes)
// and which questions show them. Loaded after glossary.js.
(function () {
  if (typeof SIGNS === "undefined" || typeof questions === "undefined") return;
  var K = "#111";
  var tri = function (s) { return triSign(s); };
  var ring = function (s) { return redRing(s); };
  var blue = function (s) { return blueDisc(s); };
  var box = function (fill, s, stroke) { return '<rect x="6" y="14" width="108" height="92" rx="10" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="4"' : "") + "/>" + (s || ""); };
  var road = function (s) { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#6b7280"/>' + (s || ""); };
  var path = function (d, c, w, f) { return '<path d="' + d + '" stroke="' + (c || K) + '" stroke-width="' + (w || 6) + '" fill="' + (f || "none") + '" stroke-linecap="round" stroke-linejoin="round"/>'; };
  var txt = function (x, y, t, s, c) { return T(x, y, t, s, c || K); };
  var car = function (x, y, s, c) { // side view car
    s = s || 1; c = c || K;
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')"><path d="M-16 0 L-16 -6 L-10 -7 L-6 -13 L7 -13 L11 -7 L16 -6 L16 0 Z" fill="' + c + '"/><circle cx="-9" cy="1" r="3.5" fill="' + c + '"/><circle cx="9" cy="1" r="3.5" fill="' + c + '"/></g>';
  };
  var lorry = function (x, y, s, c) {
    s = s || 1; c = c || K;
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')"><rect x="-20" y="-16" width="26" height="16" fill="' + c + '"/><path d="M7 0 L7 -11 L14 -11 L18 -5 L18 0 Z" fill="' + c + '"/><circle cx="-13" cy="2" r="3.5" fill="' + c + '"/><circle cx="11" cy="2" r="3.5" fill="' + c + '"/></g>';
  };
  var person = function (x, y, s, c) {
    s = s || 1; c = c || K;
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')"><circle cx="0" cy="-22" r="4" fill="' + c + '"/>' +
      '<path d="M0 -17 L0 -3 M0 -3 L-6 10 M0 -3 L6 10 M0 -13 L-7 -6 M0 -13 L7 -6" stroke="' + c + '" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>';
  };
  var horse = function (x, y, s, c, rider) {
    s = s || 1; c = c || K;
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')"><path d="M-14 -4 Q-14 -12 -4 -12 L8 -12 L13 -20 L18 -18 L16 -10 L12 -6 L12 -2 Z" fill="' + c + '"/>' +
      '<path d="M-12 -4 L-14 10 M-6 -4 L-6 10 M6 -4 L7 10 M11 -4 L13 10 M-14 -10 L-19 -2" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>' +
      (rider ? '<circle cx="1" cy="-25" r="3.5" fill="' + c + '"/><path d="M1 -21 L1 -12 M1 -18 L8 -16" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>' : "") + "</g>";
  };
  var light = function (r, a, g, extra) { // traffic light housing
    var off = "#3f3f46";
    return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/><rect x="40" y="8" width="40" height="104" rx="8" fill="#111"/>' +
      C(60, 30, 12, r ? "#ef4444" : off) + C(60, 60, 12, a ? "#f59e0b" : off) + C(60, 90, 12, g ? "#22c55e" : off) + (extra || "");
  };
  var rays = function (cx, cy, c) { var s = ""; for (var i = 0; i < 8; i++) { var an = i * Math.PI / 4; s += L((cx + 16 * Math.cos(an)).toFixed(1), (cy + 16 * Math.sin(an)).toFixed(1), (cx + 22 * Math.cos(an)).toFixed(1), (cy + 22 * Math.sin(an)).toFixed(1), c || "#f59e0b", 3); } return s; };
  var bar = '<line x1="24" y1="96" x2="96" y2="24" stroke="#d6141f" stroke-width="9"/>';
  var dash = function (x1, y1, x2, y2, c, w, d) { return L(x1, y1, x2, y2, c || "#fff", w || 4, d || "12 10"); };
  var dashLamp = function (x, y, c) { return C(x, y, 9, c) + R(x - 3, y + 9, 6, 50, K) + R(x - 3, y + 15, 6, 6, "#fff") + R(x - 3, y + 27, 6, 6, "#fff") + R(x - 3, y + 39, 6, 6, "#fff"); };
  var dashIcon = function (inner, col) { return '<rect x="0" y="0" width="120" height="120" rx="14" fill="#111827"/>' + '<g fill="none" stroke="' + col + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' + inner + "</g>"; };

  var NEW = {
    // ---- traffic lights ----
    lightsRed: function () { return light(1, 0, 0); },
    lightsAmber: function () { return light(0, 1, 0); },
    lightsRedAmber: function () { return light(1, 1, 0); },
    lightsGreen: function () { return light(0, 0, 1); },
    lightsFlashAmber: function () { return light(0, 1, 0, rays(60, 60)); },
    lightsOut: function () { return light(0, 0, 0, '<line x1="22" y1="22" x2="98" y2="98" stroke="#ef4444" stroke-width="6"/>'); },
    wigwag: function () { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/><rect x="14" y="36" width="92" height="40" rx="20" fill="#111"/>' + C(36, 56, 13, "#ef4444") + C(84, 56, 13, "#3f3f46") + rays(36, 56, "#ef4444") + R(56, 76, 8, 40, K); },
    tramLights: function () { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/><rect x="34" y="10" width="52" height="100" rx="10" fill="#111"/>' + R(44, 30, 32, 7, "#fff") + R(56, 52, 8, 32, "#fff") + C(60, 96, 5, "#fff"); },
    cycleLight: function () { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/><rect x="30" y="16" width="60" height="88" rx="10" fill="#111"/>' + C(60, 60, 24, "#14532d") + BIKE(60, 63, 1.4, "#4ade80"); },
    laneOpen: function () { return '<rect x="8" y="8" width="104" height="104" rx="8" fill="#111"/>' + path("M60 26 L60 86 M38 66 L60 90 L82 66", "#22c55e", 9); },
    vms: function () { return '<rect x="4" y="26" width="112" height="56" rx="6" fill="#111"/>' + txt(60, 50, "ACCIDENT", 16, "#f59e0b") + txt(60, 70, "AHEAD", 16, "#f59e0b") + R(20, 82, 6, 30, "#6b7280") + R(94, 82, 6, 30, "#6b7280"); },
    // ---- beacons, plates ----
    belisha: function () { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/>' + rays(60, 26) + C(60, 26, 13, "#f59e0b") + [0, 1, 2, 3, 4, 5].map(function (i) { return R(56, 40 + i * 13, 8, 13, i % 2 ? "#fff" : K, 'stroke="#111" stroke-width="1"'); }).join(""); },
    beaconGreen: function () { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/>' + car(60, 92, 2.3, "#475569") + R(52, 50, 16, 10, "#22c55e", 'rx="3"') + rays(60, 55, "#22c55e"); },
    beaconAmber: function () { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/>' + lorry(60, 92, 2.0, "#475569") + R(52, 46, 16, 10, "#f59e0b", 'rx="3"') + rays(60, 51, "#f59e0b"); },
    pPlate: function () { return '<rect x="14" y="14" width="92" height="92" rx="8" fill="#fff" stroke="#9ca3af" stroke-width="3"/>' + txt(60, 92, "P", 80, "#16a34a"); },
    // ---- red ring signs ----
    noOvertaking: function () { return ring(car(42, 70, 1.4, "#d6141f") + car(78, 70, 1.4, K)); },
    noMotor: function () { return ring('<g transform="translate(60 46) scale(.9)"><circle cx="-12" cy="0" r="6" fill="none" stroke="#111" stroke-width="3"/><circle cx="12" cy="0" r="6" fill="none" stroke="#111" stroke-width="3"/><path d="M-12 0 L-2 -8 L8 -8 L12 0 M-2 -8 L2 0" stroke="#111" stroke-width="3" fill="none"/></g>' + car(60, 82, 1.3)); },
    noGoods: function () { return ring(lorry(58, 62, 1.5) + txt(60, 90, "7.5T", 18)); },
    maxHeight: function () { return ring(path("M60 22 L60 34 M50 30 L60 20 L70 30 M60 98 L60 86 M50 90 L60 100 L70 90", K, 5) + txt(60, 66, "14'6\"", 22) + txt(60, 82, "4.4m", 13)); },
    maxWidth: function () { return ring(path("M18 60 L30 60 M24 50 L16 60 L24 70 M102 60 L90 60 M96 50 L104 60 L96 70", K, 5) + txt(60, 68, "6'6\"", 22)); },
    noPedestrians: function () { return ring(person(60, 78, 1.5) + bar); },
    noMotorcycles: function () { return ring('<g transform="translate(60 64) scale(1.4)"><circle cx="-13" cy="0" r="7" fill="none" stroke="#111" stroke-width="3"/><circle cx="13" cy="0" r="7" fill="none" stroke="#111" stroke-width="3"/><path d="M-13 0 L-3 -10 L8 -10 L13 0 M-3 -10 L0 0 L-13 0" stroke="#111" stroke-width="3" fill="none"/><circle cx="2" cy="-18" r="4" fill="#111"/></g>'); },
    noWaiting: function () { return '<circle cx="60" cy="60" r="52" fill="#1e5fbf" stroke="#d6141f" stroke-width="9"/><path d="M34 34 L86 86" stroke="#d6141f" stroke-width="12"/>'; },
    // ---- blue circles ----
    miniRoundabout: function () { return blue('<g fill="#fff">' + [0, 120, 240].map(function (a) { return '<path transform="rotate(' + a + ' 60 60)" d="M60 24 A36 36 0 0 1 91 42 L98 36 L98 58 L77 52 L84 47 A28 28 0 0 0 60 32 Z"/>'; }).join("") + "</g>"); },
    busOnly: function () { return blue('<rect x="28" y="38" width="64" height="40" rx="6" fill="#fff"/>' + R(34, 44, 52, 14, "#1e5fbf") + C(42, 82, 6, "#fff") + C(78, 82, 6, "#fff")); },
    pedOnly: function () { return blue(person(60, 78, 1.6, "#fff")); },
    horseRoute: function () { return blue(horse(60, 70, 1.8, "#fff", true)); },
    passEither: function () { return blue(path("M60 30 L60 50 M60 50 L38 80 M60 50 L82 80", "#fff", 9) + '<polygon points="30,92 32,70 48,82" fill="#fff"/><polygon points="90,92 88,70 72,82" fill="#fff"/>'); },
    // ---- rectangles ----
    oneWay: function () { return box("#1e5fbf", path("M60 96 L60 40", "#fff", 12) + '<polygon points="38,48 60,22 82,48" fill="#fff"/>'); },
    noThrough: function () { return box("#fff", R(52, 50, 16, 46, "#1e5fbf") + R(30, 34, 60, 18, "#d6141f"), "#1e5fbf"); },
    endMotorway: function () { return box("#1e5fbf", path("M44 96 L52 40 M76 96 L68 40 M60 50 L60 58 M60 70 L60 78 M60 88 L60 96", "#fff", 6) + R(46, 30, 28, 14, "#fff", 'rx="2"') + '<line x1="22" y1="100" x2="98" y2="24" stroke="#d6141f" stroke-width="9"/>'); },
    parkRide: function () { return box("#1e5fbf", txt(38, 74, "P", 56, "#fff") + '<rect x="66" y="40" width="34" height="22" rx="4" fill="#fff"/>' + C(72, 64, 3, "#fff") + C(94, 64, 3, "#fff") + '<rect x="66" y="72" width="34" height="18" rx="6" fill="#fff"/>'); },
    hospital: function () { return box("#1e5fbf", R(28, 26, 64, 68, "#fff", 'rx="6"') + txt(60, 82, "H", 56, "#1e5fbf")); },
    diversion: function () { return box("#facc15", '<polygon points="60,30 84,72 36,72" fill="#111"/>' + txt(60, 98, "DIVERSION", 13)); },
    busLane: function () { return box("#fff", R(14, 22, 44, 76, "#fff", 'stroke="#111" stroke-width="2"') + txt(36, 54, "BUS", 13) + txt(36, 70, "LANE", 12) + path("M60 22 L60 98", "#111", 2) + path("M84 92 L84 40 M74 50 L84 34 L94 50", K, 5), "#111"); },
    repeater: function () { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/>' + R(57, 56, 6, 60, "#6b7280") + '<circle cx="60" cy="40" r="26" fill="#fff" stroke="#d6141f" stroke-width="6"/>' + T(60, 50, "30", 26, K); },
    // ---- warning triangles ----
    levelNoGate: function () { return tri('<g transform="translate(60 72)"><rect x="-22" y="-10" width="30" height="16" fill="#111"/><rect x="8" y="-20" width="14" height="26" fill="#111"/><rect x="-18" y="-20" width="6" height="10" fill="#111"/><circle cx="-14" cy="9" r="5" fill="#111"/><circle cx="2" cy="9" r="5" fill="#111"/><circle cx="16" cy="9" r="5" fill="#111"/></g>'); },
    levelGate: function () { return tri(path("M32 86 L32 52 M88 86 L88 52 M32 56 L88 56 M32 70 L88 70 M32 56 L88 70 M32 70 L88 56", K, 5)); },
    trams: function () { return tri('<rect x="36" y="48" width="48" height="30" rx="5" fill="#111"/><rect x="42" y="54" width="36" height="10" fill="#fff"/>' + path("M60 48 L54 38 L66 38", K, 3) + C(46, 84, 4, K) + C(74, 84, 4, K)); },
    humpBridge: function () { return tri('<path d="M24 88 Q60 40 96 88 Z" fill="#111"/>'); },
    fallingRocks: function () { return tri('<polygon points="44,40 76,92 44,92" fill="#111"/>' + C(62, 54, 5, K) + C(72, 64, 4, K) + C(66, 76, 4, K) + C(80, 82, 5, K)); },
    quayside: function () { return tri(car(56, 58, 1.2) + '<path d="M28 70 L52 70 L52 92" stroke="#111" stroke-width="4" fill="none"/>' + path("M54 80 Q62 74 70 80 Q78 86 86 80 M54 90 Q62 84 70 90 Q78 96 86 90", K, 3)); },
    aircraft: function () { return tri(path("M30 66 L90 66 M60 44 L60 86 M70 66 L54 46 M70 66 L54 86 M36 66 L32 58 M36 66 L32 74", K, 6)); },
    doubleBend: function () { return tri(path("M54 92 L54 78 Q54 68 46 64 Q38 60 46 52 Q54 46 62 44 L62 34", K, 8) + '<polygon points="54,30 70,30 62,20" fill="#111"/>'); },
    sideWinds: function () { return tri(R(34, 40, 4, 52, K) + '<path d="M38 42 L86 50 L86 60 L38 60 Z" fill="#111"/>'); },
    queues: function () { return tri('<g fill="#111"><rect x="42" y="38" width="36" height="12" rx="4"/><rect x="38" y="56" width="44" height="14" rx="4"/><rect x="34" y="76" width="52" height="16" rx="4"/></g>'); },
    roundaboutWarn: function () { return tri('<g fill="#111">' + [0, 120, 240].map(function (a) { return '<path transform="rotate(' + a + ' 60 68)" d="M60 46 A22 22 0 0 1 79 57 L84 53 L84 68 L70 64 L75 61 A16 16 0 0 0 60 52 Z"/>'; }).join("") + "</g>"); },
    sideRoad: function () { return tri(path("M60 92 L60 38", K, 9) + path("M60 64 L84 50", K, 5)); },
    uneven: function () { return tri(path("M28 84 Q38 66 48 84 Q58 66 68 84 Q78 66 88 84", K, 6)); },
    swingBridge: function () { return tri(path("M28 88 L46 88 L46 70 M92 88 L74 88 L74 70 M46 70 L58 54 M74 70 L62 54", K, 7)); },
    merging: function () { return tri(path("M70 92 L70 36", K, 9) + path("M44 92 L44 76 Q44 64 64 54", K, 6)); },
    cycleWarn: function () { return tri(BIKE(60, 76, 1.6, "#111")); },
    otherDanger: function () { return tri(R(55, 40, 10, 34, K, 'rx="4"') + C(60, 86, 6, K)); },
    pedCrossing: function () { return tri(person(60, 82, 1.3) + path("M36 92 L84 92", K, 4)); },
    hillDown: function () { return tri('<polygon points="26,90 94,90 26,48" fill="#111"/>' + txt(44, 86, "10%", 13, "#fff")); },
    hillUp: function () { return tri('<polygon points="26,90 94,90 94,48" fill="#111"/>' + txt(76, 86, "10%", 13, "#fff")); },
    cattle: function () { return tri('<g fill="#111"><rect x="36" y="58" width="44" height="18" rx="6"/><rect x="78" y="52" width="12" height="12" rx="3"/><rect x="38" y="74" width="5" height="16"/><rect x="48" y="74" width="5" height="16"/><rect x="66" y="74" width="5" height="16"/><rect x="74" y="74" width="5" height="16"/></g>' + path("M80 52 L76 46 M90 52 L94 46", K, 3)); },
    narrowRight: function () { return tri(path("M44 92 L44 40", K, 8) + path("M78 92 Q78 70 66 60 L66 40", K, 8)); },
    elderly: function () { return tri(person(48, 84, 1.15) + person(72, 84, 1.15) + path("M78 70 L82 92", K, 3)); },
    horseRiders: function () { return tri(horse(60, 76, 1.5, K, true)); },
    staggered: function () { return tri(path("M60 92 L60 36 M60 78 L40 78 M60 52 L80 52", K, 8)); },
    chippings: function () { return tri(car(64, 66, 1.3) + C(38, 84, 3, K) + C(46, 78, 2.5, K) + C(42, 70, 2.5, K) + C(52, 86, 2.5, K) + C(34, 76, 2, K)); },
    dualEnds: function () { return tri(path("M42 92 L42 72 Q42 62 52 56 L52 38 M78 92 L78 72 Q78 62 68 56 L68 38", K, 7)); },
    humps: function () { return tri(path("M26 86 Q34 70 42 86 Q50 70 58 86 Q66 70 74 86 Q82 70 90 86", K, 5)); },
    chevrons: function () { return '<rect x="4" y="34" width="112" height="52" fill="#111"/><g fill="#fff">' + [18, 48, 78].map(function (x) { return '<polygon points="' + (x + 6) + ",40 " + (x + 20) + ",40 " + (x + 34) + ",60 " + (x + 20) + ",80 " + (x + 6) + ",80 " + (x + 20) + ',60"/>'; }).join("") + "</g>"; },
    bendRight: function () { return tri(path("M50 92 L50 66 Q50 50 66 44", K, 9) + '<polygon points="62,34 80,40 68,54" fill="#111"/>'); },
    schoolPatrol: function () { return tri(person(52, 86, 1.2) + R(68, 50, 3, 34, K) + C(70, 46, 9, K)); },
    patrolSign: function () { return '<rect x="0" y="0" width="120" height="120" rx="10" fill="#e5edf5"/>' + R(57, 70, 6, 46, "#facc15") + '<circle cx="60" cy="42" r="34" fill="#fff" stroke="#d6141f" stroke-width="7"/>' + txt(60, 38, "STOP", 15) + person(60, 66, 0.55) + txt(84, 70, "", 1); },
    pony: function () { return tri(horse(60, 78, 1.5, K, false)); },
    deer: function () { return tri('<g transform="translate(60 76) scale(1.4)">' + '<path d="M-14 -4 Q-14 -11 -4 -11 L8 -11 L12 -18 L16 -16 L13 -8 L11 -4 Z" fill="#111"/><path d="M-12 -4 L-13 9 M-6 -4 L-6 9 M5 -4 L6 9 M10 -4 L11 9" stroke="#111" stroke-width="2.6" stroke-linecap="round"/><path d="M13 -18 L10 -26 M13 -18 L17 -25 M11 -22 L7 -24 M15 -22 L19 -22" stroke="#111" stroke-width="2" stroke-linecap="round"/></g>'); },
    yJunction: function () { return tri(path("M60 92 L60 64 L42 40 M60 64 L78 40", K, 8)); },
    flooding: function () { return tri(R(34, 46, 52, 8, K) + path("M30 70 Q40 62 50 70 Q60 78 70 70 Q80 62 90 70 M30 84 Q40 76 50 84 Q60 92 70 84 Q80 76 90 84", K, 4)); },
    // ---- road markings (seen from above) ----
    dblWhiteSolidNear: function () { return road(L(54, 0, 54, 120, "#fff", 5) + dash(66, 0, 66, 120, "#fff", 5) + txt(30, 112, "you", 12, "#fff")); },
    dblWhiteBrokenNear: function () { return road(dash(54, 0, 54, 120, "#fff", 5) + L(66, 0, 66, 120, "#fff", 5) + txt(30, 112, "you", 12, "#fff")); },
    hazardLine: function () { return road(dash(60, 0, 60, 120, "#fff", 5, "30 8")); },
    centreLine: function () { return road(dash(60, 0, 60, 120, "#fff", 5, "8 24")); },
    zigzagYellow: function () { return road(path("M18 0 L30 10 L18 20 L30 30 L18 40 L30 50 L18 60 L30 70 L18 80 L30 90 L18 100 L30 110 L18 120", "#facc15", 4) + L(10, 0, 10, 120, "#facc15", 3) + txt(78, 64, "SCHOOL", 12, "#facc15")); },
    zigzagWhite: function () { return road(path("M10 0 L22 10 L10 20 L22 30 L10 40 L22 50 L10 60 L22 70 L10 80 L22 90 L10 100", "#fff", 4) + path("M110 0 L98 10 L110 20 L98 30 L110 40 L98 50 L110 60 L98 70 L110 80 L98 90 L110 100", "#fff", 4) + [0, 1, 2, 3, 4].map(function (i) { return R(30 + i * 13, 100, 8, 20, "#fff"); }).join("")); },
    yellowBox: function () { var s = ""; for (var i = -100; i < 120; i += 18) { s += L(i, 0, i + 120, 120, "#facc15", 3) + L(i + 120, 0, i, 120, "#facc15", 3); } return road('<g clip-path="inset(0)">' + s + "</g>" + '<rect x="4" y="4" width="112" height="112" fill="none" stroke="#facc15" stroke-width="4"/>'); },
    deflection: function () { return road(dash(84, 0, 84, 120, "#fff", 4) + [20, 60, 100].map(function (y) { return path("M90 " + (y - 8) + " Q76 " + y + " 70 " + (y + 10), "#fff", 4) + '<polygon points="64,' + (y + 16) + " 76," + (y + 8) + " 66," + (y + 4) + '" fill="#fff"/>'; }).join("")); },
    keepClear: function () { return road(txt(60, 52, "KEEP", 24, "#fff") + txt(60, 82, "CLEAR", 24, "#fff") + L(8, 18, 112, 18, "#fff", 3) + L(8, 102, 112, 102, "#fff", 3)); },
    dragonTeeth: function () { return road([0, 1, 2, 3].map(function (i) { return '<polygon points="8,' + (10 + i * 28) + " 30," + (20 + i * 28) + " 8," + (30 + i * 28) + '" fill="#fff"/><polygon points="112,' + (10 + i * 28) + " 90," + (20 + i * 28) + " 112," + (30 + i * 28) + '" fill="#fff"/>'; }).join("") + dash(60, 0, 60, 120, "#fff", 3)); },
    giveWayMark: function () { return road('<polygon points="30,20 90,20 60,72" fill="none" stroke="#fff" stroke-width="5"/>' + dash(10, 100, 110, 100, "#fff", 5, "12 8") + dash(10, 110, 110, 110, "#fff", 5, "12 8")); },
    cycleMark: function () { return road(L(36, 0, 36, 120, "#fff", 3) + BIKE(78, 60, 2.2, "#fff")); },
    rumble: function () { return road([0, 1, 2, 3, 4, 5].map(function (i) { return R(10, 14 + i * 16, 100, 7, "#d1d5db"); }).join("")); },
    yellowBars: function () { return road([4, 20, 34, 46, 56, 64, 71, 77].map(function (y) { return R(8, y + 20, 104, 4, "#facc15"); }).join("")); },
    redRoute: function () { return road(L(14, 0, 14, 120, "#dc2626", 4) + L(22, 0, 22, 120, "#dc2626", 4) + dash(60, 0, 60, 120, "#fff", 4)); },
    asl: function () { return road(L(0, 30, 120, 30, "#fff", 4) + L(0, 92, 120, 92, "#fff", 4) + '<rect x="0" y="34" width="120" height="54" fill="#16a34a" opacity=".5"/>' + BIKE(60, 62, 2, "#fff") + L(20, 92, 20, 120, "#fff", 3)); },
    // ---- dashboard warning lights ----
    oilLight: function () { return dashIcon('<path d="M22 68 L66 68 L94 52 L82 50 L70 58 L48 58 L44 50 L30 50 L22 58 Z"/><path d="M98 64 Q102 72 98 76"/>', "#ef4444"); },
    batteryLight: function () { return dashIcon('<rect x="24" y="40" width="72" height="46" rx="4"/><path d="M36 40 L36 32 M84 40 L84 32 M38 62 L50 62 M72 62 L82 62 M77 57 L77 67"/>', "#ef4444"); },
    tempLight: function () { return dashIcon('<path d="M60 22 L60 70 M60 34 L72 34 M60 46 L72 46 M60 58 L72 58"/><circle cx="60" cy="78" r="8"/><path d="M28 92 Q36 86 44 92 Q52 98 60 92 Q68 86 76 92 Q84 98 92 92"/>', "#ef4444"); },
    absLight: function () { return dashIcon('<circle cx="60" cy="60" r="26"/><path d="M28 36 Q18 60 28 84 M92 36 Q102 60 92 84"/>', "#f59e0b") + T(60, 69, "ABS", 20, "#f59e0b"); },
    brakeLight: function () { return dashIcon('<circle cx="60" cy="60" r="26"/><path d="M28 36 Q18 60 28 84 M92 36 Q102 60 92 84 M60 46 L60 62"/><circle cx="60" cy="72" r="2" fill="#ef4444"/>', "#ef4444"); },
    glowLight: function () { return dashIcon('<path d="M30 40 Q40 30 50 40 Q60 50 70 40 Q80 30 90 40 M30 40 L30 80 M90 40 L90 80 M44 80 L44 96 M60 80 L60 96 M76 80 L76 96 M30 80 L90 80"/>', "#f59e0b"); }
  };
  for (var k in NEW) SIGNS[k] = NEW[k];

  var MAP = {
    1005: "lightsAmber", 1006: "lightsRedAmber", 1078: "lightsGreen", 1125: "lightsRed", 1117: "lightsRed",
    1032: "lightsFlashAmber", 1036: "wigwag", 1037: "lightsOut", 1087: "tramLights", 1128: "cycleLight", 1088: "laneOpen", 1129: "vms",
    1086: "belisha", 3013: "beaconGreen", 3014: "beaconAmber", 3026: "pPlate",
    1048: "noOvertaking", 1053: "noMotor", 1054: "noGoods", 1134: "noGoods", 1055: "maxHeight", 1126: "maxWidth",
    1097: "noPedestrians", 1099: "noMotorcycles", 1100: "noWaiting",
    1094: "miniRoundabout", 1095: "busOnly", 1096: "pedOnly", 1098: "horseRoute", 1118: "passEither",
    1075: "oneWay", 1076: "noThrough", 1077: "endMotorway", 1120: "parkRide", 1121: "hospital", 1124: "diversion", 1039: "busLane", 1047: "repeater",
    1057: "levelNoGate", 1058: "levelGate", 1059: "trams", 1061: "humpBridge", 1062: "fallingRocks", 1064: "quayside", 1065: "aircraft",
    1066: "doubleBend", 1067: "sideWinds", 1068: "queues", 1069: "roundaboutWarn", 1070: "sideRoad", 1071: "uneven", 1072: "swingBridge",
    1073: "merging", 1074: "cycleWarn", 1101: "otherDanger", 1102: "pedCrossing", 1103: "hillDown", 1104: "hillUp", 1105: "cattle",
    1106: "narrowRight", 1107: "elderly", 1108: "horseRiders", 1109: "staggered", 1110: "chippings", 1111: "dualEnds", 1116: "humps",
    1119: "chevrons", 6061: "chevrons", 1130: "schoolPatrol", 6012: "patrolSign", 1131: "pony", 1132: "yJunction", 1133: "flooding",
    6016: "bendRight", 6020: "deer", 6036: "slippery", 6067: "narrows",
    1027: "dblWhiteSolidNear", 1028: "dblWhiteSolidNear", 1083: "dblWhiteBrokenNear", 1029: "hazardLine", 1112: "centreLine",
    1030: "zigzagYellow", 1031: "zigzagWhite", 1079: "yellowBox", 1080: "deflection", 1082: "keepClear", 1113: "dragonTeeth",
    1114: "giveWayMark", 1115: "cycleMark", 1089: "rumble", 1090: "yellowBars", 1040: "redRoute", 7008: "asl", 7035: "asl",
    4050: "oilLight", 4051: "batteryLight", 4052: "tempLight", 4053: "absLight", 4054: "brakeLight", 4072: "glowLight"
  };
  questions.forEach(function (q) { if (!q.sign && MAP[q.id] && SIGNS[MAP[q.id]]) q.sign = MAP[q.id]; });
})();
