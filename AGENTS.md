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
| 節目來源 | YouTube：https://www.youtube.com/@sanguo-dont-act/videos<br>Spotify：https://open.spotify.com/show/3x36G48NufkZM1Er2Mvp2b |

節目設定：曹操、諸葛亮、小喬三位主持人跨越時空，每集訪問一位三國人物；「史官提醒」負責區分《三國演義》（小說）與《三國志》（正史）。
官方標語：「《三國演義》沒說的，今天當面問清楚！」／「曹操問動機，諸葛亮想辦法，小喬問真話。」

---

## 2. 檔案結構（哪些可以改）

```
index.html  episodes.html  wiki.html  request.html  map.html  city.html  play.html  battle.html  touhu.html  danqi.html  weiqi.html  quiz.html  cards.html   ← 13 個頁面
assets/
  css/site.css            樣式（設計 token 在 :root）
  js/config.js            站名、標語、平台連結、後端網址 apiUrl        ⚠️ 謹慎
  js/data.js              ★ 全站內容資料（集數、人物、成語、查核、候選人、題目、測驗）
  js/core.js              共用：導覽列、頁尾、播放器、資料儲存 Store、背景音樂 BGM
  js/home.js wiki.js request.js battle.js map.js cards.js city.js touhu.js danqi.js weiqi.js   各頁邏輯（重點見 §12）
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
   - YouTube 影片頁 `https://www.youtube.com/@sanguo-dont-act/videos`：取得標題與影片 ID（`watch?v=` 後面 11 碼）。
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
  people: [], episodes: [], stories: [],    // 結尾的延伸連結（stories 是 STORIES 的 id）
  seal: "官渡之戰",                          // 地圖左下角紅色印章（2 或 4 個字）
  sides: { cao: { name: "曹操軍", flag: "曹", color: "var(--wei)" }, yuan: { … } },   // 顏色用陣營 token
  terrain: [{ type: "river", name: "黃河", label: 27, d: "SVG path" },
            { type: "mountains", at: [[x, y, 大小]] }, { type: "grass", at: [[x, y]] },
            { type: "lake", name: "洞庭湖", x, y, rx, ry }, { type: "camps", side: "liu", at: [[x, y]] }],   // camps：一整排小營帳（連營）
  places: { guandu: { x, y, name: "官渡", side: "cao", icon: "city|capital|camp|grain|ford" } },   // 400×300 示意圖座標
  steps: [{ id: "1", place, map: { focus: [地點id], arrows: [[從, 到, "sides 的 key 或 feint"]],
                                   fx: [[地點id 或 [x, y], "clash|fire|flag", 陣營]] },
            scene, q, options: [{ k: "a", t: "選項", who: "主持人id", say: "吐槽", real: true }],
            reveal: "史官揭曉（必須有出處）", source: "《三國志・○○傳》", lesson }],
  myths: [{ verdict, verdictText, claim: "《三國演義》這樣演｜常見說法", text, truth }],
  endings: [{ min: 5, title, text }, …, { min: 0, … }] }
```
- 每一步**剛好一個** `real: true`；`who` 只能是 HOSTS 的 id。`reveal` 一律要有史書出處，裴注、野史要標明。
- 戰役 id 與步驟 id 上線後不可改（投票鍵用到）。新戰役 `status: "upcoming"` 不會顯示。

### TIMELINE 三國地圖時間軸
`map.html` 的資料。每個關鍵年份一筆，依年份由小到大排列。
```js
{ year: 208, title: "赤壁之戰", text: "這一年發生什麼（白話）", source: "《三國志・○○傳》",
  regions: { liang: ["qun", "馬超・韓遂"], ji: ["cao", "曹操"], … },   // 16 個地區都要填：[勢力, 地圖上顯示的名字（可留空）]
  capitals: ["xu", "ye"],              // 要標出的都城（城市 id 見 data.js 註解）
  battle: "chibi",                     // 選填：BATTLES 的 id，地圖上會出現可點的戰役標記
  marks: [{ x, y, label: "樊城" }],     // 選填：其他地點標記（600×480 座標）
  guests: ["zhouyu", "zhugeliang"] }   // 這個時期相關的 PEOPLE id
