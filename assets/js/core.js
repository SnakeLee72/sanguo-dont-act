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
  const verdictBadge = (v, text) => { const m = VERDICT[v]; return `<span class="verdict ${m.cls}">${m.icon} ${text || m.label}</span>`; };
  const thumb = (ep) => ep.youtube ? `https://i.ytimg.com/vi/${ep.youtube}/hqdefault.jpg` : "";
  const epLabel = (ep) => ep.label || (ep.type === "mv" ? "主題曲" : ep.code);
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
    Cards.mark("listen:" + code);
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
      </div>`, { onClose: () => setTimeout(() => { if (!$("#modal")) BGM.release(); }, 0) });
    BGM.hold(); // 看影片、聽節目時先暫停背景音樂
    $$("#modal [data-mode]").forEach(b => b.addEventListener("click", () => openPlayer(code, b.dataset.mode)));
  }

  /* ---------- 背景音樂 ----------
     瀏覽器不允許「一打開網頁就自動出聲」，所以在訪客第一次點擊或按鍵時才開始播放。
     右下角按鈕可以開關，選擇會被記住；換頁時會從剛剛的位置接著播。 */
  const BGM = {
    src: "assets/audio/bgm.mp3", volume: 0.3,
    _a: null, _held: false, _btn: null,
    get on() { try { return localStorage.getItem("sgby_bgm") !== "off"; } catch (_) { return true; } },
    set on(v) { try { localStorage.setItem("sgby_bgm", v ? "on" : "off"); } catch (_) {} },
    audio() {
      if (!this._a) {
        const a = this._a = new Audio(this.src);
        a.loop = true; a.preload = "auto"; a.volume = 0;
        try { const t = +sessionStorage.getItem("sgby_bgm_t"); if (t > 0) a.currentTime = t; } catch (_) {}
        a.addEventListener("play", () => this.ui()); a.addEventListener("pause", () => this.ui());
      }
      return this._a;
    },
    play() {
      if (this._held) return;
      const a = this.audio();
      a.play().then(() => this.fade(this.volume)).catch(() => this.ui());
    },
    pause() { if (this._a) this._a.pause(); },
    fade(to) {
      const a = this._a; if (!a) return;
      clearInterval(this._f);
      this._f = setInterval(() => {
        const d = to - a.volume;
        if (Math.abs(d) < 0.03) { a.volume = to; clearInterval(this._f); } else a.volume += d > 0 ? 0.03 : -0.03;
      }, 60);
    },
    hold() { this._held = true; this.pause(); },
    release() { this._held = false; if (this.on && this._a) this.play(); },
    toggle() {
      const playing = this._a && !this._a.paused;
      this.on = !playing;
      if (playing) { this.pause(); toast("🔇 背景音樂已關閉，之後也不會自動播放"); }
      else { this._held = false; this.play(); toast("🎵 背景音樂開啟"); }
    },
    ui() {
      const b = this._btn; if (!b) return;
      const playing = !!(this._a && !this._a.paused);
      b.classList.toggle("on", playing);
      b.setAttribute("aria-pressed", playing);
      b.setAttribute("aria-label", playing ? "關閉背景音樂" : "播放背景音樂");
      b.title = playing ? "關閉背景音樂" : "播放背景音樂";
    },
    init() {
      const b = this._btn = document.createElement("button");
      b.className = "bgm-btn"; b.type = "button";
      b.innerHTML = `<span class="bgm-ico" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="bgm-off" aria-hidden="true">🎵</span>`;
      b.addEventListener("click", () => this.toggle());
      document.body.appendChild(b);
      this.ui();
      // 第一次互動時開始播放（點音樂按鈕或播放節目時除外）
      const start = (e) => {
        if (e.target.closest && e.target.closest(".bgm-btn, [data-play]")) return;
        off();
        if (!this.on || this._held) return;
        let first = true; try { first = !+sessionStorage.getItem("sgby_bgm_t"); } catch (_) {}
        this.play();
        if (first) setTimeout(() => { if (this._a && !this._a.paused) toast("🎵 背景音樂播放中，右下角按鈕可以關閉"); }, 400);
      };
      const off = () => ["pointerdown", "keydown"].forEach(t => document.removeEventListener(t, start, true));
      ["pointerdown", "keydown"].forEach(t => document.addEventListener(t, start, true));
      // 上一頁正在播 → 這一頁試著直接接著播（有些瀏覽器會擋，擋住就等第一次點擊）
      try { if (this.on && +sessionStorage.getItem("sgby_bgm_t") > 0) this.play(); } catch (_) {}
      // 換頁前記住播放位置
      const save = () => { try { if (this._a) sessionStorage.setItem("sgby_bgm_t", this._a.paused && !this.on ? 0 : this._a.currentTime || 0.01); } catch (_) {} };
      window.addEventListener("pagehide", save);
      setInterval(save, 3000);
    }
  };
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

  /* ---------- 武將收集卡（進度只存在訪客自己的瀏覽器） ----------
     每張卡的任務由資料自動產生：收聽那一集、讀人物檔案、完成他主演的戰役、心理測驗測出他。
     完成任一個任務 → 解鎖；全部完成 → 金卡。 */
  const Cards = {
    _k: "sgby_cards_v1",
    get() { try { const d = JSON.parse(localStorage.getItem(this._k)); return d && d.done ? d : { done: {}, seen: {} }; } catch (_) { return { done: {}, seen: {} }; } },
    set(v) { try { localStorage.setItem(this._k, JSON.stringify(v)); } catch (_) {} },
    missions(p) {
      const ms = [], ep = epByCode[p.episode];
      if (ep && ep.status === "published") ms.push({ key: "listen:" + ep.code, icon: "🎧", text: `收聽 ${ep.code}「${ep.title}」`, href: `episodes.html#${ep.code}` });
      ms.push({ key: "profile:" + p.id, icon: "📜", text: `讀${p.name}的人物檔案`, href: links.person(p.id) });
      (typeof BATTLES === "undefined" ? [] : BATTLES).filter(b => b.status === "published" && b.role === p.id)
        .forEach(b => ms.push({ key: "battle:" + b.id, icon: "⚔️", text: `在「你來當軍師」完成${b.title}`, href: `battle.html#${b.id}` }));
      if (p.role === "host") ms.push({ key: "battle:any", icon: "⚔️", text: `玩任一場「你來當軍師」，聽${p.name}吐槽`, href: "battle.html" });
      if (PERSONA_QUIZ.some(q => q.options.some(o => o.p.includes(p.id)))) ms.push({ key: "quiz:" + p.id, icon: "🎭", text: `在心理測驗測出${p.name}`, href: "quiz.html" });
      return ms;
    },
    state(p, d = this.get()) {
      const ms = this.missions(p), n = ms.filter(m => d.done[m.key]).length;
      const level = n === 0 ? "" : n === ms.length ? "gold" : "card";
      return { ms, n, level, unlocked: n > 0, gold: level === "gold", isNew: !!level && d.seen[p.id] !== level };
    },
    count(d = this.get()) { const st = PEOPLE.map(p => this.state(p, d)); return { got: st.filter(s => s.unlocked).length, gold: st.filter(s => s.gold).length, total: PEOPLE.length }; },
    mark(...keys) {
      const d = this.get(), fresh = keys.filter(k => !d.done[k]); if (!fresh.length) return;
      const before = {}; PEOPLE.forEach(p => before[p.id] = this.state(p, d).level);
      fresh.forEach(k => d.done[k] = Date.now()); this.set(d);
      const news = [];
      PEOPLE.forEach(p => {
        const lv = this.state(p, d).level;
        if (lv === before[p.id]) return;
        news.push(lv === "gold" ? `🌟 ${p.name}升級成金卡` : `🃏 獲得新卡：${p.name}`);
      });
      if (news.length) { setTimeout(() => toast(news.join("、") + "！到「卡冊」看看"), 700); this.badge(); }
    },
    seeAll() { const d = this.get(); PEOPLE.forEach(p => { const s = this.state(p, d); if (s.level) d.seen[p.id] = s.level; }); this.set(d); this.badge(); },
    badge() {
      const d = this.get(), n = PEOPLE.filter(p => this.state(p, d).isNew).length;
      document.querySelectorAll('.nav-desk a[href="play.html"], .nav-mobile a[href="play.html"], .subnav a[href="cards.html"]').forEach(a => {
        let b = a.querySelector(".nav-badge");
        if (!n) { if (b) b.remove(); return; }
        if (!b) { b = document.createElement("span"); b.className = "nav-badge"; a.appendChild(b); }
        b.textContent = n; b.setAttribute("aria-label", `${n} 張新卡`);
      });
    }
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
  /* 線上模式：Google 試算表回應約 2–3 秒，所以
     1) 統計數字在同一個分頁裡快取 90 秒，換頁不用重新等待；
     2) 投票「先算進畫面、再背景送出」，按下去立刻有反應。 */
  const TTL = 90 * 1000, SKEY = "sgby_stats_v1";
  const zeroView = (raw) => new Proxy(raw, { get: (t, k) => typeof k === "string" ? (t[k] || 0) : undefined });
  const Session = {
    get() { try { const c = JSON.parse(sessionStorage.getItem(SKEY)); return c && Date.now() - c.t < TTL ? c : null; } catch (_) { return null; } },
    set(c) { try { sessionStorage.setItem(SKEY, JSON.stringify(c)); } catch (_) {} }
  };
  const Store = {
    demo: DEMO,
    _raw: null,       // { t, votes:{}, wishes:[] }
    _inflight: null,
    _view() { return { votes: zeroView(this._raw.votes), wishes: this._raw.wishes, error: this._raw.error }; },
    async stats(force) {
      if (DEMO) {
        const d = Local.get();
        const votes = new Proxy(d.votes, { get: (t, k) => typeof k === "string" ? (t[k] || 0) + seed(k) : undefined });
        return { votes, wishes: d.wishes.map(w => ({ ...w, votes: (w.votes || 0) })) };
      }
      if (!force) {
        if (this._raw && Date.now() - this._raw.t < TTL) return this._view();
        const s = Session.get(); if (s) { this._raw = s; return this._view(); }
      }
      if (!this._inflight) {
        this._inflight = (async () => {
          try {
            const r = await fetch(`${SITE.apiUrl}?action=stats&t=${Date.now()}`);
            const j = await r.json();
            this._raw = { t: Date.now(), votes: j.votes || {}, wishes: j.wishes || [] };
            Session.set(this._raw);
          } catch (e) {
            console.warn("讀取統計失敗", e);
            if (!this._raw) this._raw = { t: 0, votes: {}, wishes: [], error: true };
          } finally { this._inflight = null; }
        })();
      }
      await this._inflight;
      return this._view();
    },
    async _post(body) {
      const r = await fetch(SITE.apiUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
      return r.json();
    },
    _bump(key, n) {
      if (!this._raw) this._raw = { t: Date.now(), votes: {}, wishes: [] };
      this._raw.votes[key] = (this._raw.votes[key] || 0) + n;
      const w = this._raw.wishes.find(x => "wish:" + x.id === key); if (w) w.votes = (w.votes || 0) + n;
      Session.set(this._raw);
    },
    /* 回傳 true 代表「已算進畫面」；真正送出在背景進行 */
    async vote(key) {
      if (!/^[a-z0-9:_-]{1,60}$/i.test(key)) return false;
      if (DEMO) {
        const d = Local.get(); d.votes[key] = (d.votes[key] || 0) + 1;
        const w = d.wishes.find(x => "wish:" + x.id === key); if (w) w.votes = (w.votes || 0) + 1;
        Local.set(d); return true;
      }
      this._bump(key, 1);
      this._post({ action: "vote", key }).catch(e => {
        console.warn(e); this._bump(key, -1);
        toast("網路不穩，這一票沒有送出，請稍後再試");
      });
      return true;
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
        Local.set(d); return true;
      }
      try { await this._post({ action: "wish", ...clean }); return true; }
      catch (e) { console.warn(e); return false; }
    }
  };

  /* ---------- 邊聽邊玩（首頁與遊戲中心共用） ---------- */
  function playBento() {
    const battles = (typeof BATTLES === "undefined" ? [] : BATTLES).filter(b => b.status === "published");
    const cc = Cards.count();
    const guests = PEOPLE.filter(p => p.role === "guest");
    const tile = (href, ico, title, text, extra = "") => `<a class="tile" href="${href}"><span class="t-ico" aria-hidden="true">${ico}</span><h3>${title}</h3><p>${text}</p>${extra}<span class="t-go">進入 →</span></a>`;
    return `<div class="tile tile-feature">
        <span class="kick">⚔️ 歷史抉擇遊戲</span>
        <h3>你來當軍師</h3>
        <p>回到歷史的關鍵時刻，換你做決定。主持人在旁邊吐槽，最後由史官揭曉當年怎麼選。</p>
        <div class="battle-list">${battles.map(b => {
          const r = personById[b.role];
          return `<a class="battle-go" href="battle.html#${esc(b.id)}">${avatar(r, 42)}<div><p>${esc(b.year.split("（")[0])}・扮演${esc(r.name)}</p><h4>${esc(b.title)}</h4></div><span class="go" aria-hidden="true">→</span></a>`;
        }).join("")}</div>
      </div>
      <div class="bento-side">
        ${tile("map.html", "🗺️", "三國地圖時間軸", "拉動時間軸，看魏蜀吳的地盤怎麼變化。")}
        ${tile("city.html", "🏯", "走進三國城池", "點一點東漢的城，看三國人怎麼生活。")}
        ${tile("quiz.html", "🎭", "你是哪位來賓？", "7 題心理測驗，測完直接聽那一集。", `<span class="t-faces">${guests.slice(0, 4).map(p => avatar(p, 26)).join("")}</span>`)}
        ${tile("cards.html", "🃏", "武將收集卡", `已收集 <b>${cc.got}</b> / ${cc.total} 張${cc.gold ? `，金卡 ${cc.gold} 張` : ""}`, `<span class="t-bar"><i style="width:${cc.got / cc.total * 100}%"></i></span>`)}
      </div>`;
  }

  /* ---------- 版型：導覽列 + 頁尾 ---------- */
  /* 主選單只放 5 個；同一區的頁面用 SUBNAV 分頁籤串起來 */
  const PAGES = [
    { key: "home", href: "index.html", label: "首頁", ico: "🏮", group: ["home"] },
    { key: "episodes", href: "episodes.html", label: "節目", ico: "🎧", group: ["episodes"] },
    { key: "wiki", href: "wiki.html", label: "小百科", ico: "📜", group: ["wiki", "map", "city"] },
    { key: "play", href: "play.html", label: "遊戲", ico: "🎮", group: ["play", "battle", "quiz", "cards"] },
    { key: "request", href: "request.html", label: "點播台", ico: "🙋", group: ["request"] }
  ];
  const SUBNAV = {
    wiki: [["wiki", "wiki.html", "📜", "人物・成語・查核"], ["map", "map.html", "🗺️", "地圖時間軸"], ["city", "city.html", "🏯", "三國城池"]],
    play: [["play", "play.html", "🎮", "遊戲中心"], ["battle", "battle.html", "⚔️", "你來當軍師"], ["quiz", "quiz.html", "🎭", "你是誰"], ["cards", "cards.html", "🃏", "武將卡冊"]]
  };
  function layout() {
    const cur = document.body.dataset.page;
    const cur_ = (p) => p.group.includes(cur) ? ' aria-current="page"' : "";
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
    // 同一區的分頁籤（放在頁面標題下方）
    const grp = PAGES.find(p => p.group.includes(cur) && SUBNAV[p.key]);
    const hero = document.querySelector(".page-hero .wrap");
    if (grp && hero) {
      const sn = document.createElement("nav");
      sn.className = "subnav"; sn.setAttribute("aria-label", grp.label + "分類");
      sn.innerHTML = SUBNAV[grp.key].map(([k, href, ico, label]) => `<a href="${href}"${k === cur ? ' aria-current="page"' : ""}><span aria-hidden="true">${ico}</span>${label}</a>`).join("");
      hero.appendChild(sn);
    }
    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `<div class="wrap">
      <div><h4>${esc(SITE.name)}</h4><p style="color:#D8BC98">${esc(SITE.slogan)}</p><p style="color:var(--lantern);margin-top:4px">${esc(SITE.tagline || "")}</p><p class="small" style="margin-top:8px;color:#B8987A">歷史喜劇＋史實查核，從小學生到大人都聽得懂，適合全家一起收聽。</p></div>
      <div><h4>收聽節目</h4><a href="${SITE.youtube}" target="_blank" rel="noopener">📺 YouTube 頻道</a><a href="${SITE.spotify}" target="_blank" rel="noopener">🎧 Spotify Podcast</a></div>
      <div><h4>網站導覽</h4><div class="foot-links">${PAGES.flatMap(p => SUBNAV[p.key] ? SUBNAV[p.key].map(([, h, i, l]) => `<a href="${h}">${i} ${l}</a>`) : [`<a href="${p.href}">${p.ico} ${p.label}</a>`]).join("")}</div></div>
      <p class="copy">史實查核以陳壽《三國志》、裴松之注為主要依據；小說情節出自羅貫中《三國演義》。</p>
    </div>`;
    document.body.appendChild(footer);
  }
  layout();
  Cards.badge();
  BGM.init();
  if (!DEMO) Store.stats(); // 一進頁面就先去拿統計數字，越早開始越快好

  window.SG = { $, $$, esc, FACTION, VERDICT, SOURCE_TYPE, personById, idiomById, storyById, epByCode, avatar, factionChip, verdictBadge,
    thumb, epLabel, fmtDate, published, links, episodeCard, openModal, closeModal, openPlayer, toast, Store, Mine, Cards, playBento, today };
})();
