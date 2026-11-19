# AGENTS.md — 《三國別演了》官網維護指南

> 給所有協助維護這個網站的 AI agent（Claude Code、Antigravity、Gemini、Codex、Cursor……）與人類協作者。
> **開始任何修改前，請完整讀過本檔。** 本檔是這個 repo 的最高維護規範；與其他文件衝突時以本檔為準（站長在對話中的明確指示除外）。

---

## 1. 專案一覽

| 項目 | 內容 |
|---|---|
| 網站 | 《三國別演了》親子歷史 Podcast 官方互動網站 |
| 正式網址 | https://sanguo-dont-act.pages.dev |
| 原始碼 | https://github.com/SnakeLee72/sanguo-dont-act （分支 `main`） |
| 部署 | Cloudflare Pages，**push 到 `main` 約 30–60 秒後自動上線**，沒有 build 步驟 |
| 後端 | Google Apps Script + Google 試算表（收集投票、聽眾投稿） |
| 技術 | 純 HTML / CSS / 原生 JavaScript。**沒有框架、沒有 npm 套件、沒有打包工具** |
| 語言 | 網站內容一律**繁體中文（台灣用語）** |
| 讀者 | 小學生到大人，以親子共聽為主 |
| 節目來源 | YouTube：https://www.youtube.com/@Snake-yl3il/videos<br>Spotify：https://open.spotify.com/show/3x36G48NufkZM1Er2Mvp2b |

節目設定：曹操、諸葛亮、小喬三位主持人跨越時空，每集訪問一位三國人物；「史官提醒」負責區分《三國演義》（小說）與《三國志》（正史）。
官方標語：「《三國演義》沒說的，今天當面問清楚！」／「曹操問動機，諸葛亮想辦法，小喬問真話。」

---

## 2. 檔案結構（哪些可以改）

```
index.html  episodes.html  wiki.html  request.html  battle.html  quiz.html   ← 6 個頁面
assets/
  css/site.css            樣式（設計 token 在 :root）
  js/config.js            站名、標語、平台連結、後端網址 apiUrl        ⚠️ 謹慎
  js/data.js              ★ 全站內容資料（集數、人物、成語、查核、候選人、題目、測驗）
  js/core.js              共用：導覽列、頁尾、播放器、資料儲存 Store、背景音樂 BGM
  js/home.js wiki.js request.js battle.js                             各頁邏輯
  img/                    favicon、og-image.png（分享預覽圖）
  audio/bgm.mp3           背景音樂（96kbps）
backend/google-apps-script.gs   後端程式（實際執行的是 Google 上的副本）  ⚠️ 謹慎
tools/check_data.js       資料檢查（每次改 data.js 後必跑）
tools/make_links.js       產生每集說明欄延伸連結 → episode-links.md
episode-links.md          給站長貼到 YouTube / Spotify 說明欄的連結
_headers                  Cloudflare 回應標頭設定
favicon.ico  site.webmanifest
```

**90% 的日常維護只需要改 `assets/js/data.js`。** 改版面、程式之前先確認站長真的要這樣做。

---

## 3. 鐵則（必須遵守）

1. **不要改既有的 id / code。** 投票資料用 id 當鍵（見 §8），改名會讓已累積的票數歸零，也會讓 YouTube／Spotify 說明欄裡的連結失效。要「下架」就用 `status`，不要刪除或改名。
2. **史實要正確。** 只寫有出處的內容，正史以陳壽《三國志》與裴松之注為主；小說情節要明確標示出自《三國演義》。不確定就不要寫，或在回報中提出來讓站長確認。**不要編造引文。**
3. **內容以節目為準。** 單集標題、核心句、史實小提醒，直接取自 YouTube / Spotify 的說明欄，不要自己改寫意思。
4. **適合孩子。** 用字淺白、不恐嚇、不血腥；不要放任何收集個資的欄位。
5. **不要動後端設定與聽眾資料**：`config.js` 的 `apiUrl`、Apps Script、Google 試算表、Cloudflare 設定，除非站長明確要求。**不要刪除或修改試算表裡的投票與投稿**，也不要替站長審核（打勾）投稿。
6. **不要加入框架、npm 依賴或 build 步驟。** 外部資源只用已在用的：Google Fonts、YouTube / Spotify 嵌入、i.ytimg.com 縮圖。
7. **每次改完 `data.js` 都要跑 `node tools/check_data.js`，通過才可以 commit。**
8. **不要 force push、不要改寫 git 歷史。** 一次 commit 做一件事，訊息用中文寫清楚改了什麼。
9. 不要在 repo 放任何密碼、金鑰、token 或個人資料（站長 email 等）。

---