```
- 勢力：`han` 東漢｜`cao` 曹操・魏｜`sun` 孫氏・吳｜`liu` 劉備・蜀漢｜`qun` 其他群雄｜`jin` 晉。
- 地區依東漢的「州」劃分，荊州、揚州、益州（漢中）再分成兩塊；疆界是**示意**，只標「主要由誰控制」。
- **其他群雄（`qun`）用人名分顏色**：同一位軍閥佔好幾塊時，每一塊都填同一個名字（例如 200 年冀、青、幽、并四州都填 `"袁紹"`），地圖會塗同一個顏色、名字只寫一次；留空表示「其他勢力」。新軍閥的顏色加在 `map.js` 的 `RULER`。
- 魏、吳、蜀等勢力用勢力顏色，名字只要填在其中一塊（重複的名字地圖也只會寫一次）。
- 選填 `labelAt: { 劉表: "jingnan" }`：指定名字寫在哪一塊（預設是那幾塊中間的一塊）。名字牌太擠時，地圖會自動上下推開。
- 網址 `map.html#208` 會直接打開那一年。新增戰役時，記得在對應年份填 `battle`，戰役結尾會自動出現「在地圖上看」的連結。

### 武將收集卡（`cards.html`，不需要另外填資料）
每位 `PEOPLE` 自動有一張卡，任務由資料自動產生（邏輯在 `core.js` 的 `Cards`）：
- 🎧 收聽他那一集（`episode` 是已上架的集數時才有；在網站上按播放就算）
- 📜 打開他的人物檔案
- ⚔️ 完成他當主角（`BATTLES.role`）的戰役；主持人則是「玩任一場」
- 🎭 心理測驗測出他（他有出現在 `PERSONA_QUIZ` 的選項裡才有）

**人物造型圖**：`assets/img/cards/<PEOPLE.id>.webp`（400×500，直式 4:5，約 30–45 KB），從該集 YouTube 縮圖（`https://i.ytimg.com/vi/<影片ID>/maxresdefault.jpg`）裁出人物的頭到腰；主持人取自「頻道預告片」縮圖。沒有圖的人物會自動改顯示大字，不會壞掉。新來賓上架後記得補一張，只能用節目自己的美術。

完成任一任務解鎖，全部完成變金卡。所以**新增來賓時照 §4 填好 `episode`、加進 `PERSONA_QUIZ`，卡片就會自動出現**；預告集上架後，「收聽」任務也會自動加上。進度只存在訪客瀏覽器（localStorage `sgby_cards_v1`），不送到後端。

### CITY_SPOTS 走進三國城池（`city.html`）
2.5D 等角視角的「示意」東漢郡城，11 個探索點；點數字會飛過去放大（改 SVG viewBox），放大後可拖曳移動、按「看全城」或 Esc 回到全景。文字在 `data.js`，建築與地點位置在 `city.js`（`SPOT_AT`）。
```js
{ id: "cang", name: "糧倉", sub: "一句話副標", text: "這是什麼地方（白話）", fact: "💡 你知道嗎（最好連到節目人物或戰役）",
  source: "《三國志・武帝紀》", link: { href: "battle.html#guandu", text: "⚔️ 換你當曹操" } }   // link 選填
```
- `id` 不可改（地圖位置用它找）；要新增地點得同時改 `city.js` 的建築與 `SPOT_AT`，以及 `tools/check_data.js` 的 `CITY_IDS`。
- 城是想像的示意城，說明文字要講「漢代一般的城」，不要寫成某座真實城市；`fact` 一定要有出處（史書或考古出土文物）。
- 探索進度存在訪客瀏覽器（localStorage `sgby_city_v1`）。這一頁在「小百科」區的分頁籤裡，首頁「邊聽邊玩」也有入口。

