/* 走進三國城池：2.5D 等角視角示意城（文字內容在 data.js 的 CITY_SPOTS） */
(function () {
  const { $, esc, toast } = SG;
  const motion = matchMedia("(prefers-reduced-motion: no-preference)").matches;

  /* ---------- 等角投影：格子座標 (x, y, 高度 z) → 畫面座標 ---------- */
  const A = 16, B = 8, Z = 10;
  const P = (x, y, z = 0) => [(x - y) * A, (x + y) * B - z * Z];
  const pts = arr => arr.map(p => P(...p).map(n => n.toFixed(1)).join(",")).join(" ");
  const poly = (arr, fill, cls = "") => `<polygon points="${pts(arr)}" fill="${fill}"${cls ? ` class="${cls}"` : ""}/>`;
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * f))));
    return "#" + c.map(v => v.toString(16).padStart(2, "0")).join("");
  }
  /* 場景色盤（土牆、瓦片、木頭……） */
  const C = {
    grass: "#C9D49A", grass2: "#B7C487", ground: "#E7D7B0", road: "#D9C08C", earth: "#C49A62", earthTop: "#D8B987",
    roof: "#4A4E5C", roofRed: "#7C2B25", straw: "#B88A3E", plaster: "#EFE3C8", wood: "#8A5A33", water: "#7FB0CF",
    field1: "#A9C26B", field2: "#D6C26A", field3: "#8FB35E", leaf: "#6E9A4E", leaf2: "#86B05B", trunk: "#7A5233",
    red: "#B8432F", gold: "#D9A23A", green: "#3F7E55", blue: "#3B6E9A"
  };

  /* ---------- 積木：方塊、屋頂、圓倉、樹 ---------- */
  const f1 = n => (+n).toFixed(1);
  const seg = (p, q) => `M${P(...p).map(f1).join(" ")}L${P(...q).map(f1).join(" ")}`;
  const SH = []; // 影子（光從左上來，影子落在右下）
  function shadow(x, y, w, d, h) {
    const s = h * .55, t = h * .18;
    SH.push(poly([[x, y, 0], [x + w, y, 0], [x + w + s, y + t, 0], [x + w + s, y + d + t, 0], [x + s, y + d + t, 0], [x, y + d, 0]], "#2A1F1A"));
  }
  function box(x, y, w, d, h, z, c, cls = "", o = {}) {
    const t = z + h;
    if (o.shadow && !z) shadow(x, y, w, d, h);
    let layers = "";
    if (o.layers) { let dd = ""; for (let zz = z + .42; zz < t - .12; zz += .42) dd += seg([x, y + d, zz], [x + w, y + d, zz]) + seg([x + w, y, zz], [x + w, y + d, zz]); layers = `<path class="layers" d="${dd}"/>`; }
    return `<g${cls ? ` class="${cls}"` : ""}>` +
      poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]], shade(c, .9)) +   // 左前面
      poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]], shade(c, .72)) +  // 右前面
      layers + poly([[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]], shade(c, 1.08)) + `</g>`; // 頂面
  }
  function roof(x, y, w, d, z, rh, c, e = .35) {
    const X0 = x - e, Y0 = y - e, X1 = x + w + e, Y1 = y + d + e, zt = z + rh, step = .34;
    const a = [X0, Y0, z], b = [X1, Y0, z], cc = [X1, Y1, z], dd = [X0, Y1, z];
    let faces, R1, R2, tl = "";
    if (w >= d) {
      const ym = y + d / 2, r1 = x + d / 2, r2 = x + w - d / 2;
      R1 = [r1, ym, zt]; R2 = [r2, ym, zt];
      faces = poly([a, b, R2, R1], shade(c, 1.2)) + poly([a, dd, R1], shade(c, 1.05)) + poly([b, cc, R2], shade(c, .72)) + poly([dd, cc, R2, R1], shade(c, .92));
      for (let ex = X0 + step; ex < X1 - step / 2; ex += step) { // 前坡的瓦壟
        const u = ex < r1 ? (ex - X0) / (r1 - X0) : ex > r2 ? (X1 - ex) / (X1 - r2) : 1;
        tl += seg([ex, Y1, z], [ex, Y1 + (ym - Y1) * u, z + rh * u]);
      }
      for (let ey = Y0 + step; ey < Y1 - step / 2; ey += step) { // 右坡
        const u = ey <= ym ? (ey - Y0) / (ym - Y0) : (Y1 - ey) / (Y1 - ym);
        tl += seg([X1, ey, z], [X1 + (r2 - X1) * u, ey, z + rh * u]);
      }
    } else {
      const xm = x + w / 2, q1 = y + w / 2, q2 = y + d - w / 2;
      R1 = [xm, q1, zt]; R2 = [xm, q2, zt];
      faces = poly([a, b, R1], shade(c, 1.2)) + poly([a, dd, R2, R1], shade(c, 1.05)) + poly([b, cc, R2, R1], shade(c, .72)) + poly([dd, cc, R2], shade(c, .92));
      for (let ex = X0 + step; ex < X1 - step / 2; ex += step) {
        const u = ex <= xm ? (ex - X0) / (xm - X0) : (X1 - ex) / (X1 - xm);
        tl += seg([ex, Y1, z], [ex, Y1 + (q2 - Y1) * u, z + rh * u]);
      }
      for (let ey = Y0 + step; ey < Y1 - step / 2; ey += step) {
        const u = ey < q1 ? (ey - Y0) / (q1 - Y0) : ey > q2 ? (Y1 - ey) / (Y1 - q2) : 1;
        tl += seg([X1, ey, z], [X1 + (xm - X1) * u, ey, z + rh * u]);
      }
    }
    const [ax, ay] = P(...R1), [bx, by] = P(...R2), [lx, ly] = P(...dd), [rx, ry] = P(...b), [fx, fy] = P(...cc);
    return faces + `<path class="tiles" d="${tl}"/>` +
      `<path class="ridge" d="M${f1(ax)} ${f1(ay)}L${f1(bx)} ${f1(by)}"/>` +
      `<path class="eave" d="M${f1(lx)} ${f1(ly)}q-3 0 -5 -4M${f1(rx)} ${f1(ry)}q3 0 5 -4M${f1(fx - 3)} ${f1(fy - 1)}q3 3 6 0"/>` +
      `<path class="ridge-end" d="M${f1(ax)} ${f1(ay)}q-3 -1 -3 -5M${f1(bx)} ${f1(by)}q3 -1 3 -5"/>`;
  }
  // 房子：牆 + 門 + 窗（夜晚會亮）+ 屋頂
  function hall(x, y, w, d, h, o = {}) {
    const z = o.z || 0, wall = o.wall || C.plaster, rf = o.roof || C.roof, rh = o.rh || Math.min(w, d) * .55;
    if (!z && !o.noShadow) shadow(x, y, w, d, h + rh * .7);
    let s = box(x, y, w, d, h, z, wall);
    const zb = z + h - Math.min(.2, h * .2), zt = z + h;
    s += poly([[x, y + d, zb], [x + w, y + d, zb], [x + w, y + d, zt], [x, y + d, zt]], "rgba(40,25,15,.28)") + poly([[x + w, y, zb], [x + w, y + d, zb], [x + w, y + d, zt], [x + w, y, zt]], "rgba(40,25,15,.32)");
    if (o.pillars) for (let i = 0; i <= 3; i++) { const px = x + w * i / 3; s += poly([[px - .06, y + d, z], [px + .06, y + d, z], [px + .06, y + d, z + h], [px - .06, y + d, z + h]], C.red); }
    if (o.door !== false) { const m = x + w / 2; s += poly([[m - .28, y + d, z], [m + .28, y + d, z], [m + .28, y + d, z + h * .62], [m - .28, y + d, z + h * .62]], shade(C.wood, .7)); }
    if (o.win) [x + w * .2, x + w * .8 - .3].forEach(wx => { s += poly([[wx, y + d, z + h * .4], [wx + .3, y + d, z + h * .4], [wx + .3, y + d, z + h * .72], [wx, y + d, z + h * .72]], "#5a4a3a", "win"); });
    return s + roof(x, y, w, d, z + h, rh, rf, o.e);
  }
  function granary(cx, cy, r, h) { // 圓形穀倉「囷」
    shadow(cx - r * .8, cy - r * .8, r * 1.6, r * 1.6, h + 1);
    const [X, Y0] = P(cx, cy, 0), [, Y1] = P(cx, cy, h + .3), rx = Math.SQRT2 * A * r, ry = Math.SQRT2 * B * r;
    return `<g><path d="M${X - rx} ${Y1} V${Y0} A${rx} ${ry} 0 0 0 ${X + rx} ${Y0} V${Y1} Z" fill="${shade(C.plaster, .88)}"/>
      <ellipse cx="${X}" cy="${Y1}" rx="${rx}" ry="${ry}" fill="${C.plaster}"/>
      <path d="M${X - rx - 3} ${Y1} L${X} ${Y1 - r * 26} L${X + rx + 3} ${Y1} A${rx + 3} ${ry + 1.5} 0 0 1 ${X - rx - 3} ${Y1} Z" fill="${C.straw}"/>
      <path d="M${X} ${Y1 - r * 26} L${X + rx + 3} ${Y1} A${rx + 3} ${ry + 1.5} 0 0 1 ${X} ${Y1 + ry + 1.5} Z" fill="${shade(C.straw, .8)}"/></g>`;
  }
  function tree(x, y, s = 1, c = C.leaf) {
    shadow(x - .35 * s, y - .35 * s, .7 * s, .7 * s, 2.4 * s);
    const [X, Y] = P(x, y, 0);
    return `<g class="tree" transform="translate(${X} ${Y}) scale(${s})"><path d="M0 0V-12" stroke="${C.trunk}" stroke-width="2.4"/><circle cy="-17" r="8" fill="${c}"/><circle cx="-5" cy="-13" r="6" fill="${shade(c, 1.12)}"/><circle cx="5" cy="-14" r="5.5" fill="${shade(c, .88)}"/></g>`;
  }
  function willow(x, y, s = 1) {
    shadow(x - .4 * s, y - .4 * s, .8 * s, .8 * s, 2.6 * s);
    const [X, Y] = P(x, y, 0);
    const strands = [-9, -5, -1, 3, 7, 10].map((dx, i) => `M${dx} ${-22 + (i % 2) * 2}q${dx > 0 ? 2 : -2} 8 ${dx > 0 ? 1 : -1} ${14 + (i % 3) * 3}`).join("");
    return `<g class="tree" transform="translate(${X} ${Y}) scale(${s})"><path d="M0 0V-16" stroke="${C.trunk}" stroke-width="2.4"/><ellipse cy="-22" rx="11" ry="7" fill="#8DB566"/><path d="${strands}" class="willow"/></g>`;
  }
  function pine(x, y, s = 1) {
    shadow(x - .3 * s, y - .3 * s, .6 * s, .6 * s, 3 * s);
    const [X, Y] = P(x, y, 0);
    return `<g class="tree" transform="translate(${X} ${Y}) scale(${s})"><path d="M0 0V-6" stroke="${C.trunk}" stroke-width="2.4"/><path d="M-9 -5h18l-9 -12z" fill="#4F7A47"/><path d="M-7 -12h14l-7 -11z" fill="#5C8A52"/><path d="M-5 -19h10l-5 -10z" fill="#6A9A5C"/></g>`;
  }
  function haystack(x, y) {
    shadow(x - .4, y - .4, .8, .8, 1.2);
    const [X, Y] = P(x, y, 0);
    return `<g transform="translate(${X} ${Y})"><ellipse rx="8" ry="4" fill="${shade(C.straw, .8)}"/><path d="M-8 0Q-7 -14 0 -15Q7 -14 8 0z" fill="${C.straw}"/><path d="M0 -15Q5 -12 8 0" fill="none" stroke="${shade(C.straw, .7)}" stroke-width="1"/><path d="M-1 -15l1 -3 1 3" fill="${shade(C.straw, .7)}"/></g>`;
  }
  const person = (body, hat) => `<path d="M-2.4 0h4.8l-.8-7h-3.2z" fill="${body}"/><circle cy="-9" r="2.3" fill="#E9C9A0"/>${hat}`;
  const strawHat = `<path d="M-4.5 -9.5L0 -13.5 4.5 -9.5z" fill="${C.straw}"/>`;
  function farmer(x, y, body = C.blue) { const [X, Y] = P(x, y, 0); return `<g transform="translate(${X} ${Y})">${person(body, strawHat)}<path d="M2 -4l5 4" stroke="${C.trunk}" stroke-width="1.2"/></g>`; }
  const oxShape = `<g><ellipse cx="0" cy="-5" rx="8" ry="4.5" fill="#7A5A3E"/><circle cx="8" cy="-7" r="3.2" fill="#6B4A33"/><path d="M8 -10l2 -2M9 -10l3 -1" stroke="#E8DCC0" stroke-width="1"/><path d="M-5 -1v3M-2 -1v3M3 -1v3M6 -1v3" stroke="#5A3E2A" stroke-width="1.4"/></g>`;
  function guard(x, y, z) { const [X, Y] = P(x, y, z); return `<g class="guard" transform="translate(${X} ${Y})">${person("#8E2F25", `<path d="M-2.7 -9.4a2.7 2.7 0 0 1 5.4 0z" fill="#3A3A44"/>`)}<path d="M3.2 1V-15" stroke="#5A4A3A" stroke-width=".9"/><path d="M3.2 -15l-1 -3h2z" fill="#B9C2C9"/></g>`; }
  function banner(x, y, z, c = C.red) { const [X, Y] = P(x, y, z); return `<g transform="translate(${X} ${Y})"><path d="M0 0V-22" stroke="#3A2A1E" stroke-width="1.3"/><path class="flag-cloth" d="M0 -22h11q-2.5 3.5 0 7H0z" fill="${c}"/></g>`; }
  function smoke(x, y, z) {
    if (!motion) return "";
    const [X, Y] = P(x, y, z);
    return `<g class="smoke" transform="translate(${f1(X)} ${f1(Y)})"><circle r="3"/><circle r="3.6" style="animation-delay:-1.3s"/><circle r="3.2" style="animation-delay:-2.6s"/></g>`;
  }
  function official(x, y) { const [X, Y] = P(x, y, 0); return `<g transform="translate(${X} ${Y})">${person("#2F3B5A", `<path d="M-2.3 -10.8h4.6v-3.2h-4.6z" fill="#1E1E24"/>`)}</g>`; }
  function folk(x, y, c) { const [X, Y] = P(x, y, 0); return `<g transform="translate(${X} ${Y})">${person(c, `<path d="M-2.4 -10.6q2.4 -2.6 4.8 0z" fill="#3A2A1E"/>`)}</g>`; }
  function well(x, y) {
    return box(x, y, .6, .6, .3, 0, "#A8A29A", "", { shadow: true }) + poly([[x + .1, y + .1, .3], [x + .5, y + .1, .3], [x + .5, y + .5, .3], [x + .1, y + .5, .3]], "#4F86AC") +
      box(x - .02, y + .25, .06, .1, .9, .3, C.wood) + box(x + .6, y + .25, .06, .1, .9, .3, C.wood) + roof(x, y + .1, .66, .4, 1.2, .3, C.roof, .12);
  }
  const ground = (x, y, w, d, fill, cls = "") => poly([[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]], fill, cls);
  function merlons(x0, y0, x1, y1, z) { // 城垛
    let s = ""; const n = Math.round(Math.hypot(x1 - x0, y1 - y0) / .9);
    for (let i = 0; i < n; i += 2) { const t = i / n; s += box(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, .35, .35, .32, z, C.earth); }
    return s;
  }
  function lamp(x, y, z, r = 14) { const [X, Y] = P(x, y, z); return `<circle cx="${X}" cy="${Y}" r="${r}" class="lamp"/><circle cx="${X}" cy="${Y}" r="2.2" class="lamp-core"/>`; }

  /* ---------- 城的配置（城牆 0–20 格） ---------- */
  const L = []; // [深度, svg]
  const add = (depth, s) => L.push([depth, s]);

  // 地面：田野、護城河、道路、城內地面
  const HZ = -24; // 地平線（畫面座標）
  let base = `<path d="M-490 ${HZ + 2} C-420 ${HZ - 6} -360 ${HZ - 4} -300 ${HZ + 1} S-180 ${HZ + 6} -110 ${HZ - 2} S20 ${HZ - 8} 90 ${HZ - 1} S220 ${HZ + 5} 300 ${HZ - 3} S410 ${HZ - 6} 450 ${HZ} V480 H-490Z" fill="${C.grass}"/>
    <path d="M-490 ${HZ + 2} C-420 ${HZ - 6} -360 ${HZ - 4} -300 ${HZ + 1} S-180 ${HZ + 6} -110 ${HZ - 2} S20 ${HZ - 8} 90 ${HZ - 1} S220 ${HZ + 5} 300 ${HZ - 3} S410 ${HZ - 6} 450 ${HZ}" class="hill-line"/>`;
  [[-330, 60, 120, 40, "#B6C786"], [140, 30, 160, 34, "#D3DCA4"], [-60, 420, 200, 50, "#B6C786"], [330, 300, 130, 40, "#D3DCA4"], [-400, 300, 110, 46, "#BDCB8C"], [300, 120, 90, 30, "#B6C786"]]
    .forEach(([cx, cy, rx, ry, c]) => base += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" opacity=".55" filter="url(#cityBlur)"/>`);
  // 小溪：從山腳流進護城河
  const brook = `M${P(-7.6, 5.2).map(f1).join(" ")} C${P(-6.4, 4.2).map(f1).join(" ")} ${P(-6, 6.4).map(f1).join(" ")} ${P(-4.9, 5.6).map(f1).join(" ")} S${P(-3.6, 6.2).map(f1).join(" ")} ${P(-2.9, 6.6).map(f1).join(" ")}`;
  base += `<path d="${brook}" class="brook-bank"/><path d="${brook}" class="brook"/><path d="${brook}" class="brook-flow"/>`;
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const busy = (x, y) => (x > -3.6 && x < 23.6 && y > -3.6 && y < 23.6) || (x > -1 && x < 9.4 && y > 23.6 && y < 31) || (x > 23.4 && x < 30.6 && y > 21.4 && y < 28.6) || (x > 27 && x < 30 && y > 10.6 && y < 13.6) || (Math.abs(x - 10) < 1 && y > 23) || (Math.abs(y - 10) < 1 && x > 23);
  for (let i = 0; i < 18; i++) { const x = -10 + (i * 7.3) % 46, y = -10 + (i * 11.7) % 46; if (!busy(x + .8, y + .8) && P(x, y)[1] > HZ + 6) base += ground(x, y, 1.6, 1.6, C.grass2); }
  let tufts = "", flowers = "";
  for (let i = 0; i < 260; i++) {
    const x = -12 + rnd() * 50, y = -12 + rnd() * 50; if (busy(x, y) || P(x, y)[1] < HZ + 4 || (x > -8 && x < -2.6 && y > 3.6 && y < 7.2)) continue;
    const [X, Y] = P(x, y, 0);
    if (i % 6 === 0) flowers += `<circle cx="${f1(X)}" cy="${f1(Y - 1)}" r="1.5" fill="${["#FFF6E2", "#F7D774", "#F2B6C6"][i % 3]}"/>`;
    else tufts += `M${f1(X - 3)} ${f1(Y)}l1.5 -3.5M${f1(X)} ${f1(Y)}v-4.5M${f1(X + 3)} ${f1(Y)}l-1.5 -3.5`;
  }
  base += `<path class="tuft" d="${tufts}"/>${flowers}`;
  // 屯田：一塊塊田，中間有田埂
  const fieldC = [C.field1, C.field2, C.field3];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
    const fx = -.6 + i * 2.3, fy = 24.2 + j * 2.3, c = fieldC[(i + j) % 3];
    base += ground(fx, fy, 2.1, 2.1, c, "field");
    for (let k = 1; k < 5; k++) base += `<path class="furrow" d="${seg([fx + .1, fy + k * .42, 0], [fx + 2, fy + k * .42, 0])}"/>`;
  }
  base += `<path d="M${pts([[-3, -3], [23, -3], [23, 23], [-3, 23]]).replace(/ /g, " L")} Z M${pts([[-1, -1], [-1, 21], [21, 21], [21, -1]]).replace(/ /g, " L")} Z" class="moat" fill-rule="evenodd"/>`;
  base += `<path d="M${pts([[-3, -3], [23, -3], [23, 23], [-3, 23]]).replace(/ /g, " L")} Z" class="moat-ripple" fill="none"/>`;
  base += `<path d="M${pts([[-3.15, -3.15], [23.15, -3.15], [23.15, 23.15], [-3.15, 23.15]]).replace(/ /g, " L")} Z M${pts([[-.85, -.85], [-.85, 20.85], [20.85, 20.85], [20.85, -.85]]).replace(/ /g, " L")} Z" class="moat-bank" fill="none"/>`;
  base += ground(23, 9.55, 15, .9, C.road) + ground(9.55, 23, .9, 15, C.road) + ground(-12, 9.55, 9, .9, C.road) + ground(9.55, -12, .9, 9, C.road);
  base += ground(0, 0, 20, 20, C.ground);
  base += ground(1, 9.5, 18, 1, C.road) + ground(9.5, 1, 1, 18, C.road);
  let pave = "", ruts = "";
  for (let k = 1.3; k < 18.8; k += .55) { if (Math.abs(k - 10) > .55) pave += seg([k, 9.5, 0], [k, 10.5, 0]) + seg([9.5, k, 0], [10.5, k, 0]); }
  pave += seg([1, 10, 0], [9.5, 10, 0]) + seg([10.5, 10, 0], [19, 10, 0]) + seg([10, 1, 0], [10, 9.5, 0]) + seg([10, 10.5, 0], [10, 19, 0]);
  [[23, 38], [-12, -3]].forEach(([a, b]) => { ruts += seg([a, 9.8, 0], [b, 9.8, 0]) + seg([a, 10.2, 0], [b, 10.2, 0]) + seg([9.8, a, 0], [9.8, b, 0]) + seg([10.2, a, 0], [10.2, b, 0]); });
  base += `<path class="paving" d="${pave}"/><path class="rut" d="${ruts}"/>`;
  add(-100, base);
  // 橋
  [[21, 9.3, 2, 1.4], [9.3, 21, 1.4, 2], [-3, 9.3, 2, 1.4], [9.3, -3, 1.4, 2]].forEach(([x, y, w, d]) => add(-90, box(x, y, w, d, .25, 0, C.wood)));

  // 城牆（每一段）與城門
  const H = 2.2;
  const wallSeg = (x, y, w, d, front) => box(x, y, w, d, H, 0, C.earth, "", { layers: true, shadow: true }) + (front ? merlons(...front, H) : "");
  function gate(x, y, w, d, dir) { // dir: 'x' 城門開在東西向牆（門洞面向 x+）、'y' 面向 y+
    shadow(x, y, w, d, H + 2.6);
    let s = box(x, y, w, d, H + .4, 0, C.earth, "", { layers: true });
    const m = dir === "x" ? [x + w, y + d / 2] : [x + w / 2, y + d];
    const hole = dir === "x"
      ? [[x + w, m[1] - .55, 0], [x + w, m[1] + .55, 0], [x + w, m[1] + .55, 1.5], [x + w, m[1] - .55, 1.5]]
      : [[m[0] - .55, y + d, 0], [m[0] + .55, y + d, 0], [m[0] + .55, y + d, 1.5], [m[0] - .55, y + d, 1.5]];
    s += poly(hole, "#3a2a1e", "gate-hole") + poly(hole, C.wood, "gate-door");
    s += hall(x + .25, y + .25, w - .5, d - .5, 1.3, { z: H + .4, roof: C.roof, rh: .9, door: false, win: true, pillars: false });
    s += lamp(m[0] + (dir === "x" ? .1 : 0), m[1] + (dir === "y" ? .1 : 0), 1.9, 16);
    s += dir === "x" ? banner(x + w, y + .15, H + .4) + banner(x + w, y + d - .15, H + .4) : banner(x + .15, y + d, H + .4) + banner(x + w - .15, y + d, H + .4);
    return s;
  }
  const tower = (x, y) => (shadow(x - 1.1, y - 1.1, 2.2, 2.2, H + 2.8), "") + box(x - 1.1, y - 1.1, 2.2, 2.2, H + 1.1, 0, C.earth, "", { layers: true }) + banner(x + 1.1, y + 1.1, H + 1.1, C.gold) + hall(x - .8, y - .8, 1.6, 1.6, 1.1, { z: H + 1.1, rh: .9, door: false, win: true, noShadow: true }) + lamp(x + .9, y + .9, H + 1.6, 10);
  // 後面的牆（北、西）
  add(-50, wallSeg(1, 0, 8.3, 1) + wallSeg(10.7, 0, 8.3, 1) + gate(8.6, -.4, 2.8, 1.8, "y"));
  add(-49, wallSeg(0, 1, 1, 8.3) + wallSeg(0, 10.7, 1, 8.3) + gate(-.4, 8.6, 1.8, 2.8, "x"));
  add(-48, tower(0, 0));
  add(20, tower(20, 0)); add(20.5, tower(0, 20));
  // 前面的牆（東、南）
  add(100, wallSeg(19, 1, 1, 8.3, [20, 1.2, 20, 9.4]) + wallSeg(19, 10.7, 1, 8.3, [20, 10.8, 20, 19]));
  add(100.5, [3, 6.4, 13.4, 16.6].map(y => guard(19.55, y, H) + lamp(19.8, y + .4, H + .9, 9)).join(""));
  if (motion) add(100.6, `<g>${guard(0, 0, 0)}<animateMotion dur="16s" repeatCount="indefinite" path="M${P(19.5, 1.6, H).join(" ")} L${P(19.5, 8.2, H).join(" ")} L${P(19.5, 1.6, H).join(" ")}"/></g>`);
  add(101, gate(18.6, 8.6, 1.8, 2.8, "x"));
  add(102, wallSeg(1, 19, 8.3, 1, [1.2, 20, 9.4, 20]) + wallSeg(10.7, 19, 8.3, 1, [10.8, 20, 19, 20]));
  add(102.5, [3, 6.6, 13.4, 16.4].map(x => guard(x, 19.55, H) + lamp(x + .4, 19.8, H + .9, 9)).join(""));
  add(103, gate(8.6, 18.6, 2.8, 1.8, "y"));
  add(110, tower(20, 20));

  // 太守府（西北）
  const yard = (x, y, w, d, gateSide) => { // 院牆
    let s = box(x, y, w, .3, .7, 0, C.plaster) + box(x, y, .3, d, .7, 0, C.plaster);
    s += box(x + w - .3, y, .3, d, .7, 0, C.plaster);
    if (gateSide === "y") s += box(x, y + d - .3, w / 2 - .6, .3, .7, 0, C.plaster) + box(x + w / 2 + .6, y + d - .3, w / 2 - .6, .3, .7, 0, C.plaster);
    else s += box(x, y + d - .3, w, .3, .7, 0, C.plaster);
    return s;
  };
  add(4, yard(2, 2, 6.5, 6.5, "y"));
  add(8, (shadow(3.2, 3, 4, 2.2, 2.7), "") + box(2.9, 2.7, 4.6, 2.8, .3, 0, "#D3C6AC", "", { shadow: true }) + hall(3.2, 3, 4, 2.2, 1.5, { z: .3, roof: C.roofRed, rh: 1.3, pillars: true, win: true }));
  add(9.5, hall(2.6, 5.9, 1.4, 1.8, 1, { win: true }) + hall(6.5, 5.9, 1.4, 1.8, 1, { win: true }));
  add(10, tree(5.2, 7));
  add(14.6, official(4.9, 9.05) + official(5.6, 9.15));
  add(25.4, guard(17, 8.05, 0));
  add(31.2, folk(13.9, 15.6, C.gold) + folk(16.3, 13.7, C.blue));
  add(9, lamp(5.2, 5.3, 1.1));
  // 糧倉、武庫（東北）
  add(14, granary(12.6, 2.8, .8, 1.4)); add(15.6, granary(14.6, 2.8, .8, 1.4)); add(16.6, granary(12.6, 4.9, .8, 1.4));
  add(17, hall(12, 6.6, 3.6, 1.6, 1, { z: .4, wall: "#D9C9A0", roof: C.straw, rh: .9, win: false }) + box(12, 6.6, 3.6, 1.6, .4, 0, C.wood));
  add(20.5, hall(16.2, 2.2, 2.4, 5.6, 1.3, { roof: C.roof, rh: 1.1, win: false }));
  add(24, box(15.8, 8.4, 3, .3, .9, 0, C.wood));
  // 市（東南）
  let mk = "";
  [[12, 12, 6.5, .3], [12, 12, .3, 6.5]].forEach(([x, y, w, d]) => mk += box(x, y, w, d, .6, 0, C.plaster));
  add(24, mk);
  const awn = [C.red, C.gold, C.green, C.blue];
  [[12.8, 12.8], [14.3, 12.8], [16.6, 12.8], [12.8, 14.2], [16.8, 14.2], [12.8, 16.6], [14.4, 16.9], [16.6, 16.6]].forEach(([x, y], i) => {
    add(x + y + 2, box(x, y, 1.1, .8, .55, 0, C.wood, "", { shadow: true }) + box(x - .1, y - .1, 1.3, 1, .12, .7, awn[i % 4]));
  });
  add(30.2, (shadow(14.5, 14.5, 1.4, 1.4, 3.2), "") + box(14.5, 14.5, 1.4, 1.4, 1.5, 0, C.plaster) + hall(14.6, 14.6, 1.2, 1.2, 1.1, { z: 1.5, roof: C.roofRed, rh: .8, door: false, win: true }) + lamp(15.9, 15.9, 1.8) + banner(15.7, 14.6, 3.4, C.gold));
  add(37, box(12, 18.2, 2.6, .3, .6, 0, C.plaster) + box(15.4, 18.2, 3.1, .3, .6, 0, C.plaster) + box(18.2, 12, .3, 2.6, .6, 0, C.plaster) + box(18.2, 15.4, .3, 3.1, .6, 0, C.plaster));
  // 里（西南）
  add(14, box(2, 12, 6.5, .3, .7, 0, C.plaster) + box(2, 12, .3, 6.5, .7, 0, C.plaster));
  [[2.6, 12.6], [4.6, 12.6], [2.5, 15.9], [4.4, 16.1], [6.3, 15.9]].forEach(([x, y], i) => add(x + y + 2.2, hall(x, y, 1.7, 1.5, .95, { win: true, rh: .8 }) + (i % 2 ? "" : smoke(x + 1.3, y + .35, 1.75))));
  add(21.3, folk(5.8, 15.4, C.green) + folk(4.6, 15.7, C.red));
  add(20.5, tree(7.6, 13.6, 1.25, C.leaf2)); // 桑樹
  add(20.2, well(4.9, 14.9));
  add(26, box(2, 18.2, 2.4, .3, .7, 0, C.plaster) + box(5.4, 18.2, 3.1, .3, .7, 0, C.plaster) + box(8.2, 12, .3, 6.5, .7, 0, C.plaster));
  // 城外：亭、塢堡、樹
  add(41, box(27.4, 11, 2.2, 2.2, .25, 0, C.earthTop) + hall(27.6, 11.2, 1.8, 1.8, 1.4, { win: true, rh: 1 }));
  add(41.5, (() => { const [X, Y] = P(29.9, 11, 0); return `<g><path d="M${X} ${Y}V${Y - 40}" stroke="${C.trunk}" stroke-width="1.6"/><path d="M${X} ${Y - 40}h14l-3 5 3 5H${X}z" fill="${C.red}"/><text x="${X + 6.5}" y="${Y - 31.5}" class="sign">亭</text></g>`; })() + lamp(29.2, 13, 1));
  add(48, yard(24, 22, 6, 6, "y"));
  add(52, hall(25.2, 23, 3.4, 2, 1.1, { win: true, rh: 1 }));
  add(46.5, box(24, 22, 1.3, 1.3, 2.6, 0, C.plaster, "", { shadow: true }) + hall(24.1, 22.1, 1.1, 1.1, .9, { z: 2.6, door: false, win: true, rh: .7 }));
  add(58, box(28.7, 26.7, 1.3, 1.3, 2.6, 0, C.plaster, "", { shadow: true }) + hall(28.8, 26.8, 1.1, 1.1, .9, { z: 2.6, door: false, win: true, rh: .7 }) + banner(30, 28, 2.6, C.green));
  [[-6, 4, 1.1], [26, -5, 1], [33, 17, .9], [13, 29, 1.1], [22, 32, 1.2], [5, -7, .9], [34, 30, 1]].forEach(([x, y, s]) => add(x + y + 1, tree(x, y, s)));
  [[-4.3, 2.5], [-4.3, 16.5], [24.3, 3.5], [24.3, 17], [3, -4.3], [16.5, -4.3], [15.5, 24.4]].forEach(([x, y]) => add(x + y + 1, willow(x, y, 1)));
  [[-9, 10, 1.1], [31, 0, 1], [35, 23, 1.1], [19, 30, 1], [-8, 19, .9], [12, 33, 1]].forEach(([x, y, s]) => add(x + y + 1, pine(x, y, s)));
  // 西門外的小村落
  [[-9.4, 12.6], [-7.2, 13.4], [-9.2, 15.4]].forEach(([x, y], i) => add(x + y + 1.6, hall(x, y, 1.5, 1.2, .85, { win: true, rh: .75, roof: C.straw }) + (i === 1 ? "" : smoke(x + 1.1, y + .3, 1.55))));
  add(5.6, box(-10.2, 12, 4.6, .12, .45, 0, C.wood) + box(-10.2, 12, .12, 5.4, .45, 0, C.wood));
  add(9.4, box(-10.2, 17.3, 4.6, .12, .45, 0, C.wood));
  add(8.5, haystack(-6.6, 16.4)); add(5.2, tree(-6.2, 11.6, .9)); add(7.6, tree(-10.8, 18.6, 1));
  add(34.2, haystack(8.9, 25.3)); add(36.6, haystack(8.9, 27.7)); add(38.8, haystack(8.9, 29.9));
  add(31.5, farmer(2.6, 28.9)); add(34.6, farmer(6.4, 28.2, C.red));
  add(33.5, motion ? `<g>${oxShape}<animateMotion dur="12s" repeatCount="indefinite" path="M${P(2.2, 31.5).join(" ")} L${P(6.6, 31.5).join(" ")} L${P(2.2, 31.5).join(" ")}"/></g>` : (() => { const [X, Y] = P(4, 31.5); return `<g transform="translate(${X} ${Y})">${oxShape}</g>`; })());

  /* ---------- 會動的小東西：牛車、行人（夜晚不出門） ---------- */
  const cartShape = box(-.5, -.3, 1, .6, .45, .2, C.wood) + box(.6, -.25, .7, .5, .55, 0, "#6B4A33");
  const walker = `<circle cy="-9" r="2.6" fill="#E9C9A0"/><path d="M-2.2 -6 h4.4 l1 7 h-6.4z" fill="${C.blue}"/>`;
  let movers = "";
  if (motion) {
    const road = (a, b, dur, shape, delay = 0) => `<g class="mover">${shape.replace(/^/, "")}<animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" path="M${P(...a).join(" ")} L${P(...b).join(" ")}"/></g>`;
    movers += road([22, 10], [37, 10], 16, cartShape) + road([37, 10.2], [22, 10.2], 20, walker, 3) + road([10, 22], [10, 37], 18, walker, 1) + road([10.3, 36], [10.3, 22], 22, walker.replace(C.blue, C.red), 6);
    movers += road([15.3, 13.2], [13.2, 15.3], 7, walker.replace(C.blue, C.green)) + road([17.6, 15], [15.6, 17.6], 9, walker.replace(C.blue, C.gold), 2);
    const boat = `<ellipse cx="0" cy="2" rx="13" ry="3" fill="#fff" opacity=".35"/><path d="M-11 -2q11 6 22 0l-2.5 -3h-17z" fill="${C.wood}" stroke="#4a3220" stroke-width=".8"/><g transform="translate(-3 -3)">${walker.replace(C.blue, "#5C7A99")}</g><path d="M4 -4l9 -10" stroke="#5a4a3a" stroke-width="1"/>`;
    movers += `<g class="mover boat">${boat}<animateMotion dur="26s" repeatCount="indefinite" path="M${P(3, 22).join(" ")} L${P(7.5, 22).join(" ")} L${P(3, 22).join(" ")}"/></g>`;
  }

  const sky = `<g class="sky-day"><g class="cloud c1"><ellipse cx="-380" cy="-70" rx="48" ry="13"/><circle cx="-396" cy="-80" r="15"/><circle cx="-368" cy="-86" r="19"/><circle cx="-342" cy="-76" r="12"/></g><g class="cloud c2"><ellipse cx="300" cy="-60" rx="42" ry="11"/><circle cx="288" cy="-70" r="13"/><circle cx="312" cy="-75" r="16"/><circle cx="334" cy="-66" r="10"/></g></g>
    <g class="sky-night"><circle cx="360" cy="-60" r="22" class="moon"/><circle cx="371" cy="-66" r="20" class="moon-cut"/>${[[-420, -90], [-300, -60], [-170, -95], [130, -95], [230, -50], [420, -30], [-450, -20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" class="star"/>`).join("")}</g>`;
  add(-80, `<g class="shadows">${SH.join("")}</g>`);
  const far = "M-490 -14 C-470 -36 -446 -60 -414 -64 C-392 -66 -380 -50 -358 -52 C-330 -55 -318 -88 -288 -90 C-258 -92 -248 -60 -218 -58 C-190 -56 -178 -76 -148 -78 C-118 -80 -100 -52 -70 -50 C-40 -48 -28 -72 2 -74 C30 -76 48 -98 80 -100 C110 -102 128 -64 160 -62 C190 -60 200 -82 230 -84 C260 -86 282 -58 310 -56 C340 -54 362 -88 392 -90 C420 -92 438 -56 450 -44 L450 0 L-490 0Z";
  const near = "M-490 -4 C-460 -22 -430 -30 -396 -26 C-366 -22 -350 -40 -316 -42 C-282 -44 -262 -20 -228 -18 C-196 -16 -170 -34 -136 -34 C-100 -34 -86 -14 -50 -14 C-16 -14 0 -30 34 -32 C70 -34 88 -12 122 -12 C156 -12 176 -36 212 -36 C248 -36 262 -14 296 -12 C330 -10 352 -30 388 -32 C420 -34 440 -18 450 -12 L450 6 L-490 6Z";
  const cun = [[-288, -90], [80, -100], [392, -90], [-148, -78], [230, -84]].map(([x, y]) => `M${x} ${y + 4}q-6 10 -14 16M${x + 4} ${y + 8}q-2 8 -8 14M${x} ${y + 4}q6 10 12 14`).join("");
  add(-101, `<g class="bg">
    <rect x="-490" y="-110" width="940" height="130" class="bg-sky"/>${sky}
    <path d="${far}" class="mtn-far"/><path d="${cun}" class="mtn-cun"/>
    <ellipse cx="-200" cy="-22" rx="220" ry="16" class="haze"/><ellipse cx="240" cy="-28" rx="240" ry="18" class="haze"/>
    <path d="${near}" class="mtn-near"/></g>`);
  add(-99.5, `<rect x="-490" y="${HZ - 8}" width="940" height="14" class="horizon-haze"/>`);
  const birds = motion ? [[-470, -40, 34], [-500, -10, 46]].map(([x, y, dur], i) => `<g class="bird"><path d="M-6 0q3 -4 6 0q3 -4 6 0" /><animateMotion dur="${dur}s" begin="${i * 6}s" repeatCount="indefinite" path="M${x} ${y} Q 0 ${y - 50} 480 ${y - 20}"/></g>`).join("") : "";

  /* ---------- 探索點 ---------- */
  const SPOT_AT = {
    chengchi: [22.2, 15.5, .4], chengmen: [19.5, 10, 5.4], jiaolou: [0, 20, 6.3], taishou: [5.2, 4.1, 4.4], shi: [15.2, 15.2, 5.4],
    li: [4.6, 14.6, 3.2], cang: [13.6, 3.9, 3.7], wuku: [17.4, 5, 3.4], ting: [28.5, 12, 4.4], tuntian: [4, 28, 1.2], wubao: [26.9, 24.9, 4.6]
  };
  const spots = CITY_SPOTS.filter(s => SPOT_AT[s.id]);
  const marks = spots.map((s, i) => {
    const [X, Y] = P(...SPOT_AT[s.id]);
    return `<g class="spot" data-spot="${s.id}" tabindex="0" role="button" aria-label="${i + 1}. ${esc(s.name)}" transform="translate(${X.toFixed(1)} ${Y.toFixed(1)})">
      <g class="spot-in"><path d="M0 0v-12" class="spot-stem"/><circle cy="-24" r="17" class="spot-ring"/><circle cy="-24" r="12.5" class="spot-dot"/><text y="-19.5">${i + 1}</text>
      <g class="spot-tag"><rect x="16" y="-35" width="${s.name.length * 14 + 14}" height="22" rx="6"/><text x="${23 + s.name.length * 7}" y="-19" text-anchor="middle">${esc(s.name)}</text></g></g></g>`;
  }).join("");

  /* ---------- 畫出來 ---------- */
  L.sort((a, b) => a[0] - b[0]);
  const VB = "-490 -110 940 580";
  const scene = $("#citySvg");
  scene.setAttribute("viewBox", VB);
  scene.innerHTML = `<defs><linearGradient id="citySkyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9D0E6"/><stop offset="1" stop-color="#F3E9D2"/></linearGradient>
    <linearGradient id="cityFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FA3B5"/><stop offset="1" stop-color="#D3DDE0"/></linearGradient>
    <linearGradient id="cityNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7F9C86"/><stop offset="1" stop-color="#C6D3A8"/></linearGradient>
    <linearGradient id="cityBlend" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D49A" stop-opacity="0"/><stop offset=".75" stop-color="#C9D49A" stop-opacity="1"/></linearGradient>
    <filter id="cityBlur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="cityPaper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .3  0 0 0 0 .15  0 0 0 .1 0"/></filter>
    <radialGradient id="cityVig" cx="50%" cy="50%" r="70%"><stop offset="65%" stop-color="#5a3a1a" stop-opacity="0"/><stop offset="100%" stop-color="#5a3a1a" stop-opacity=".3"/></radialGradient>
    <linearGradient id="citySun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE9B0" stop-opacity=".5"/><stop offset=".55" stop-color="#FFE9B0" stop-opacity="0"/><stop offset="1" stop-color="#7A4A1C" stop-opacity=".18"/></linearGradient>
    <linearGradient id="cityWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CCBE3"/><stop offset="1" stop-color="#5E93B8"/></linearGradient><radialGradient id="cityGlow"><stop offset="0" stop-color="#FFD36B" stop-opacity=".9"/><stop offset="1" stop-color="#FFB13B" stop-opacity="0"/></radialGradient></defs>
    <rect x="-490" y="-110" width="940" height="580" class="city-sky"/>
    <g class="city-world">${L.map(l => l[1]).join("")}${movers}
      <g class="mist"><ellipse cx="-120" cy="250" rx="190" ry="14"/><ellipse cx="200" cy="360" rx="220" ry="16"/><ellipse cx="-300" cy="120" rx="140" ry="10"/></g></g>
    <g class="birds">${birds}</g>
    <rect x="-490" y="-110" width="940" height="580" class="sunlight"/>
    <rect x="-490" y="-110" width="940" height="580" filter="url(#cityPaper)" pointer-events="none"/>
    <rect x="-490" y="-110" width="940" height="580" fill="url(#cityVig)" pointer-events="none"/>
    <rect x="-490" y="-110" width="940" height="580" class="night-veil"/>
    <g class="lamps">${L.map(l => l[1]).join("").match(/<circle[^>]*class="lamp(?:-core)?"[^>]*\/>/g).join("")}</g>
    ${marks}`;

  /* ---------- 互動：說明卡、探索進度、白天夜晚 ---------- */
  const KEY = "sgby_city_v1";
  const seen = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; } })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(seen)); } catch (_) {} };
  const info = $("#cityInfo"), chips = $("#cityChips"), prog = $("#cityProg");
  let cur = -1;
  const wrap = $("#cityWrap"), sc = $("#cityScroll"), outBtn = $("#cityOut");

  /* ---------- 放大鏡：點數字飛過去看細節，可以拖曳移動 ---------- */
  const FULL = [-490, -110, 940, 580], ZW = 360;
  let vb = FULL.slice(), raf = 0, zoomed = false;
  function setVB(v) {
    vb = v;
    scene.setAttribute("viewBox", v.map(n => n.toFixed(1)).join(" "));
    const pw = scene.getBoundingClientRect().width || 680; // 標記在螢幕上維持差不多的大小
    scene.style.setProperty("--ms", Math.min(1, 1.15 * v[2] / pw).toFixed(3));
  }
  const clampVB = v => {
    const [w, h] = [v[2], v[3]];
    return [Math.max(FULL[0], Math.min(FULL[0] + FULL[2] - w, v[0])), Math.max(FULL[1], Math.min(FULL[1] + FULL[3] - h, v[1])), w, h];
  };
  function fly(to, ms = 750) {
    cancelAnimationFrame(raf);
    const from = vb.slice(), t0 = performance.now(), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    if (!motion) return setVB(to);
    const step = now => {
      const t = Math.min(1, (now - t0) / ms), k = ease(t);
      setVB(from.map((f, i) => f + (to[i] - f) * k));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function zoomTo(id) {
    const at = SPOT_AT[id]; if (!at) return;
    const [cx, cy] = P(at[0], at[1], at[2] * .45), h = ZW * FULL[3] / FULL[2];
    if (!zoomed) { zoomed = true; wrap.classList.add("zoomed"); outBtn.hidden = false; sc.scrollLeft = 0; }
    fly(clampVB([cx - ZW / 2, cy - h / 2 + 18, ZW, h]));
  }
  function zoomOut() {
    if (!zoomed) return;
    zoomed = false; wrap.classList.remove("zoomed"); outBtn.hidden = true;
    fly(FULL.slice());
    requestAnimationFrame(() => { if (sc.scrollWidth > sc.clientWidth) sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2; });
  }
  outBtn.addEventListener("click", zoomOut);
  document.addEventListener("keydown", e => { if (e.key === "Escape") zoomOut(); });
  // 放大時用滑鼠或手指拖曳移動
  let drag = null, dragged = false;
  scene.addEventListener("pointerdown", e => {
    dragged = false;
    if (!zoomed || e.button > 0) return;
    drag = { x: e.clientX, y: e.clientY, vb: vb.slice(), k: vb[2] / scene.getBoundingClientRect().width };
  });
  window.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!dragged && Math.hypot(dx, dy) < 6) return;
    if (!dragged) { dragged = true; cancelAnimationFrame(raf); wrap.classList.add("dragging"); }
    setVB(clampVB([drag.vb[0] - dx * drag.k, drag.vb[1] - dy * drag.k, drag.vb[2], drag.vb[3]]));
  });
  window.addEventListener("pointerup", () => { if (drag) { drag = null; wrap.classList.remove("dragging"); setTimeout(() => { dragged = false; }, 0); } });

  function progress() {
    const n = spots.filter(s => seen[s.id]).length;
    prog.innerHTML = `已探索 <b>${n}</b> / ${spots.length}${n === spots.length ? "　🏆 整座城都逛完了！" : ""}`;
    chips.innerHTML = spots.map((s, i) => `<button type="button" class="city-chip${seen[s.id] ? " seen" : ""}${i === cur ? " on" : ""}" data-spot="${s.id}"><b>${i + 1}</b>${esc(s.name)}</button>`).join("");
    scene.querySelectorAll(".spot").forEach(g => { g.classList.toggle("seen", !!seen[g.dataset.spot]); g.classList.toggle("on", g.dataset.spot === (spots[cur] || {}).id); });
  }
  function show(i, scroll) {
    cur = (i + spots.length) % spots.length;
    const s = spots[cur];
    const first = !seen[s.id]; seen[s.id] = 1; save();
    info.innerHTML = `<div class="fade-in">
      <div class="ci-head"><span class="ci-no">${cur + 1}</span><div><h2>${esc(s.name)}</h2><p class="muted small">${esc(s.sub)}</p></div></div>
      <p class="ci-text">${esc(s.text)}</p>
      <div class="ci-fact"><b>💡 你知道嗎？</b><p>${esc(s.fact)}</p></div>
      <p class="src">出處：${esc(s.source)}</p>
      ${s.link ? `<a class="btn btn-line btn-sm" href="${s.link.href}">${esc(s.link.text)} →</a>` : ""}
      <div class="ci-nav"><button class="btn btn-line btn-sm" data-go="-1">← 上一個</button><button class="btn btn-red btn-sm" data-go="1">下一個 →</button></div>
    </div>`;
    progress();
    if (first && spots.every(x => seen[x.id])) toast("🏆 恭喜！整座三國城池都逛完了！");
    zoomTo(s.id);
    if (scroll && matchMedia("(max-width: 899px)").matches) wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const pick = e => { if (dragged) return; const t = e.target.closest("[data-spot]"); if (t) show(spots.findIndex(s => s.id === t.dataset.spot), true); };
  scene.addEventListener("click", pick);
  scene.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.closest(".spot")) { e.preventDefault(); pick(e); } });
  chips.addEventListener("click", pick);
  info.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) show(cur + +b.dataset.go, false); });

  const tgl = $("#cityTime");
  tgl.addEventListener("click", () => {
    const night = wrap.classList.toggle("night");
    tgl.textContent = night ? "☀️ 切換到白天" : "🌙 切換到夜晚";
    tgl.setAttribute("aria-pressed", night);
    if (night) toast("🌙 天黑了：城門關上，路上也沒人了");
  });
  // 手機：一開始捲到城的中間
  if (sc.scrollWidth > sc.clientWidth) sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2;
  progress();
  info.innerHTML = `<div class="ci-intro"><h2>🏯 歡迎進城！</h2><p>這是一座「示意」的東漢末年郡城，依據史書記載和考古出土的陶樓、畫像磚畫成。</p><p>點地圖上的 <b class="ci-dot">1</b> ～ <b class="ci-dot">${spots.length}</b> 號，看看三國時代的人怎麼生活。也可以切換到夜晚看看！</p><div class="row" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-red btn-sm" data-go="1">從 1 號開始逛 →</button><a class="btn btn-line btn-sm" href="map.html">🗺️ 三國地圖時間軸</a></div></div>`;
})();