## 4. 標準作業：節目上新集數（最常見的任務）

**觸發**：站長說「YouTube / Spotify 有更新，請同步網站」。

1. **抓資料**
   - YouTube 影片頁 `https://www.youtube.com/@Snake-yl3il/videos`：取得標題與影片 ID（`watch?v=` 後面 11 碼）。
   - Spotify 節目頁 `https://open.spotify.com/show/3x36G48NufkZM1Er2Mvp2b`：取得單集說明、長度、日期與單集 ID（`/episode/` 後面 22 碼）。說明欄裡有「史實小提醒」與「核心句」，是寫小百科的主要依據。
   - 和 `EPISODES` 比對，找出網站還沒有的集數。
2. **改 `EPISODES`**（新的放最上面；`status: "upcoming"` 的預告集放在最上方）
   - 若是之前的預告集（例如 EP10）上架了：把 `status` 改成 `"published"`，補上 `date`、`length`、`youtube`、`spotify`、`lesson`，**code 不變**。
   - 若節目說明提到「下一集：XXX」，可以新增一筆 `status: "upcoming"` 的預告集。
3. **補小百科**（依該集內容，2–4 則即可，品質優先）
   - 新來賓 → `PEOPLE` 新增人物（`role: "guest"`，`episode` 填集數），並在 `PERSONA_QUIZ` 至少 2 個選項裡加上他，讓測驗有機會測出他。
   - 該集提到的成語、名句 → `IDIOMS`。
   - 該集的「史實小提醒」→ `STORIES`（真的 `true`／小說虛構 `fiction`／史實改編 `adapted`）。
   - 把新的 id 填進該集的 `related`。
4. **更新點播台**
   - `TOPICS`：已播出的題目改 `status: "aired"` 並填 `episode`；下一集在錄的改 `"recording"`。
   - `CANDIDATES`：已經上過節目的候選人移除（**只移除，不要改其他人的 id**），可補上新人選。
5. **檢查**：`node tools/check_data.js` 必須顯示 ✅ OK。
6. **重新產生說明欄連結**：`node tools/make_links.js assets/js/data.js episode-links.md`
7. **本機預覽**（§9），確認首頁「最新一集」、節目頁、小百科新條目都正常、主控台沒有錯誤。
8. **commit + push**，等約 1 分鐘後到正式網址確認。
9. **回報站長**：新增了哪些集數／人物／成語／查核，以及 `episode-links.md` 裡新集數的連結區塊（請他貼到 YouTube、Spotify 說明欄）。

---

## 5. 資料格式（`assets/js/data.js`）

陣營 `faction`：`wei` 魏／`shu` 蜀／`wu` 吳／`qun` 群雄。id 只用英文小寫、數字、連字號。

### EPISODES 單集
```js
{
  code: "EP10",                 // 唯一代碼，網址 episodes.html#EP10 會用到（不可改）
  type: "ep",                   // ep 人物來作客｜sp 特別篇｜mv 主題曲・預告片
  label: "預告片",               // 選填：卡片角標文字（預設 ep/sp 顯示 code，mv 顯示「主題曲」）
  status: "published",          // published 已上架｜upcoming 即將上架（不顯示播放鈕）
  person: "caocao",             // 來賓的 PEOPLE id；特別篇留 ""
  title: "曹操來作客",
  question: "本集的核心提問（取自影片標題冒號後面）",
  lesson: "本集核心句（取自說明欄「核心句」）",
  desc: "一兩句簡介",
  date: "2026-11-20", length: "17:20",
  youtube: "11碼影片ID", spotify: "22碼單集ID",
  related: { people: [], idioms: [], stories: [] }   // 本集相關小百科 id
}
```

### PEOPLE 人物
```js
{
  id: "huangzhong", name: "黃忠", zi: "漢升", faction: "shu", life: "？－220",
  role: "guest",                // guest 節目來賓｜host 主持人
  episode: "EP11",              // 他那一集；沒有就 ""
  tags: ["老當益壯"],
  oneLine: "一句話介紹",
  history: ["正史記載（每點一句，附出處更好）"],
  myths: [{ novel: "小說這樣演", truth: "史官查核" }],
  quizBlurb: "測驗結果的描述（第二人稱「你……」）"
}
```

### IDIOMS 成語／名句
```js
{ id: "weicai", word: "唯才是舉",
  sourceType: "history",        // history 正史典故｜novel 出自演義｜other 其他古籍或俗語
  source: "出處", meaning: "意思", story: "典故（白話）", example: "給孩子的造句",
  people: ["caocao"], episode: "SP02" }
```

