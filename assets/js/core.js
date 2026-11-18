/* ============================================================
   三國別演了｜共用程式（版型、工具、資料儲存、播放器）
   一般更新不需要改這個檔案。
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 小工具 ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const FACTION = { wei: "魏", shu: "蜀", wu: "吳", qun: "群雄" };
  const VERDICT = {
    true: { label: "正史有載", icon: "📜", cls: "v-true" },
    fiction: { label: "小說虛構", icon: "🎭", cls: "v-fiction" },
    adapted: { label: "史實改編", icon: "✂️", cls: "v-adapted" }
  };
  const SOURCE_TYPE = { history: "正史典故", novel: "出自演義", other: "其他古籍 / 俗語" };
  const personById = Object.fromEntries(PEOPLE.map(p => [p.id, p]));
  const idiomById = Object.fromEntries(IDIOMS.map(i => [i.id, i]));
  const storyById = Object.fromEntries(STORIES.map(s => [s.id, s]));
  const epByCode = Object.fromEntries(EPISODES.map(e => [e.code, e]));
  const today = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD（本地時間）

  function avatar(p, size = 56) {
    if (!p) return "";
    const ch = p.name.length > 2 ? p.name.slice(-1) : p.name.slice(0, 1);
    return `<span class="avatar f-${p.faction}" style="--s:${size}px" aria-hidden="true">${esc(ch)}</span>`;
  }
  const factionChip = (f) => `<span class="chip chip-f f-${f}">${FACTION[f] || ""}</span>`;
  const verdictBadge = (v) => { const m = VERDICT[v]; return `<span class="verdict ${m.cls}">${m.icon} ${m.label}</span>`; };
  const thumb = (ep) => ep.youtube ? `https://i.ytimg.com/vi/${ep.youtube}/hqdefault.jpg` : "";
  const epLabel = (ep) => ep.type === "mv" ? "主題曲" : ep.code;
  const fmtDate = (d) => d ? d.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, dd) => `${+m}/${+dd}`) : "";
  const published = () => EPISODES.filter(e => e.status !== "upcoming");

  const links = {
    person: (id) => `wiki.html#p=${id}`,
    idiom: (id) => `wiki.html#i=${id}`,
    story: (id) => `wiki.html#s=${id}`,
    episode: (code) => `episodes.html#${code}`
  };

  /* ---------- 單集卡片（首頁、節目頁共用） ---------- */
  function episodeCard(ep) {
    const guest = personById[ep.person];
    if (ep.status === "upcoming") {
      return `<article class="card ep-card ep-upcoming fade-in" id="${esc(ep.code)}">
        <div class="ep-thumb"><span>即將上架</span><span class="ep-code">${esc(ep.code)}</span></div>
        <div class="ep-body">
          <h3>${esc(ep.title)}</h3>
          <p class="ep-q">${esc(ep.question)}</p>
          <p class="muted small">${esc(ep.desc)}</p>
          <div style="margin-top:auto"><a class="btn btn-red btn-sm" href="request.html#wish">✍️ 我想問${guest ? esc(guest.name) : ""}…</a></div>
        </div></article>`;
    }
    const rel = (ep.related?.people || []).map(id => personById[id]).filter(Boolean)
      .map(p => `<a class="chip chip-link" href="${links.person(p.id)}">${esc(p.name)}</a>`).join("");
    return `<article class="card ep-card fade-in" id="${esc(ep.code)}">
      <div class="ep-thumb">
        ${ep.youtube ? `<img loading="lazy" src="${thumb(ep)}" alt="${esc(ep.code)} ${esc(ep.title)} 封面" />` : ""}
        <span class="ep-code">${esc(epLabel(ep))}</span>
        ${ep.length ? `<span class="ep-len">${esc(ep.length)}</span>` : ""}
        <button class="ep-play" data-play="${esc(ep.code)}" aria-label="播放 ${esc(ep.title)}"><span>▶</span></button>
      </div>
      <div class="ep-body">
        <div style="display:flex;gap:10px;align-items:center">
          ${guest && guest.role === "guest" ? avatar(guest, 40) : ""}
          <div><h3>${esc(ep.title)}</h3>${ep.date ? `<span class="muted small">${fmtDate(ep.date)} 上架</span>` : ""}</div>
        </div>
        <p class="ep-q">${esc(ep.question)}</p>
        ${ep.lesson ? `<p class="ep-lesson">💡 ${esc(ep.lesson)}</p>` : ""}
        ${rel ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:6px">${rel}</div>` : ""}
      </div></article>`;
  }

  /* ---------- 播放器對話框 ---------- */
  let lastFocus = null;
  function openModal(html, { onClose } = {}) {
    closeModal();
    lastFocus = document.activeElement;
    const m = document.createElement("div");
    m.className = "modal"; m.id = "modal";
    m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
    m.innerHTML = `<div class="modal-bg" data-close></div><div class="modal-box"><button class="modal-close" data-close aria-label="關閉">✕</button>${html}</div>`;
    m._onClose = onClose;
    document.body.appendChild(m);
    document.body.style.overflow = "hidden";
    m.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
    $(".modal-close", m).focus();
    return m;
  }
  function closeModal() {
    const m = $("#modal"); if (!m) return;
    m.remove(); document.body.style.overflow = "";
    if (typeof m._onClose === "function") m._onClose();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  function openPlayer(code, mode) {
    const ep = epByCode[code]; if (!ep) return;
    mode = mode || (ep.youtube ? "yt" : "sp");
    const ytSrc = ep.youtube ? `https://www.youtube-nocookie.com/embed/${ep.youtube}?autoplay=1&rel=0` : "";
    const spSrc = ep.spotify ? `https://open.spotify.com/embed/episode/${ep.spotify}?utm_source=generator` : "";
    const rel = ep.related || {};
    const relHtml = [
      ...(rel.people || []).map(id => personById[id] && `<a class="chip chip-link" href="${links.person(id)}">👤 ${esc(personById[id].name)}</a>`),
      ...(rel.idioms || []).map(id => idiomById[id] && `<a class="chip chip-link" href="${links.idiom(id)}">📖 ${esc(idiomById[id].word)}</a>`),
      ...(rel.stories || []).map(id => storyById[id] && `<a class="chip chip-link" href="${links.story(id)}">🔍 ${esc(storyById[id].title)}</a>`)
    ].filter(Boolean).join("");
    openModal(`
      <div class="video" id="playerArea">${mode === "yt" && ytSrc
        ? `<iframe src="${ytSrc}" title="${esc(ep.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
        : `<div style="padding:56px 20px 20px;background:var(--curtain-deep);height:100%;display:flex;align-items:center"><iframe style="width:100%;height:152px;border:0;border-radius:12px" src="${spSrc}" allow="autoplay; clipboard-write; encrypted-media" loading="lazy" title="Spotify 播放器"></iframe></div>`}</div>
      <div class="card-pad">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between">
          <div><span class="chip">${esc(epLabel(ep))}</span> <b style="font-family:var(--head);font-size:22px">${esc(ep.title)}</b></div>
          <div class="seg" role="tablist" aria-label="收聽方式">
            ${ytSrc ? `<button data-mode="yt" aria-selected="${mode === "yt"}">📺 看影片</button>` : ""}
            ${spSrc ? `<button data-mode="sp" aria-selected="${mode === "sp"}">🎧 聽 Podcast</button>` : ""}
          </div>
        </div>
        <p class="ep-q" style="margin-top:10px">${esc(ep.question)}</p>
        <p class="muted" style="margin-top:6px">${esc(ep.desc)}</p>
        ${ep.lesson ? `<p class="ep-lesson" style="margin-top:12px">💡 本集核心句：${esc(ep.lesson)}</p>` : ""}
        ${relHtml ? `<p class="small muted" style="margin-top:16px">本集小百科</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${relHtml}</div>` : ""}
      </div>`);
    $$("#modal [data-mode]").forEach(b => b.addEventListener("click", () => openPlayer(code, b.dataset.mode)));
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-play]");
    if (b) { e.preventDefault(); openPlayer(b.dataset.play); }
  });

  /* ---------- 提示訊息 ---------- */
  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- 本機記錄（我投過什麼） ---------- */
  const Mine = {
    _k: "sgby_mine_v2",
    get() { try { return JSON.parse(localStorage.getItem(this._k)) || {}; } catch (_) { return {}; } },
    set(v) { try { localStorage.setItem(this._k, JSON.stringify(v)); } catch (_) {} },
    has(key) { return !!(this.get().voted || {})[key]; },
    mark(key, val = true) { const m = this.get(); m.voted = m.voted || {}; m.voted[key] = val; this.set(m); },
    value(key) { return (this.get().voted || {})[key]; },
    guestLeft() { const m = this.get(); return m.guestDay === today() ? Math.max(0, SITE.guestVotesPerDay - (m.guestUsed || 0)) : SITE.guestVotesPerDay; },
    useGuest() { const m = this.get(); if (m.guestDay !== today()) { m.guestDay = today(); m.guestUsed = 0; } m.guestUsed++; this.set(m); }
  };

  /* ---------- 資料儲存：Google 試算表 or 示範模式 ---------- */
  const DEMO = !SITE.apiUrl;
  function seed(key) { // 示範模式用的假數字（固定，不會每次跳動）
    let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return 3 + (h % 38);
  }
  const Local = {
    _k: "sgby_demo_v2",
    get() { try { return JSON.parse(localStorage.getItem(this._k)) || { votes: {}, wishes: [] }; } catch (_) { return { votes: {}, wishes: [] }; } },
    set(v) { try { localStorage.setItem(this._k, JSON.stringify(v)); } catch (_) {} }
  };
  const Store = {
    demo: DEMO,
    _cache: null,
    async stats(force) {
      if (this._cache && !force) return this._cache;
      if (DEMO) {
        const d = Local.get();
        const votes = new Proxy(d.votes, { get: (t, k) => typeof k === "string" ? (t[k] || 0) + seed(k) : undefined });
        this._cache = { votes, wishes: d.wishes.map(w => ({ ...w, votes: (w.votes || 0) })) };
        return this._cache;
      }
      try {
        const r = await fetch(`${SITE.apiUrl}?action=stats&t=${Date.now()}`);
        const j = await r.json();
        const raw = j.votes || {};
        this._cache = { votes: new Proxy(raw, { get: (t, k) => typeof k === "string" ? (t[k] || 0) : undefined }), wishes: j.wishes || [] };
      } catch (e) {
        console.warn("讀取統計失敗", e);
        this._cache = { votes: new Proxy({}, { get: () => 0 }), wishes: [], error: true };
      }
      return this._cache;
    },
    async _post(body) {
      const r = await fetch(SITE.apiUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
      return r.json();
    },
    async vote(key) {
      if (!/^[a-z0-9:_-]{1,60}$/i.test(key)) return false;
      if (DEMO) {
        const d = Local.get(); d.votes[key] = (d.votes[key] || 0) + 1;
        const w = d.wishes.find(x => "wish:" + x.id === key); if (w) w.votes = (w.votes || 0) + 1;
        Local.set(d); this._cache = null; return true;
      }
      try { await this._post({ action: "vote", key }); this._cache = null; return true; }
      catch (e) { console.warn(e); return false; }
    },
    async wish(data) {
      const clean = {
        type: String(data.type || "").slice(0, 10), content: String(data.content || "").slice(0, 300),
        nickname: String(data.nickname || "").slice(0, 20), grade: String(data.grade || "").slice(0, 12),
        host: String(data.host || "").slice(0, 10)
      };
      if (DEMO) {
        const d = Local.get();
        d.wishes.unshift({ id: "local" + Date.now(), ...clean, votes: 0, mine: true });
        Local.set(d); this._cache = null; return true;
      }
      try { await this._post({ action: "wish", ...clean }); this._cache = null; return true; }
      catch (e) { console.warn(e); return false; }
    }
  };

  /* ---------- 版型：導覽列 + 頁尾 ---------- */
  const PAGES = [
    { key: "home", href: "index.html", label: "首頁", ico: "🏮" },
    { key: "episodes", href: "episodes.html", label: "節目", ico: "🎧" },
    { key: "wiki", href: "wiki.html", label: "小百科", ico: "📜" },
    { key: "request", href: "request.html", label: "點播台", ico: "🙋" },
    { key: "quiz", href: "quiz.html", label: "你是誰", ico: "🎭" }
  ];
  function layout() {
    const cur = document.body.dataset.page;
    const cur_ = (p) => p.key === cur ? ' aria-current="page"' : "";
    const header = document.createElement("header");
    header.className = "topbar";
    header.innerHTML = `<div class="wrap">
      <a class="brand" href="index.html" aria-label="三國別演了 首頁"><span class="brand-mark">演</span><span class="brand-name">${esc(SITE.name)}</span></a>
      <nav class="nav-desk" aria-label="主選單">${PAGES.map(p => `<a href="${p.href}"${cur_(p)}>${p.label}</a>`).join("")}</nav>
      <a class="btn btn-gold btn-sm top-cta" href="${SITE.youtubeSubscribe}" target="_blank" rel="noopener">▶ 訂閱頻道</a>
    </div>`;
    document.body.prepend(header);
    if (DEMO) {
      const b = document.createElement("div");
      b.className = "demo-banner";
      b.textContent = "示範模式：投票與投稿只存在你的瀏覽器，數字為示範資料。（設定方式見 README.md）";
      header.after(b);
    }
    const mob = document.createElement("nav");
    mob.className = "nav-mobile"; mob.setAttribute("aria-label", "主選單");
    mob.innerHTML = PAGES.map(p => `<a href="${p.href}"${cur_(p)}><span class="ico" aria-hidden="true">${p.ico}</span>${p.label}</a>`).join("");
    document.body.appendChild(mob);
    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `<div class="wrap">
      <div><h4>${esc(SITE.name)}</h4><p style="color:#D8BC98">${esc(SITE.slogan)}</p><p class="small" style="margin-top:8px;color:#B8987A">歷史喜劇＋史實查核，從小學生到大人都聽得懂，適合全家一起收聽。</p></div>
      <div><h4>收聽節目</h4><a href="${SITE.youtube}" target="_blank" rel="noopener">📺 YouTube 頻道</a><a href="${SITE.spotify}" target="_blank" rel="noopener">🎧 Spotify Podcast</a></div>
      <div><h4>網站導覽</h4>${PAGES.map(p => `<a href="${p.href}">${p.ico} ${p.label}</a>`).join("")}</div>
      <p class="copy">史實查核以陳壽《三國志》、裴松之注為主要依據；小說情節出自羅貫中《三國演義》。</p>
    </div>`;
    document.body.appendChild(footer);
  }
  layout();

  window.SG = { $, $$, esc, FACTION, VERDICT, SOURCE_TYPE, personById, idiomById, storyById, epByCode, avatar, factionChip, verdictBadge,
    thumb, epLabel, fmtDate, published, links, episodeCard, openModal, closeModal, openPlayer, toast, Store, Mine, today };
})();
