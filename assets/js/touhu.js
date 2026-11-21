/* 投壺：拖曳拉弓、放開投箭（canvas 小遊戲） */
(function () {
  const { $, toast } = SG;
  const cv = $("#game"), ctx = cv.getContext("2d");
  const W = 800, H = 450, FLOOR = 382, HAND = { x: 112, y: 300 };
  const ROUNDS = [{ d: 380, label: "近" }, { d: 480, label: "中" }, { d: 580, label: "遠" }], ARROWS = 4;
  const G = 900, VMAX = 960, PULL = 170;
  const LINES = {
    in: [["曹操", "人才！這手感我要了，合約呢？"], ["小喬", "漂亮！穩穩進壺～"], ["諸葛亮", "角度、力道，皆在亮的計算之中。"]],
    ear: [["曹操", "貫耳！這種高手，一定要招募！"], ["小喬", "哇！穿過壺耳，太神了！"], ["諸葛亮", "此乃貫耳，難度極高。"]],
    miss: [["小喬", "差一點點！再試一次～"], ["諸葛亮", "力道稍過，下一箭收一點。"], ["曹操", "勝敗乃兵家常事，再來！"]]
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 畫面縮放（高解析度） ---------- */
  function fit() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.width * H / W * dpr);
    ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
  }
  const toLocal = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; };

  /* ---------- 遊戲狀態 ---------- */
  let st;
  function reset() {
    st = { round: 0, left: ARROWS, score: 0, roundScore: [0, 0, 0], arrow: null, stuck: [], aim: null, msg: null, over: false, bests: best(), fx: [], trail: [], wob: 0, cheer: 0, ring: 0, pops: [] };
    board(); ui();
  }
  const potX = () => HAND.x + ROUNDS[st.round].d;
  function best() { try { return +localStorage.getItem("sgby_touhu_best") || 0; } catch (_) { return 0; } }
  function saveBest(n) { try { if (n > best()) localStorage.setItem("sgby_touhu_best", n); } catch (_) {} }

  /* 壺的形狀（側面） */
  const pot = () => {
    const x = potX();
    return { x, mouthY: 236, mouthHalf: 12, rimHalf: 16, neckTop: 236, neckBot: 316, neckHalf: 11, bellyY: 346, bellyRx: 38, bellyRy: 34,
      ears: [{ x: x - 25, y: 268 }, { x: x + 25, y: 268 }], earR: 9, earIn: 5.5 };
  };

  /* ---------- 投擲 ---------- */
  cv.addEventListener("pointerdown", e => {
    if (st.over || st.arrow) return;
    const p = toLocal(e); st.aim = { sx: p.x, sy: p.y, x: p.x, y: p.y };
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener("pointermove", e => { if (st.aim) { const p = toLocal(e); st.aim.x = p.x; st.aim.y = p.y; } });
  cv.addEventListener("pointerup", () => {
    if (!st.aim) return;
    const v = launchVel(st.aim); st.aim = null;
    if (!v) return;
    st.arrow = { x: HAND.x, y: HAND.y, vx: v.vx, vy: v.vy, done: false, hit: false, age: 0, rot: 0, spin: 0 }; st.trail = [];
    st.left--; ui();
  });
  cv.addEventListener("pointercancel", () => { st.aim = null; });
  function launchVel(a) {
    const dx = a.sx - a.x, dy = a.sy - a.y, len = Math.hypot(dx, dy);
    if (len < 12) return null;
    const k = Math.min(len, PULL) / PULL * VMAX;
    return { vx: dx / len * k, vy: dy / len * k };
  }

  function step(dt) {
    const a = st.arrow; if (!a || a.done) return;
    const P = pot();
    a.age += dt;
    if (a.age > 5) return land("miss", { x: Math.min(W - 20, Math.max(20, a.x)), y: FLOOR }); // 保險：飛太久就算沒進
    if (a.hit) a.rot += a.spin * dt;
    for (let i = 0; i < 6; i++) {
      const h = dt / 6, px = a.x, py = a.y;
      if (i === 0) { st.trail.push({ x: a.x, y: a.y }); if (st.trail.length > 14) st.trail.shift(); }
      a.vy += G * h; a.x += a.vx * h; a.y += a.vy * h;
      if (!a.hit) {
        // 貫耳：箭頭穿過壺耳的圓圈
        for (const ear of P.ears) if (Math.hypot(a.x - ear.x, a.y - ear.y) < P.earIn) return land("ear", { x: ear.x, y: ear.y });
        // 從上方掉進壺口
        if (py < P.mouthY && a.y >= P.mouthY && a.vy > 0) {
          const off = Math.abs(a.x - P.x);
          if (off < P.mouthHalf) return land("in", { x: a.x, y: P.mouthY });
          if (off < P.rimHalf) { a.y = P.mouthY - 1; a.vy *= -.35; a.vx *= -.45; st.wob = .6; burst(a.x, P.mouthY, 8, ["#FFE7A3", "#C9A45A"], 120); continue; } // 撞到壺口邊緣彈開
        }
        // 撞到壺頸或壺身：彈開、翻滾、掉到地上（之後不再跟壺碰撞，才不會卡住）
        const inNeck = Math.abs(a.x - P.x) < P.neckHalf && a.y > P.neckTop && a.y < P.neckBot;
        const inBelly = ((a.x - P.x) / P.bellyRx) ** 2 + ((a.y - P.bellyY) / P.bellyRy) ** 2 < 1;
        if (inNeck || inBelly) {
          const side = px < P.x ? -1 : 1;
          a.hit = true; a.x = px; a.y = py; a.rot = Math.atan2(a.vy, a.vx);
          a.vx = side * (80 + Math.abs(a.vx) * .2); a.vy = -60 - Math.random() * 60; a.spin = side * (6 + Math.random() * 4);
          st.wob = .6; burst(px, py, 10, ["#FFE7A3", "#C9A45A"], 140);
        }
      }
      if (a.y >= FLOOR) return land("miss", { x: a.x, y: FLOOR });
      if (a.x > W + 60 || a.x < -60) return land("miss", null);
    }
  }
  function land(kind, at) {
    const a = st.arrow; a.done = true;
    const ang = Math.atan2(a.vy, a.vx);
    if (at) st.stuck.push({ x: at.x, y: at.y, ang: kind === "miss" ? Math.min(.25, Math.max(-.25, ang * .2)) : kind === "ear" ? ang : Math.max(1.1, Math.min(1.9, ang)), kind, round: st.round });
    if (kind === "in") { st.wob = 1; st.cheer = 1.6; burst(pot().x, pot().mouthY, 26, ["#FFE7A3", "#F0B23E", "#fff"], 260); }
    else if (kind === "ear") { st.wob = 1; st.cheer = 2; st.ring = 1; burst(at.x, at.y, 34, ["#F7D774", "#fff", "#F0B23E"], 300); }
    else if (at) burst(at.x, FLOOR, 12, ["#B98A5A", "#8A5A33"], 90, true);
    st.trail = [];
    const pts = kind === "ear" ? 20 : kind === "in" ? 10 : 0;
    if (pts) st.pops.push({ x: at.x, y: at.y - 20, text: `+${pts}`, t: 1.2, gold: kind === "ear" });
    st.score += pts; st.roundScore[st.round] += pts;
    const [who, say] = pick(LINES[kind]);
    st.msg = { text: kind === "ear" ? "貫耳！+20" : kind === "in" ? "入壺！+10" : "沒進……", who, say, t: 1.6, kind };
    setTimeout(next, calm ? 700 : 1300);
  }
  function next() {
    st.arrow = null;
    if (st.left === 0) {
      if (st.round < ROUNDS.length - 1) { st.round++; st.left = ARROWS; st.stuck = st.stuck.filter(s => s.round === st.round); st.msg = { text: `第 ${st.round + 1} 回合：壺放得更${ROUNDS[st.round].label}了`, t: 1.8, kind: "round" }; }
      else return finish();
    }
    ui();
  }
  function finish() {
    st.over = true; saveBest(st.score); ui();
    const t = title(st.score);
    $("#result").hidden = false;
    $("#result").innerHTML = `<div class="th-res fade-in">
      <p class="muted small">三回合共 12 支箭</p>
      <h2>${st.score} 分・${t.name}</h2>
      <p>${t.text}</p>
      <p class="small muted">各回合：${st.roundScore.map((n, i) => `${ROUNDS[i].label} ${n}`).join("・")}　｜　你的最佳紀錄：${Math.max(st.score, st.bests)} 分</p>
      <div class="row"><button class="btn btn-red" id="again">↺ 再玩一次</button><button class="btn btn-line" id="share">📋 分享成績</button></div></div>`;
    $("#again").addEventListener("click", () => { $("#result").hidden = true; reset(); });
    $("#share").addEventListener("click", async () => {
      const text = `我在《三國別演了》投壺拿到 ${st.score} 分，稱號「${t.name}」！換你試試：${location.href.split("#")[0]}`;
      try { await navigator.clipboard.writeText(text); toast("已複製！貼給朋友吧"); } catch (_) { prompt("複製這段文字分享：", text); }
    });
  }
  function title(n) {
    if (n >= 150) return { name: "投壺名士", text: "箭箭入壺、還會貫耳，放在三國的宴席上，一定是全場焦點！" };
    if (n >= 90) return { name: "投壺高手", text: "手很穩！再多練幾次，就能挑戰貫耳。" };
    if (n >= 40) return { name: "宴席常客", text: "已經抓到訣竅了，遠的那一回合再加把勁。" };
    return { name: "投壺新手", text: "投壺要靠角度和力道，多拉幾次就會越來越準！" };
  }

  /* ---------- 繪圖 ---------- */
  function burst(x, y, n, colors, sp, dust) {
    if (calm) return;
    for (let i = 0; i < n; i++) {
      const ang = dust ? -Math.PI * (.15 + Math.random() * .7) : -Math.PI * Math.random() - (Math.random() < .3 ? Math.PI : 0) * .2;
      const v = sp * (.4 + Math.random() * .8);
      st.fx.push({ x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, life: 1, c: colors[i % colors.length], r: dust ? 4 + Math.random() * 5 : 2 + Math.random() * 2.5, dust });
    }
  }
  function drawFx(dt) {
    st.fx = st.fx.filter(f => (f.life -= dt * (f.dust ? 1.4 : 1.1)) > 0);
    st.fx.forEach(f => {
      f.vy += (f.dust ? -40 : 500) * dt; f.vx *= .98; f.x += f.vx * dt; f.y += f.vy * dt;
      ctx.globalAlpha = Math.max(0, f.life) * (f.dust ? .45 : 1); ctx.fillStyle = f.c;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (f.dust ? 2 - f.life : 1), 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // 貫耳的光環
    if (st.ring > 0) {
      st.ring -= dt * 1.4; const P = pot();
      P.ears.forEach(e => { ctx.strokeStyle = `rgba(247,215,116,${Math.max(0, st.ring)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(e.x, e.y, P.earR + (1 - st.ring) * 26, 0, Math.PI * 2); ctx.stroke(); });
    }
  }
  function drawTrail() {
    if (st.trail.length < 2) return;
    for (let i = 1; i < st.trail.length; i++) {
      const p = st.trail[i - 1], q = st.trail[i];
      ctx.strokeStyle = `rgba(255,226,160,${i / st.trail.length * .55})`; ctx.lineWidth = 1 + i / st.trail.length * 2.5;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    }
  }
  const T = () => performance.now() / 1000;
  function figure(x, y, robe, hat, opts = {}) { // 跪坐的人物（側面、Q 版）
    const bob = opts.cheer ? Math.abs(Math.sin(T() * 9)) * -5 * Math.min(1, opts.cheer) : 0;
    ctx.save(); ctx.translate(x, y + bob);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, 4 - bob, 26, 6, 0, 0, Math.PI * 2); ctx.fill();
    // 袍子
    const g = ctx.createLinearGradient(-22, -50, 22, 0); g.addColorStop(0, robe[0]); g.addColorStop(1, robe[1]);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-24, 2); ctx.quadraticCurveTo(-26, -34, -12, -48); ctx.lineTo(12, -48); ctx.quadraticCurveTo(26, -30, 24, 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,230,180,.55)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-6, -47); ctx.lineTo(4, -20); ctx.stroke(); // 交領
    // 頭
    ctx.fillStyle = opts.skin || "#F1D3B0"; ctx.beginPath(); ctx.arc(0, -60, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1F1A"; ctx.beginPath(); ctx.arc(0, -64, 14, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    if (hat) { ctx.fillStyle = hat; ctx.fillRect(-8, -84, 16, 12); ctx.fillRect(-12, -74, 24, 4); }
    if (opts.kind === "cao") { // 盔甲、頭盔、鬍子
      ctx.fillStyle = "#2E2E36"; ctx.beginPath(); ctx.arc(0, -64, 15.5, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "#C88A22"; ctx.fillRect(-15.5, -66, 31, 4); ctx.beginPath(); ctx.moveTo(-3, -79); ctx.lineTo(0, -88); ctx.lineTo(3, -79); ctx.fill();
      ctx.fillStyle = "#1E1612"; ctx.beginPath(); ctx.moveTo(-6, -53); ctx.quadraticCurveTo(4, -38, 13, -52); ctx.quadraticCurveTo(6, -48, -6, -53); ctx.fill();
      ctx.fillStyle = "#8A2323"; ctx.beginPath(); ctx.moveTo(-14, -46); ctx.lineTo(-30, 2); ctx.lineTo(-18, 2); ctx.closePath(); ctx.fill(); // 披風
      ctx.fillStyle = "#C88A22"; ctx.beginPath(); ctx.arc(-10, -44, 5, 0, Math.PI * 2); ctx.arc(10, -44, 5, 0, Math.PI * 2); ctx.fill();
    }
    if (opts.kind === "zhuge") { // 綸巾、眼鏡、羽扇
      ctx.fillStyle = "#1E1E24"; ctx.fillRect(-11, -86, 22, 14); ctx.fillStyle = "#3F7E55"; ctx.beginPath(); ctx.arc(0, -79, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#5A4630"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(2, -60, 3.6, 0, Math.PI * 2); ctx.arc(10, -60, 3.6, 0, Math.PI * 2); ctx.stroke();
      const fan = Math.sin(T() * 3) * .15;
      ctx.save(); ctx.translate(16, -40); ctx.rotate(-.5 + fan);
      ctx.fillStyle = "#F7F2E6"; ctx.strokeStyle = "rgba(120,110,90,.6)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-14, -16, -4, -32); ctx.quadraticCurveTo(10, -30, 12, -14); ctx.closePath(); ctx.fill(); ctx.stroke();
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-6 + k * 5, -28 + Math.abs(k - 1.5) * 3); ctx.stroke(); }
      ctx.fillStyle = "#8A5A33"; ctx.fillRect(-1.5, 0, 3, 10); ctx.restore();
    }
    if (opts.kind === "qiao") { // 雙髻與花
      ctx.fillStyle = "#2A1F1A"; ctx.beginPath(); ctx.arc(-9, -77, 7, 0, Math.PI * 2); ctx.arc(9, -77, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#F28BA8"; [[-13, -80], [13, -80], [-5, -84]].forEach(([fx, fy]) => { ctx.beginPath(); ctx.arc(fx, fy, 2.6, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = "rgba(242,139,168,.55)"; ctx.beginPath(); ctx.arc(9, -54, 3, 0, Math.PI * 2); ctx.fill(); // 腮紅
    }
    ctx.fillStyle = "#2A1F1A"; ctx.beginPath(); ctx.arc(opts.face || 5, -60, 1.8, 0, Math.PI * 2); ctx.fill();
    if (opts.cheer > .1) { ctx.strokeStyle = "#2A1F1A"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(opts.face || 5, -55, 3.5, .1 * Math.PI, .9 * Math.PI); ctx.stroke(); }
    // 手臂
    if (opts.arm) { ctx.strokeStyle = robe[0]; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(6, -40); ctx.lineTo(opts.arm[0] - x, opts.arm[1] - y - bob); ctx.stroke(); ctx.fillStyle = "#F1D3B0"; ctx.beginPath(); ctx.arc(opts.arm[0] - x, opts.arm[1] - y - bob, 5, 0, Math.PI * 2); ctx.fill(); }
    else if (opts.cheer > .1) { ctx.strokeStyle = robe[0]; ctx.lineWidth = 8; ctx.lineCap = "round"; [-1, 1].forEach(sx => { ctx.beginPath(); ctx.moveTo(sx * 10, -42); ctx.lineTo(sx * 20, -66 + Math.sin(T() * 12) * 3); ctx.stroke(); }); }
    ctx.restore();
  }
  function drawScene() {
    // 牆面
    const wall = ctx.createLinearGradient(0, 0, 0, FLOOR);
    wall.addColorStop(0, "#4A1412"); wall.addColorStop(1, "#8A3A26");
    ctx.fillStyle = wall; ctx.fillRect(0, 0, W, FLOOR);
    for (let x = 0; x < W; x += 46) { ctx.fillStyle = "rgba(0,0,0,.1)"; ctx.fillRect(x, 0, 2, FLOOR); }
    // 柱子
    [[8, "#5A1A12"], [W - 30, "#5A1A12"]].forEach(([x, c]) => { const g = ctx.createLinearGradient(x, 0, x + 22, 0); g.addColorStop(0, "#3A0E0A"); g.addColorStop(.5, "#9A3324"); g.addColorStop(1, "#3A0E0A"); ctx.fillStyle = g; ctx.fillRect(x, 0, 22, FLOOR); });
    // 帷幔
    ctx.fillStyle = "#6A1919"; ctx.fillRect(0, 0, W, 22);
    for (let x = 17; x < W; x += 34) { ctx.beginPath(); ctx.arc(x, 22, 17, 0, Math.PI); ctx.fillStyle = "#8A2323"; ctx.fill(); }
    ctx.fillStyle = "#C88A22"; ctx.fillRect(0, 20, W, 2);
    // 屏風：四扇山水
    const sx = 236, sw = 330, sy = 96, sh = 214;
    ctx.fillStyle = "#3A1A0E"; ctx.fillRect(sx - 6, sy - 6, sw + 12, sh + 12);
    for (let i = 0; i < 4; i++) {
      const x0 = sx + i * sw / 4 + 2, w0 = sw / 4 - 4;
      const pg = ctx.createLinearGradient(0, sy, 0, sy + sh); pg.addColorStop(0, "#F1E4C6"); pg.addColorStop(1, "#DCC79B");
      ctx.fillStyle = pg; ctx.fillRect(x0, sy, w0, sh);
    }
    ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip();
    const mtn = (base, pts, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(sx, base); pts.forEach(([x, y]) => ctx.lineTo(sx + x, y)); ctx.lineTo(sx + sw, base); ctx.lineTo(sx + sw, sy + sh); ctx.lineTo(sx, sy + sh); ctx.fill(); };
    mtn(220, [[30, 170], [70, 200], [120, 140], [170, 190], [220, 150], [280, 196], [330, 168]], "rgba(90,100,110,.35)");
    mtn(250, [[0, 230], [50, 200], [100, 236], [160, 196], [230, 238], [290, 210], [330, 236]], "rgba(60,70,75,.5)");
    ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(sx, 228, sw, 8);
    ctx.fillStyle = "rgba(184,67,47,.8)"; ctx.beginPath(); ctx.arc(sx + 262, 130, 11, 0, Math.PI * 2); ctx.fill(); // 夕陽
    ctx.strokeStyle = "rgba(40,40,40,.5)"; ctx.lineWidth = 1.3; // 飛鳥
    [[90, 126], [104, 120], [118, 130]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(sx + x - 5, y); ctx.quadraticCurveTo(sx + x, y - 4, sx + x, y); ctx.quadraticCurveTo(sx + x, y - 4, sx + x + 5, y); ctx.stroke(); });
    ctx.restore();
    ctx.strokeStyle = "#C88A22"; ctx.lineWidth = 2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(sx + i * sw / 4, sy); ctx.lineTo(sx + i * sw / 4, sy + sh); ctx.stroke(); }
    ctx.strokeRect(sx - 6, sy - 6, sw + 12, sh + 12);
    // 燈籠（會閃）
    // 匾額
    ctx.strokeStyle = "#C88A22"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(372, 22); ctx.lineTo(380, 40); ctx.moveTo(428, 22); ctx.lineTo(420, 40); ctx.stroke();
    ctx.fillStyle = "#2B0C0C"; ctx.fillRect(338, 38, 124, 44); ctx.strokeStyle = "#C88A22"; ctx.lineWidth = 3; ctx.strokeRect(341, 41, 118, 38); ctx.lineWidth = 1; ctx.strokeRect(346, 46, 108, 28);
    ctx.fillStyle = "#F0B23E"; ctx.font = '700 24px "LXGW WenKai TC", serif'; ctx.textAlign = "center"; ctx.fillText("投　壺", 400, 69); ctx.textAlign = "start";
    [[150, 66], [650, 66]].forEach(([x, y], k) => {
      const fl = .85 + Math.sin(T() * 6 + k * 2) * .08 + Math.sin(T() * 13 + k) * .05;
      ctx.strokeStyle = "#F3D9B8"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, 22); ctx.lineTo(x, y - 16); ctx.stroke();
      const g = ctx.createRadialGradient(x, y, 2, x, y, 60 * fl); g.addColorStop(0, `rgba(255,190,90,${.45 * fl})`); g.addColorStop(1, "rgba(255,190,90,0)");
      ctx.fillStyle = g; ctx.fillRect(x - 60, y - 60, 120, 120);
      const b = ctx.createRadialGradient(x, y - 4, 2, x, y, 20); b.addColorStop(0, "#FFD08A"); b.addColorStop(.6, "#E0482E"); b.addColorStop(1, "#A92A1C");
      ctx.fillStyle = b; ctx.beginPath(); ctx.ellipse(x, y, 20, 17, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#C88A22"; ctx.fillRect(x - 9, y - 19, 18, 4); ctx.fillRect(x - 9, y + 15, 18, 4);
      ctx.strokeStyle = "#F0B23E"; ctx.beginPath(); ctx.moveTo(x, y + 19); ctx.lineTo(x, y + 30); ctx.stroke();
    });
    // 地板
    const fl = ctx.createLinearGradient(0, FLOOR, 0, H);
    fl.addColorStop(0, "#8A5A33"); fl.addColorStop(1, "#4E301A");
    ctx.fillStyle = fl; ctx.fillRect(0, FLOOR, W, H - FLOOR);
    ctx.strokeStyle = "rgba(0,0,0,.18)"; ctx.lineWidth = 1;
    for (let y = FLOOR + 14; y < H; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.fillStyle = "#C88A22"; ctx.fillRect(0, FLOOR - 2, W, 3);
    // 席子
    const mat = (x, w) => { ctx.fillStyle = "#C9A36A"; ctx.fillRect(x, FLOOR + 2, w, 18); ctx.strokeStyle = "rgba(90,60,20,.35)"; for (let i = x + 4; i < x + w; i += 6) { ctx.beginPath(); ctx.moveTo(i, FLOOR + 2); ctx.lineTo(i, FLOOR + 20); ctx.stroke(); } ctx.fillStyle = "#7A2B22"; ctx.fillRect(x, FLOOR + 2, w, 3); ctx.fillRect(x, FLOOR + 17, w, 3); };
    mat(14, 150);
    // 觀眾：主持人坐在屏風前看
    const ch = st.cheer > 0 ? st.cheer : 0;
    figure(278, FLOOR, ["#3A3A48", "#1E1E28"], null, { cheer: ch, face: 6, kind: "cao", skin: "#D9A77E" });
    figure(338, FLOOR, ["#5A7A9A", "#2A3E58"], null, { cheer: ch, face: 6, kind: "zhuge" });
    figure(398, FLOOR, ["#F2B8C6", "#C9708A"], null, { cheer: ch, face: 6, kind: "qiao" });
    // 案几與酒杯
    ctx.fillStyle = "#5E3A1E"; ctx.fillRect(184, FLOOR - 22, 56, 6); ctx.fillRect(188, FLOOR - 16, 4, 16); ctx.fillRect(232, FLOOR - 16, 4, 16);
    ctx.fillStyle = "#B8432F"; [200, 222].forEach(x => { ctx.beginPath(); ctx.ellipse(x, FLOOR - 25, 7, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#8A2323"; ctx.fillRect(x - 5, FLOOR - 25, 10, 3); ctx.fillStyle = "#B8432F"; });
    ctx.fillStyle = "#E8DCC0"; ctx.beginPath(); ctx.ellipse(211, FLOOR - 29, 9, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#C46A3E"; ctx.beginPath(); ctx.arc(208, FLOOR - 31, 2.5, 0, Math.PI * 2); ctx.arc(214, FLOOR - 31, 2.5, 0, Math.PI * 2); ctx.fill();
    // 箭筒
    ctx.fillStyle = "#6B4A33"; ctx.fillRect(22, FLOOR - 58, 18, 56); ctx.fillStyle = "#C88A22"; ctx.fillRect(22, FLOOR - 58, 18, 4); ctx.fillRect(22, FLOOR - 26, 18, 3);
    for (let i = 0; i < st.left; i++) { ctx.strokeStyle = "#E8DCC0"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(26 + i * 3.5, FLOOR - 56); ctx.lineTo(26 + i * 3.5, FLOOR - 84); ctx.stroke(); ctx.fillStyle = "#B8432F"; ctx.fillRect(24.5 + i * 3.5, FLOOR - 86, 3, 6); }
    // 投壺的人
    const aiming = !!st.aim;
    figure(74, FLOOR, ["#8A2323", "#4D1414"], "#1E1E24", { arm: aiming ? [HAND.x - (st.aim.sx - st.aim.x) * .08, HAND.y - (st.aim.sy - st.aim.y) * .08] : [HAND.x, HAND.y], face: 7 });
    // 距離標示
    ctx.setLineDash([6, 6]); ctx.strokeStyle = "rgba(255,230,180,.35)"; ctx.beginPath(); ctx.moveTo(HAND.x, FLOOR + 30); ctx.lineTo(potX(), FLOOR + 30); ctx.stroke(); ctx.setLineDash([]);
  }
  function drawPot(dt) {
    const P = pot();
    st.wob = Math.max(0, st.wob - dt * 1.6);
    const tilt = st.wob * Math.sin(T() * 22) * .06;
    mat(P.x - 50, 100);
    function mat(x, w) { ctx.fillStyle = "#C9A36A"; ctx.fillRect(x, FLOOR + 2, w, 18); ctx.strokeStyle = "rgba(90,60,20,.35)"; for (let i = x + 4; i < x + w; i += 6) { ctx.beginPath(); ctx.moveTo(i, FLOOR + 2); ctx.lineTo(i, FLOOR + 20); ctx.stroke(); } ctx.fillStyle = "#7A2B22"; ctx.fillRect(x, FLOOR + 2, w, 3); ctx.fillRect(x, FLOOR + 17, w, 3); }
    ctx.fillStyle = "rgba(0,0,0,.32)"; ctx.beginPath(); ctx.ellipse(P.x + 6, FLOOR, 46, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(P.x, FLOOR); ctx.rotate(tilt); ctx.translate(-P.x, -FLOOR);
    const bronze = ctx.createLinearGradient(P.x - 40, 0, P.x + 40, 0);
    bronze.addColorStop(0, "#4A3A20"); bronze.addColorStop(.3, "#D8B46A"); bronze.addColorStop(.45, "#F2D99A"); bronze.addColorStop(.65, "#8C6E3A"); bronze.addColorStop(1, "#3E2F18");
    ctx.fillStyle = bronze; ctx.fillRect(P.x - 24, FLOOR - 12, 48, 12);
    ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.fillRect(P.x - 24, FLOOR - 4, 48, 4);
    ctx.fillStyle = bronze; ctx.beginPath(); ctx.ellipse(P.x, P.bellyY, P.bellyRx, P.bellyRy, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(40,25,10,.5)"; ctx.lineWidth = 1.5; ctx.stroke();
    // 紋飾帶：雲雷紋
    ctx.save(); ctx.beginPath(); ctx.ellipse(P.x, P.bellyY, P.bellyRx, P.bellyRy, 0, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "rgba(60,90,70,.55)"; ctx.fillRect(P.x - 40, P.bellyY - 10, 80, 16);
    ctx.strokeStyle = "rgba(240,210,140,.7)"; ctx.lineWidth = 1.2;
    for (let x = P.x - 38; x < P.x + 38; x += 10) { ctx.beginPath(); ctx.moveTo(x, P.bellyY + 2); ctx.lineTo(x, P.bellyY - 6); ctx.lineTo(x + 6, P.bellyY - 6); ctx.lineTo(x + 6, P.bellyY - 1); ctx.lineTo(x + 3, P.bellyY - 1); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,240,200,.35)"; ctx.beginPath(); ctx.ellipse(P.x - 14, P.bellyY - 14, 8, 14, -.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = bronze; ctx.fillRect(P.x - P.neckHalf, P.neckTop, P.neckHalf * 2, P.neckBot - P.neckTop);
    ctx.fillStyle = "rgba(60,90,70,.6)"; [P.neckTop + 20, P.neckBot - 14].forEach(y => ctx.fillRect(P.x - P.neckHalf, y, P.neckHalf * 2, 5));
    ctx.fillStyle = "rgba(255,240,200,.4)"; ctx.fillRect(P.x - 6, P.neckTop + 4, 3, P.neckBot - P.neckTop - 8);
    P.ears.forEach(e => {
      ctx.fillStyle = "#8C6E3A"; ctx.fillRect(Math.min(e.x, P.x) + (e.x < P.x ? P.earR - 2 : 0), e.y - 2, Math.abs(e.x - P.x) - P.earR + 2, 4);
      ctx.strokeStyle = "#D8B46A"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(e.x, e.y, P.earR - 1.5, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "rgba(40,25,10,.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(e.x, e.y, P.earR + .5, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.fillStyle = "#1E1208"; ctx.beginPath(); ctx.ellipse(P.x, P.mouthY, P.rimHalf, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#E8C77E"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.restore();
  }
  function drawArrow(x, y, ang, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(ang);
    const g = ctx.createLinearGradient(0, -2, 0, 2); g.addColorStop(0, "#F3E6C8"); g.addColorStop(1, "#B99A68");
    ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-2, 0); ctx.stroke();
    ctx.strokeStyle = "rgba(90,60,30,.6)"; ctx.lineWidth = 1; [-24, -50].forEach(x0 => { ctx.beginPath(); ctx.moveTo(x0, -1.6); ctx.lineTo(x0, 1.6); ctx.stroke(); });
    ctx.fillStyle = "#AEB8C0"; ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-6, -4); ctx.lineTo(-3, 0); ctx.lineTo(-6, 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#E8EEF2"; ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-2, -1.5); ctx.lineTo(-2, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#B8432F"; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-62, -8, -52, -2); ctx.lineTo(-56, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#8A2323"; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-62, 8, -52, 2); ctx.lineTo(-56, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F0B23E"; ctx.fillRect(-73, -1, 4, 2);
    ctx.restore();
  }
  function drawPops(dt) {
    st.pops = st.pops.filter(p => (p.t -= dt) > 0);
    st.pops.forEach(p => {
      ctx.save(); ctx.globalAlpha = Math.min(1, p.t * 1.8); ctx.textAlign = "center";
      ctx.font = `900 ${p.gold ? 30 : 26}px "Noto Sans TC", sans-serif`; ctx.lineWidth = 5; ctx.strokeStyle = "rgba(40,10,10,.75)"; ctx.fillStyle = p.gold ? "#F7D774" : "#FFE7A3";
      const y = p.y - (1.2 - p.t) * 40; ctx.strokeText(p.text, p.x, y); ctx.fillText(p.text, p.x, y); ctx.restore();
    });
  }
  function drawVignette() {
    const v = ctx.createRadialGradient(W / 2, H * .45, H * .35, W / 2, H * .5, W * .62);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(20,5,0,.4)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }
  function drawStuck(front) {
    st.stuck.filter(s => (s.kind === "in") !== front).forEach(s => {
      if (s.kind === "in") drawArrow(s.x, s.y + 28, s.ang); // 箭插在壺裡，露出箭尾
      else if (s.kind === "ear") drawArrow(s.x + 8 * Math.cos(s.ang), s.y + 8 * Math.sin(s.ang), s.ang);
      else drawArrow(s.x, s.y - 2, s.ang, .75);
    });
  }
  function drawAim() {
    const a = st.aim;
    if (!a) { if (!st.arrow && !st.over) drawArrow(HAND.x, HAND.y, -.5, .9); return; }
    const v = launchVel(a);
    const ang = v ? Math.atan2(v.vy, v.vx) : -.5;
    drawArrow(HAND.x, HAND.y, ang);
    // 拉弓的線
    ctx.strokeStyle = "rgba(255,230,180,.5)"; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(a.x, a.y); ctx.stroke(); ctx.setLineDash([]);
    if (!v) return;
    // 瞄準輔助：只畫前一小段弧線
    ctx.fillStyle = "rgba(255,226,160,.85)";
    for (let i = 1; i <= 9; i++) {
      const t = i * .035, x = HAND.x + v.vx * t, y = HAND.y + v.vy * t + G * t * t / 2;
      ctx.beginPath(); ctx.arc(x, y, 3 - i * .2, 0, Math.PI * 2); ctx.fill();
    }
    const pw = Math.min(1, Math.hypot(a.sx - a.x, a.sy - a.y) / PULL);
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(HAND.x - 40, HAND.y + 30, 80, 8);
    ctx.fillStyle = pw > .85 ? "#F7D774" : "#F0B23E"; ctx.fillRect(HAND.x - 40, HAND.y + 30, 80 * pw, 8);
  }
  function drawMsg(dt) {
    const m = st.msg; if (!m) return;
    m.t -= dt; if (m.t <= 0) { st.msg = null; return; }
    ctx.save(); ctx.globalAlpha = Math.min(1, m.t * 2.5);
    ctx.textAlign = "center"; ctx.font = '700 40px "LXGW WenKai TC", serif';
    ctx.lineWidth = 6; ctx.strokeStyle = "rgba(40,10,10,.8)"; ctx.fillStyle = m.kind === "ear" ? "#F7D774" : m.kind === "in" ? "#FFE7A3" : "#F3D9B8";
    ctx.strokeText(m.text, W / 2, 150); ctx.fillText(m.text, W / 2, 150);
    if (m.who) { ctx.font = '500 18px "Noto Sans TC", sans-serif'; ctx.lineWidth = 4; ctx.strokeText(`${m.who}：${m.say}`, W / 2, 184); ctx.fillStyle = "#fff"; ctx.fillText(`${m.who}：${m.say}`, W / 2, 184); }
    ctx.restore();
  }

  function ui() {
    $("#hud").innerHTML = `<span>🏮 第 <b>${st.round + 1}</b> / ${ROUNDS.length} 回合（${ROUNDS[st.round].label}）</span><span>🏹 剩 <b>${st.left}</b> 支箭</span><span>⭐ <b>${st.score}</b> 分</span><span class="muted">最佳 ${Math.max(st.bests, best())}</span>`;
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    step(dt);
    ctx.clearRect(0, 0, W, H);
    st.cheer = Math.max(0, st.cheer - dt);
    drawScene(); drawStuck(false); drawPot(dt); drawStuck(true); drawTrail();
    if (st.arrow && !st.arrow.done) drawArrow(st.arrow.x, st.arrow.y, st.arrow.hit ? st.arrow.rot : Math.atan2(st.arrow.vy, st.arrow.vx));
    drawAim(); drawFx(dt); drawVignette(); drawPops(dt); drawMsg(dt);
    requestAnimationFrame(loop);
  }
  function board() { /* 每回合清空舊箭（保留本回合的） */ }

  window.addEventListener("resize", fit);
  reset(); fit();
  if (document.fonts) document.fonts.ready.then(fit);
  requestAnimationFrame(loop);
})();