### 小遊戲：投壺（`touhu.html`）、彈棋（`danqi.html`）、吃子棋（`weiqi.html`）
小遊戲（投壺、彈棋是 canvas，吃子棋是 SVG），規則與畫法都在各自的 js 裡，不需要填資料。頁面右側的「史官小知識」必須有出處：
- 投壺：《禮記・投壺》（每人四矢）、《後漢書・祭遵傳》、《三國志・王粲傳》裴注引《魏略》（邯鄲淳〈投壺賦〉）。遊戲計分是自訂的，頁面已註明。
- 彈棋：曹丕《典論・自敘》、《世說新語・巧藝》、邯鄲淳《藝經》（黑白各六枚）、李商隱〈無題〉（棋盤中心不平）。完整規則已失傳，頁面已註明是「改編」玩法。
- 吃子棋：《三國志・武帝紀》裴注引《博物志》（曹操善圍棋）、〈王粲傳〉（覆局）、〈費禕傳〉（與來敏對弈）、〈趙達傳〉裴注引《吳錄》（嚴武）、河北望都東漢墓石棋盤（17 道）；關羽下棋療毒標明是《三國演義》。規則是現代的入門玩法「先吃到 N 顆就贏」，有禁著點與簡單打劫。
- 最佳紀錄存在訪客瀏覽器（`sgby_touhu_best`、`sgby_danqi_wins`、`sgby_weiqi_wins`）。

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
- **導覽只有 5 個主選單**（首頁／節目／小百科／遊戲／點播台），寫在 `core.js` 的 `PAGES`；同一區的頁面用 `SUBNAV` 在頁面標題下方顯示分頁籤：
  - 小百科：人物・成語・查核（wiki）、地圖時間軸（map）、三國城池（city）
  - 遊戲：遊戲中心（play）、你來當軍師（battle）、投壺（touhu）、彈棋（danqi）、吃子棋（weiqi）、你是誰（quiz）、武將卡冊（cards）
  新增頁面時，加進其中一區的 `group` 與 `SUBNAV`，**不要再加主選單項目**（手機底部列只放得下 5 個）。首頁的「邊聽邊玩」與遊戲中心共用 `SG.playBento()`。
- App 圖示（`icon-192/512.png`、`apple-touch-icon.png`、`icon-maskable-512.png`）必須是**不透明的正方形**，四角不能透明，否則手機加到主畫面會出現黑角；系統會自己裁成圓角。
- 地圖上的文字要畫在紙紋、暗角等覆蓋層的上面；手機版字會變小，白色描邊要變細、字色要深，才看得清楚。
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

**驗證小技巧**（之前踩過的坑）：
- 瀏覽器會快取舊的 js／css。改完若畫面沒變，先強制重新整理，或在主控台跑 `fetch('/assets/js/xxx.js',{cache:'reload'})` 再重新載入。
- 在背景分頁或內嵌預覽窗格裡，CSS 動畫有時會停住，`.fade-in` 的卡片看起來是半透明（opacity 0）。這不是 bug，切到前景或用 `document.getAnimations().forEach(a=>a.finish())` 就正常。
- 手機寬度要用 375px 實測，順便確認 `document.documentElement.scrollWidth` 等於 375（沒有橫向捲動）。
- 測試「你來當軍師」、首頁查核等會投票的功能時，先攔截 POST（§8），不要真的送出。
- 測完遊戲記得清掉 localStorage 裡的測試紀錄（`sgby_touhu_best` 等）。

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

## 12. 程式重點與交接現況（給接手的 agent）

> 最後更新：2026-11-22。以下是讀程式前最好先知道的設計，改之前先看這裡，可以少走很多冤枉路。

### 12.1 共用（`core.js`、`site.css`）
- `PAGES`（5 個主選單）＋ `SUBNAV`（分頁籤）。分頁籤放不下時，`core.js` 會自動加 `more-l`／`more-r` class（兩側淡出）並把目前頁捲到看得見的位置。
- `SG.playBento()`：首頁「邊聽邊玩」與遊戲中心共用。手機（<640px）三個小遊戲會排成一列小卡（`.bento-mini`）。
- 篩選列 `.toolbar`：手機上第一個 `.seg` 會變成單列左右滑；`episodes.html` 的 `.tb-row` 讓搜尋排第一、收聽進度與排序並排。
- `Cards`（武將卡）、`Store`（投票與統計）、`BGM`、`openPlayer` 都在 `core.js`，見 §5、§8。
- 首頁手機版主視覺的精簡樣式寫在 `index.html` 的 `<style>`（`@media (max-width: 599px)`）。

### 12.2 地圖時間軸（`map.js`）
- 地區是 16 個中心點自動切出的 Voronoi 區塊（`REGIONS`），疆界、相鄰邊（`EDGES`）都是程式算的，不需要手畫。
- 顏色：魏吳蜀用 `POWER`；其他群雄用人名查 `RULER`（新軍閥要加顏色）。`ownerOf()` 決定一塊地「屬於誰」，交界粗線與邊界暈染（`#tlWash`）都依它畫。
- 名字只寫一次：同名的幾塊地選中間那塊（或 `labelAt` 指定）。`plaques()` 會量文字大小、自動上下推開互相重疊的名字牌；字型載入後與視窗縮放時會重排。
- 改完地圖請跑一次「名字牌重疊檢查」：在 `map.html` 主控台把每個年份的 `.tl-plaque` 兩兩比對 `getBoundingClientRect()`，桌機與 375px 都應該是 0 個重疊。