### STORIES 史實查核（先猜再翻牌）
```js
{ id: "keju", title: "三國時代用『科舉考試』選官員",
  verdict: "fiction",           // true 正史有載｜fiction 虛構｜adapted 史實改編（半真半假）
  verdictText: "沒這回事",       // 選填：取代徽章上的預設文字
  claimLabel: "常見誤會",        // 選填：說法不是出自小說時，取代「小說這樣演」標題
  people: [], episode: "SP02",
  novel: "說法／小說情節", history: "史官查核（說明真相與出處）" }
```
標題中的引號請用『』（外層會再被「」包住）。

### CANDIDATES 下一位來賓候選人
`{ id, name, faction, teaser }`

### TOPICS 題目看板
`{ id: "t-xxx", type: "人物|故事|成語|生活|詩詞", title, status: "collecting|recording|aired", episode }`

### BATTLES 你來當軍師（戰役抉擇）
`battle.html` 的資料。每場戰役約 5 個關鍵時刻，玩家扮演 `role` 做決定，每一步揭曉真實歷史。
```js
{ id: "guandu", title: "官渡之戰", year: "西元 200 年", role: "caocao", foe: "袁紹", status: "published",
  teaser, intro, introSay: { who: "caocao", say: "開場白" },
  people: [], episodes: [],                 // 結尾的延伸連結
  seal: "官渡之戰",                          // 地圖左下角紅色印章（2 或 4 個字）
  sides: { cao: { name: "曹操軍", flag: "曹", color: "var(--wei)" }, yuan: { … } },   // 顏色用陣營 token
  terrain: [{ type: "river", name: "黃河", label: 27, d: "SVG path" },
            { type: "mountains", at: [[x, y, 大小]] }, { type: "grass", at: [[x, y]] }],
  places: { guandu: { x, y, name: "官渡", side: "cao", icon: "city|capital|camp|grain|ford" } },   // 400×300 示意圖座標
  steps: [{ id: "1", place, map: { focus: [地點id], arrows: [[從, 到, "sides 的 key 或 feint"]],
                                   fx: [[地點id, "clash|fire|flag", 陣營]] },
            scene, q, options: [{ k: "a", t: "選項", who: "主持人id", say: "吐槽", real: true }],
            reveal: "史官揭曉（必須有出處）", source: "《三國志・○○傳》", lesson }],
  myths: [{ verdict, verdictText, claim: "《三國演義》這樣演｜常見說法", text, truth }],
  endings: [{ min: 5, title, text }, …, { min: 0, … }] }
```
- 每一步**剛好一個** `real: true`；`who` 只能是 HOSTS 的 id。`reveal` 一律要有史書出處，裴注、野史要標明。
- 戰役 id 與步驟 id 上線後不可改（投票鍵用到）。新戰役 `status: "upcoming"` 不會顯示。

### PERSONA_QUIZ 心理測驗
每題 `{ q, options: [{ t: "選項文字", p: ["人物id", ...] }] }`。選到的選項替列出的人物各加 1 分，最高分者為結果。新增來賓時把他加進至少 2 個選項，並注意不要讓某人出現次數遠多於其他人。

### HOSTS 主持人
三位主持人的稱號與口頭禪，id 必須在 PEOPLE 裡存在。

---

## 6. 網站設定（`assets/js/config.js`）

`name`、`slogan`、`tagline`、`about`（首頁簡介）、平台連結、`apiUrl`（後端網址，**勿改**）、`guestVotesPerDay`（每人每天可投來賓的票數）。

---

## 7. 設計規範

- 風格：「戲台 × 錄音室」——紅色布幕、燈籠、金色點綴、米色紙張底。
- 顏色 token 定義在 `site.css` 的 `:root`：`--curtain` `--curtain-deep` `--lantern` `--gold` `--paper` `--ink`；陣營色 `--wei` `--shu` `--wu` `--qun`。新增元件請沿用 token，不要另外寫死顏色。
- 字體：標題 LXGW WenKai TC，內文 Noto Sans TC。
- 必須支援手機（375px 寬）且不能出現橫向捲動；手機有底部導覽列，固定元件要避開（`bottom` ≥ 92px）。
- 圖示與分享預覽圖在 `assets/img/`；改圖請維持 og-image 1200×630。
- 每個頁面的 `<head>` 有 `<!-- meta:start -->…<!-- meta:end -->` 區塊（分享預覽、favicon），新增頁面時照抄並修改 title / description / url。

---

## 8. 後端與聽眾資料（只讀，勿動）

