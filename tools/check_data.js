// 檢查 assets/js/data.js：語法、必填欄位、id 重複、互相引用是否都找得到。
// 用法：node tools/check_data.js   （沒有錯誤會印出 OK，有錯會列出並以代碼 1 結束）
const fs = require("fs"), vm = require("vm"), path = require("path");
const file = path.join(__dirname, "..", "assets", "js", "data.js");
const ctx = {};
try {
  vm.runInNewContext(fs.readFileSync(file, "utf8") +
    "\n;this.D={HOSTS,EPISODES,PEOPLE,IDIOMS,STORIES,CANDIDATES,TOPICS,PERSONA_QUIZ,BATTLES};", ctx);
} catch (e) { console.error("❌ data.js 語法錯誤：", e.message); process.exit(1); }
const { HOSTS, EPISODES, PEOPLE, IDIOMS, STORIES, CANDIDATES, TOPICS, PERSONA_QUIZ, BATTLES } = ctx.D;
const errs = [];
const ID = /^[a-z0-9-]+$/;
const FACTIONS = ["wei", "shu", "wu", "qun"];
const dup = (list, key, name) => {
  const seen = new Set();
  list.forEach(x => { if (seen.has(x[key])) errs.push(`${name} 重複的 ${key}: ${x[key]}`); seen.add(x[key]); });
};
dup(EPISODES, "code", "EPISODES"); dup(PEOPLE, "id", "PEOPLE"); dup(IDIOMS, "id", "IDIOMS");
dup(STORIES, "id", "STORIES"); dup(CANDIDATES, "id", "CANDIDATES"); dup(TOPICS, "id", "TOPICS");

const P = new Set(PEOPLE.map(p => p.id)), I = new Set(IDIOMS.map(i => i.id));
const S = new Set(STORIES.map(s => s.id)), E = new Set(EPISODES.map(e => e.code));

EPISODES.forEach(e => {
  const where = `EPISODES ${e.code}`;
  if (!["ep", "sp", "mv"].includes(e.type)) errs.push(`${where} type 必須是 ep / sp / mv`);
  if (!["published", "upcoming"].includes(e.status)) errs.push(`${where} status 必須是 published / upcoming`);
  if (e.status === "published" && !e.youtube && !e.spotify) errs.push(`${where} 已上架但沒有 youtube 也沒有 spotify`);
  if (e.youtube && !/^[A-Za-z0-9_-]{11}$/.test(e.youtube)) errs.push(`${where} youtube 應該是 11 碼影片 ID（不是整個網址）`);
  if (e.spotify && !/^[A-Za-z0-9]{22}$/.test(e.spotify)) errs.push(`${where} spotify 應該是 22 碼單集 ID（不是整個網址）`);
  if (e.person && !P.has(e.person)) errs.push(`${where} person 找不到: ${e.person}`);
  const r = e.related || {};
  (r.people || []).forEach(x => P.has(x) || errs.push(`${where} related.people 找不到: ${x}`));
  (r.idioms || []).forEach(x => I.has(x) || errs.push(`${where} related.idioms 找不到: ${x}`));
  (r.stories || []).forEach(x => S.has(x) || errs.push(`${where} related.stories 找不到: ${x}`));
});
PEOPLE.forEach(p => {
  if (!ID.test(p.id)) errs.push(`PEOPLE id 只能用英文小寫/數字/連字號: ${p.id}`);
  if (!FACTIONS.includes(p.faction)) errs.push(`PEOPLE ${p.id} faction 錯誤: ${p.faction}`);
  if (p.episode && !E.has(p.episode)) errs.push(`PEOPLE ${p.id} episode 找不到: ${p.episode}`);
  ["name", "oneLine"].forEach(k => p[k] || errs.push(`PEOPLE ${p.id} 缺少 ${k}`));
  if (!Array.isArray(p.history) || !Array.isArray(p.myths) || !Array.isArray(p.tags)) errs.push(`PEOPLE ${p.id} history / myths / tags 必須是陣列`);
});
IDIOMS.forEach(i => {
  if (!ID.test(i.id)) errs.push(`IDIOMS id 格式錯誤: ${i.id}`);
  if (!["history", "novel", "other"].includes(i.sourceType)) errs.push(`IDIOMS ${i.id} sourceType 必須是 history / novel / other`);
  (i.people || []).forEach(x => P.has(x) || errs.push(`IDIOMS ${i.id} people 找不到: ${x}`));
  if (i.episode && !E.has(i.episode)) errs.push(`IDIOMS ${i.id} episode 找不到: ${i.episode}`);
});
STORIES.forEach(s => {
  if (!ID.test(s.id)) errs.push(`STORIES id 格式錯誤: ${s.id}`);
  if (!["true", "fiction", "adapted"].includes(s.verdict)) errs.push(`STORIES ${s.id} verdict 必須是 true / fiction / adapted`);
  (s.people || []).forEach(x => P.has(x) || errs.push(`STORIES ${s.id} people 找不到: ${x}`));
  if (s.episode && !E.has(s.episode)) errs.push(`STORIES ${s.id} episode 找不到: ${s.episode}`);
  ["title", "novel", "history"].forEach(k => s[k] || errs.push(`STORIES ${s.id} 缺少 ${k}`));
});
CANDIDATES.forEach(c => {
  if (!ID.test(c.id)) errs.push(`CANDIDATES id 格式錯誤: ${c.id}`);
  if (!FACTIONS.includes(c.faction)) errs.push(`CANDIDATES ${c.id} faction 錯誤`);
});
TOPICS.forEach(t => {
  if (!["collecting", "recording", "aired"].includes(t.status)) errs.push(`TOPICS ${t.id} status 錯誤`);
  if (t.episode && !E.has(t.episode)) errs.push(`TOPICS ${t.id} episode 找不到: ${t.episode}`);
});
PERSONA_QUIZ.forEach((q, n) => q.options.forEach(o => o.p.forEach(x => P.has(x) || errs.push(`PERSONA_QUIZ 第${n + 1}題 找不到人物: ${x}`))));
HOSTS.forEach(h => P.has(h.id) || errs.push(`HOSTS ${h.id} 在 PEOPLE 裡找不到`));