### 12.3 戰役示意圖（`battle.js`）
- 每場戰役 400×300 的手繪風 SVG，全部從 `BATTLES` 資料畫出來，美術是自動的：
  - 勢力範圍暈染：每個有 `side` 的地點周圍畫一圈模糊的陣營色（`#mp-zone` 濾鏡用 `userSpaceOnUse`，否則會整個消失）。
  - 水墨樹林：`trees(b)` 用固定亂數在空地長幾片小樹林，會避開地名文字、河、湖、山、營帳、印章與指北針；同一場戰役每次長得一樣。
- 所以**新增戰役只要填資料**，不用另外畫樹或上色。若樹長在不該長的地方，調整 `trees()` 的避開範圍，不要手動刪樹。

### 12.4 三國城池（`city.js`）
- 等角投影 `P(x, y, z)`；所有物件用 `add(深度, svg)` 加入，最後依深度排序（約等於 `x + y`，越大越前面）。新增物件時深度要設對，否則會蓋錯。
- 小物件（陶罐、米袋、雞、豬、馬、軺車、兵器架、睡蓮、鴨子、蘆葦、秧苗……）都是 `city.js` 前段的小函式，可以重複使用。
- `.mover`（會走動的牛車、行人）是用 `animateMotion` 畫在**所有東西的最上層**，不參與深度排序。路線必須走在空地上，不能穿過建築，否則會看起來走在屋頂上。
- 夜晚模式：`.mover` 和包在 `day()` 裡的人（官員、小吏、買東西的人、農夫）會消失；守衛和家畜留著。新增「白天才在外面的人」請包 `day()`。
- 探索點的位置在 `SPOT_AT`，放大鏡（點數字飛過去）用的是改 SVG viewBox。

### 12.5 小遊戲（`touhu.js`、`danqi.js`、`weiqi.js`）
- 投壺、彈棋是 canvas，有處理高解析度螢幕（DPR），邏輯座標固定（投壺 800×450、彈棋 600×600）；吃子棋是 SVG 棋盤。
- 投壺：箭撞到壺身會彈開翻滾、5 秒保險自動結束，不會卡住。三位主持人在旁邊觀戰。
- 吃子棋：規則在 `tryPlay()`／`legal()`（提子、禁著點、打劫），電腦是簡單的啟發式。

### 12.6 待辦與已知小問題（可以優先處理）
- 市集攤位的貨物偏小（攤位頂棚會擋住），站長說要的話可以把頂棚架高或把貨放大。
- 遊戲中心「你是誰」卡片的頭像離「進入」有點近；手機上投壺的人物偏小、「最佳」紀錄會換行。
- 建議過但還沒做的遊戲：**史官快問快答**（限時判斷真假，題目可直接用 `STORIES`）。
- `episode-links.md` 的 MV02 與 QA01 區塊，提醒站長貼到 YouTube / Spotify 說明欄。
- EP11（黃月英來作客）是 `upcoming`，上架時照 §4 處理（記得新增 `PEOPLE` 條目 `huangyueying`、補 `PERSONA_QUIZ` 選項與武將卡造型圖）。

## 13. 更新紀錄

