/* 首頁 */
(function () {
  const { $, esc, avatar, personById, published, episodeCard, thumb, openPlayer, Store, Mine, links, verdictBadge, factionChip, FACTION } = SG;

  $("#heroAbout").textContent = SITE.about;
  $("#ytBtn").href = SITE.youtube;
  $("#spBtn").href = SITE.spotify;

  /* ---------- 戲台：絲絨布幕（連續布料物理）、流蘇、燈籠、聚光燈的互動 ---------- */
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const replay = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  // 建立左右戲台絲絨布幕（SVG 連續曲面＋金繩束帶＋垂穗）
  const BASE_TOP   = [0, 23, 49, 77, 106, 134, 160];
  const BASE_UP    = [0, 19, 41, 65,  90, 114, 138];
  const BASE_WAIST = [0, 11, 23, 36,  49,  61,  73];
  const BASE_LOW   = [0, 14, 30, 48,  66,  84, 102];
  const BASE_BOT   = [0, 17, 36, 56,  76,  95, 114];
  const FOLD_STOPS = [
    ["#2E0707", "#6B1717", "#9E2A24", "#C44332", "#741A1A", "#380909"],
    ["#340808", "#781B1B", "#AD312A", "#D14E3B", "#7E1D1D", "#3D0B0B"],
    ["#2B0606", "#661515", "#962620", "#BA3D2D", "#6E1818", "#350808"],
    ["#360909", "#7C1D1D", "#B2342C", "#D6533F", "#821F1F", "#3F0C0C"],
    ["#2F0707", "#701818", "#A32C26", "#C84735", "#761B1B", "#390A0A"],
    ["#380A0A", "#821F1F", "#B8382F", "#DE5A44", "#8A2222", "#450D0D"]
  ];

  function createDrape(el) {
    const right = el.classList.contains("right");
    const pfx = right ? "drR" : "drL";
    const grads = FOLD_STOPS.map((c, i) => `
      <linearGradient id="${pfx}_f${i}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${c[0]}"/>
        <stop offset="22%" stop-color="${c[1]}"/>
        <stop offset="48%" stop-color="${c[2]}"/>
        <stop offset="64%" stop-color="${c[3]}"/>
        <stop offset="84%" stop-color="${c[4]}"/>
        <stop offset="100%" stop-color="${c[5]}"/>
      </linearGradient>`).join("");

    el.innerHTML = `<svg class="drape-svg" viewBox="0 0 180 600" preserveAspectRatio="none">
      <defs>
        ${grads}
        <linearGradient id="${pfx}_back" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#1E0505"/>
          <stop offset="55%" stop-color="#4D1111"/>
          <stop offset="85%" stop-color="#6B1919"/>
          <stop offset="100%" stop-color="#2E0808"/>
        </linearGradient>
        <linearGradient id="${pfx}_shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0E0202" stop-opacity=".55"/>
          <stop offset="9%" stop-color="#0E0202" stop-opacity="0"/>
          <stop offset="56%" stop-color="#220505" stop-opacity=".18"/>
          <stop offset="88%" stop-color="#0E0202" stop-opacity=".08"/>
          <stop offset="100%" stop-color="#090101" stop-opacity=".52"/>
        </linearGradient>
        <linearGradient id="${pfx}_gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFF0B8"/>
          <stop offset="35%" stop-color="#E5A832"/>
          <stop offset="70%" stop-color="#9E6814"/>
          <stop offset="100%" stop-color="#F7D774"/>
        </linearGradient>
      </defs>
      <path class="dr-back" fill="url(#${pfx}_back)" stroke="url(#${pfx}_gold)" stroke-width="1.2" stroke-opacity=".55"/>
      <g class="dr-folds">${FOLD_STOPS.map((_, i) => `<path class="dr-fold" fill="url(#${pfx}_f${i})"/>`).join("")}</g>
      <path class="dr-vshade" fill="url(#${pfx}_shade)" pointer-events="none"/>
      <g class="dr-creases" fill="none" stroke-linecap="round">${[1, 2, 3, 4, 5].map(() => `<path class="dr-crease"/>`).join("")}</g>
      <path class="dr-trim-in" fill="none" stroke="#FFE7A0" stroke-width="1" stroke-dasharray="5 3.5" stroke-opacity=".55"/>
      <path class="dr-trim" fill="none" stroke="url(#${pfx}_gold)" stroke-width="3" stroke-linecap="round"/>
      <g class="dr-tie">
        <path class="dr-rope-sh" fill="none" stroke="rgba(20,4,4,.55)" stroke-width="7" stroke-linecap="round"/>
        <path class="dr-rope" fill="none" stroke="url(#${pfx}_gold)" stroke-width="5.5" stroke-linecap="round"/>
        <path class="dr-rope-tw" fill="none" stroke="#7A4B08" stroke-width="5.5" stroke-dasharray="3.5 5" stroke-linecap="round" opacity=".55"/>
        <g class="dr-ornament">
          <g class="dr-tassel">
            <line x1="0" y1="0" x2="0" y2="14" stroke="url(#${pfx}_gold)" stroke-width="2.6"/>
            <rect x="-6" y="13" width="12" height="5" rx="2" fill="url(#${pfx}_gold)" stroke="#6E4307" stroke-width=".8"/>
            <path d="M-5.5 18 L5.5 18 L8 46 Q0 49 -8 46 Z" fill="#C83728" stroke="url(#${pfx}_gold)" stroke-width="1"/>
            <path d="M-3.5 19 L-4.5 45 M0 19 L0 46 M3.5 19 L4.5 45" stroke="#F7D774" stroke-width="1.1" opacity=".75"/>
          </g>
          <circle class="dr-knot-out" r="8.5" fill="url(#${pfx}_gold)" stroke="#5E3804" stroke-width="1.2"/>
          <circle class="dr-knot-in" r="4" fill="#A8241C" stroke="#FFF0B8" stroke-width="1"/>
        </g>
      </g>
    </svg>`;

    const svg = el.querySelector("svg");
    const backEl = svg.querySelector(".dr-back");
    const foldEls = [...svg.querySelectorAll(".dr-fold")];
    const vshadeEl = svg.querySelector(".dr-vshade");
    const creaseEls = [...svg.querySelectorAll(".dr-crease")];
    const trimEl = svg.querySelector(".dr-trim");
    const trimInEl = svg.querySelector(".dr-trim-in");
    const ropeShEl = svg.querySelector(".dr-rope-sh");
    const ropeEl = svg.querySelector(".dr-rope");
    const ropeTwEl = svg.querySelector(".dr-rope-tw");
    const ornamentEl = svg.querySelector(".dr-ornament");
    const tasselEl = svg.querySelector(".dr-tassel");

    // 4 個垂直耦合的彈簧節點（上腹 y=175、束腰 y=340、下腹 y=475、裙擺 y=600）＋皺褶波紋＋流蘇鐘擺
    const state = {
      el, right,
      u: [0, 0, 0, 0], v: [0, 0, 0, 0],
      waveAmp: 0, waveVel: 0, wavePhase: 0, focusK: 4,
      tasselA: 0, tasselV: 0,
      lastX: null, lastY: null, lastT: 0
    };

    function curveDown(t, u, w, l, b) {
      const c1x = u + (t - u) * 0.34, c2x = w + (u - w) * 0.36;
      const c3x = w + (l - w) * 0.52, c4x = b + (l - b) * 0.44;
      return {
        c1x, c2x, c3x, c4x,
        down: `C ${c1x.toFixed(1)} 118, ${c2x.toFixed(1)} 252, ${w.toFixed(1)} 340 C ${c3x.toFixed(1)} 416, ${c4x.toFixed(1)} 514, ${b.toFixed(1)} 600`,
        up:   `C ${c4x.toFixed(1)} 514, ${c3x.toFixed(1)} 416, ${w.toFixed(1)} 340 C ${c2x.toFixed(1)} 252, ${c1x.toFixed(1)} 118, ${t.toFixed(1)} 0`
      };
    }

    state.render = function () {
      const [uUp, uWaist, uLow, uBot] = state.u;
      const top = [0], up = [0], waist = [0], low = [0], bot = [0];

      for (let k = 1; k <= 6; k++) {
        // 越往舞台內側的布料擺幅越大（k=0 固定在牆邊），鄰近滑鼠處有連續柔波連動
        const r = Math.pow(k / 6, 1.12);
        const distK = Math.abs(k - state.focusK);
        const localBell = Math.exp(-distK * distK * 0.35);
        const ripple = Math.sin(k * 0.85 - state.wavePhase) * state.waveAmp * (0.45 + 0.55 * localBell) * (k / 6);

        top[k]   = BASE_TOP[k]   + uUp * 0.16 * r + ripple * 0.18;
        up[k]    = BASE_UP[k]    + uUp * r        + ripple * 0.95;
        waist[k] = BASE_WAIST[k] + uWaist * r     + ripple * 0.42;
        low[k]   = BASE_LOW[k]   + uLow * r       + ripple * 1.05;
        bot[k]   = BASE_BOT[k]   + uBot * r       + ripple * 0.85;

        // 確保皺褶邊界永遠平滑遞增，絕不交叉或斷裂成管狀
        top[k]   = Math.max(top[k - 1] + 8, top[k]);
        up[k]    = Math.max(up[k - 1] + 7, up[k]);
        waist[k] = Math.max(waist[k - 1] + 5, waist[k]);
        low[k]   = Math.max(low[k - 1] + 6, low[k]);
        bot[k]   = Math.max(bot[k - 1] + 7, bot[k]);
      }

      const B = [];
      for (let k = 0; k <= 6; k++) B[k] = curveDown(top[k], up[k], waist[k], low[k], bot[k]);

      // 每一道絲絨皺褶與相鄰皺褶共用完全相同的貝茲曲線邊界（加 0.55px 接合重疊防縫隙）
      for (let k = 0; k < 6; k++) {
        const pad = k < 5 ? 0.55 : 0;
        const Bnext = pad ? curveDown(top[k + 1] + pad, up[k + 1] + pad, waist[k + 1] + pad, low[k + 1] + pad, bot[k + 1] + pad) : B[k + 1];
        const midX = ((bot[k] + bot[k + 1]) * 0.5).toFixed(1);
        const hemY = k % 2 === 0 ? 604 : 596;
        foldEls[k].setAttribute("d", `M ${top[k].toFixed(1)} 0 ${B[k].down} Q ${midX} ${hemY} ${(bot[k + 1] + pad).toFixed(1)} 600 ${Bnext.up} Z`);
      }

      // 整體垂直光影遮罩與後層襯幕
      const fullPath = `M 0 0 L ${top[6].toFixed(1)} 0 ${B[6].down} L 0 600 Z`;
      vshadeEl.setAttribute("d", fullPath);

      const Bback = curveDown(
        174 + uUp * 0.1,
        152 + uUp * 0.58,
        87  + uWaist * 0.58,
        118 + uLow * 0.58,
        130 + uBot * 0.58
      );
      backEl.setAttribute("d", `M 0 0 L ${(174 + uUp * 0.1).toFixed(1)} 0 ${Bback.down} L 0 600 Z`);

      // 皺褶立體暗線與絲絨反光
      for (let k = 1; k <= 5; k++) {
        const elC = creaseEls[k - 1];
        elC.setAttribute("d", `M ${top[k].toFixed(1)} 0 ${B[k].down}`);
        elC.setAttribute("stroke", k % 2 ? "rgba(255,215,150,.18)" : "rgba(25,3,3,.42)");
        elC.setAttribute("stroke-width", k % 2 ? "1.3" : "1.8");
      }

      // 內緣金錦滾邊
      trimEl.setAttribute("d", `M ${top[6].toFixed(1)} 0 ${B[6].down}`);
      const BtrimIn = curveDown(top[6] - 4.5, up[6] - 4.5, waist[6] - 3.8, low[6] - 4.5, bot[6] - 4.5);
      trimInEl.setAttribute("d", `M ${(top[6] - 4.5).toFixed(1)} 0 ${BtrimIn.down}`);

      // 金繩束帶、如意結與物理垂穗
      const wx = waist[6] + 2;
      const ropeD = `M -2 318 Q ${(wx * 0.46).toFixed(1)} 350 ${wx.toFixed(1)} 337`;
      ropeShEl.setAttribute("d", `M -2 321 Q ${(wx * 0.46).toFixed(1)} 353 ${wx.toFixed(1)} 340`);
      ropeEl.setAttribute("d", ropeD);
      ropeTwEl.setAttribute("d", ropeD);

      const kx = Math.max(18, waist[6] - 7), ky = 339;
      const cw = el.clientWidth || 120, ch = el.clientHeight || 540;
      const pxScale = Math.max(0.45, Math.min(1.05, cw / 125));
      const sx = (pxScale * 180) / cw, sy = (pxScale * 600) / ch;
      ornamentEl.setAttribute("transform", `translate(${kx.toFixed(1)}, ${ky}) scale(${sx.toFixed(2)}, ${sy.toFixed(2)})`);
      tasselEl.setAttribute("transform", `translate(0, 3) rotate(${state.tasselA.toFixed(2)})`);
    };

    state.render();
    return state;
  }

  const drapes = [...document.querySelectorAll(".drape")].map(createDrape);
  window.addEventListener("resize", () => drapes.forEach(d => d.render()));

  if (!calm) {
    let rafId = 0;
    function stepDrapes() {
      let active = false;
      // 4 個高度節點的彈簧係數（束腰處 k=1 有金繩固定較緊，下擺 k=2,3 較柔軟飄逸）
      const stiff = [0.085, 0.14, 0.075, 0.062];
      const damp  = [0.84,  0.80, 0.85,  0.86];

      drapes.forEach(d => {
        const prevWaist = d.u[1];
        // 垂直相鄰節點耦合拉力，讓布料上下連成一體傳遞波浪
        const c01 = (d.u[1] - d.u[0]) * 0.045;
        const c10 = (d.u[0] - d.u[1]) * 0.032 + (d.u[2] - d.u[1]) * 0.032;
        const c21 = (d.u[1] - d.u[2]) * 0.05  + (d.u[3] - d.u[2]) * 0.04;
        const c32 = (d.u[2] - d.u[3]) * 0.065;
        const couple = [c01, c10, c21, c32];

        for (let i = 0; i < 4; i++) {
          d.v[i] = (d.v[i] - d.u[i] * stiff[i] + couple[i]) * damp[i];
          d.u[i] += d.v[i];
          d.u[i] = Math.max(-28, Math.min(34, d.u[i]));
        }

        // 布面柔波衰減與相位推進
        d.waveVel = (d.waveVel - d.waveAmp * 0.09) * 0.84;
        d.waveAmp += d.waveVel;
        d.wavePhase += 0.18;

        // 垂穗受束腰水平加速度驅動，像真實鐘擺一樣搖晃
        const waistAcc = d.u[1] - prevWaist;
        d.tasselV = (d.tasselV - d.tasselA * 0.095 - waistAcc * 1.45) * 0.88;
        d.tasselA = Math.max(-36, Math.min(36, d.tasselA + d.tasselV));

        d.render();

        const energy =
          Math.abs(d.u[0]) + Math.abs(d.u[1]) + Math.abs(d.u[2]) + Math.abs(d.u[3]) +
          Math.abs(d.v[0]) + Math.abs(d.v[1]) + Math.abs(d.v[2]) + Math.abs(d.v[3]) +
          Math.abs(d.waveAmp) + Math.abs(d.tasselA) + Math.abs(d.tasselV);
        if (energy > 0.06) active = true;
      });

      if (active) {
        rafId = requestAnimationFrame(stepDrapes);
      } else {
        rafId = 0;
        drapes.forEach(d => {
          d.u.fill(0); d.v.fill(0);
          d.waveAmp = 0; d.waveVel = 0; d.tasselA = 0; d.tasselV = 0;
          d.render();
        });
      }
    }

    function kickDrapes() {
      if (!rafId) rafId = requestAnimationFrame(stepDrapes);
    }

    const stage = document.querySelector(".stage"), spots = stage.querySelectorAll(".spot");
    stage.addEventListener("pointermove", e => {
      const now = performance.now();
      drapes.forEach(d => {
        const r = d.el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        // 轉換到布幕局部座標：distFromWall 為距離舞台側邊的水平距離（0=牆邊，r.width=布幕框內緣）
        const distFromWall = d.right ? (r.right - e.clientX) : (e.clientX - r.left);
        const nx = distFromWall / r.width;
        const ny = (e.clientY - r.top) / r.height;

        const dt = Math.max(8, Math.min(60, now - (d.lastT || now - 16)));
        const prevDist = d.lastX ?? distFromWall;
        const prevNy = d.lastY ?? ny;
        d.lastX = distFromWall; d.lastY = ny; d.lastT = now;

        // 滑鼠在布幕及其外側感應區（nx <= 1.45）移動時，帶動整幅布料與皺褶波浪
        if (nx < -0.1 || nx > 1.45 || ny < -0.05 || ny > 1.05) return;

        // vxLocal > 0 代表往舞台中央撥開；vxLocal < 0 代表往牆邊收攏
        const vxLocal = ((distFromWall - prevDist) / dt) * 15;
        const vyLocal = ((ny - prevNy) / dt) * 180;
        const proximity = Math.max(0, 1 - Math.max(0, nx - 0.85) / 0.6);
        if (Math.abs(vxLocal) < 0.08 && Math.abs(vyLocal) < 0.08) return;

        // 依滑鼠所在的高度（上段 0.25、束腰 0.56、下腹 0.78、裙擺 0.96）分配整片布料的推力
        const nodeY = [0.25, 0.56, 0.78, 0.96];
        const push = Math.max(-7.5, Math.min(7.5, vxLocal * 0.48)) * proximity;
        nodeY.forEach((yf, idx) => {
          const wY = Math.exp(-Math.pow((ny - yf) / 0.34, 2));
          const scale = idx === 1 ? 0.55 : idx === 3 ? 1.15 : 0.95;
          d.v[idx] += push * wY * scale;
        });

        // 垂直滑過布幕時也會掀起輕柔的布浪與流蘇擺動
        d.focusK = Math.max(1, Math.min(6, nx * 6));
        const speed = Math.min(9, Math.hypot(vxLocal, vyLocal * 0.6));
        d.waveVel += (vxLocal >= 0 ? 1 : -1) * speed * 0.28 * proximity;
        d.waveAmp = Math.max(-12, Math.min(12, d.waveAmp));
        d.tasselV += (-push * 0.7 + vyLocal * 0.18) * Math.exp(-Math.pow((ny - 0.58) / 0.32, 2));

        kickDrapes();
      });

      // 聚光燈跟著滑鼠
      const sr = stage.getBoundingClientRect(), k = (e.clientX - sr.left) / sr.width - .5;
      spots.forEach((s, i) => s.style.transform = `translateX(${(k * (i ? 90 : 120)).toFixed(0)}px) rotate(${(-k * 8).toFixed(1)}deg)`);
    });

    stage.addEventListener("pointerleave", () => {
      drapes.forEach(d => { d.lastX = null; d.lastY = null; });
      spots.forEach(s => s.style.transform = "");
    });

    // 流蘇
    document.querySelectorAll(".tassel").forEach(t => {
      t.addEventListener("pointerenter", () => replay(t, "swing"));
      t.addEventListener("animationend", () => t.classList.remove("swing"));
    });
  }
  // 燈籠：滑過會晃，點一下用力晃，還會掉出一個成語燈謎
  let lastIdiom = -1;
  document.querySelectorAll(".hl").forEach(l => {
    const inner = l.querySelector(".hl-in");
    if (!calm) {
      l.addEventListener("pointerenter", () => { if (!inner.classList.contains("spin")) replay(inner, "swing"); });
      inner.addEventListener("animationend", () => inner.classList.remove("swing", "spin"));
    }
    l.addEventListener("click", () => {
      if (!calm) replay(inner, "spin");
      if (!IDIOMS.length) return;
      let k; do { k = Math.floor(Math.random() * IDIOMS.length); } while (k === lastIdiom && IDIOMS.length > 1);
      lastIdiom = k; const it = IDIOMS[k];
      SG.toast(`🏮 燈謎揭曉：「${it.word}」——${it.meaning}`);
    });
  });

  const latest = published().find(e => e.type !== "mv") || published()[0];
  $("#playLatest").addEventListener("click", () => openPlayer(latest.code));

  /* 主持人台詞 */
  $("#hosts").innerHTML = HOSTS.map(h => {
    const p = personById[h.id] || { name: h.name, faction: h.faction };
    return `<div class="host">${avatar(p, 54)}<div class="bubble"><b>${esc(h.name)}｜${esc(h.role)}</b>${esc(h.line)}</div></div>`;
  }).join("");

  const guests = PEOPLE.filter(p => p.role === "guest").length;
  $("#stats").innerHTML = [
    [published().filter(e => e.type !== "mv").length, "集節目"], [guests, "位來賓"], [IDIOMS.length, "則成語"], [STORIES.length, "個查核"]
  ].map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");

  /* 最新一集（大卡） */
  const upcoming = EPISODES.find(e => e.status === "upcoming");
  const g = personById[latest.person];
  const latestHeard = SG.Cards.has("listen:" + latest.code);
  $("#latest").innerHTML = `
    <article class="card feature">
      <div class="ep-thumb" data-thumb-ep="${esc(latest.code)}">
        <img src="${thumb(latest)}" alt="${esc(latest.title)} 封面" />
        <span class="ep-code">${esc(latest.code)}</span>
        ${latestHeard ? `<span class="ep-heard">✓ 已收聽</span>` : ""}
        <button class="ep-play" data-play="${esc(latest.code)}" aria-label="播放 ${esc(latest.title)}"><span>▶</span></button>
      </div>
      <div class="ep-body" style="padding:24px">
        <div style="display:flex;gap:12px;align-items:center">${g ? avatar(g, 48) : ""}<h3 style="font-size:28px">${esc(latest.title)}</h3></div>
        <p class="ep-q" style="font-size:19px">${esc(latest.question)}</p>
        <p class="muted">${esc(latest.desc)}</p>
        ${latest.lesson ? `<p class="ep-lesson">💡 ${esc(latest.lesson)}</p>` : ""}
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:auto">
          <button class="btn btn-red btn-sm" data-play="${esc(latest.code)}">▶ 立即收聽</button>
          ${g ? `<a class="btn btn-line btn-sm" href="${links.person(g.id)}">認識${esc(g.name)}</a>` : ""}
        </div>
        ${upcoming ? `<p class="small" style="margin-top:6px;background:var(--paper-2);border-radius:10px;padding:8px 12px">🔜 下一集預告：<b>${esc(upcoming.code)} ${esc(upcoming.title)}</b>　<a href="request.html#wish">想問什麼？投稿 →</a></p>` : ""}
      </div>
    </article>`;

  /* 今日史實查核：每天換一題 */
  const pool = STORIES.filter(s => s.verdict === "true" || s.verdict === "fiction");
  const day = Math.floor(new Date(SG.today()).getTime() / 864e5);
  const story = pool[day % pool.length];
  const pollKey = (c) => `poll:${story.id}:${c}`;
  async function renderPoll() {
    const mine = Mine.value("poll:" + story.id);
    const box = $("#poll");
    box.innerHTML = `
      <div class="sec-head" style="margin-bottom:8px"><h2 style="font-size:24px"><span class="kicker">DAILY CHECK</span>今日史實查核</h2></div>
      <p class="muted small">這段故事，你覺得是史書記載的，還是小說演的？</p>
      <p style="font-family:var(--head);font-size:24px;margin-top:10px">「${esc(story.title)}」</p>
      <p class="muted" style="margin-top:4px">${esc(story.novel)}</p>
      <div class="poll-btns">
        <button data-c="true" ${mine ? "disabled" : ""} class="${mine === "true" ? "pick-me" : ""}">📜 是真的！</button>
        <button data-c="fiction" ${mine ? "disabled" : ""} class="${mine === "fiction" ? "pick-me" : ""}">🎭 別演了！</button>
      </div>
      <div id="pollRes"></div>`;
    box.querySelectorAll("[data-c]").forEach(b => b.addEventListener("click", async () => {
      Mine.mark("poll:" + story.id, b.dataset.c);
      box.querySelectorAll("[data-c]").forEach(x => x.disabled = true);
      b.classList.add("pick-me");
      await Store.vote(pollKey(b.dataset.c));
      showResult(b.dataset.c);
    }));
    if (mine) showResult(mine);
  }
  async function showResult(mine) {
    const s = await Store.stats();
    const t = s.votes[pollKey("true")], f = s.votes[pollKey("fiction")], total = Math.max(1, t + f);
    const right = mine === story.verdict;
    $("#pollRes").innerHTML = `
      <div class="poll-result fade-in">
        <p style="font-weight:700;color:${right ? "var(--ok)" : "var(--bad)"}">${right ? "✅ 你答對了！" : "❌ 被演到了！"}　答案：${verdictBadge(story.verdict, story.verdictText)}</p>
        <div class="small">📜 是真的 ${Math.round(t / total * 100)}%<div class="bar"><i style="width:${t / total * 100}%"></i></div></div>
        <div class="small">🎭 別演了 ${Math.round(f / total * 100)}%<div class="bar"><i style="width:${f / total * 100}%"></i></div></div>
        <p class="small muted">${t + f <= 1 ? "🎉 你是今天第一位參與的聽眾！" : `共 ${t + f} 位聽眾參與`}</p>
        <p style="background:var(--paper-2);border-radius:12px;padding:10px 12px">📜 史官說：${esc(story.history)}</p>
        <a class="small" href="${links.story(story.id)}">看更多史實查核 →</a>
      </div>`;
  }
  renderPoll();

  /* 來賓排行 */
  Store.stats().then(s => {
    const ranked = CANDIDATES.map(c => ({ ...c, n: s.votes["guest:" + c.id] })).sort((a, b) => b.n - a.n).slice(0, 5);
    const max = Math.max(1, ranked[0]?.n || 1);
    if (!ranked[0] || ranked[0].n === 0) {
      $("#rank").innerHTML = `<div style="text-align:center;padding:18px 0"><p style="font-size:40px">🔥</p><p style="font-family:var(--head);font-size:22px">還沒有人投票！</p><p class="muted">搶頭香，決定誰是下一位來賓。候選人有黃忠、馬超、貂蟬、華佗……</p></div>`;
      return;
    }
    $("#rank").innerHTML = ranked.map((c, i) => `
      <div class="rank-row">
        <span class="rank-no">${i + 1}</span>
        ${avatar({ name: c.name, faction: c.faction }, 40)}
        <div><b>${esc(c.name)}</b> <span class="muted small">${c.n} 票</span><div class="bar" style="margin-top:4px"><i style="width:${c.n / max * 100}%"></i></div></div>
      </div>`).join("");
  });

  /* 小百科入口 */
  $("#portals").innerHTML = [
    ["#people", "👤", "人物檔案", `${PEOPLE.length} 位`, "來賓與主持人的正史檔案，還有小說把他們「演」成什麼樣子。"],
    ["#idioms", "📖", "成語典故", `${IDIOMS.length} 則`, "望梅止渴、三顧茅廬……每個成語背後的真實故事與造句。"],
    ["#stories", "🔍", "史實查核", `${STORIES.length} 個`, "先猜再翻牌！草船借箭、空城計，到底是真是假？"],
    ["map.html", "🗺️", "三國地圖時間軸", `${typeof TIMELINE !== "undefined" ? TIMELINE.length : 10} 個年份`, "從黃巾之亂到三分歸晉，拉動時間軸看魏、蜀、吳的地盤怎麼變化。"],
    ["city.html", "🏯", "走進三國城池", `${typeof CITY_SPOTS !== "undefined" ? CITY_SPOTS.length : 11} 個地點`, "走進 2.5D 東漢郡城，點一點城門、市集、太守府，看三國人怎麼生活。"]
  ].map(([h, i, t, n, d]) => `
    <a class="card portal" href="${h[0] === "#" ? "wiki.html" + h : h}">
      <span class="big" aria-hidden="true">${i}</span>
      <h3>${t} <span class="chip">${n}</span></h3>
      <p class="muted">${d}</p>
      <span style="color:var(--curtain);font-weight:700;margin-top:auto">進入 →</span>
    </a>`).join("");

  const pick = PEOPLE.filter(p => p.role === "guest").sort(() => Math.random() - .5).slice(0, 4);
  $("#randomPeople").innerHTML = pick.map(p => `
    <a class="card card-pad f-${p.faction}" href="${links.person(p.id)}" style="text-decoration:none;display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;gap:12px;align-items:center">${avatar(p, 50)}<div><b style="font-family:var(--head);font-size:22px">${esc(p.name)}</b><br>${factionChip(p.faction)} <span class="small muted">字${esc(p.zi)}</span></div></div>
      <p class="small">${esc(p.oneLine)}</p>
    </a>`).join("");

  $("#bento").innerHTML = SG.playBento();
})();
