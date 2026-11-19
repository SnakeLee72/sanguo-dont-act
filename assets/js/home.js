/* 首頁 */
(function () {
  const { $, esc, avatar, personById, published, episodeCard, thumb, openPlayer, Store, Mine, links, verdictBadge, factionChip, FACTION } = SG;

  $("#heroAbout").textContent = SITE.about;
  $("#ytBtn").href = SITE.youtube;
  $("#spBtn").href = SITE.spotify;

  /* ---------- 戲台：布幕、流蘇、燈籠、聚光燈的互動 ---------- */
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const replay = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  if (!calm) {
    // 布幕在文字後面，所以在整個舞台上偵測滑鼠：滑過哪一條皺褶，就從那裡往兩邊撥開
    const drapes = [...document.querySelectorAll(".drape")].map(dr => ({ dr, folds: [...dr.children], right: dr.classList.contains("right") }));
    drapes.forEach(d => d.folds.forEach(f => f.addEventListener("animationend", () => f.classList.remove("rustle"))));
    document.querySelector(".stage").addEventListener("pointermove", e => {
      drapes.forEach(({ dr, folds, right }) => {
        const r = dr.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
        const t = right ? (r.right - e.clientX) / r.width : (e.clientX - r.left) / r.width, i = Math.min(folds.length - 1, Math.floor(t * folds.length));
        if (folds[i].classList.contains("rustle")) return;
        folds.forEach((f, j) => { const d = Math.abs(j - i); if (d <= 3) setTimeout(() => replay(f, "rustle"), d * 70); });
      });
    });
    // 流蘇
    document.querySelectorAll(".tassel").forEach(t => {
      t.style.pointerEvents = "auto";
      t.addEventListener("pointerenter", () => replay(t, "swing"));
      t.addEventListener("animationend", () => t.classList.remove("swing"));
    });
    // 聚光燈跟著滑鼠
    const stage = document.querySelector(".stage"), spots = stage.querySelectorAll(".spot");
    stage.addEventListener("pointermove", e => {
      const r = stage.getBoundingClientRect(), k = (e.clientX - r.left) / r.width - .5;
      spots.forEach((s, i) => s.style.transform = `translateX(${(k * (i ? 90 : 120)).toFixed(0)}px) rotate(${(-k * 8).toFixed(1)}deg)`);
    });
    stage.addEventListener("pointerleave", () => spots.forEach(s => s.style.transform = ""));
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
  $("#latest").innerHTML = `
    <article class="card feature">
      <div class="ep-thumb">
        <img src="${thumb(latest)}" alt="${esc(latest.title)} 封面" />
        <span class="ep-code">${esc(latest.code)}</span>
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
    ["#people", "👤", "人物", `${PEOPLE.length} 位`, "來賓與主持人的正史檔案，還有小說把他們「演」成什麼樣子。"],
    ["#idioms", "📖", "成語", `${IDIOMS.length} 則`, "望梅止渴、三顧茅廬……每個成語背後的真實故事與造句。"],
    ["#stories", "🔍", "史實查核", `${STORIES.length} 個`, "先猜再翻牌！草船借箭、空城計，到底是真是假？"]
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