| 日期 | 內容 |
|---|---|
| 2026-11-18 | 網站上線（EP01–EP09、SP01、主題曲 MV）、Google 試算表後端、Cloudflare Pages |
| 2026-11-19 | 新增 SP02 選舉季特別企劃、頻道預告片、官方標語；建立本指南與 `tools/check_data.js` |
| 2026-11-19 | 新增「你來當軍師」頁面（`battle.html`、`BATTLES`），第一場：官渡之戰 |
| 2026-11-19 | 戰場示意圖改為古地圖手繪風；新增第二場：赤壁之戰（扮演周瑜）；首頁加入「你來當軍師」入口 |
| 2026-11-19 | 新增第三場：夷陵之戰（扮演陸遜） |
| 2026-11-19 | 新增「三國地圖時間軸」頁面（`map.html`、`TIMELINE`），導覽列加入「地圖」 |
| 2026-11-19 | 地圖美術加強、加入年號；新增「武將收集卡」頁面（`cards.html`），導覽列加入「卡冊」 |
| 2026-11-19 | 收集卡加入 12 位人物造型（取自節目縮圖）、卡面美術改版 |
| 2026-11-19 | 新增「走進三國城池」2.5D 等角城池頁（`city.html`、`CITY_SPOTS`），白天／夜晚切換 |
| 2026-11-19 | 版面整理：主選單減為 5 個＋分頁籤、新增遊戲中心（`play.html`）、首頁合併為「邊聽邊玩」；App 圖示改為不透明；手機地圖文字加深 |
| 2026-11-19 | 首頁左右布幕改為 SVG 絲絨束腰大幕與連續布料物理擺動；音樂鈕整合至頂部導覽列；新增已收聽標記與篩選、播放器上下集切換與分享、首頁小百科補齊 5 大入口 |
| 2026-11-20 | EP10 曹操來作客上架；新增 4 則查核（許攸來投、燒信、呂伯奢、寧我負人）；QA01 聽眾問答預告 |
| 2026-11-21 | 新增「唯才是舉」曹操主題曲 MV（MV02） |
| 2026-11-21 | 新增小遊戲：投壺（`touhu.html`）、彈棋（`danqi.html`）、吃子棋（`weiqi.html`），放在「遊戲」分頁籤與「邊聽邊玩」 |
| 2026-11-21 | 手機版面整理：首頁主視覺收短、分頁籤兩側淡出並自動捲到目前頁、小百科入口與小遊戲改精簡卡、節目／小百科篩選改單列滑動、測驗頭像不再被裁切、卡冊小字放大到 12px |
| 2026-11-21 | 地圖時間軸：群雄依人名分顏色、同名只標一次、名字牌自動避開；邊界暈染、水墨樹林、紙面水彩斑駁、標題框加年份 |
| 2026-11-21 | 戰役地圖美術：雙方勢力範圍暈染、空地自動長出水墨樹林、河流墨線描邊、湖面漣漪、山的陰影面、建築地面陰影、金色角飾 |
| 2026-11-21 | 三國城池細節：太守府雙闕・軺車・小吏、市集貨物、里的豬圈・雞・晾衣、糧倉米袋、武庫兵器架、護城河睡蓮・鴨・蘆葦、亭的拴馬、塢堡守衛、屯田水渠與秧苗、地面鋪磚碎石；路上的人夜晚會收工 |
| 2026-11-22 | 交接文件：AGENTS.md 新增 §12 程式重點與交接現況、驗證小技巧；GEMINI.md 補 Antigravity 注意事項；README 更新檔案結構與部署方式 |
| 2026-11-22 | QA01 聽眾問答番外篇上架；新增 2 則成語（兵馬未動糧草先行、枕戈待旦）、3 則查核（赤兔馬、陰符/字驗密碼、門中活字）與 EP11 黃月英預告 |
| 2026-11-23 | SB01 孫子兵法第一集上架；新增 SB02 預告、2 則成語/名句（兵貴勝不貴久、攻其無備出其不意）、3 則查核（孫武時代、官渡兵力比、孫臏減灶誘敵） |
| 2026-11-24 | SP03 時事特別企劃（黃仁勳 11 天回歸 CEO vs 皇帝歸位）上架；新增 1 則成語（東山再起）與 4 則查核（奪門之變、神龍政變、溥儀十二日復辟、高平陵之變） |
| 2026-11-25 | SB02 孫子兵法第二集（謀攻篇＋軍形篇）上架；新增 SB03 預告、2 則名句（不戰而屈人之兵、知彼知己百戰不殆）、2 則查核（郝昭守陳倉、七擒七縱孟獲） |
| 2026-11-25 | SEO 與社群分享強化：新增 `robots.txt`、`sitemap.xml`、主要頁面 JSON-LD 結構化資料；`quiz.html` 升級結果分享文案、`#r=<id>` 挑戰連結與 PNG 結果圖卡下載 |
| 2026-11-26 | 新增 Google Search Console 網站擁有權驗證檔（`googlebe1bd2ab77a18d3c.html`） |

> 每次完成一批更新，請在上表新增一行（日期用 YYYY-MM-DD）。