dup(BATTLES, "id", "BATTLES");
BATTLES.forEach(b => {
  const where = `BATTLES ${b.id}`;
  if (!ID.test(b.id)) errs.push(`${where} id 格式錯誤`);
  b.steps.forEach(s => S.has(`${b.id}-${s.id}`) && errs.push(`${where} 第${s.id}步的投票鍵和 STORIES「${b.id}-${s.id}」撞名（都用 poll:）`));
  if (!["published", "upcoming"].includes(b.status)) errs.push(`${where} status 必須是 published / upcoming`);
  if (!b.sides || !Object.keys(b.sides).length) errs.push(`${where} 缺少 sides`);
  Object.values(b.places).forEach(p => (!p.side || (b.sides || {})[p.side]) || errs.push(`${where} 地點 ${p.name} 的 side 不在 sides 裡`));
  b.terrain.filter(t => t.type === "camps").forEach(t => (b.sides || {})[t.side] || errs.push(`${where} camps 的 side 不在 sides 裡: ${t.side}`));
  if (!P.has(b.role)) errs.push(`${where} role 找不到人物: ${b.role}`);
  (b.people || []).forEach(x => P.has(x) || errs.push(`${where} people 找不到: ${x}`));
  (b.episodes || []).forEach(x => E.has(x) || errs.push(`${where} episodes 找不到: ${x}`));
  (b.stories || []).forEach(x => S.has(x) || errs.push(`${where} stories 找不到: ${x}`));
  dup(b.steps, "id", where + " steps");
  b.steps.forEach(s => {
    const w = `${where} 第${s.id}步`;
    if (!/^[a-z0-9]+$/.test(s.id)) errs.push(`${w} id 只能用英文小寫/數字`);
    if (s.options.filter(o => o.real).length !== 1) errs.push(`${w} 必須剛好有一個 real: true`);
    s.options.forEach(o => {
      if (!/^[a-z]$/.test(o.k)) errs.push(`${w} 選項 k 必須是一個小寫字母`);
      if (!HOSTS.some(h => h.id === o.who)) errs.push(`${w} 選項 ${o.k} 的 who 必須是主持人 id`);
    });
    dup(s.options, "k", w + " options");
    [...(s.map.focus || []), ...(s.map.arrows || []).flatMap(a => a.slice(0, 2)), ...(s.map.fx || []).map(f => f[0]).filter(x => !Array.isArray(x))].forEach(x => b.places[x] || errs.push(`${w} 地圖找不到地點: ${x}`));
    (s.map.arrows || []).forEach(a => a[2] === "feint" || (b.sides || {})[a[2]] || errs.push(`${w} 箭頭陣營要是 sides 的 key 或 feint: ${a[2]}`));
    (s.map.fx || []).forEach(f => ["clash", "fire", "flag"].includes(f[1]) || errs.push(`${w} fx 只能是 clash / fire / flag: ${f[1]}`));
    ["scene", "q", "reveal", "source", "lesson"].forEach(k => s[k] || errs.push(`${w} 缺少 ${k}`));
  });
  (b.myths || []).forEach(m => ["true", "fiction", "adapted"].includes(m.verdict) || errs.push(`${where} myths verdict 錯誤`));
  if (!(b.endings || []).some(e => e.min === 0)) errs.push(`${where} endings 需要一個 min: 0 的結局`);
});

if (errs.length) { console.error("❌ 發現 " + errs.length + " 個問題：\n- " + errs.join("\n- ")); process.exit(1); }
console.log(`✅ OK｜集數 ${EPISODES.length}・人物 ${PEOPLE.length}・成語 ${IDIOMS.length}・查核 ${STORIES.length}・候選人 ${CANDIDATES.length}・題目 ${TOPICS.length}・戰役 ${BATTLES.length}`);
