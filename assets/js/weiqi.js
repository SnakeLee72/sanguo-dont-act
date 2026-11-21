/* 吃子棋：圍棋入門玩法，先吃到指定顆數的人贏（SVG 棋盤） */
(function () {
  const { $, $$, toast } = SG;
  const svg = $("#board"), CELL = 40;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NAME = { 1: "黑棋", 2: "白棋" };
  let N = 9, target = 1, mode = "ai", hints = true;
  let st;

  /* ---------- 規則引擎 ---------- */
  const nb = i => { const x = i % N, y = (i / N) | 0, r = []; if (x > 0) r.push(i - 1); if (x < N - 1) r.push(i + 1); if (y > 0) r.push(i - N); if (y < N - 1) r.push(i + N); return r; };
  function group(b, i) { // 回傳 { stones, libs }
    const c = b[i], stones = [i], seen = new Set([i]), libs = new Set();
    for (let k = 0; k < stones.length; k++) for (const j of nb(stones[k])) {
      if (b[j] === 0) libs.add(j);
      else if (b[j] === c && !seen.has(j)) { seen.add(j); stones.push(j); }
    }
    return { stones, libs };
  }
  // 試下一步：合法就回傳新盤面與吃掉的子，不合法回傳 null
  function tryPlay(b, i, c, ko) {
    if (b[i] !== 0 || i === ko) return null;
    const nbd = b.slice(); nbd[i] = c;
    const opp = 3 - c; let cap = [];
    for (const j of nb(i)) if (nbd[j] === opp) { const g = group(nbd, j); if (g.libs.size === 0) { g.stones.forEach(s => nbd[s] = 0); cap = cap.concat(g.stones); } }
    cap = [...new Set(cap)];
    const own = group(nbd, i);
    if (own.libs.size === 0) return null; // 不能自殺
    const newKo = cap.length === 1 && own.stones.length === 1 && own.libs.size === 1 ? cap[0] : -1;
    return { b: nbd, cap, ko: newKo, own };
  }
  const legal = (b, c, ko) => { const r = []; for (let i = 0; i < N * N; i++) if (tryPlay(b, i, c, ko)) r.push(i); return r; };

  /* ---------- 遊戲狀態 ---------- */
  function reset() {
    st = { b: new Array(N * N).fill(0), turn: 1, caps: { 1: 0, 2: 0 }, ko: -1, last: -1, hist: [], over: false, thinking: false, hover: -1, show: -1, placeT: 0, ghosts: [] };
    $("#result").hidden = true; draw(); ui();
  }
  function play(i) {
    if (st.over || st.thinking) return false;
    const r = tryPlay(st.b, i, st.turn, st.ko);
    if (!r) { toast(st.b[i] ? "這裡已經有棋子了" : i === st.ko ? "這裡剛被提子，要先下別的地方（打劫）" : "這一步自己沒有氣，不能下（禁著點）"); return false; }
    st.hist.push({ b: st.b, caps: { ...st.caps }, turn: st.turn, ko: st.ko, last: st.last });
    const now = performance.now();
    st.ghosts = r.cap.map(j => ({ i: j, c: st.b[j], t: now }));
    st.b = r.b; st.ko = r.ko; st.last = i; st.caps[st.turn] += r.cap.length; st.placeT = now; animate();
    if (r.cap.length) flash(i, r.cap.length);
    if (st.caps[st.turn] >= target) { draw(); ui(); return finish(st.turn), true; }
    st.turn = 3 - st.turn;
    if (!legal(st.b, st.turn, st.ko).length) { draw(); ui(); return finish(0), true; }
    draw(); ui();
    if (mode === "ai" && st.turn === 2) { st.thinking = true; ui(); setTimeout(aiMove, calm ? 150 : 520); }
    return true;
  }
  function undo() {
    if (st.thinking || !st.hist.length) return;
    const back = mode === "ai" ? (st.turn === 1 && st.hist.length >= 2 ? 2 : 1) : 1;
    let h; for (let k = 0; k < back && st.hist.length; k++) h = st.hist.pop();
    Object.assign(st, { b: h.b, caps: h.caps, turn: h.turn, ko: h.ko, last: h.last, over: false });
    $("#result").hidden = true; draw(); ui();
  }

  /* ---------- 電腦：能吃就吃、被叫吃就逃、不送死、找機會叫吃 ---------- */
  function aiMove() {
    const me = 2, op = 1, moves = legal(st.b, me, st.ko);
    // 自己現在被叫吃的棋
    const myAtari = new Set();
    for (let i = 0; i < N * N; i++) if (st.b[i] === me) { const g = group(st.b, i); if (g.libs.size === 1) g.stones.forEach(s => myAtari.add(s)); }
    let best = -1e9, pick = moves[0];
    for (const m of moves) {
      const r = tryPlay(st.b, m, me, st.ko); let s = 0;
      if (r.cap.length) s += 1000 * r.cap.length + (st.caps[me] + r.cap.length >= target ? 1e6 : 0);
      const L = r.own.libs.size;
      if (L === 1 && !r.cap.length) s -= 700;            // 自己送進叫吃
      s += L * 9;
      // 救回被叫吃的棋
      if (myAtari.size) { const saved = [...myAtari].filter(x => r.b[x] === me && group(r.b, x).libs.size >= 2).length; s += saved * 160; }
      // 下完以後還有沒有自己的棋只剩一口氣
      let danger = 0;
      for (let i = 0; i < N * N; i++) if (r.b[i] === me && group(r.b, i).libs.size === 1) danger++;
      s -= danger * 140;
      // 叫吃對手，且對手逃不掉更好
      const seen = new Set();
      for (const j of nb(m)) if (r.b[j] === op && !seen.has(j)) {
        const g = group(r.b, j); g.stones.forEach(x => seen.add(x));
        if (g.libs.size === 1) {
          s += 140;
          const esc = tryPlay(r.b, [...g.libs][0], op, -1);
          if (!esc || esc.own.libs.size <= 1) s += 260; // 跑了也只剩一口氣：抓得到
        } else s += (4 - Math.min(4, g.libs.size)) * 12;
      }
      const x = m % N, y = (m / N) | 0, c = (N - 1) / 2;
      s += nb(m).some(j => st.b[j]) ? 10 : 0;
      s -= (Math.abs(x - c) + Math.abs(y - c)) * 1.5;
      if (x === 0 || y === 0 || x === N - 1 || y === N - 1) s -= 12;
      s += Math.random() * 28; // 留一點破綻，小朋友才贏得了
      if (s > best) { best = s; pick = m; }
    }
    st.thinking = false;
    if (pick == null) return finish(0);
    play(pick);
  }

  /* ---------- 結束 ---------- */
  function finish(w) {
    st.over = true; ui();
    const res = $("#result"); res.hidden = false;
    let h, t;
    if (!w) { h = "沒有地方可以下了，平手！"; t = "棋盤下滿了還沒分出勝負，換大一點的目標再挑戰吧。"; }
    else if (mode === "ai") {
      h = w === 1 ? "你贏了！🎉" : "電腦贏了……";
      t = w === 1 ? `先吃到 ${target} 顆！這個眼力，曹操都要找你下一盤。` : "下棋前先看看：自己的棋還剩幾口氣？被叫吃（只剩一口氣）的棋要趕快長出去！";
      if (w === 1) { try { localStorage.setItem("sgby_weiqi_wins", (+localStorage.getItem("sgby_weiqi_wins") || 0) + 1); } catch (_) {} }
    } else { h = `${NAME[w]}獲勝！`; t = `先吃到 ${target} 顆棋子。換人先下再來一局吧！`; }
    res.innerHTML = `<div class="th-res fade-in"><h2>${h}</h2><p>${t}</p><div class="row"><button class="btn btn-red" id="again">↺ 再來一局</button><button class="btn btn-line" id="undo2">↶ 悔棋看看</button><button class="btn btn-line" id="share">📋 分享</button></div></div>`;
    $("#again").addEventListener("click", reset);
    $("#undo2").addEventListener("click", undo);
    $("#share").addEventListener("click", async () => {
      const text = `我在《三國別演了》下吃子棋：${h} 曹操、王粲都愛下圍棋，換你試試：${location.href.split("#")[0]}`;
      try { await navigator.clipboard.writeText(text); toast("已複製！貼給朋友吧"); } catch (_) { prompt("複製這段文字分享：", text); }
    });
  }
  let flashAt = null;
  function flash(i, n) { flashAt = { i, n, t: performance.now() }; }

  /* ---------- 畫棋盤 ---------- */
  const P = i => [(i % N + 1) * CELL, (((i / N) | 0) + 1) * CELL];
  function draw() {
    const S = (N + 1) * CELL, a = CELL, z = N * CELL;
    svg.setAttribute("viewBox", `0 0 ${S} ${S}`);
    const stars = N === 9 ? [[2, 2], [6, 2], [2, 6], [6, 6], [4, 4]] : [[3, 3]];
    let s = `<defs>
      <radialGradient id="wqB" cx="38%" cy="34%" r="68%"><stop offset="0" stop-color="#5E6270"/><stop offset=".3" stop-color="#2C2F38"/><stop offset=".8" stop-color="#101116"/><stop offset="1" stop-color="#050508"/></radialGradient>
      <radialGradient id="wqW" cx="38%" cy="34%" r="72%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F4EFE3"/><stop offset=".9" stop-color="#D3C9B0"/><stop offset="1" stop-color="#B8AD92"/></radialGradient>
      <radialGradient id="wqSheen" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="wqWood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0CF92"/><stop offset=".45" stop-color="#E2B878"/><stop offset="1" stop-color="#C9985A"/></linearGradient>
      <radialGradient id="wqVig" cx="50%" cy="45%" r="70%"><stop offset=".6" stop-color="#7A4A1C" stop-opacity="0"/><stop offset="1" stop-color="#7A4A1C" stop-opacity=".22"/></radialGradient>
      <pattern id="wqGrain" width="180" height="22" patternUnits="userSpaceOnUse"><path d="M0 6 Q45 2 90 6 T180 6M0 15 Q50 19 100 14 T180 16" stroke="rgba(120,70,20,.13)" stroke-width="1.4" fill="none"/></pattern>
      <clipPath id="wqClipW"><circle r="17.5"/></clipPath></defs>
      <rect y="6" width="${S}" height="${S - 6}" rx="10" fill="#8E5A28"/>
      <rect width="${S}" height="${S - 6}" rx="10" fill="url(#wqWood)"/><rect width="${S}" height="${S - 6}" rx="10" fill="url(#wqGrain)"/><rect width="${S}" height="${S - 6}" rx="10" fill="url(#wqVig)"/>
      <g class="wq-lines">`;
    for (let k = 0; k < N; k++) { const v = (k + 1) * CELL; s += `<path d="M${a} ${v}H${z}M${v} ${a}V${z}"/>`; }
    s += `<rect x="${a}" y="${a}" width="${z - a}" height="${z - a}" class="wq-edge"/></g>`;
    s += stars.map(([x, y]) => `<circle cx="${(x + 1) * CELL}" cy="${(y + 1) * CELL}" r="3.6" class="wq-star"/>`).join("");
    // 被叫吃（只剩一口氣）的棋
    const atari = new Set(), libsShow = new Set();
    if (hints) for (let i = 0; i < N * N; i++) if (st.b[i] && !atari.has(i)) { const g = group(st.b, i); if (g.libs.size === 1) g.stones.forEach(x => atari.add(x)); }
    if (st.show >= 0 && st.b[st.show]) group(st.b, st.show).libs.forEach(l => libsShow.add(l));
    for (let i = 0; i < N * N; i++) {
      const [x, y] = P(i);
      if (st.b[i]) {
        const age = i === st.last ? Math.min(1, (performance.now() - st.placeT) / 260) : 1, k = 1 + (1 - age) * .35, op = .4 + age * .6;
        s += `<g transform="translate(${x} ${y}) scale(${k.toFixed(3)})" opacity="${op.toFixed(2)}">${stone(st.b[i], i)}</g>`;
        if (atari.has(i)) s += `<circle cx="${x}" cy="${y}" r="21" class="wq-atari"/>`;
        if (i === st.last) s += `<circle cx="${x}" cy="${y}" r="5" class="wq-last ${st.b[i] === 1 ? "on-b" : "on-w"}"/>`;
      } else if (libsShow.has(i)) s += `<circle cx="${x}" cy="${y}" r="6" class="wq-lib"/>`;
    }
    // 被吃掉的子：淡出往上飄
    const now = performance.now();
    st.ghosts = st.ghosts.filter(g => now - g.t < 650);
    st.ghosts.forEach(g => { const [x, y] = P(g.i), t = (now - g.t) / 650; s += `<g transform="translate(${x} ${y - t * 18}) scale(${1 - t * .3})" opacity="${(1 - t).toFixed(2)}" pointer-events="none">${stone(g.c, -1)}</g>`; });
    // 預覽（滑鼠移過的空點）
    if (st.hover >= 0 && !st.b[st.hover] && !st.over && !st.thinking && !(mode === "ai" && st.turn === 2)) {
      const [x, y] = P(st.hover);
      s += `<circle cx="${x}" cy="${y}" r="17" fill="url(#wq${st.turn === 1 ? "B" : "W"})" opacity=".45" pointer-events="none"/>`;
    }
    if (flashAt && performance.now() - flashAt.t < 1400) {
      const [x, y] = P(flashAt.i);
      s += `<text x="${x}" y="${y - 26}" class="wq-pop">提子 ${flashAt.n}！</text>`;
    }
    svg.innerHTML = s;
  }
  // 一顆棋子：黑是板岩、白是貝殼（有細細的紋路）
  function stone(c, i) {
    if (c === 1) return `<circle cx="1.8" cy="2.8" r="17.5" fill="rgba(0,0,0,.32)"/><circle r="17.5" fill="url(#wqB)" class="wq-stone" data-i="${i}"/><ellipse cx="-5" cy="-6.5" rx="7" ry="4" fill="url(#wqSheen)" opacity=".45" transform="rotate(-30 -5 -6.5)"/>`;
    return `<circle cx="1.8" cy="2.8" r="17.5" fill="rgba(0,0,0,.28)"/><circle r="17.5" fill="url(#wqW)" class="wq-stone" data-i="${i}"/>
      <g clip-path="url(#wqClipW)" opacity=".22">${[6, 11, 16, 21, 26].map(r => `<circle cx="-14" cy="18" r="${r}" fill="none" stroke="#A89878" stroke-width=".8"/>`).join("")}</g>
      <ellipse cx="-5.5" cy="-7" rx="6.5" ry="3.6" fill="#fff" opacity=".8" transform="rotate(-30 -5.5 -7)"/>`;
  }
  let raf = 0;
  function animate() {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const tick = () => { draw(); if (performance.now() - t0 < 700) raf = requestAnimationFrame(tick); };
    if (calm) return draw();
    raf = requestAnimationFrame(tick);
  }
  // 吃子進度：已吃的子 ● 與還差幾顆 ○
  const pips = (c, n) => Array.from({ length: target }, (_, k) => `<i class="pip ${c}${k < n ? " got" : ""}"></i>`).join("");
  function ui() {
    const who = st.over ? "對局結束" : st.thinking ? "🤖 電腦思考中…" : mode === "ai" ? (st.turn === 1 ? "👉 輪到你（黑棋）" : "🤖 電腦（白棋）") : `👉 輪到${NAME[st.turn]}`;
    $("#hud").innerHTML = `<span><b>${who}</b></span><span class="bowl">黑吃 ${pips("w", st.caps[1])}</span><span class="bowl">白吃 ${pips("b", st.caps[2])}</span>`;
    $("#undo").disabled = !st.hist.length || st.thinking;
  }

  /* ---------- 操作 ---------- */
  function pointAt(e) {
    const r = svg.getBoundingClientRect(), S = (N + 1) * CELL;
    const gx = Math.round((e.clientX - r.left) * S / r.width / CELL) - 1, gy = Math.round((e.clientY - r.top) * S / r.height / CELL) - 1;
    return gx < 0 || gy < 0 || gx >= N || gy >= N ? -1 : gy * N + gx;
  }
  svg.addEventListener("click", e => {
    if (mode === "ai" && st.turn === 2) return;
    const i = pointAt(e); if (i >= 0) play(i);
  });
  svg.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const i = pointAt(e), show = i >= 0 && st.b[i] ? i : -1;
    if (i !== st.hover || show !== st.show) { st.hover = i; st.show = show; draw(); }
  });
  svg.addEventListener("pointerleave", () => { st.hover = -1; st.show = -1; draw(); });
  // 手機：長按自己的棋子看氣
  let pressT;
  svg.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") return; const i = pointAt(e); if (i >= 0 && st.b[i]) pressT = setTimeout(() => { st.show = i; draw(); }, 350); });
  ["pointerup", "pointercancel"].forEach(t => svg.addEventListener(t, () => { clearTimeout(pressT); if (st.show >= 0) setTimeout(() => { st.show = -1; draw(); }, 900); }));

  const opt = (sel, fn) => $$(sel).forEach(b => b.addEventListener("click", () => { $$(sel).forEach(x => { const on = x === b; x.setAttribute("aria-pressed", on); x.classList.toggle("on", on); }); fn(b.dataset); reset(); }));
  opt("[data-mode]", d => mode = d.mode);
  opt("[data-size]", d => N = +d.size);
  opt("[data-target]", d => target = +d.target);
  $("#undo").addEventListener("click", undo);
  $("#restart").addEventListener("click", reset);
  $("#hints").addEventListener("change", e => { hints = e.target.checked; draw(); });
  setInterval(() => { if (flashAt && performance.now() - flashAt.t < 1500) draw(); }, 250);
  reset();
})();
