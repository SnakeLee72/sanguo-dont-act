/* 你來當軍師：戰役抉擇遊戲（資料在 data.js 的 BATTLES） */
(function () {
  const { $, esc, avatar, personById, storyById, epByCode, links, Store, Mine, toast, verdictBadge } = SG;
  const box = $("#box");
  const hostName = id => (HOSTS.find(h => h.id === id) || personById[id] || {}).name || "";
  const list = BATTLES.filter(b => b.status === "published");
  const voteKey = (b, s, k) => `poll:${b.id}-${s.id}:${k}`;
  const top = () => box.scrollIntoView({ behavior: "smooth", block: "start" });
  const roleName = b => (personById[b.role] || {}).name || "";

  /* ---------- 戰場示意圖（純 SVG 手繪風） ---------- */
  const f1 = n => +n.toFixed(1);
  const ICON = {
    city: c => `<path d="M-9 6V-4h2v-3h3v3h2.5v-3h3v3H4v-3h3v3h2V6z" fill="${c}" class="ink"/><path d="M-2.5 6V1.5a2.5 2.5 0 0 1 5 0V6z" class="hole"/>`,
    capital: c => `<g transform="scale(1.2)">${ICON.city(c)}<rect x="-4" y="-12" width="8" height="5" fill="${c}" class="ink"/><path d="M-7-11.5 0-16l7 4.5z" fill="${c}" class="ink"/></g>`,
    camp: c => `<path d="M-12 8h24" class="stake"/><path d="M-10 8v-4M-6 8v-4M6 8v-4M10 8v-4" class="stake"/><path d="M-8 6 0-6l8 12z" fill="${c}" class="ink"/><path d="M-2 6l2-5 2 5z" class="hole"/>`,
    grain: c => `<path d="M-7 6v-7h14v7z" fill="${c}" class="ink"/><path d="M-9-1 0-9l9 8z" fill="${c}" class="ink"/><circle cx="-10" cy="5" r="3" class="sack"/><circle cx="10" cy="5" r="3" class="sack"/>`,
    ford: c => `<path d="M-10 6q3-2 6 0t6 0 6 0" class="wave"/><path d="M-8 0q8 6 16 0z" fill="${c}" class="ink"/><path d="M0 0v-11l6 7z" fill="${c}" opacity=".7"/>`
  };
  const FX = {
    clash: () => `<g class="fx-clash" transform="translate(0 -23)"><path d="M-8-8 8 8M8-8-8 8" class="sword"/><path d="M-9-4-4-9M4-9 9-4" class="hilt"/><path d="M0-6 1.5-1.5 6 0 1.5 1.5 0 6-1.5 1.5-6 0-1.5-1.5z" class="spark"/></g>`,
    fire: () => `<g transform="translate(0 -6) scale(1.35)"><circle class="smoke" cx="0" cy="-18" r="5"/><circle class="smoke s2" cx="5" cy="-22" r="4"/>
      <path class="flame f1" d="M-6 0c-6-5-2-11 0-18 2 6 7 10 2 18z"/><path class="flame f2" d="M2 0c-4-4-1-9 2-15 2 5 6 9 2 15z"/><path class="flame f3" d="M-3 0c-3-3 0-6 2-10 2 4 4 6 1 10z"/></g>`,
    flag: (side) => `<g class="fx-flag" transform="translate(10 -12)"><path d="M0 12V-24" class="pole"/><path class="cloth" d="M0-24h18q-3 6 0 12H0z" style="fill:${side.color}"/><text x="8.5" y="-14" class="flag-ch">${esc(side.flag)}</text></g>`
  };
  function map(b, view) {
    const P = b.places, S = b.sides, focus = new Set(view.focus || []);
    const sideOf = k => S[k] || { color: "var(--muted)" };
    const arrow = ([from, to, kind]) => {
      const a = P[from], c = P[to]; if (!a || !c) return "";
      const dx = c.x - a.x, dy = c.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
      const x1 = a.x + ux * 14, y1 = a.y + uy * 14, x2 = c.x - ux * 16, y2 = c.y - uy * 16;
      const mx = (x1 + x2) / 2 - uy * 18, my = (y1 + y2) / 2 + ux * 18;
      const side = kind === "feint" ? Object.keys(S)[0] : kind;
      const d = `M${f1(x1)} ${f1(y1)}Q${f1(mx)} ${f1(my)} ${f1(x2)} ${f1(y2)}`;
      return `<path class="arw-halo" d="${d}"/><path class="arw ${kind === "feint" ? "feint" : ""}" d="${d}" style="stroke:${sideOf(side).color}" marker-end="url(#m-${side})"/>`;
    };
    const place = ([id, p]) => {
      const right = p.x > 350, c = sideOf(p.side).color;
      return `<g class="pl${focus.has(id) ? " focus" : ""}" transform="translate(${p.x} ${p.y})">
        <circle class="ring" r="16"/>${(ICON[p.icon] || ICON.city)(c)}
        <text x="${right ? -14 : 14}" y="5" text-anchor="${right ? "end" : "start"}">${esc(p.name)}</text></g>`;
    };
    const fx = ([at, kind, side]) => {
      const pt = Array.isArray(at) ? { x: at[0], y: at[1] } : P[at];
      return pt && FX[kind] ? `<g transform="translate(${pt.x} ${pt.y})">${FX[kind](sideOf(side || pt.side))}</g>` : "";
    };
    const terrain = t => {
      if (t.type === "river") return `<path id="rv-${b.id}" d="${t.d}" class="river-bank"/><path d="${t.d}" class="river"/><path d="${t.d}" class="river-flow"/>
        <text class="river-name" dy="${t.below ? 18 : -9}"><textPath href="#rv-${b.id}" startOffset="${t.label || 10}%">${esc([...t.name].join("　"))}</textPath></text>`;
      if (t.type === "lake") return `<ellipse cx="${t.x}" cy="${t.y}" rx="${t.rx + 6}" ry="${t.ry + 5}" class="lake-bank"/><ellipse cx="${t.x}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" class="lake"/><text x="${t.x}" y="${t.y + 4}" class="lake-name">${esc(t.name)}</text>`;
      if (t.type === "mountains") return t.at.map(([x, y, s]) => `<g class="mtn" transform="translate(${x} ${y}) scale(${s / 10})"><path d="M-12 0 0-13 12 0z" class="mtn-body"/><path d="M0-13-3-5 0-7 2-3 4 0" class="mtn-shade"/></g>`).join("");
      if (t.type === "camps") return t.at.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(.6)">${ICON.camp(sideOf(t.side).color)}</g>`).join("");
      if (t.type === "grass") return t.at.map(([x, y]) => `<path class="grass" d="M${x - 4} ${y}q2-5 4-6M${x} ${y}v-7M${x + 4} ${y}q-2-5-4-6"/>`).join("");
      return "";
    };
    const seal = [...(b.seal || b.title.slice(0, 2))];
    return `<div class="map">
      <svg viewBox="0 0 400 300" role="img" aria-label="${esc(b.title)}示意圖">
        <defs>
          <filter id="mp-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .3  0 0 0 0 .15  0 0 0 .12 0"/></filter>
          <filter id="mp-rough"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>
          <radialGradient id="mp-vig" cx="50%" cy="50%" r="70%"><stop offset="60%" stop-color="#7a4a1c" stop-opacity="0"/><stop offset="100%" stop-color="#7a4a1c" stop-opacity=".28"/></radialGradient>
          ${Object.entries(S).map(([k, v]) => `<marker id="m-${k}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 3 5z" style="fill:${v.color}"/></marker>`).join("")}
        </defs>
        <rect width="400" height="300" class="paper"/>
        <rect width="400" height="300" filter="url(#mp-paper)"/>
        <g filter="url(#mp-rough)">${b.terrain.map(terrain).join("")}</g>
        ${(view.arrows || []).map(arrow).join("")}
        ${Object.entries(P).map(place).join("")}
        ${(view.fx || []).map(fx).join("")}
        <g class="compass" transform="translate(370 256)"><circle r="14"/><path d="M0-12 4 0 0 12-4 0z" class="needle"/><path d="M0-12 4 0h-8z" class="needle-n"/><text y="-17">北</text></g>
        <g class="seal" transform="translate(20 250) rotate(-4)"><rect width="30" height="30" rx="3"/>
          ${seal.length === 4 ? seal.map((ch, i) => `<text x="${i % 2 ? 22 : 8.5}" y="${i < 2 ? 13 : 26.5}">${esc(ch)}</text>`).join("") : seal.slice(0, 2).map((ch, i) => `<text x="15" y="${i ? 26.5 : 13}">${esc(ch)}</text>`).join("")}</g>
        <rect width="400" height="300" fill="url(#mp-vig)" pointer-events="none"/>
        <rect x="6" y="6" width="388" height="288" rx="6" class="frame"/><rect x="10" y="10" width="380" height="280" rx="4" class="frame thin"/>
        <text x="392" y="288" class="note" text-anchor="end">示意圖・不按比例</text>
      </svg>
    </div>
    <div class="legend">${Object.values(S).map(v => `<span><b style="background:${v.color}"></b>${esc(v.name)}</span>`).join("")}${(view.arrows || []).some(a => a[2] === "feint") ? `<span><b style="background:repeating-linear-gradient(90deg,${Object.values(S)[0].color} 0 4px,transparent 4px 8px)"></b>佯攻（假動作）</span>` : ""}</div>`;
  }

  /* ---------- 選戰役 ---------- */
  function home() {
    box.innerHTML = list.map(b => `
      <article class="card card-pad fade-in" style="display:grid;gap:14px;padding:24px">
        <div style="display:flex;gap:12px;align-items:center">
          ${avatar(personById[b.role], 52)}
          <div><p class="muted small">${esc(b.year)}</p><h2 style="font-size:30px">${esc(b.title)}</h2></div>
        </div>
        ${map(b, { focus: [] })}
        <p style="font-size:17px">${esc(b.teaser)}</p>
        <div><button class="btn btn-red" style="font-size:18px" data-go="${esc(b.id)}">開始：換你當${esc(personById[b.role].name)} →</button></div>
      </article>`).join("") + `
      <p class="muted" style="text-align:center">更多戰役陸續登場！想玩哪一場？<a href="request.html#wish">到點播台告訴我們</a></p>`;
    box.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => { location.hash = btn.dataset.go; }));
  }

  /* ---------- 開場 ---------- */
  function intro(b) {
    box.innerHTML = `<article class="card card-pad fade-in" style="display:grid;gap:14px;padding:24px">
      <p class="muted small">${esc(b.year)}</p>
      <h2 style="font-size:30px">${esc(b.title)}</h2>
      ${map(b, { focus: b.steps[0].map.focus })}
      <p class="scene">${esc(b.intro)}</p>
      ${b.introSay ? `<div class="say">${avatar(personById[b.introSay.who], 44)}<p class="bubble"><b>${esc(hostName(b.introSay.who))}</b>${esc(b.introSay.say)}</p></div>` : ""}
      <div class="row"><button class="btn btn-red" style="font-size:18px" id="go">上場！共 ${b.steps.length} 個關鍵決定 →</button>
      <a class="btn btn-line btn-sm" href="battle.html" style="align-self:center">← 選別的戰役</a></div>
    </article>`;
    $("#go").addEventListener("click", () => play(b));
  }

  /* ---------- 關鍵時刻 ---------- */
  function play(b) {
    const hits = [];
    const step = (i) => {
      const s = b.steps[i];
      box.innerHTML = `<article class="card card-pad fade-in" style="display:grid;gap:14px;padding:22px">
        <div class="steps" aria-hidden="true">${b.steps.map((_, k) => `<i class="${k < i ? (hits[k] ? "hit" : "on") : k === i ? "on" : ""}"></i>`).join("")}</div>
        <p class="muted small">第 ${i + 1} / ${b.steps.length} 個決定・📍 ${esc(s.place)}</p>
        ${map(b, s.map)}
        <p class="scene">${esc(s.scene)}</p>
        <h3 class="q-title">${esc(s.q)}</h3>
        <div class="opts">${s.options.map(o => `<button class="opt" data-k="${o.k}"><span class="k">${o.k.toUpperCase()}</span><span>${esc(o.t)}</span></button>`).join("")}</div>
        <div id="after" aria-live="polite"></div>
      </article>`;
      box.querySelectorAll(".opt").forEach(btn => btn.addEventListener("click", () => choose(s, btn.dataset.k, i)));
      if (i > 0) top();
    };
    const choose = (s, k, i) => {
      const o = s.options.find(x => x.k === k), real = s.options.find(x => x.real);
      hits[i] = !!o.real;
      box.querySelectorAll(".opt").forEach(btn => {
        btn.disabled = true;
        const ok = btn.dataset.k === real.k;
        if (btn.dataset.k === k) btn.classList.add("picked");
        if (ok) { btn.classList.add("real"); btn.insertAdjacentHTML("beforeend", `<span class="tag">📜 歷史</span>`); }
      });
      // 每位聽眾每一步只算一次
      const mk = `battle:${b.id}-${s.id}`;
      if (!Mine.value(mk)) { Store.vote(voteKey(b, s, k)); Mine.mark(mk, k); }
      const last = i === b.steps.length - 1;
      const after = $("#after");
      after.innerHTML = `<div class="fade-in" style="display:grid;gap:14px">
        <div class="say">${avatar(personById[o.who], 44)}<p class="bubble"><b>${esc(hostName(o.who))}</b>${esc(o.say)}</p></div>
        <section class="reveal">
          <h3>📜 史官揭曉：${o.real ? `你和${esc(roleName(b))}選得一樣！` : `${esc(roleName(b))}當年選了 ${real.k.toUpperCase()}`}</h3>
          <p>${esc(s.reveal)}</p>
          <p class="src">出處：${esc(s.source)}</p>
          <p class="ep-lesson">💡 ${esc(s.lesson)}</p>
          <div><p class="small muted" id="crowd">全國軍師怎麼選……</p><div class="bars" id="bars"></div></div>
        </section>
        <div><button class="btn btn-red" id="next">${last ? "看看你的軍師稱號 →" : "下一個決定 →"}</button></div>
      </div>`;
      crowd(b, s, k);
      $("#next").addEventListener("click", () => last ? end(b, hits) : step(i + 1));
      setTimeout(() => after.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    };
    step(0);
  }

  async function crowd(b, s, mine) {
    const st = await Store.stats();
    const n = s.options.map(o => st.votes[voteKey(b, s, o.k)] || 0);
    const total = n.reduce((a, c) => a + c, 0);
    const bars = $("#bars"), label = $("#crowd");
    if (!bars) return;
    if (!total) { label.textContent = "還沒有人作答，你是第一位軍師！"; return; }
    const same = Math.round(n[s.options.findIndex(o => o.k === mine)] / total * 100);
    label.textContent = `目前 ${total} 位軍師作答，${same}% 跟你選一樣`;
    bars.innerHTML = s.options.map((o, j) => `<div class="crowd-row${o.k === mine ? " mine" : ""}${o.real ? " real" : ""}">
      <b>${o.k.toUpperCase()}</b><span class="track"><span class="fill" data-w="${Math.round(n[j] / total * 100)}"></span></span><span class="pct">${Math.round(n[j] / total * 100)}%</span></div>`).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => bars.querySelectorAll(".fill").forEach(f => f.style.width = f.dataset.w + "%")));
  }

  /* ---------- 結局 ---------- */
  function end(b, hits) {
    const score = hits.filter(Boolean).length;
    const e = b.endings.find(x => score >= x.min);
    const eps = (b.episodes || []).map(c => epByCode[c]).filter(ep => ep && ep.status === "published");
    box.innerHTML = `<article class="card fade-in" style="overflow:hidden">
      <div class="end-head">
        <p class="score">你有 ${score} / ${b.steps.length} 個決定和${esc(roleName(b))}一樣</p>
        <h2>${esc(e.title)}</h2>
        <p style="margin-top:6px">${esc(e.text)}</p>
      </div>
      <div class="card-pad" style="display:grid;gap:14px;padding:22px">
        <h3 style="font-size:22px">🎭 小喬問真話：這些說法是真的嗎？</h3>
        ${b.myths.map(m => `<div class="myth">
          <div>${verdictBadge(m.verdict, m.verdictText)}</div>
          <p class="small muted">💬 ${esc(m.claim)}</p>
          <p class="claim">${esc(m.text)}</p>
          <p>📜 ${esc(m.truth)}</p></div>`).join("")}
        <h3 style="font-size:22px;margin-top:6px">延伸收聽・小百科</h3>
        <div class="row">
          ${eps.map(ep => `<button class="btn btn-red btn-sm" data-play="${esc(ep.code)}">▶ ${esc(ep.code)} ${esc(ep.title)}</button>`).join("")}
          ${(() => { const k = TIMELINE.find(t => t.battle === b.id); return k ? `<a class="chip chip-link" href="map.html#${k.year}" style="padding:6px 12px">🗺️ 在地圖上看 ${k.year} 年的天下</a>` : ""; })()}
          ${(b.stories || []).map(id => storyById[id] && `<a class="chip chip-link" href="${links.story(id)}" style="padding:6px 12px">🔍 ${esc(storyById[id].title)}</a>`).join("")}
          ${b.people.map(id => personById[id] && `<a class="chip chip-link" href="${links.person(id)}" style="padding:6px 12px">${avatar(personById[id], 26)} ${esc(personById[id].name)}的人物檔案</a>`).join("")}
        </div>
        <div class="row" style="justify-content:center;border-top:1px dashed var(--line);padding-top:16px">
          <button class="btn btn-ink btn-sm" id="share">📋 複製結果分享給朋友</button>
          <button class="btn btn-line btn-sm" id="again">↺ 再玩一次</button>
        </div>
      </div></article>`;
    $("#again").addEventListener("click", () => intro(b));
    $("#share").addEventListener("click", async () => {
      const url = location.href.split("#")[0] + "#" + b.id;
      const text = `我在《三國別演了》的「你來當軍師・${b.title}」拿到「${e.title}」（${score}/${b.steps.length} 個決定和${roleName(b)}一樣）！換你來試試：${url}`;
      try { await navigator.clipboard.writeText(text); toast("已複製！貼給朋友吧"); }
      catch (_) { prompt("複製這段文字分享：", text); }
    });
    top();
  }

  function route() {
    const b = list.find(x => x.id === location.hash.slice(1));
    b ? intro(b) : home();
    if (b) top();
  }
  window.addEventListener("hashchange", route);
  route();
})();
