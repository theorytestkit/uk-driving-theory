// auth.js - login (Google + email/password), progress saved to the account, one device at a time.
(function () {
  var SB_URL = "https://fknovtlwznswxngvtwmv.supabase.co";
  var SB_KEY = "sb_publishable_EXWchBMmqlnzoJIPVFydCQ_PWZF31cG";
  if (!window.supabase) { return; }
  var sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  var deviceId;
  try { deviceId = localStorage.getItem("deviceId"); if (!deviceId) { deviceId = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()); localStorage.setItem("deviceId", deviceId); } } catch (e) { deviceId = "d" + Math.random(); }

  // ---------- look ----------
  var css = document.createElement("style");
  css.textContent =
    "#authBox{position:fixed;inset:0;z-index:9999;background:#1e5bd8;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif}" +
    "#authBox .card2{background:#fff;border-radius:16px;padding:22px;max-width:380px;width:100%;box-shadow:0 8px 30px rgba(0,0,0,.25)}" +
    "#authBox h2{margin:0 0 4px;font-size:1.3rem}#authBox p{margin:0 0 14px;color:#555;font-size:.92rem}" +
    "#authBox input{width:100%;padding:12px;margin:0 0 10px;border:1px solid #bbb;border-radius:10px;font-size:1rem;box-sizing:border-box}" +
    "#authBox button{width:100%;padding:13px;border:0;border-radius:10px;font-size:1rem;cursor:pointer;margin:0 0 10px}" +
    "#authBox .pri{background:#1e5bd8;color:#fff}#authBox .goo{background:#fff;border:1px solid #bbb;color:#222}" +
    "#authBox .lnk{background:none;color:#1e5bd8;padding:6px;margin:0;font-size:.9rem}" +
    "#authBox .msg{font-size:.9rem;margin:0 0 10px;color:#b00020}#authBox .ok{color:#1b7a3a}" +
    "#authOut{position:fixed;right:10px;bottom:10px;z-index:9000;background:#fff;border:1px solid #bbb;border-radius:20px;padding:6px 12px;font-size:.8rem;cursor:pointer;opacity:.85}";
  document.head.appendChild(css);

  var box = document.createElement("div");
  box.id = "authBox";
  box.innerHTML =
    '<div class="card2"><h2 id="aT">Welcome</h2><p id="aS">Log in to save your progress and use it on any device.</p>' +
    '<p id="aM" class="msg" style="display:none"></p>' +
    '<div id="aMain">' +
    '<button class="goo" id="aG">Continue with Google</button>' +
    '<input id="aE" type="email" placeholder="Email" autocomplete="email">' +
    '<input id="aP" type="password" placeholder="Password (min 6 characters)" autocomplete="current-password">' +
    '<button class="pri" id="aLogin">Log in</button>' +
    '<button class="lnk" id="aSign">Create new account</button>' +
    '<button class="lnk" id="aForgot">Forgot password?</button></div>' +
    '<div id="aNew" style="display:none"><input id="aNP" type="password" placeholder="New password"><button class="pri" id="aNPb">Save new password</button></div>' +
    '</div>';
  document.body.appendChild(box);
  var out = document.createElement("button");
  out.id = "authOut"; out.textContent = "Log out"; out.style.display = "none";
  document.body.appendChild(out);

  function $a(id) { return document.getElementById(id); }
  function msg(t, ok) { var m = $a("aM"); m.textContent = t || ""; m.className = "msg" + (ok ? " ok" : ""); m.style.display = t ? "block" : "none"; }
  function show() { box.style.display = "flex"; out.style.display = "none"; }
  function hide() { box.style.display = "none"; out.style.display = "block"; }
  function nice(e) {
    var t = (e && e.message) || "Something went wrong";
    if (/invalid login/i.test(t)) return "Wrong email or password. If you used Google before, tap Continue with Google.";
    if (/already registered/i.test(t)) return "This email already has an account. Tap Log in.";
    if (/at least 6/i.test(t)) return "Password must be at least 6 characters.";
    if (/not confirmed/i.test(t)) return "Please open the confirmation email we sent and tap the link first.";
    return t;
  }

  // ---------- buttons ----------
  $a("aG").onclick = function () { sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin } }); };
  $a("aLogin").onclick = async function () {
    msg("");
    var r = await sb.auth.signInWithPassword({ email: $a("aE").value.trim(), password: $a("aP").value });
    if (r.error) msg(nice(r.error));
  };
  $a("aSign").onclick = async function () {
    msg("");
    var r = await sb.auth.signUp({ email: $a("aE").value.trim(), password: $a("aP").value, options: { emailRedirectTo: location.origin } });
    if (r.error) return msg(nice(r.error));
    if (!r.data.session) msg("Account created. Now open the email we sent you and tap the confirm link, then come back and log in.", true);
  };
  $a("aForgot").onclick = async function () {
    var em = $a("aE").value.trim();
    if (!em) return msg("Type your email first, then tap Forgot password.");
    var r = await sb.auth.resetPasswordForEmail(em, { redirectTo: location.origin });
    msg(r.error ? nice(r.error) : "We sent a reset link to your email.", !r.error);
  };
  $a("aNPb").onclick = async function () {
    var r = await sb.auth.updateUser({ password: $a("aNP").value });
    if (r.error) return msg(nice(r.error));
    $a("aNew").style.display = "none"; $a("aMain").style.display = "block"; msg("Password changed.", true);
    var s = (await sb.auth.getSession()).data.session; if (s) start(s);
  };
  out.onclick = async function () { await sb.auth.signOut(); location.reload(); };

  // ---------- progress sync ----------
  var uid = null, timer = null, poll = null, started = false;
  function upload() {
    if (!uid) return;
    var data; try { data = JSON.parse(localStorage.getItem("save") || "null"); } catch (e) {}
    if (!data) return;
    sb.from("progress").upsert({ user_id: uid, data: data, updated_at: new Date().toISOString() }).then(function () {});
  }
  var origStore = window.store;
  if (typeof origStore === "function") {
    window.store = function () { origStore.apply(this, arguments); clearTimeout(timer); timer = setTimeout(upload, 1500); };
  }

  async function checkDevice() {
    if (!uid) return;
    var r = await sb.from("devices").select("device_id").eq("user_id", uid).maybeSingle();
    if (r.data && r.data.device_id !== deviceId) {
      clearInterval(poll); uid = null;
      await sb.auth.signOut();
      show(); msg("This account was opened on another device, so you were logged out here. Only one device at a time is allowed.");
    }
  }

  async function start(session) {
    if (started) return; started = true;
    uid = session.user.id;
    // this device becomes the active one (any other device is logged out)
    await sb.from("devices").upsert({ user_id: uid, device_id: deviceId, updated_at: new Date().toISOString() });
    var r = await sb.from("progress").select("data").eq("user_id", uid).maybeSingle();
    var local = localStorage.getItem("save");
    if (r.data && r.data.data) {
      var remote = JSON.stringify(r.data.data);
      if (remote !== local) {
        localStorage.setItem("save", remote);
        if (!sessionStorage.getItem("synced")) { sessionStorage.setItem("synced", "1"); location.reload(); return; }
      }
    } else { upload(); }
    sessionStorage.removeItem("synced");
    hide();
    poll = setInterval(checkDevice, 20000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) checkDevice(); });
  }

  sb.auth.onAuthStateChange(function (ev, session) {
    if (ev === "PASSWORD_RECOVERY") { show(); $a("aMain").style.display = "none"; $a("aNew").style.display = "block"; $a("aT").textContent = "Set a new password"; return; }
    if (session && !started && ev !== "PASSWORD_RECOVERY") setTimeout(function () { start(session); }, 0);
  });
  sb.auth.getSession().then(function (r) { if (!r.data.session) show(); });
})();
