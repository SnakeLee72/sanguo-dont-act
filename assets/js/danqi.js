/* 彈棋：把自己的棋子彈出去，把對手的棋子撞出棋盤（canvas 小遊戲） */
(function () {
  const { $, $$, toast } = SG;
  const cv = $("#game"), ctx = cv.getContext("2d");
  const S = 600, B0 = 46, B1 = 554, C = S / 2, R = 17, HR = 118, PULL = 140, VMAX = 920;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fit() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.width * dpr);
    ctx.setTransform(cv.width / S, 0, 0, cv.height / S, 0, 0);
  }
  const toLocal = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * S / r.width, y: (e.clientY - r.top) * S / r.height }; };

  /* ---------- 狀態 ---------- */
  let mode = "ai", st;
  const NAME = { b: "黑棋", w: "白棋" };
  function reset() {
    const ps = [];
    for (let i = 0; i < 6; i++) { ps.push({ side: "b", x: 100 + i * 80, y: 488, vx: 0, vy: 0, out: 0 }); ps.push({ side: "w", x: 100 + i * 80, y: 112, vx: 0, vy: 0, out: 0 }); }
    st = { ps, turn: "b", moving: false, aim: null, over: false, shot: null, thinking: false, msg: null, sparks: [] };
    $("#result").hidden = true; ui();
  }
  const alive = s => st.ps.filter(p => p.side === s && !p.out);
  const isAI = () => mode === "ai" && st.turn === "w";

  /* ---------- 操作：按住自己的棋子往後拉 ---------- */
  cv.addEventListener("pointerdown", e => {
    if (st.over || st.moving || isAI()) return;
    const m = toLocal(e);
    const p = alive(st.turn).sort((a, b) => Math.hypot(a.x - m.x, a.y - m.y) - Math.hypot(b.x - m.x, b.y - m.y))[0];
    if (!p || Math.hypot(p.x - m.x, p.y - m.y) > R + 16) { flash(`請按住自己的${NAME[st.turn]}往後拉`); return; }
    st.aim = { p, x: m.x, y: m.y }; cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener("pointermove", e => { if (st.aim) { const m = toLocal(e); st.aim.x = m.x; st.aim.y = m.y; } });
  cv.addEventListener("pointerup", () => {
    const a = st.aim; if (!a) return; st.aim = null;
    const v = vel(a); if (v) shoot(a.p, v.vx, v.vy);
  });
  cv.addEventListener("pointercancel", () => { st.aim = null; });
  function vel(a) {
    const dx = a.p.x - a.x, dy = a.p.y - a.y, len = Math.hypot(dx, dy);
    if (len < 10) return null;
    const k = Math.min(len, PULL) / PULL * VMAX;
    return { vx: dx / len * k, vy: dy / len * k, pw: Math.min(1, len / PULL) };
  }
  function shoot(p, vx, vy) {
    p.vx = vx; p.vy = vy; st.moving = true; st.shot = { side: st.turn, before: { b: alive("b").length, w: alive("w").length } };
  }

  /* ---------- 電腦：挑一顆最容易撞出界的對手棋子 ---------- */
  function edgeDist(x, y, ux, uy) {
    const ts = [];
    if (ux > 0) ts.push((B1 - x) / ux); if (ux < 0) ts.push((B0 - x) / ux);
    if (uy > 0) ts.push((B1 - y) / uy); if (uy < 0) ts.push((B0 - y) / uy);
    return Math.min(...ts);
  }
  function blocked(a, b) { // a→b 的路徑上有沒有別的棋子擋住
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
    return st.ps.some(q => {
      if (q === a || q === b || q.out) return false;
      const t = ((q.x - a.x) * dx + (q.y - a.y) * dy) / (L * L);
      if (t <= 0 || t >= 1) return false;
      return Math.hypot(a.x + dx * t - q.x, a.y + dy * t - q.y) < R * 2.05;
    });
  }
  function aiMove() {
    st.thinking = true; ui();
    setTimeout(() => {
      let bestS = -1e9, pick = null;
      for (const a of alive("w")) for (const b of alive("b")) {
        const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        const e = edgeDist(b.x, b.y, ux, uy), selfRisk = edgeDist(a.x, a.y, ux, uy) < L + 40 ? 120 : 0;
        const s = 700 - e * 1.1 - L * .35 - (blocked(a, b) ? 400 : 0) - selfRisk + Math.random() * 40;
        if (s > bestS) { bestS = s; pick = { a, ux, uy, L, e }; }
      }
      st.thinking = false;
      if (!pick) return endTurn();
      const noise = (Math.random() - .5) * .26, ang = Math.atan2(pick.uy, pick.ux) + noise;
      const sp = Math.max(420, Math.min(VMAX, (380 + pick.L * .5 + pick.e * 1.1) * (.85 + Math.random() * .3)));
      shoot(pick.a, Math.cos(ang) * sp, Math.sin(ang) * sp);
      ui();
    }, calm ? 300 : 750);
  }

  /* ---------- 物理 ---------- */
  function physics(dt) {
    const n = 4, h = dt / n;
    for (let k = 0; k < n; k++) {
      for (const p of st.ps) {
        if (p.out) continue;
        // 中間凸起：越靠近中心，往外推的力越大
        const dx = p.x - C, dy = p.y - C, d = Math.hypot(dx, dy);
        if (d < HR && d > .5) { const f = 240 * (1 - d / HR); p.vx += dx / d * f * h; p.vy += dy / d * f * h; }
        // 摩擦
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 0) { const ns = Math.max(0, sp * Math.exp(-1.25 * h) - 34 * h); p.vx *= ns / sp; p.vy *= ns / sp; }
        p.x += p.vx * h; p.y += p.vy * h;
        if (k === 0) { p.tr = p.tr || []; if (Math.hypot(p.vx, p.vy) > 80) { p.tr.push([p.x, p.y]); if (p.tr.length > 10) p.tr.shift(); } else if (p.tr.length) p.tr.shift(); }
        if (p.x < B0 || p.x > B1 || p.y < B0 || p.y > B1) { p.out = 1; p.fall = 1; }
      }
      // 棋子互撞（等重、幾乎彈性）
      for (let i = 0; i < st.ps.length; i++) for (let j = i + 1; j < st.ps.length; j++) {
        const a = st.ps[i], b = st.ps[j]; if (a.out || b.out) continue;
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        if (d >= R * 2 || d === 0) continue;
        const nx = dx / d, ny = dy / d, ov = R * 2 - d;
        a.x -= nx * ov / 2; a.y -= ny * ov / 2; b.x += nx * ov / 2; b.y += ny * ov / 2;
        const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (rel <= 0) continue;
        const imp = rel * .94;
        if (rel > 140 && !calm) for (let q = 0; q < Math.min(10, rel / 50); q++) { const an = Math.random() * Math.PI * 2, sp = 60 + Math.random() * rel * .4; st.sparks.push({ x: a.x + nx * R, y: a.y + ny * R, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, life: 1 }); }
        a.vx -= imp * nx; a.vy -= imp * ny; b.vx += imp * nx; b.vy += imp * ny;
      }
    }
    for (const p of st.ps) if (p.fall) { p.fall -= dt * 2.4; if (p.fall <= 0) p.fall = 0; }
    if (st.moving && st.ps.every(p => p.out || Math.hypot(p.vx, p.vy) < 3) && st.ps.every(p => !p.fall)) {
      st.ps.forEach(p => { p.vx = 0; p.vy = 0; });
      st.moving = false; endTurn();
    }
  }
  function endTurn() {
    const b = alive("b").length, w = alive("w").length;
    if (st.shot) {
      const s = st.shot, mine = s.side, opp = mine === "b" ? "w" : "b";
      const hit = s.before[opp] - (opp === "b" ? b : w), lost = s.before[mine] - (mine === "b" ? b : w);
      if (hit > 0) flash(hit > 1 ? `一次撞掉 ${hit} 枚！` : "撞掉一枚！");
      else if (lost > 0) flash("哎呀，自己的棋子飛出去了");
      st.shot = null;
    }
    if (!b || !w) return finish(b, w);
    st.turn = st.turn === "b" ? "w" : "b"; ui();
    if (isAI()) aiMove();
  }
  function finish(b, w) {
    st.over = true; ui();
    const res = $("#result"); res.hidden = false;
    let h, t;
    if (!b && !w) { h = "平手！"; t = "雙方的棋子同時全部出界，真是少見的結局。"; }
    else if (mode === "ai") {
      const win = w === 0;
      h = win ? `你贏了！還剩 ${b} 枚黑棋` : "電腦贏了……";
      t = win ? "這手彈棋功夫，連曹丕都要對你刮目相看！" : "彈棋要算好角度，也要注意別把自己的棋子彈出界。再來一局！";
      if (win) { try { localStorage.setItem("sgby_danqi_wins", (+localStorage.getItem("sgby_danqi_wins") || 0) + 1); } catch (_) {} }
    } else { h = `${w === 0 ? "黑棋" : "白棋"}獲勝！`; t = `還剩 ${Math.max(b, w)} 枚棋子。換邊再戰一局吧！`; }
    res.innerHTML = `<div class="th-res fade-in"><h2>${h}</h2><p>${t}</p><div class="row"><button class="btn btn-red" id="again">↺ 再來一局</button><button class="btn btn-line" id="share">📋 分享</button></div></div>`;
    $("#again").addEventListener("click", reset);
    $("#share").addEventListener("click", async () => {
      const text = `我在《三國別演了》玩曹丕最拿手的「彈棋」：${h} 換你挑戰：${location.href.split("#")[0]}`;
      try { await navigator.clipboard.writeText(text); toast("已複製！貼給朋友吧"); } catch (_) { prompt("複製這段文字分享：", text); }
    });
    res.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function flash(text) { st.msg = { text, t: 1.4 }; }

  /* ---------- 繪圖 ---------- */
  /* 棋盤只畫一次，存在離屏畫布 */
  let bgCanvas = null;
  function buildBoard() {
    const k = 2, c = document.createElement("canvas"); c.width = c.height = S * k;
    const g = c.getContext("2d"); g.scale(k, k);
    // 紫檀木框
    const fr = g.createLinearGradient(0, 0, S, S); fr.addColorStop(0, "#5A2A18"); fr.addColorStop(.5, "#7A3A22"); fr.addColorStop(1, "#3E1A0E");
    g.fillStyle = fr; g.fillRect(0, 0, S, S);
    g.strokeStyle = "rgba(0,0,0,.18)"; g.lineWidth = 1;
    for (let y = 4; y < S; y += 7) { g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(S * .3, y + 4, S * .6, y - 4, S, y + 2); g.stroke(); }
    // 金色嵌線與雲紋
    g.strokeStyle = "#C88A22"; g.lineWidth = 3; g.strokeRect(14, 14, S - 28, S - 28);
    g.lineWidth = 1.2; g.strokeRect(22, 22, S - 44, S - 44);
    const cloud = (x, y, r, rot) => { g.save(); g.translate(x, y); g.rotate(rot); g.strokeStyle = "#E0B45A"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r, Math.PI * .2, Math.PI * 1.8); g.stroke(); g.beginPath(); g.arc(r * .2, 0, r * .45, Math.PI, Math.PI * 2.4); g.stroke(); g.beginPath(); g.moveTo(r * .85, -r * .55); g.quadraticCurveTo(r * 1.8, -r * .9, r * 2.2, 0); g.stroke(); g.restore(); };
    [[30, 30, 0], [S - 30, 30, Math.PI / 2], [S - 30, S - 30, Math.PI], [30, S - 30, -Math.PI / 2]].forEach(([x, y, r]) => cloud(x, y, 7, r));
    [C, C].forEach(() => 0);
    for (let x = 120; x < S - 100; x += 120) { cloud(x, 31, 5, 0); cloud(x, S - 31, 5, Math.PI); cloud(31, x, 5, -Math.PI / 2); cloud(S - 31, x, 5, Math.PI / 2); }
    // 玉石面
    g.save(); g.beginPath(); g.rect(B0, B0, B1 - B0, B1 - B0); g.clip();
    const jade = g.createRadialGradient(C - 60, C - 80, 30, C, C, 380);
    jade.addColorStop(0, "#E6F4E0"); jade.addColorStop(.4, "#A8D0A0"); jade.addColorStop(1, "#4E8456");
    g.fillStyle = jade; g.fillRect(B0, B0, B1 - B0, B1 - B0);
    // 玉的紋路（固定亂數，不會每次不一樣）
    let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 26; i++) {
      g.strokeStyle = `rgba(${rnd() < .5 ? "255,255,255" : "40,90,50"},${.06 + rnd() * .1})`; g.lineWidth = .6 + rnd() * 2.2;
      g.beginPath(); let x = B0 + rnd() * (B1 - B0), y = B0 + rnd() * (B1 - B0); g.moveTo(x, y);
      for (let j = 0; j < 4; j++) { const nx = x + (rnd() - .5) * 200, ny = y + (rnd() - .5) * 120; g.quadraticCurveTo((x + nx) / 2 + (rnd() - .5) * 60, (y + ny) / 2 + (rnd() - .5) * 60, nx, ny); x = nx; y = ny; }
      g.stroke();
    }
    // 中間隆起：亮面在左上、暗面在右下
    const hi = g.createRadialGradient(C - 34, C - 38, 4, C - 10, C - 12, HR);
    hi.addColorStop(0, "rgba(255,255,255,.75)"); hi.addColorStop(.35, "rgba(255,255,255,.22)"); hi.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = hi; g.beginPath(); g.arc(C, C, HR, 0, Math.PI * 2); g.fill();
    const sh = g.createRadialGradient(C - 30, C - 30, HR * .55, C, C, HR * 1.05);
    sh.addColorStop(0, "rgba(20,50,25,0)"); sh.addColorStop(.85, "rgba(20,50,25,.2)"); sh.addColorStop(1, "rgba(20,50,25,0)");
    g.fillStyle = sh; g.beginPath(); g.arc(C, C, HR * 1.05, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 1; [HR * .35, HR * .65].forEach(r => { g.beginPath(); g.arc(C - 4, C - 4, r, Math.PI * .9, Math.PI * 1.6); g.stroke(); });
    // 雙方底線與中央圓點
    g.strokeStyle = "rgba(30,60,35,.35)"; g.setLineDash([8, 8]); g.lineWidth = 1.5;
    [112, 488].forEach(y => { g.beginPath(); g.moveTo(B0 + 12, y); g.lineTo(B1 - 12, y); g.stroke(); });
    g.setLineDash([]);
    g.restore();
    // 玉面邊緣的內陰影
    g.strokeStyle = "rgba(10,30,15,.55)"; g.lineWidth = 4; g.strokeRect(B0, B0, B1 - B0, B1 - B0);
    g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1; g.strokeRect(B0 + 3, B0 + 3, B1 - B0 - 6, B1 - B0 - 6);
    bgCanvas = c;
  }
  function drawBoard() {
    if (!bgCanvas) buildBoard();
    ctx.drawImage(bgCanvas, 0, 0, S, S);
  }
  function drawPiece(p) {
    const s = p.out ? p.fall : 1; if (s <= 0) return;
    // 拖尾
    if (!p.out && p.tr && p.tr.length > 1) p.tr.forEach(([x, y], i) => { ctx.fillStyle = p.side === "b" ? `rgba(20,20,28,${i / p.tr.length * .18})` : `rgba(255,255,255,${i / p.tr.length * .3})`; ctx.beginPath(); ctx.arc(x, y, R * (.5 + i / p.tr.length * .4), 0, Math.PI * 2); ctx.fill(); });
    ctx.save(); ctx.globalAlpha = s; ctx.translate(p.x, p.y); ctx.scale(s, s);
    // 影子（凸起處影子偏移較多）
    const d = Math.hypot(p.x - C, p.y - C), lift = d < HR ? (1 - d / HR) * 4 : 0;
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(3 + lift, 5 + lift, R, R * .82, 0, 0, Math.PI * 2); ctx.fill();
    // 側邊厚度
    ctx.fillStyle = p.side === "b" ? "#050508" : "#A89C82"; ctx.beginPath(); ctx.ellipse(0, 3, R, R * .96, 0, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(-6, -8, 1, 0, 0, R);
    if (p.side === "b") { g.addColorStop(0, "#7A7A88"); g.addColorStop(.35, "#2E2E38"); g.addColorStop(1, "#0A0A0E"); }
    else { g.addColorStop(0, "#FFFFFF"); g.addColorStop(.55, "#F1ECDF"); g.addColorStop(1, "#C9BEA4"); }
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
    // 金邊、刻紋
    ctx.strokeStyle = p.side === "b" ? "rgba(224,180,90,.85)" : "rgba(160,120,60,.75)"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, 0, R - 3.5, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, R - 8, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = p.side === "b" ? "rgba(224,180,90,.85)" : "rgba(160,120,60,.8)";
    for (let i = 0; i < 4; i++) { const an = i * Math.PI / 2 + Math.PI / 4; ctx.beginPath(); ctx.arc(Math.cos(an) * (R - 5.7), Math.sin(an) * (R - 5.7), 1.3, 0, Math.PI * 2); ctx.fill(); }
    // 高光
    ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.ellipse(-6, -8, 5, 2.6, -.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function drawSparks(dt) {
    st.sparks = st.sparks.filter(f => (f.life -= dt * 2.2) > 0);
    st.sparks.forEach(f => { f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= .92; f.vy *= .92; ctx.fillStyle = `rgba(255,236,170,${f.life})`; ctx.beginPath(); ctx.arc(f.x, f.y, 1.5 + f.life * 1.5, 0, Math.PI * 2); ctx.fill(); });
  }
  function drawTurnGlow() {
    if (st.moving || st.over) return;
    const t = performance.now() / 400;
    alive(st.turn).forEach(p => {
      ctx.strokeStyle = `rgba(240,178,62,${.35 + .25 * Math.sin(t)})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, R + 5, 0, Math.PI * 2); ctx.stroke();
    });
  }
  function drawAim() {
    const a = st.aim; if (!a) return;
    const v = vel(a);
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.setLineDash([4, 5]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(a.p.x, a.p.y); ctx.lineTo(a.x, a.y); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(240,178,62,.9)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(a.p.x, a.p.y, R + 6, 0, Math.PI * 2); ctx.stroke();
    if (!v) return;
    const sp = Math.hypot(v.vx, v.vy), ux = v.vx / sp, uy = v.vy / sp, len = 60 + v.pw * 160;
    const sx = a.p.x + ux * (R + 6), sy = a.p.y + uy * (R + 6), ex = a.p.x + ux * len, ey = a.p.y + uy * len;
    const col = v.pw > .85 ? "#D7263D" : v.pw > .5 ? "#F08A24" : "#F0B23E";
    const g = ctx.createLinearGradient(sx, sy, ex, ey); g.addColorStop(0, "rgba(255,255,255,.2)"); g.addColorStop(1, col);
    ctx.strokeStyle = g; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(ex + ux * 14, ey + uy * 14); ctx.lineTo(ex - uy * 11, ey + ux * 11); ctx.lineTo(ex + uy * 11, ey - ux * 11); ctx.fill();
    // 預測方向的虛線
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.setLineDash([3, 7]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + ux * 120, ey + uy * 120); ctx.stroke(); ctx.setLineDash([]);
  }
  function drawMsg(dt) {
    const m = st.msg; if (!m) return;
    m.t -= dt; if (m.t <= 0) { st.msg = null; return; }
    ctx.save(); ctx.globalAlpha = Math.min(1, m.t * 2.5); ctx.textAlign = "center";
    ctx.font = '700 34px "LXGW WenKai TC", serif'; ctx.lineWidth = 6; ctx.strokeStyle = "rgba(30,40,20,.75)"; ctx.fillStyle = "#FFE7A3";
    ctx.strokeText(m.text, C, C - 150); ctx.fillText(m.text, C, C - 150); ctx.restore();
  }
  function ui() {
    const b = alive("b").length, w = alive("w").length;
    const who = st.over ? "對局結束" : st.thinking ? "🤖 電腦思考中…" : mode === "ai" ? (st.turn === "b" ? "👉 輪到你（黑棋）" : "🤖 電腦（白棋）出手") : `👉 輪到${NAME[st.turn]}`;
    $("#hud").innerHTML = `<span><b>${who}</b></span><span>⚫ 黑棋 ${b} 枚</span><span>⚪ 白棋 ${w} 枚</span>`;
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(.04, (now - last) / 1000); last = now;
    physics(dt);
    ctx.clearRect(0, 0, S, S);
    drawBoard(); drawTurnGlow();
    st.ps.filter(p => p.out).forEach(drawPiece); st.ps.filter(p => !p.out).forEach(drawPiece);
    drawSparks(dt); drawAim(); drawMsg(dt);
    requestAnimationFrame(loop);
  }

  $$("[data-mode]").forEach(btn => btn.addEventListener("click", () => {
    mode = btn.dataset.mode;
    $$("[data-mode]").forEach(x => { const on = x === btn; x.setAttribute("aria-pressed", on); x.className = "btn btn-sm " + (on ? "btn-red" : "btn-line"); });
    reset();
  }));
  window.addEventListener("resize", fit);
  reset(); fit();
  if (document.fonts) document.fonts.ready.then(fit);
  requestAnimationFrame(loop);
})();
