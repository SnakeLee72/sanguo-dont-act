/* 聽眾點播台 */
(function () {
  const { $, $$, esc, avatar, factionChip, Store, Mine, toast, epByCode } = SG;
  let stats = null;

  /* ---------- 下一位來賓 ---------- */
  function renderCands() {
    const left = Mine.guestLeft();
    $("#voteLeft").textContent = left > 0 ? `🎟️ 今天還有 ${left} 票` : "🎟️ 今天的票投完了，明天再來！";
    const list = CANDIDATES.map(c => ({ ...c, n: stats.votes["guest:" + c.id] })).sort((a, b) => b.n - a.n);
    const max = Math.max(1, list[0].n);
    const medal = ["🥇", "🥈", "🥉"];
    $("#cands").innerHTML = list.map((c, i) => {
      const mineToday = (Mine.value("guestToday:" + c.id) === SG.today());
      return `<article class="card cand f-${c.faction} ${mineToday ? "voted" : ""}">
        ${i < 3 ? `<span class="rank" aria-label="第${i + 1}名">${medal[i]}</span>` : ""}
        <div class="top">${avatar({ name: c.name, faction: c.faction }, 52)}<div><b style="font-family:var(--head);font-size:24px">${esc(c.name)}</b><br>${factionChip(c.faction)}</div></div>
        <p class="small">${esc(c.teaser)}</p>
        <div style="margin-top:auto"><div style="display:flex;justify-content:space-between;align-items:end"><span class="n">${c.n}</span><span class="small muted">票</span></div>
        <div class="bar"><i style="width:${c.n / max * 100}%"></i></div></div>
        <button class="btn ${mineToday ? "btn-gold" : "btn-red"} btn-sm" data-guest="${c.id}" ${left <= 0 ? "disabled" : ""}>${mineToday ? "✔ 再投一票" : "🗳️ 投他一票"}</button>
      </article>`;
    }).join("");
  }
  $("#cands").addEventListener("click", async e => {
    const b = e.target.closest("[data-guest]"); if (!b) return;
    if (Mine.guestLeft() <= 0) { toast("今天的票投完了，明天再來！"); return; }
    b.disabled = true;
    Mine.useGuest(); Mine.mark("guestToday:" + b.dataset.guest, SG.today());
    const ok = await Store.vote("guest:" + b.dataset.guest);
    const c = CANDIDATES.find(x => x.id === b.dataset.guest);
    toast(ok ? `已投給 ${c.name}！曹操：「這位人才孤記下了！」` : "投票失敗，請稍後再試");
    await refresh();
  });

  /* ---------- 題目看板 ---------- */
  function upBtn(key, n) {
    const on = Mine.has(key);
    return `<button class="up ${on ? "on" : ""}" data-up="${esc(key)}" ${on ? "disabled" : ""} aria-label="${on ? "已按讚" : "按讚"}">👍 ${n}<small>${on ? "已按讚" : "想聽"}</small></button>`;
  }
  function renderBoard() {
    const collect = TOPICS.filter(t => t.status === "collecting").map(t => ({ ...t, n: stats.votes["topic:" + t.id] })).sort((a, b) => b.n - a.n);
    $("#colCollect").innerHTML = collect.map(t => `<div class="topic"><span class="chip">${esc(t.type)}</span><p>${esc(t.title)}</p>${upBtn("topic:" + t.id, t.n)}</div>`).join("") || `<p class="muted small">目前沒有募集中的題目</p>`;
    const epLink = (t) => { const ep = epByCode[t.episode]; return ep && ep.status !== "upcoming" ? `<button class="btn btn-sm btn-ink" data-play="${esc(ep.code)}">▶ ${esc(ep.code)}</button>` : (ep ? `<span class="chip">${esc(ep.code)}</span>` : ""); };
    $("#colRec").innerHTML = TOPICS.filter(t => t.status === "recording").map(t => `<div class="topic"><span class="chip">${esc(t.type)}</span><p>${esc(t.title)}</p>${epLink(t)}</div>`).join("") || `<p class="muted small">錄音室休息中</p>`;
    $("#colAired").innerHTML = TOPICS.filter(t => t.status === "aired").map(t => `<div class="topic"><span class="chip">${esc(t.type)}</span><p>${esc(t.title)}</p>${epLink(t)}</div>`).join("");
  }

  /* ---------- 許願牆 ---------- */
  const HOST_NAME = { caocao: "曹操", zhugeliang: "諸葛亮", xiaoqiao: "小喬", any: "都可以" };
  function renderWall() {
    const list = (stats.wishes || []).slice().sort((a, b) => (b.votes || 0) - (a.votes || 0));
    if (!list.length) {
      $("#wishes").innerHTML = `<div class="card card-pad" style="grid-column:1/-1;text-align:center"><p style="font-size:40px">🏮</p><p>許願牆還空空的，<a href="#wish">放出第一盞燈籠</a>吧！</p></div>`;
      return;
    }
    $("#wishes").innerHTML = list.map(w => `
      <article class="card wish-card fade-in">
        <span style="font-size:30px" aria-hidden="true">🏮</span>
        <div style="flex:1">
          <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="chip">${esc(w.type || "投稿")}</span>${w.host && HOST_NAME[w.host] ? `<span class="chip">問 ${esc(HOST_NAME[w.host])}</span>` : ""}${w.mine ? `<span class="chip" style="background:#FFF2CC">僅你可見・待審核</span>` : ""}</div>
          <p class="c" style="margin-top:6px">${esc(w.content)}</p>
          <p class="small muted" style="margin-top:4px">— ${esc(w.nickname || "匿名聽眾")}${w.grade ? `（${esc(w.grade)}）` : ""}</p>
        </div>
        ${upBtn("wish:" + w.id, w.votes || 0)}
      </article>`).join("");
  }

  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-up]"); if (!b || b.disabled) return;
    const key = b.dataset.up;
    if (Mine.has(key)) return;
    b.disabled = true; Mine.mark(key);
    const ok = await Store.vote(key);
    toast(ok ? "收到！小喬：「這題我也好想知道！」" : "按讚失敗，請稍後再試");
    await refresh();
  });

  /* ---------- 投稿表單 ---------- */
  const TYPES = ["想聽的人物", "成語 / 故事", "問主持人", "生活大哉問", "其他"];
  $("#typePick").innerHTML = TYPES.map((t, i) => `<label><input type="radio" name="type" value="${t}" ${i === 0 ? "checked" : ""}/><span>${t}</span></label>`).join("");
  $("#hostPick").innerHTML = [...HOSTS.map(h => [h.id, h.name]), ["any", "都可以"]]
    .map(([v, l], i) => `<label><input type="radio" name="host" value="${v}" ${v === "any" ? "checked" : ""}/><span>${esc(l)}</span></label>`).join("");
  const form = $("#form");
  form.content.addEventListener("input", () => $("#len").textContent = form.content.value.length);
  const BAD = /(09\d{2}[-\s]?\d{3}[-\s]?\d{3}|\d{2,4}-\d{6,8}|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i; // 手機、電話、Email

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
      type: form.querySelector('input[name="type"]:checked')?.value || "",
      content: form.content.value.trim(),
      nickname: form.nickname.value.trim(),
      grade: form.grade.value,
      host: form.querySelector('input[name="host"]:checked')?.value || "any"
    };
    const err = $("#err");
    if (data.content.length < 4) { err.textContent = "諸葛亮：內容再多寫一點，亮才好準備訪綱喔！"; form.content.focus(); return; }
    if (!data.nickname) { err.textContent = "請取一個暱稱（不要用真實姓名喔）。"; form.nickname.focus(); return; }
    if (BAD.test(data.content + " " + data.nickname)) { err.textContent = "小喬：看起來有電話或 Email，為了安全請刪掉再送出喔！"; return; }
    err.textContent = "";
    const btn = form.querySelector("button[type=submit], button:not([type])"); btn.disabled = true;
    const ok = await Store.wish(data);
    btn.disabled = false;
    if (!ok) { err.textContent = "送出失敗，請稍後再試一次。"; return; }
    const stars = Array.from({ length: 22 }, () => `<span class="star" style="left:${Math.random() * 100}%;top:${Math.random() * 90}%"></span>`).join("");
    const host = HOSTS.find(h => h.id === data.host);
    $("#done").innerHTML = `
      <div class="sky" aria-hidden="true">${stars}<span class="lantern"></span></div>
      <h3 style="font-size:28px;margin-top:18px">燈籠升空啦！🏮</h3>
      <p style="margin-top:8px">${host ? `${esc(host.name)}：「${esc(data.nickname)}，你的問題${host.id === "zhugeliang" ? "亮已收入訪綱" : host.id === "caocao" ? "孤收下了，有空來魏國上班" : "我記下來了，一定幫你問到底"}！」` : `諸葛亮：「${esc(data.nickname)}，你的投稿已收入訪綱紙箱！」`}</p>
      <p class="small muted" style="margin-top:6px">主持人看過後，就會掛上許願牆。也記得幫其他人的題目按讚！</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
        <button class="btn btn-red" id="again">再投一題</button><a class="btn btn-line" href="#wall">看許願牆</a>
      </div>`;
    form.classList.add("hidden"); $("#done").classList.remove("hidden");
    $("#again").addEventListener("click", () => { form.reset(); $("#len").textContent = "0"; $("#done").classList.add("hidden"); form.classList.remove("hidden"); form.content.focus(); });
    await refresh();
  });

  async function refresh() {
    stats = await Store.stats(true);
    if (stats.error) toast("暫時連不上投票資料，請稍後重新整理");
    renderCands(); renderBoard(); renderWall();
  }
  refresh();
})();