- 試算表「三國別演了 聽眾互動」：`投票統計`（key / count）與 `聽眾投稿`（`approved` 打勾才會出現在許願牆，**由站長本人審核**）。
- Apps Script 專案「三國別演了 聽眾互動後端」是在 script.google.com 獨立建立的，用 `SHEET_ID` 指向試算表。repo 裡的 `backend/google-apps-script.gs` 是副本；修改後必須到 Apps Script 貼上並「部署 → 管理部署作業 → 編輯 → 新版本」，網址才會不變。**這需要站長的 Google 帳號，請交給站長操作。**
- 投票鍵（key）格式，前端與後端都依賴它：
  - `guest:<CANDIDATES.id>` 下一位來賓
  - `topic:<TOPICS.id>` 題目按讚
  - `poll:<STORIES.id>:<true|fiction>` 首頁每日史實查核
  - `wish:<投稿id>` 許願牆按讚
  - `persona:<PEOPLE.id>` 測驗結果統計
  - `poll:<BATTLES.id>-<步驟id>:<選項k>` 你來當軍師各選項人數（借用 poll 前綴，不必改後端；check_data 會檢查不和 STORIES 撞名）
  後端只接受符合 `^(guest|topic|poll|wish|persona):[a-z0-9:_-]{1,50}$` 的鍵。
- 讀取統計（唯讀、可用來確認後端正常）：`GET <apiUrl>?action=stats`。**測試時不要對正式後端送出投票或投稿**；若必須測試，在瀏覽器攔截 POST，或事後告知站長清除。
- 前端行為：統計數字在同一分頁快取 90 秒（sessionStorage `sgby_stats_v1`），投票會先在畫面加 1 再背景送出；每日投票上限記在訪客瀏覽器 localStorage。

---

## 9. 本機預覽與驗證

```bash
# 在 repo 根目錄
python -m http.server 8765
# 開 http://localhost:8765
```
（必須用本機伺服器；直接雙擊 html 用 file:// 開，部分功能不會正常。）

改完至少確認：
- [ ] `node tools/check_data.js` 顯示 ✅ OK
- [ ] 所有頁面都打得開，瀏覽器主控台沒有錯誤
- [ ] 手機寬度（375px）沒有橫向捲動
- [ ] 新集數：首頁「最新一集」正確、節目頁播放器可以播放、相關小百科連結點得開
- [ ] 小百科新條目：`wiki.html#p=<id>`、`#i=<id>`、`#s=<id>` 都能直接開到該條目

上線後：到 https://sanguo-dont-act.pages.dev 確認（必要時強制重新整理）。若 push 後 2 分鐘仍未更新，到 Cloudflare 後台 Workers & Pages → sanguo-dont-act → Deployments 查看，並告知站長。

---

## 10. Git 慣例

- 直接在 `main` 工作（小型個人網站），push 即部署；改動較大或不確定時，先開分支讓站長確認。
- commit 訊息用繁體中文，例如：`新增 EP10 曹操來作客與相關小百科`。
- 如果你的工具支援，在 commit 訊息結尾加上署名（例如 `Co-Authored-By: <你的模型名稱>`），方便站長知道是哪個 agent 改的。
- `episode-links.md` 與 `tools/` 也會被部署成公開檔案，內容只能是公開資訊。

---

## 11. 常見任務速查

| 站長說 | 你要做的 |
|---|---|
| 「有新集數」 | §4 完整流程 |
| 「EP10 上架了」 | 把 EP10 `status` 改 `published` 並補齊欄位，其餘照 §4 |
| 「加一個人物 / 成語 / 查核」 | 照 §5 格式新增 → check → 預覽 → push |
| 「換候選人」 | 修改 `CANDIDATES`（不要改既有 id，只增刪） |
| 「題目錄好了」 | `TOPICS` 改 `status`、填 `episode` |
| 「說明欄連結」 | `node tools/make_links.js assets/js/data.js episode-links.md`，把該集區塊給站長 |
| 「改標語 / 簡介」 | `config.js` 的 `slogan` / `tagline` / `about` |
| 「換背景音樂」 | 轉成 96kbps mp3 覆蓋 `assets/audio/bgm.mp3`（先確認站長有使用授權） |
| 「看投稿 / 審核」 | 請站長自己到 Google 試算表處理，agent 不代為審核 |

---

## 12. 更新紀錄

| 日期 | 內容 |
|---|---|
| 2026-11-18 | 網站上線（EP01–EP09、SP01、主題曲 MV）、Google 試算表後端、Cloudflare Pages |
| 2026-11-19 | 新增 SP02 選舉季特別企劃、頻道預告片、官方標語；建立本指南與 `tools/check_data.js` |
| 2026-11-19 | 新增「你來當軍師」頁面（`battle.html`、`BATTLES`），第一場：官渡之戰 |

> 每次完成一批更新，請在上表新增一行（日期用 YYYY-MM-DD）。
