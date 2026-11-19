/* 武將收集卡：卡冊頁（任務與進度在 core.js 的 Cards） */
(function () {
  const { $, esc, FACTION, personById, links, openModal, toast, Cards } = SG;
  const grid = $("#cardGrid"), prog = $("#cardProg");
  const ch = p => p.name.length > 2 ? p.name.slice(-1) : p.name.slice(0, 1);
  const no = p => "No." + String(PEOPLE.indexOf(p) + 1).padStart(2, "0");

  const art = p => `assets/img/cards/${p.id}.webp`;
  const corner = cls => `<svg class="tc-corner ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 22V2h20M6 22V6h16M10 14v-4h4"/></svg>`;
  function cardHtml(p, st, big) {
    const cls = ["tcard", "f-" + p.faction, st.unlocked ? "" : "locked", st.gold ? "gold" : "", st.isNew && !big ? "new" : "", big ? "big" : ""].filter(Boolean).join(" ");
    return `<div class="${cls}">
      <div class="tc-in">
        ${corner("c1")}${corner("c2")}${corner("c3")}${corner("c4")}
        <div class="tc-top"><span class="tc-seal">${esc(FACTION[p.faction])}</span>${p.role === "host" ? `<span class="tc-role">主持人</span>` : ""}<span class="tc-no">${no(p)}</span></div>
        <div class="tc-art">
          <span class="tc-ch" aria-hidden="true">${esc(ch(p))}</span>
          <img src="${art(p)}" alt="${st.unlocked ? esc(p.name) + "的造型" : ""}" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('noimg');this.remove()">
          ${st.unlocked ? "" : `<span class="tc-q" aria-hidden="true">？</span>`}
          <span class="tc-shine" aria-hidden="true"></span>
        </div>
        <div class="tc-ribbon"><span class="tc-name">${esc(p.name)}</span></div>
        <div class="tc-sub">${esc([p.zi ? "字" + p.zi : "", p.life].filter(Boolean).join("・"))}</div>
        <div class="tc-tags">${st.unlocked ? p.tags.slice(0, 2).map(t => "#" + esc(t)).join(" ") : "完成任務來解鎖"}</div>
        <div class="tc-foot">${st.gold ? "★ 金卡 ★" : st.unlocked ? `已收集・任務 ${st.n}/${st.ms.length}` : `🔒 任務 0/${st.ms.length}`}</div>
      </div>
    </div>`;
  }

  function render() {
    const d = Cards.get(), c = Cards.count(d);
    prog.innerHTML = `<div class="cp-num"><b>${c.got}</b> / ${c.total} 張</div>
      <div class="cp-bar"><i style="width:${c.got / c.total * 100}%"></i><i class="g" style="width:${c.gold / c.total * 100}%"></i></div>
      <p class="muted small">已收集 ${c.got} 張，其中 ${c.gold} 張是金卡${c.got === c.total ? (c.gold === c.total ? "。🏆 全部金卡！你是真正的三國通！" : "。🎉 全部收集完成！挑戰把每張都升級成金卡吧！") : "。"}</p>`;
    grid.innerHTML = PEOPLE.map(p => `<button type="button" class="tc-btn" data-id="${esc(p.id)}" aria-label="${esc(p.name)}的卡片">${cardHtml(p, Cards.state(p, d))}</button>`).join("");
  }

  function detail(id) {
    const p = personById[id]; if (!p) return;
    const st = Cards.state(p);
    openModal(`<div class="cd">
      <div class="cd-card">${cardHtml(p, st, true)}</div>
      <div class="cd-info">
        <h2 style="font-size:28px">${esc(p.name)}</h2>
        ${st.unlocked
          ? `<p style="font-size:17px;margin-top:4px">${esc(p.oneLine)}</p>
             <ul class="cd-facts">${p.history.slice(0, 2).map(h => `<li>📜 ${esc(h)}</li>`).join("")}</ul>`
          : `<p class="muted" style="margin-top:4px">完成下面任何一個任務，就能解鎖這張卡！</p>`}
        <h3 class="cd-h">🎯 收集任務 <span class="muted small">${st.n} / ${st.ms.length}${st.gold ? "・★ 金卡" : "・全部完成升級金卡"}</span></h3>
        <ul class="cd-ms">${st.ms.map(m => {
          const done = !!Cards.get().done[m.key];
          return `<li class="${done ? "done" : ""}"><span class="ck" aria-hidden="true">${done ? "✓" : m.icon}</span>${done ? `<span>${esc(m.text)}</span>` : `<a href="${m.href}">${esc(m.text)} →</a>`}</li>`;
        }).join("")}</ul>
        <div class="row" style="margin-top:6px">
          ${st.unlocked ? `<button class="btn btn-red btn-sm" id="saveCard">🖼️ 存成圖片</button>` : ""}
          <a class="btn btn-line btn-sm" href="${links.person(p.id)}">📜 人物檔案</a>
        </div>
      </div></div>`);
    const s = $("#saveCard"); if (s) s.addEventListener("click", () => save(p, st));
  }

  /* ---------- 存成圖片（用 canvas 重畫一張卡） ---------- */
  function roundRect(c, X, Y, w, h, r) { c.beginPath(); c.moveTo(X + r, Y); c.arcTo(X + w, Y, X + w, Y + h, r); c.arcTo(X + w, Y + h, X, Y + h, r); c.arcTo(X, Y + h, X, Y, r); c.arcTo(X, Y, X + w, Y, r); c.closePath(); }
  function wrap(c, text, x, y, maxW, lh, maxLines) {
    let line = "", lines = [];
    for (const chr of text) { if (c.measureText(line + chr).width > maxW && !/[，。、！？：」』）]/.test(chr)) { lines.push(line); line = chr; } else line += chr; }
    lines.push(line); lines = lines.slice(0, maxLines);
    lines.forEach((l, i) => c.fillText(l, x, y + i * lh));
  }
  async function save(p, st) {
    try { if (document.fonts) await document.fonts.load('700 40px "LXGW WenKai TC"'); } catch (_) {}
    const css = getComputedStyle(document.documentElement), v = n => css.getPropertyValue(n).trim();
    const fc = v("--" + p.faction), W = 600, H = 860, cv = document.createElement("canvas");
    cv.width = W; cv.height = H; const c = cv.getContext("2d");
    const head = '"LXGW WenKai TC", serif', body = '"Noto Sans TC", sans-serif';
    // 外框
    c.fillStyle = v("--paper"); c.fillRect(0, 0, W, H);
    const fr = c.createLinearGradient(0, 0, W, H);
    if (st.gold) { fr.addColorStop(0, "#F7D774"); fr.addColorStop(.5, "#C88A22"); fr.addColorStop(1, "#FBE7A1"); } else { fr.addColorStop(0, fc); fr.addColorStop(1, fc); }
    roundRect(c, 14, 14, W - 28, H - 28, 30); c.lineWidth = 16; c.strokeStyle = fr; c.stroke();
    // 上方
    c.fillStyle = fc; roundRect(c, 44, 44, 70, 44, 10); c.fill();
    c.fillStyle = "#fff"; c.font = `700 28px ${head}`; c.textAlign = "center"; c.fillText(FACTION[p.faction], 79, 76);
    c.fillStyle = v("--muted"); c.font = `700 26px ${body}`; c.textAlign = "right"; c.fillText(no(p), W - 46, 76);
    // 圖：人物造型（沒有圖就畫大字）
    c.save(); roundRect(c, 44, 106, W - 88, 400, 20); c.clip();
    const g = c.createLinearGradient(0, 106, 0, 506); g.addColorStop(0, fc); g.addColorStop(1, v("--curtain-deep"));
    c.fillStyle = g; c.fillRect(44, 106, W - 88, 400);
    const img = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = art(p); });
    if (img) { const s2 = Math.max((W - 88) / img.width, 400 / img.height), iw = img.width * s2, ih = img.height * s2; c.drawImage(img, 44 + (W - 88 - iw) / 2, 106, iw, ih); }
    else { c.fillStyle = "#fff"; c.font = `700 190px ${head}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(ch(p), W / 2, 306); c.textBaseline = "alphabetic"; }
    c.restore();
    c.strokeStyle = st.gold ? "#E9C25A" : "rgba(255,255,255,.7)"; c.lineWidth = 4; roundRect(c, 52, 114, W - 104, 384, 16); c.stroke();
    // 名字緞帶
    c.fillStyle = st.gold ? "#C88A22" : fc; roundRect(c, 120, 520, W - 240, 60, 14); c.fill();
    c.fillStyle = "#fff"; c.font = `700 46px ${head}`; c.textAlign = "center"; c.fillText(p.name, W / 2, 566);
    c.fillStyle = v("--muted"); c.font = `500 26px ${body}`;
    c.fillText([p.zi ? "字" + p.zi : "", p.life].filter(Boolean).join("・"), W / 2, 618);
    c.fillStyle = fc; c.font = `700 26px ${body}`; c.fillText(p.tags.slice(0, 3).map(t => "#" + t).join("  "), W / 2, 660);
    c.fillStyle = v("--ink"); c.font = `500 25px ${body}`; c.textAlign = "left";
    wrap(c, p.oneLine, 60, 708, W - 120, 36, 2);
    // 底部
    c.textAlign = "center"; c.fillStyle = st.gold ? v("--gold") : v("--muted"); c.font = `700 24px ${body}`;
    c.fillText((st.gold ? "★ 金卡　" : "") + "《三國別演了》武將收集卡", W / 2, 812);
    cv.toBlob(b => {
      if (!b) return toast("這個瀏覽器不支援存圖，可以直接截圖喔");
      const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `三國別演了-${p.name}卡.png`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, "image/png");
  }

  grid.addEventListener("click", e => { const b = e.target.closest(".tc-btn"); if (b) detail(b.dataset.id); });
  // 滑鼠移動時卡片微微傾斜、反光跟著跑（手機與「減少動態」設定不啟用）
  if (matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
    grid.addEventListener("pointermove", e => {
      const b = e.target.closest(".tc-btn"); if (!b) return;
      const r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      b.style.setProperty("--rx", ((.5 - y) * 14).toFixed(1) + "deg"); b.style.setProperty("--ry", ((x - .5) * 16).toFixed(1) + "deg");
      b.style.setProperty("--mx", (x * 100).toFixed(0) + "%"); b.style.setProperty("--my", (y * 100).toFixed(0) + "%");
    });
    grid.addEventListener("pointerout", e => { const b = e.target.closest(".tc-btn"); if (b && !b.contains(e.relatedTarget)) ["--rx", "--ry"].forEach(k => b.style.removeProperty(k)); });
  }
  render();
  // 進到卡冊就算「看過」新卡（畫面上的 NEW 這次還是會顯示）
  Cards.seeAll();
  const id = location.hash.slice(1); if (personById[id]) detail(id);
})();
