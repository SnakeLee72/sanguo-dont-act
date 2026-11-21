/* 三國地圖時間軸（內容在 data.js 的 TIMELINE；這裡是地圖的幾何形狀與畫法） */
(function () {
  const { $, esc, avatar, personById, links } = SG;
  const W = 600, H = 480;

  /* 勢力顏色（沿用陣營 token）；flag(year) 是都城旗子上的字 */
  const POWER = {
    han: { name: "東漢朝廷", color: "var(--gold)", flag: () => "漢" },
    cao: { name: "曹操・魏", color: "var(--wei)", flag: y => y >= 220 ? "魏" : "曹" },
    sun: { name: "孫氏・吳", color: "var(--wu)", flag: y => y >= 222 ? "吳" : "孫" },
    liu: { name: "劉備・蜀漢", color: "var(--shu)", flag: y => y >= 221 ? "蜀" : "劉" },
    qun: { name: "其他群雄", color: "var(--qun)", flag: () => "" },
    jin: { name: "晉", color: "var(--jin)", flag: () => "晉" }
  };
  /* 其他群雄：每位軍閥一個顏色（同一年同一個人佔好幾塊時，用顏色看出範圍，名字只寫一次） */
  const RULER = {
    "袁紹": "#7A4E9C", "袁術": "#D08636", "呂布": "#9C3B5F", "劉表": "#3A8A88", "劉璋": "#8E9A34", "張魯": "#C46A86",
    "士燮": "#5F7F99", "馬騰・韓遂": "#A8743F", "馬超・韓遂": "#A8743F", "李傕・郭汜": "#6E6862", "公孫瓚": "#4F9AB8"
  };
  const SPARE = ["#8C5A9E", "#4E8F6E", "#B5654A", "#5B7BB0", "#A08A3C"];
  const rulerColor = n => RULER[n] || SPARE[[...n].reduce((s, c) => s + c.charCodeAt(0), 0) % SPARE.length];
  // 這一塊地屬於誰：群雄依人名分，其他依勢力分
  const ownerOf = ([pw, label] = []) => pw === "qun"
    ? { key: "qun:" + (label || ""), color: label ? rulerColor(label) : POWER.qun.color, name: label || "其他勢力" }
    : { key: pw, color: POWER[pw].color, name: POWER[pw].name };
  /* 各區中心點（約略依經緯度換算），疆界用「最近中心點」自動劃分；lx/ly 是文字位置 */
  const REGIONS = {
    liang: { x: 120, y: 112, name: "涼州" }, sili: { x: 318, y: 150, name: "司隸" }, bing: { x: 360, y: 82, name: "并州" },
    you: { x: 478, y: 46, name: "幽州" }, ji: { x: 420, y: 112, name: "冀州", lx: 440, ly: 98 }, qing: { x: 500, y: 122, name: "青州" },
    yan: { x: 445, y: 146, name: "兗州" }, xu: { x: 500, y: 160, name: "徐州" }, yu: { x: 418, y: 180, name: "豫州", lx: 426, ly: 186 },
    huainan: { x: 455, y: 196, name: "揚州・淮南", lx: 474, ly: 214 }, jiangdong: { x: 512, y: 248, name: "揚州・江東" },
    jingbei: { x: 352, y: 196, name: "荊州・北" }, jingnan: { x: 372, y: 278, name: "荊州・南" },
    hanzhong: { x: 250, y: 182, name: "漢中", ly: 194 }, yi: { x: 180, y: 262, name: "益州" }, jiao: { x: 352, y: 372, name: "交州" }
  };
  const CITIES = {
    luoyang: { x: 366, y: 155, name: "洛陽" }, changan: { x: 287, y: 161, name: "長安" }, xu: { x: 396, y: 168, name: "許", a: "end" },
    ye: { x: 410, y: 124, name: "鄴", a: "end" }, chengdu: { x: 178, y: 227, name: "成都" }, jianye: { x: 508, y: 202, name: "建業" },
    xiangyang: { x: 359, y: 203, name: "襄陽" }, jiangling: { x: 361, y: 233, name: "江陵" }, wuchang: { x: 423, y: 234, name: "武昌" }
  };
  const BATTLE_AT = { guandu: { x: 400, y: 150 }, chibi: { x: 398, y: 246 }, yiling: { x: 336, y: 224 } };
  const SEA = "M600 66 L568 68 L528 58 L486 76 L494 100 L516 108 L560 100 L596 104 L600 106 Z " +
    "M600 112 L594 110 L560 118 L538 130 L518 154 L540 178 L576 212 L560 236 L572 244 L552 276 L522 310 L494 340 L462 360 L424 372 L392 382 L344 392 L312 410 L292 396 L236 408 L222 440 L212 480 L600 480 Z";
  const RIVERS = [
    { name: "黃河", d: "M150 140 C 190 104, 236 52, 308 48 S 334 84, 322 136 S 360 152, 392 150 S 468 112, 500 104", at: 52 },
    { name: "長江", d: "M120 262 C 170 266, 206 252, 233 247 S 280 220, 300 221 S 340 227, 361 233 S 381 251, 395 245 S 410 228, 446 245 S 490 205, 508 202 S 556 210, 578 212", at: 33 },
    { name: "漢水", d: "M244 186 C 290 178, 330 188, 359 203 S 392 214, 408 229", at: 30, small: true },
    { name: "淮河", d: "M384 197 C 410 192, 440 198, 464 192 S 506 178, 536 176", at: 56, small: true }
  ];
  /* 山脈（水墨小山）：[x, y, 大小] */
  const MOUNTAINS = [
    [212, 170, 8], [236, 166, 10], [262, 168, 8], [318, 172, 8],                 // 秦嶺
    [382, 64, 8], [386, 86, 9], [391, 106, 7],                                   // 太行山
    [44, 212, 10], [62, 236, 13], [90, 250, 10], [58, 282, 12], [96, 296, 9],    // 西邊高原
    [88, 82, 8], [116, 74, 10], [146, 88, 8],                                    // 祁連山
    [318, 330, 9], [348, 324, 11], [380, 332, 9], [412, 326, 10], [442, 332, 8], // 南嶺
    [282, 206, 8], [218, 206, 7]                                                 // 巫山、大巴山
  ];

  /* 南方的林子（水墨小樹）：[x, y, 大小] */
  const TREES = [
    [536, 284, 9], [548, 296, 7], [522, 300, 8], [460, 296, 8], [474, 306, 7],
    [418, 298, 7], [296, 300, 8], [282, 314, 9], [268, 300, 7], [240, 318, 8],
    [150, 318, 8], [166, 332, 9], [134, 336, 7], [300, 360, 8], [396, 360, 8], [410, 372, 7]
  ];
  /* ---------- 疆界：簡單的 Voronoi（每個中心點切出自己的區塊） ---------- */
  function clip(poly, a, b, c) { // 保留 a*x + b*y <= c 的部分
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length];
      const fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c;
      if (fp <= 0) out.push(p);
      if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
        const t = fp / (fp - fq);
        out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
      }
    }
    return out;
  }
  const IDS = Object.keys(REGIONS), POLY = {}, CELLS = {}, EDGES = [];
  const d2 = (p, r) => (p[0] - r.x) ** 2 + (p[1] - r.y) ** 2;
  IDS.forEach(id => {
    const r = REGIONS[id];
    let poly = [[-20, -20], [W + 20, -20], [W + 20, H + 20], [-20, H + 20]];
    IDS.forEach(j => {
      if (j === id) return;
      const s = REGIONS[j];
      poly = clip(poly, s.x - r.x, s.y - r.y, (s.x * s.x + s.y * s.y - r.x * r.x - r.y * r.y) / 2);
    });
    POLY[id] = poly;
    CELLS[id] = "M" + poly.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z";
  });
  // 找出相鄰兩區共用的邊（之後用來畫「勢力交界」的粗線）
  IDS.forEach(id => POLY[id].forEach((p, k, arr) => {
    const q = arr[(k + 1) % arr.length], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const near = IDS.map(j => [j, d2(m, REGIONS[j])]).sort((a, b) => a[1] - b[1]);
    if (near[0][0] !== id && near[1][0] !== id) return;
    const other = near[0][0] === id ? near[1][0] : near[0][0];
    if (Math.abs(Math.sqrt(near[0][1]) - Math.sqrt(near[1][1])) > .6 || id > other) return;
    EDGES.push({ a: id, b: other, d: `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}` });
  }));

  /* ---------- 裝飾小圖 ---------- */
  const mountain = ([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s / 10})"><path d="M-17 0-8-9-4-5 3-14 14 0z" class="tl-mtn"/><path d="M3-14 0-7 3-8 5-3 8 0M-8-9-9-4-7-3" class="tl-mtn-s"/></g>`;
  const tree = ([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s / 10})"><path d="M0 0V5" class="tl-trunk"/><path d="M0-13C6-12 8-6 6-2 4 1-4 1-6-2-8-6-6-12 0-13Z" class="tl-tree"/><path d="M-2-9C0-10 2-9 2-7" class="tl-tree-s"/></g>`;
  const cloud = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" class="tl-cloud"><path d="M0 0h40c7 0 9-8 3-11-5-2-9 2-7 6M6 0c-7 0-9-8-3-12 5-3 11 0 11 5 0-7 8-11 14-7 4 3 3 9-2 9"/><path d="M-6 6h30c5 0 6-5 2-7"/></g>`;
  const rose = `<g class="tl-rose" transform="translate(548 68)">
    <path d="M0-24 4-4 0 0z" class="r1"/><path d="M0-24-4-4 0 0z" class="r2"/><path d="M0 24 4 4 0 0z" class="r2"/><path d="M0 24-4 4 0 0z" class="r1"/>
    <path d="M24 0 4 4 0 0z" class="r1"/><path d="M24 0 4-4 0 0z" class="r2"/><path d="M-24 0-4 4 0 0z" class="r2"/><path d="M-24 0-4-4 0 0z" class="r1"/>
    <g transform="rotate(45)"><path d="M0-14 3-3 0 0-3-3z" class="r3"/><path d="M0 14 3 3 0 0-3 3z" class="r3"/><path d="M14 0 3 3 0 0 3-3z" class="r3"/><path d="M-14 0-3 3 0 0-3-3z" class="r3"/></g>
    <circle r="3" class="r0"/><text y="-29">北</text></g>`;
  const boat = `<g class="tl-boat" transform="translate(584 340)"><g class="bob"><path d="M-11 0q11 7 22 0z" class="hull"/><path d="M0-1V-19" class="mast"/><path d="M1-18 11-5H1z" class="sail"/><path d="M-1-15-8-5h7z" class="sail"/></g></g>`;

  /* ---------- 畫地圖（只畫一次，之後換年份只改顏色與文字） ---------- */
  const box = $("#tl");
  box.innerHTML = `
    <div class="tl-head"><div class="tl-year" id="tlYear"></div><div><h2 class="tl-title" id="tlTitle"></h2><p class="tl-era" id="tlEra"></p></div></div>
    <div class="tl-map">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="tlTitle" id="tlSvg">
        <defs>
          <filter id="tl-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .3  0 0 0 0 .15  0 0 0 .14 0"/></filter>
          <filter id="tl-rough"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
          <filter id="tl-ink"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="2" seed="2"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter>
          <pattern id="tl-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" class="tl-hatch-line"/></pattern>
          <pattern id="tl-wavep" width="24" height="14" patternUnits="userSpaceOnUse"><path d="M0 14a6 6 0 0 1 12 0a6 6 0 0 1 12 0M-6 7a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0" class="tl-wave-line"/></pattern>
          <linearGradient id="tl-fade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--paper-2)" stop-opacity=".95"/><stop offset=".22" stop-color="var(--paper-2)" stop-opacity="0"/></linearGradient>
          <radialGradient id="tl-vig" cx="50%" cy="50%" r="72%"><stop offset="60%" stop-color="#7a4a1c" stop-opacity="0"/><stop offset="100%" stop-color="#7a4a1c" stop-opacity=".34"/></radialGradient>
          ${IDS.map(id => `<clipPath id="tl-c-${id}"><path d="${CELLS[id]}"/></clipPath>`).join("")}
          <filter id="tl-mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="21"/><feColorMatrix values="0 0 0 0 .42  0 0 0 0 .27  0 0 0 0 .12  0 0 0 -.9 .62"/></filter>
          <filter id="tl-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.2"/></filter>
          <radialGradient id="tl-stain" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#8a5a24" stop-opacity=".12"/><stop offset=".7" stop-color="#8a5a24" stop-opacity=".05"/><stop offset="1" stop-color="#8a5a24" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="${W}" height="${H}" class="tl-paper"/>
        <g filter="url(#tl-rough)">
          ${IDS.map(id => `<path d="${CELLS[id]}" class="tl-cell" data-r="${id}"/>`).join("")}
          <g id="tlWash" filter="url(#tl-soft)"></g>
          ${IDS.map(id => `<path d="${CELLS[id]}" class="tl-border"/>`).join("")}
          <g id="tlFB"></g>
        </g>
        <rect width="${W}" height="${H}" filter="url(#tl-mottle)" pointer-events="none"/>
        <rect width="${W}" height="${H}" fill="url(#tl-hatch)" pointer-events="none"/>
        <g filter="url(#tl-ink)">${MOUNTAINS.map(mountain).join("")}${TREES.map(tree).join("")}</g>
        <g filter="url(#tl-rough)">
          <path d="${SEA}" class="tl-sea"/><path d="${SEA}" fill="url(#tl-wavep)" class="tl-sea-wave"/><path d="${SEA}" class="tl-coast"/>
          <ellipse cx="300" cy="438" rx="20" ry="13" class="tl-island"/><ellipse cx="560" cy="352" rx="9" ry="24" class="tl-island"/>
        </g>
        <g filter="url(#tl-ink)">${RIVERS.map((r, i) => `<path d="${r.d}" class="tl-river-bank${r.small ? " small" : ""}"/><path id="tl-rv${i}" d="${r.d}" class="tl-river${r.small ? " small" : ""}"/><path d="${r.d}" class="tl-river-flow"/>`).join("")}</g>
        ${boat}
        <rect width="${W}" height="${H}" fill="url(#tl-fade)" pointer-events="none"/>
        <ellipse cx="120" cy="380" rx="70" ry="50" fill="url(#tl-stain)" pointer-events="none"/><ellipse cx="470" cy="70" rx="50" ry="36" fill="url(#tl-stain)" pointer-events="none"/>
        <rect width="${W}" height="${H}" filter="url(#tl-paper)" pointer-events="none"/>
        <rect width="${W}" height="${H}" fill="url(#tl-vig)" pointer-events="none"/>
        <!-- 文字放在紙紋、暗角之上，手機上才清楚 -->
        ${RIVERS.map((r, i) => `<text class="tl-river-name${r.small ? " small" : ""}" dy="-7"><textPath href="#tl-rv${i}" startOffset="${r.at}%">${esc([...r.name].join(" "))}</textPath></text>`).join("")}
        <text x="548" y="306" class="tl-sea-name">東 海</text><text x="420" y="446" class="tl-sea-name">南 海</text>
        <g id="tlLabels"></g>
        <g id="tlCities"></g>
        <g id="tlMarks"></g>
        ${cloud(30, 446, .9)}${cloud(574, 452, .8, true)}
        <g class="tl-cartouche" transform="translate(26 24)"><rect width="138" height="52" rx="5"/><circle cx="0" cy="26" r="7"/><circle cx="138" cy="26" r="7"/><text x="69" y="25">三國形勢圖</text><text x="69" y="43" class="sub" id="tlCartYear"></text></g>
        ${rose}
        <rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="8" class="tl-frame"/><rect x="13" y="13" width="${W - 26}" height="${H - 26}" rx="6" class="tl-frame thin"/>
        <text x="${W - 24}" y="${H - 22}" class="tl-note" text-anchor="end">示意圖・疆界為大致範圍</text>
      </svg>
    </div>
    <div class="tl-legend" id="tlLegend"></div>
    <div class="tl-ctrl">
      <button class="btn btn-line btn-sm" id="tlPrev" aria-label="上一個年份">◀</button>
      <div class="tl-range">
        <input type="range" id="tlRange" min="0" max="${TIMELINE.length - 1}" step="1" value="0" aria-label="選擇年份">
        <div class="tl-ticks">${TIMELINE.map((k, i) => `<button type="button" data-i="${i}" style="left:${i / (TIMELINE.length - 1) * 100}%">${k.year}</button>`).join("")}</div>
      </div>
      <button class="btn btn-line btn-sm" id="tlNext" aria-label="下一個年份">▶</button>
      <button class="btn btn-red btn-sm" id="tlPlay">▶ 自動播放</button>
    </div>
    <article class="card card-pad tl-info" id="tlInfo" aria-live="polite"></article>`;

  const svg = $("#tlSvg"), range = $("#tlRange");
  const cells = {}; svg.querySelectorAll(".tl-cell").forEach(p => cells[p.dataset.r] = p);
  const regionOf = c => IDS.reduce((best, id) => d2([c.x, c.y], REGIONS[id]) < d2([c.x, c.y], REGIONS[best]) ? id : best, IDS[0]);
  let cur = -1, timer = null, prevOwner = {};

  function plaques() { // 勢力名字後面墊一塊小牌子
    // 名字牌太擠時互相推開（手機上字比較大，最容易疊在一起）
    const gs = [...svg.querySelectorAll(".tl-lbl")].filter(g => g.querySelector(".tl-owner"));
    gs.forEach(g => { g.dataset.dy = 0; g.querySelector(".tl-owner").removeAttribute("transform"); g.querySelector(".tl-rname").removeAttribute("transform"); });
    const box = g => {
      const m = g.transform.baseVal.consolidate().matrix, o = g.querySelector(".tl-owner").getBBox(), s = g.querySelector(".tl-rname");
      let x0 = o.x - 8, y0 = o.y - 3, x1 = o.x + o.width + 8, y1 = o.y + o.height + 3;
      if (getComputedStyle(s).display !== "none") { const r = s.getBBox(); x0 = Math.min(x0, r.x); x1 = Math.max(x1, r.x + r.width); y1 = Math.max(y1, r.y + r.height); }
      return { x: x0 + m.e, y: y0 + m.f + +g.dataset.dy, w: x1 - x0, h: y1 - y0 };
    };
    for (let it = 0; it < 12; it++) {
      let moved = false;
      for (let i = 0; i < gs.length; i++) for (let j = i + 1; j < gs.length; j++) {
        const a = box(gs[i]), b = box(gs[j]);
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (ox <= 0 || oy <= 0) continue;
        const [up, dn] = a.y <= b.y ? [gs[i], gs[j]] : [gs[j], gs[i]], d = oy / 2 + .5;
        up.dataset.dy = +up.dataset.dy - d; dn.dataset.dy = +dn.dataset.dy + d; moved = true;
      }
      if (!moved) break;
    }
    gs.forEach(g => { const dy = +g.dataset.dy; if (dy) ["tl-owner", "tl-rname"].forEach(c => g.querySelector("." + c).setAttribute("transform", `translate(0 ${dy.toFixed(1)})`)); });
    svg.querySelectorAll(".tl-owner").forEach(t => {
      const g = t.parentNode, old = g.querySelector(".tl-plaque"); if (old) old.remove();
      const b = t.getBBox(); if (!b.width) return;
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("class", "tl-plaque"); r.setAttribute("rx", 6);
      r.setAttribute("x", b.x - 7); r.setAttribute("y", b.y - 2); if (t.getAttribute("transform")) r.setAttribute("transform", t.getAttribute("transform")); r.setAttribute("width", b.width + 14); r.setAttribute("height", b.height + 4);
      r.style.stroke = t.dataset.c;
      g.insertBefore(r, t);
    });
  }

  function show(i, push = true) {
    i = Math.max(0, Math.min(TIMELINE.length - 1, i));
    const k = TIMELINE[i];
    cur = i; range.value = i;
    box.querySelectorAll(".tl-ticks button").forEach((b, j) => b.classList.toggle("on", j === i));
    $("#tlYear").textContent = `西元 ${k.year} 年`;
    $("#tlTitle").textContent = k.title;
    $("#tlEra").textContent = k.era ? `年號：${k.era}` : "";
    // 上色；換了主人的地區閃一下
    $("#tlCartYear").textContent = `西元 ${k.year} 年`;
    const own = {}; IDS.forEach(id => own[id] = ownerOf(k.regions[id]));
    Object.keys(k.regions).forEach(id => {
      const c = cells[id]; if (!c) return;
      c.style.fill = own[id].color;
      if (prevOwner[id] && prevOwner[id] !== own[id].key) { c.classList.remove("chg"); void c.getBBox(); c.classList.add("chg"); }
      prevOwner[id] = own[id].key;
    });
    // 勢力交界：粗線＋沿著邊界往內暈開的顏色（古地圖的描邊上色）
    const diff = EDGES.filter(e => own[e.a].key !== own[e.b].key);
    $("#tlFB").innerHTML = diff.map(e => `<path d="${e.d}" class="tl-fb-halo"/><path d="${e.d}" class="tl-fb"/>`).join("");
    $("#tlWash").innerHTML = diff.map(e => [e.a, e.b].map(id => `<path d="${e.d}" class="tl-wash" clip-path="url(#tl-c-${id})" style="stroke:${own[id].color}"/>`).join("")).join("");
    // 同一個名字只寫一次：寫在那幾塊地中間的那一塊（可用 labelAt 指定）
    const anchor = {}, byName = {};
    IDS.forEach(id => { const lb = (k.regions[id] || [])[1]; if (lb) (byName[own[id].key + "|" + lb] = byName[own[id].key + "|" + lb] || []).push(id); });
    Object.entries(byName).forEach(([g, ids]) => {
      const lb = g.split("|")[1], want = k.labelAt && k.labelAt[lb];
      if (want && ids.includes(want)) return anchor[want] = true;
      const cx = ids.reduce((s, id) => s + REGIONS[id].x, 0) / ids.length, cy = ids.reduce((s, id) => s + REGIONS[id].y, 0) / ids.length;
      anchor[ids.reduce((b, id) => d2([cx, cy], REGIONS[id]) < d2([cx, cy], REGIONS[b]) ? id : b)] = true;
    });
    $("#tlLabels").innerHTML = IDS.map(id => {
      const r = REGIONS[id], label = anchor[id] ? k.regions[id][1] : "";
      return `<g class="tl-lbl fade" transform="translate(${r.lx || r.x} ${r.ly || r.y})">${label ? `<text class="tl-owner" y="-2" data-c="${own[id].color}">${esc(label)}</text>` : ""}<text class="tl-rname${label ? " sub" : ""}" y="${label ? 17 : 5}">${esc(r.name)}</text></g>`;
    }).join("");
    plaques();
    // 都城：插上勢力旗子
    $("#tlCities").innerHTML = (k.capitals || []).map(c => CITIES[c]).filter(Boolean).map(c => {
      const pw = (k.regions[regionOf(c)] || [])[0], ch = pw ? POWER[pw].flag(k.year) : "";
      const icon = ch
        ? `<path d="M0 2V-22" class="tl-pole"/><path d="M0-22h15q-3 5 0 10H0z" class="tl-cloth" style="fill:${POWER[pw].color}"/><text x="7" y="-14" class="tl-flag-ch">${esc(ch)}</text><circle r="3" class="tl-cdot"/>`
        : `<path d="M0-7 2-2 7-2 3 1.5 4.5 7 0 3.8-4.5 7-3 1.5-7-2-2-2z" class="tl-star"/>`;
      return `<g class="tl-city fade" transform="translate(${c.x} ${c.y})">${icon}<text class="tl-cname" x="${c.a ? -8 : 8}" y="${ch ? 12 : 5}" text-anchor="${c.a || "start"}">${esc(c.name)}</text></g>`;
    }).join("");
    const bt = k.battle && BATTLES.find(b => b.id === k.battle && b.status === "published");
    $("#tlMarks").innerHTML = (bt ? [`<a href="battle.html#${bt.id}" class="tl-battle" aria-label="玩${esc(bt.title)}"><g transform="translate(${BATTLE_AT[bt.id].x} ${BATTLE_AT[bt.id].y})"><circle r="17" class="tl-ring"/><circle r="13" class="tl-bdot"/><path d="M-6-6 6 6M6-6-6 6" class="tl-sword"/><path d="M-7-3-3-7M3-7 7-3" class="tl-hilt"/><title>${esc(bt.title)}：換你當軍師</title></g></a>`] : [])
      .concat((k.marks || []).map(m => `<g class="tl-mark fade" transform="translate(${m.x} ${m.y})"><circle r="5"/><text x="9" y="5">${esc(m.label)}</text></g>`)).join("");
    // 圖例：這一年出現的勢力
    const used = {}; IDS.forEach(id => used[own[id].key] = used[own[id].key] || own[id]);
    const order = o => o.key.startsWith("qun:") ? (o.key === "qun:" ? 2 : 1) : 0;
    $("#tlLegend").innerHTML = Object.values(used).sort((a, b) => order(a) - order(b)).map(o => `<span><b style="background:${o.color}"></b>${esc(o.name)}</span>`).join("") + `<span><i class="tl-lg-line"></i>勢力交界</span>`;
    // 說明卡
    const guests = (k.guests || []).map(id => personById[id]).filter(Boolean);
    $("#tlInfo").innerHTML = `<div class="fade-in" style="display:grid;gap:12px">
      <p class="tl-text">${esc(k.text)}</p>
      <p class="src">出處：${esc(k.source)}</p>
      ${bt ? `<a class="tl-cta" href="battle.html#${bt.id}">⚔️ <span><b>${esc(bt.title)}</b>：換你當${esc(personById[bt.role].name)}，做出關鍵決定 →</span></a>` : ""}
      ${guests.length ? `<div><p class="small muted" style="margin-bottom:6px">🎙️ 這個時期的節目來賓・主持人</p><div class="row">${guests.map(p => `<a class="chip chip-link" href="${links.person(p.id)}" style="padding:5px 12px">${avatar(p, 24)} ${esc(p.name)}</a>`).join("")}</div></div>` : ""}
    </div>`;
    if (push) history.replaceState(null, "", "#" + k.year);
  }

  function stop() { clearInterval(timer); timer = null; $("#tlPlay").textContent = "▶ 自動播放"; }
  $("#tlPlay").addEventListener("click", () => {
    if (timer) return stop();
    if (cur >= TIMELINE.length - 1) show(0);
    $("#tlPlay").textContent = "⏸ 暫停";
    timer = setInterval(() => { cur >= TIMELINE.length - 1 ? stop() : show(cur + 1); }, 4000);
  });
  range.addEventListener("input", () => { stop(); show(+range.value); });
  $("#tlPrev").addEventListener("click", () => { stop(); show(cur - 1); });
  $("#tlNext").addEventListener("click", () => { stop(); show(cur + 1); });
  box.querySelectorAll(".tl-ticks button").forEach(b => b.addEventListener("click", () => { stop(); show(+b.dataset.i); }));

  const fromHash = () => {
    const y = +location.hash.slice(1);
    const i = TIMELINE.findIndex(k => k.year === y);
    return i < 0 ? 0 : i;
  };
  window.addEventListener("hashchange", () => { const i = fromHash(); if (i !== cur) { stop(); show(i, false); } });
  show(fromHash(), false);
  // 字型載入後，重新量一次牌子大小
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(plaques);
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(plaques, 200); });
})();
