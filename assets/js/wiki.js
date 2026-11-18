/* 三國小百科：人物 / 成語 / 史實查核 */
(function () {
  const { $, $$, esc, avatar, factionChip, verdictBadge, FACTION, VERDICT, SOURCE_TYPE, personById, idiomById, storyById, epByCode, links, openModal, Mine } = SG;

  const state = { tab: "people", sub: "all", q: "" };
  const SUBS = {
    people: [["all", "全部"], ["guest", "節目來賓"], ["host", "主持人"], ["wei", "魏"], ["shu", "蜀"], ["wu", "吳"], ["qun", "群雄"]],
    idioms: [["all", "全部"], ["history", "正史典故"], ["novel", "出自演義"], ["other", "其他古籍 / 俗語"]],
    stories: [["all", "全部"], ["unflipped", "還沒翻牌"], ["true", "正史有載"], ["fiction", "小說虛構"], ["adapted", "史實改編"]]
  };
  const PH = { people: "🔍 搜尋人物（例如：趙雲、勇敢）", idioms: "🔍 搜尋成語（例如：曹操、梅）", stories: "🔍 搜尋故事（例如：空城計）" };

  const peopleChips = (ids) => (ids || []).map(id => personById[id]).filter(Boolean)
    .map(p => `<a class="chip chip-link" href="${links.person(p.id)}">${esc(p.name)}</a>`).join("");
  const epButton = (code, label) => {
    const ep = epByCode[code]; if (!ep) return "";
    if (ep.status === "upcoming") return `<span class="chip">🔜 ${esc(ep.code)} 即將上架</span>`;
    return `<button class="btn btn-red btn-sm" data-play="${esc(code)}">▶ ${label || "收聽"} ${esc(ep.code)}</button>`;
  };
  const match = (text) => !state.q || text.toLowerCase().includes(state.q.toLowerCase());

  /* ---------- 人物 ---------- */
  function renderPeople() {
    const list = PEOPLE.filter(p => {
      const s = state.sub;
      if (s === "guest" || s === "host") { if (p.role !== s) return false; }
      else if (s !== "all" && p.faction !== s) return false;
      return match([p.name, p.zi, p.tags.join(" "), p.oneLine, p.history.join(" ")].join(" "));
    });
    $("#panel").innerHTML = `<div class="grid g3">${list.map(p => `
      <button class="card p-card f-${p.faction} fade-in" data-person="${p.id}">
        <div style="display:flex;gap:14px;align-items:center">
          ${avatar(p, 60)}
          <div>
            <b style="font-family:var(--head);font-size:26px">${esc(p.name)}</b>
            <div class="tagrow" style="margin-top:2px">${factionChip(p.faction)}${p.zi ? `<span class="chip">字${esc(p.zi)}</span>` : ""}${p.role === "host" ? `<span class="chip" style="background:var(--lantern)">🎙️ 主持人</span>` : ""}</div>
          </div>
        </div>
        <p>${esc(p.oneLine)}</p>
        <div class="tagrow">${p.tags.filter(t => t !== "主持人").map(t => `<span class="chip">#${esc(t)}</span>`).join("")}</div>
        <span style="color:var(--curtain);font-weight:700;margin-top:auto">打開人物檔案 →</span>
      </button>`).join("")}</div>`;
    return list.length;
  }

  function openPerson(id) {
    const p = personById[id]; if (!p) return;
    const ep = epByCode[p.episode];
    const relIdioms = IDIOMS.filter(i => i.people.includes(id));
    const relStories = STORIES.filter(s => s.people.includes(id));
    openModal(`
      <div class="p-head f-${p.faction}">
        ${avatar(p, 76)}
        <div>
          <h2 style="font-size:34px">${esc(p.name)}</h2>
          <p style="opacity:.9">${p.zi ? `字${esc(p.zi)}｜` : ""}${FACTION[p.faction]}｜${esc(p.life)}</p>
          <div class="tagrow" style="margin-top:6px">${p.tags.map(t => `<span class="chip" style="background:rgba(255,255,255,.18);color:#fff;border-color:rgba(255,255,255,.35)">#${esc(t)}</span>`).join("")}</div>
        </div>
      </div>
      <div class="card-pad" style="display:grid;gap:22px">
        <p style="font-size:19px;font-weight:700">${esc(p.oneLine)}</p>
        ${ep && ep.lesson ? `<div class="ep-lesson">💡 節目裡學到的：${esc(ep.lesson)}</div>` : ""}
        <div><h3 style="font-size:22px">📜 正史這樣記載</h3><ul class="h-list">${p.history.map(h => `<li>${esc(h)}</li>`).join("")}</ul></div>
        ${p.myths.length ? `<div><h3 style="font-size:22px;margin-bottom:10px">🎭 小說 vs 正史</h3><div class="vs">${p.myths.map(m => `
          <div class="vs-row"><div class="vs-novel"><b style="color:var(--bad)">小說這樣演</b>${esc(m.novel)}</div><div class="vs-truth"><b style="color:var(--ok)">史官查核</b>${esc(m.truth)}</div></div>`).join("")}</div></div>` : ""}
        ${relIdioms.length ? `<div><h3 style="font-size:20px">📖 相關成語</h3><div class="tagrow" style="margin-top:8px">${relIdioms.map(i => `<a class="chip chip-link" href="${links.idiom(i.id)}">${esc(i.word)}</a>`).join("")}</div></div>` : ""}
        ${relStories.length ? `<div><h3 style="font-size:20px">🔍 相關史實查核</h3><div class="tagrow" style="margin-top:8px">${relStories.map(s => `<a class="chip chip-link" href="${links.story(s.id)}">${VERDICT[s.verdict].icon} ${esc(s.title)}</a>`).join("")}</div></div>` : ""}
        <div style="display:flex;flex-wrap:wrap;gap:10px">${ep ? epButton(ep.code, "聽他的那一集") : ""}<a class="btn btn-line btn-sm" href="request.html#wish">✍️ 我有問題想問${esc(p.name)}</a></div>
      </div>`, { onClose: () => { if (/^#p=/.test(location.hash)) history.replaceState(null, "", "#people"); } });
  }

  /* ---------- 成語 ---------- */
  function renderIdioms(focus) {
    const list = IDIOMS.filter(i => (state.sub === "all" || i.sourceType === state.sub) &&
      match([i.word, i.meaning, i.story, i.example, i.people.map(id => personById[id]?.name).join(" ")].join(" ")));
    $("#panel").innerHTML = `<div class="grid g2">${list.map(i => `
      <article class="card idiom fade-in" id="idiom-${i.id}">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:start;flex-wrap:wrap">
          <span class="word">${esc(i.word)}</span>
          <span class="chip" style="${i.sourceType === "novel" ? "background:#FFE3DD;border-color:#F3B4A8" : i.sourceType === "history" ? "background:#E2F2E8;border-color:#A9D3B8" : ""}">${SOURCE_TYPE[i.sourceType]}</span>
        </div>
        <p><b>意思：</b>${esc(i.meaning)}</p>
        <details ${focus === i.id ? "open" : ""}>
          <summary>📖 看典故與造句 ▾</summary>
          <p>${esc(i.story)}</p>
          <p class="small muted" style="margin-top:6px">出處：${esc(i.source)}</p>
          <p style="margin-top:8px;background:#FFF6E2;border-radius:10px;padding:8px 12px">✏️ 造句：${esc(i.example)}</p>
          <div class="tagrow" style="margin-top:10px;align-items:center">${peopleChips(i.people)}<span style="flex:1"></span>${epButton(i.episode)}</div>
        </details>
      </article>`).join("")}</div>`;
    if (focus) { const el = $("#idiom-" + focus); if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("flash"); } }
    return list.length;
  }

  /* ---------- 史實查核（先猜再翻牌） ---------- */
  const flipKey = (id) => "flip:" + id;
  function renderStories(focus) {
    const list = STORIES.filter(s => {
      if (state.sub === "unflipped") { if (Mine.value(flipKey(s.id))) return false; }
      else if (state.sub !== "all" && s.verdict !== state.sub) return false;
      return match([s.title, s.novel, s.history, s.people.map(id => personById[id]?.name).join(" ")].join(" "));
    });
    const flipped = STORIES.filter(s => Mine.value(flipKey(s.id)));
    const right = flipped.filter(s => Mine.value(flipKey(s.id)) === s.verdict).length;
    $("#panel").innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:18px">
        <span class="progress">🃏 已翻牌 ${flipped.length} / ${STORIES.length}　✅ 猜對 ${right}</span>
        <span class="small muted">先猜猜看，再看史官怎麼說！</span>
        ${flipped.length ? `<button class="btn btn-line btn-sm" id="resetFlip">重新玩一次</button>` : ""}
      </div>
      <div class="grid g3">${list.map(storyCard).join("")}</div>`;
    const reset = $("#resetFlip");
    if (reset) reset.addEventListener("click", () => { STORIES.forEach(s => Mine.mark(flipKey(s.id), false)); render(); });
    if (focus) { const el = $("#story-" + focus); if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("flash"); } }
    return list.length;
  }
  function storyCard(s) {
    const mine = Mine.value(flipKey(s.id));
    return `<article class="card story fade-in" id="story-${s.id}">
      <h3>${esc(s.title)}</h3>
      <div class="tagrow">${peopleChips(s.people)}</div>
      <p><b style="color:var(--bad)">🎭 小說這樣演：</b>${esc(s.novel)}</p>
      ${mine ? `
        <div class="reveal fade-in">
          <p style="font-weight:700">${mine === s.verdict ? "✅ 猜對了！" : "❌ 被演到了！"}　${verdictBadge(s.verdict)}</p>
          <p style="margin-top:6px"><b style="color:var(--ok)">📜 史官查核：</b>${esc(s.history)}</p>
        </div>
        <div style="margin-top:auto">${epButton(s.episode, "延伸收聽")}</div>`
      : `<p class="small muted" style="margin-top:auto">你覺得呢？</p>
        <div class="guess">
          <button data-guess="true" data-id="${s.id}">📜 是真的</button>
          <button data-guess="adapted" data-id="${s.id}">✂️ 半真半假</button>
          <button data-guess="fiction" data-id="${s.id}">🎭 別演了</button>
        </div>`}
    </article>`;
  }

  /* ---------- 切換與網址 ---------- */
  function render(focus) {
    $$(".tabs [data-tab]").forEach(a => a.setAttribute("aria-selected", a.dataset.tab === state.tab));
    $("#subFilter").innerHTML = SUBS[state.tab].map(([k, l]) => `<button data-sub="${k}" aria-pressed="${k === state.sub}">${l}</button>`).join("");
    $("#q").placeholder = PH[state.tab];
    const n = state.tab === "people" ? renderPeople() : state.tab === "idioms" ? renderIdioms(focus) : renderStories(focus);
    $("#empty").classList.toggle("hidden", n > 0);
  }
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    const [k, v] = h.split("=");
    const tabOf = { p: "people", i: "idioms", s: "stories" };
    if (tabOf[k]) {
      const tab = tabOf[k];
      if (state.tab !== tab) { state.tab = tab; state.sub = "all"; state.q = ""; $("#q").value = ""; }
      else if (state.sub !== "all" || state.q) { state.sub = "all"; state.q = ""; $("#q").value = ""; }
      render(v);
      if (k === "p") openPerson(v);
    } else if (SUBS[h]) {
      if (state.tab !== h) { state.tab = h; state.sub = "all"; state.q = ""; $("#q").value = ""; }
      render();
    } else render();
  }

  $("#subFilter").addEventListener("click", e => { const b = e.target.closest("[data-sub]"); if (b) { state.sub = b.dataset.sub; render(); } });
  $("#q").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
  $("#panel").addEventListener("click", e => {
    const pc = e.target.closest("[data-person]");
    if (pc) { history.replaceState(null, "", "#p=" + pc.dataset.person); openPerson(pc.dataset.person); return; }
    const g = e.target.closest("[data-guess]");
    if (g) {
      Mine.mark(flipKey(g.dataset.id), g.dataset.guess);
      const card = $("#story-" + g.dataset.id);
      const s = storyById[g.dataset.id];
      card.outerHTML = storyCard(s);
      const flipped = STORIES.filter(x => Mine.value(flipKey(x.id)));
      const right = flipped.filter(x => Mine.value(flipKey(x.id)) === x.verdict).length;
      const prog = $(".progress"); if (prog) prog.textContent = `🃏 已翻牌 ${flipped.length} / ${STORIES.length}　✅ 猜對 ${right}`;
      if (flipped.length === STORIES.length) SG.toast(`全部翻完！你猜對了 ${right} 題 🎉`);
    }
  });
  // 在同一頁點人物 / 成語連結（例如對話框裡）時
  window.addEventListener("hashchange", () => {
    const h = location.hash;
    SG.closeModal();
    if (location.hash !== h) history.replaceState(null, "", h);
    fromHash();
  });
  fromHash();
})();
