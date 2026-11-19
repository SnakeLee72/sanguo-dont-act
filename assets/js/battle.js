/* 你來當軍師：戰役抉擇遊戲（資料在 data.js 的 BATTLES） */
(function () {
  const { $, esc, avatar, personById, epByCode, links, Store, Mine, toast, verdictBadge } = SG;
  const box = $("#box");
  const hostName = id => (HOSTS.find(h => h.id === id) || personById[id] || {}).name || "";
  const list = BATTLES.filter(b => b.status === "published");
  const voteKey = (b, s, k) => `poll:${b.id}-${s.id}:${k}`;
  const top = () => box.scrollIntoView({ behavior: "smooth", block: "start" });

  /* ---------- 戰場示意圖 ---------- */
  function map(b, view) {
    const P = b.places, focus = new Set(view.focus || []);
    const arrow = ([from, to, kind]) => {
      const a = P[from], c = P[to]; if (!a || !c) return "";
      const dx = c.x - a.x, dy = c.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
      const x1 = a.x + ux * 12, y1 = a.y + uy * 12, x2 = c.x - ux * 14, y2 = c.y - uy * 14;
      const mx = (x1 + x2) / 2 - uy * 18, my = (y1 + y2) / 2 + ux * 18;
      const side = kind === "yuan" ? "yuan" : "cao";
      return `<path class="arw ${kind}" d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" marker-end="url(#m-${side})" />`;
    };
    const place = ([id, p]) => {
      const right = p.x > 350;
      return `<g class="pl ${p.side || "none"}${focus.has(id) ? " focus" : ""}">
        <circle class="ring" cx="${p.x}" cy="${p.y}" r="13" />
        <circle class="dot" cx="${p.x}" cy="${p.y}" r="7" />
        <text x="${right ? p.x - 12 : p.x + 12}" y="${p.y + 5}" text-anchor="${right ? "end" : "start"}">${esc(p.name)}</text></g>`;
    };
    return `<div class="map">
      <svg viewBox="0 0 400 300" role="img" aria-label="${esc(b.title)}示意圖">
        <defs>
          <marker id="m-cao" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--wei)" /></marker>
          <marker id="m-yuan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--qun)" /></marker>
        </defs>
        ${b.terrain.map(t => `<path class="river" d="${t.d}" /><text class="river-name" x="40" y="44">${esc(t.name)}</text>`).join("")}
        ${(view.arrows || []).map(arrow).join("")}
        ${Object.entries(P).map(place).join("")}
      </svg>
      <span class="note">示意圖・不按比例</span>
    </div>
    <div class="legend"><span><b style="background:var(--wei)"></b>曹操軍</span><span><b style="background:var(--qun)"></b>${esc(b.foe)}軍</span>${(view.arrows || []).some(a => a[2] === "feint") ? `<span><b style="background:repeating-linear-gradient(90deg,var(--wei) 0 4px,transparent 4px 8px)"></b>佯攻（假動作）</span>` : ""}</div>`;
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
          <h3>📜 史官揭曉：${o.real ? "你和曹操選得一樣！" : `曹操當年選了 ${real.k.toUpperCase()}`}</h3>
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
        <p class="score">你有 ${score} / ${b.steps.length} 個決定和曹操一樣</p>
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
      const text = `我在《三國別演了》的「你來當軍師・${b.title}」拿到「${e.title}」（${score}/${b.steps.length} 個決定和曹操一樣）！換你來試試：${url}`;
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
