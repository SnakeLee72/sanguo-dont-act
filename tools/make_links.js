// 依 data.js 產生每集「說明欄延伸連結」：node tools/make_links.js <data.js> <輸出.md>
const fs = require("fs"), vm = require("vm");
const [, , dataPath, outPath] = process.argv;
const ctx = {};
vm.runInNewContext(fs.readFileSync(dataPath, "utf8") + "\n;this.D={HOSTS,EPISODES,PEOPLE,IDIOMS,STORIES};", ctx);
const { EPISODES, PEOPLE, IDIOMS, STORIES } = ctx.D;
const P = Object.fromEntries(PEOPLE.map(p => [p.id, p]));
const I = Object.fromEntries(IDIOMS.map(i => [i.id, i]));
const S = Object.fromEntries(STORIES.map(s => [s.id, s]));
const BASE = "https://sanguo-dont-act.pages.dev";
const VERD = { true: "是真的嗎", fiction: "是真的嗎", adapted: "是真的嗎" };

function block(ep, src) {
  const q = `?from=${src}`;
  const L = [];
  L.push("📚 本集延伸｜三國別演了 官網");
  const r = ep.related || {};
  if (ep.type === "ep" && P[ep.person]) {
    L.push(`👤 ${P[ep.person].name}人物檔案（正史 vs 小說）→ ${BASE}/wiki${q}#p=${ep.person}`);
  }
  (r.stories || []).slice(0, 2).forEach(id => {
    const s = S[id]; if (s) L.push(`🔍 「${s.title}」${VERD[s.verdict]}？先猜再翻牌 → ${BASE}/wiki${q}#s=${id}`);
  });
  (r.idioms || []).slice(0, ep.type === "sp" ? 3 : 1).forEach(id => {
    const i = I[id]; if (i) L.push(`📖 ${i.word.length > 4 ? "名句" : "成語"}「${i.word}」典故與造句 → ${BASE}/wiki${q}#i=${id}`);
  });
  if (ep.type === "mv") L.push(`🏮 官網首頁 → ${BASE}/${q}`);
  L.push(`🎭 測測你最像哪位三國來賓 → ${BASE}/quiz${q}`);
  L.push(`🗳️ 下一位來賓由你投票決定 → ${BASE}/request${q}`);
  return L.join("\n");
}

const eps = EPISODES.filter(e => e.status !== "upcoming").slice().reverse(); // 由舊到新
let md = `# 每集說明欄延伸連結

直接複製貼到 YouTube 影片說明、Spotify 單集說明的最下方。
連結裡的 \`?from=yt\` / \`?from=spotify\` 用來在 Cloudflare Web Analytics 分辨訪客從哪個平台來，請貼到對應的平台。

> 新增集數後要重新產生：\`node tools/make_links.js assets/js/data.js episode-links.md\`（或請 Claude 幫你更新）

## 頻道 / 節目簡介用（一行版）

- YouTube 頻道簡介：🏮 官網｜人物小百科・史實查核・投票點播 → ${BASE}/?from=yt
- Spotify 節目簡介：🏮 官網｜人物小百科・史實查核・投票點播 → ${BASE}/?from=spotify

`;
for (const ep of eps) {
  const title = ep.type === "mv" ? ep.title : `${ep.code} ${ep.title}`;
  md += `---\n\n## ${title}\n\n### 📺 YouTube\n\n\`\`\`text\n${block(ep, "yt")}\n\`\`\`\n\n### 🎧 Spotify\n\n\`\`\`text\n${block(ep, "spotify")}\n\`\`\`\n\n`;
}
fs.writeFileSync(outPath, md, "utf8");
console.log("ok", eps.length, "episodes");
