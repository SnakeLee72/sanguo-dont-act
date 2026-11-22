# 三國別演了｜官方互動網站

> 🤖 **AI agent／協作者請先讀 [AGENTS.md](AGENTS.md)**：完整維護規範、資料格式與上新集數流程。

純 HTML / CSS / JavaScript，不需要安裝或編譯。

- 正式網址：https://sanguo-dont-act.pages.dev
- 本機預覽：在這個資料夾執行 `python -m http.server 8765`，再開 http://localhost:8765 （直接雙擊 html 檔，部分功能不會正常）

## 網站架構

| 頁面 | 檔案 | 內容 |
|---|---|---|
| 🏮 首頁 | `index.html` | 戲台主視覺、最新一集、**今日史實查核**（每天換一題，看全體聽眾投票比例）、來賓排行榜、小百科入口 |
| 🎧 節目 | `episodes.html` | 全部單集，可篩選、搜尋、排序；站內直接看 YouTube 或聽 Spotify |
| 📜 小百科 | `wiki.html` | **人物檔案**（正史記載＋小說 vs 正史對照）、**成語**（典故＋造句）、**史實查核**（先猜再翻牌） |
| 🙋 點播台 | `request.html` | **下一位來賓投票**、**題目看板**（募集中 / 錄製中 / 已播出）、**許願牆**、**投稿表單** |
| 🗺️ 地圖 | `map.html` | 三國地圖時間軸：184–280 年十個關鍵年份的勢力變化，可點戰役進入「你來當軍師」 |
| ⚔️ 當軍師 | `battle.html` | 「你來當軍師」戰役抉擇遊戲：戰場示意圖、主持人吐槽、史官揭曉、全國聽眾選擇比例 |
| 🎮 遊戲中心 | `play.html` | 「遊戲」選單的入口：你來當軍師、投壺、彈棋、吃子棋、心理測驗、武將卡冊、地圖與城池 |
| 🏺 投壺 | `touhu.html` | 宴會小遊戲：拉弓投箭，三回合十二支箭 |
| 🎯 彈棋 | `danqi.html` | 曹丕最拿手的遊戲：彈棋子撞出對手，可對電腦或兩人對戰 |
| ⚫ 吃子棋 | `weiqi.html` | 圍棋入門：先吃到對手的棋子就贏，提示叫吃與氣，可對電腦 |
| 🃏 卡冊 | `cards.html` | 武將收集卡：聽節目、讀檔案、玩遊戲解鎖人物卡，全部完成升級金卡，可存成圖片 |
| 🏯 城池 | `city.html` | 走進三國城池：2.5D 等角視角的東漢郡城，11 個探索點（點數字放大看細節）、白天／夜晚切換 |
| 🎭 你是誰 | `quiz.html` | 「你是哪位三國來賓」心理測驗，測完直接收聽那一集 |

小百科的連結格式：`wiki.html#p=zhaoyun`（人物）、`wiki.html#i=wangmei`（成語）、`wiki.html#s=kongcheng`（故事）。
節目連結：`episodes.html#EP03` 會直接打開那一集的播放器。

導覽只有 5 個主選單：首頁／節目／小百科／遊戲／點播台。同一區的頁面用頁面標題下方的分頁籤切換（小百科：人物・成語・查核、地圖、城池；遊戲：遊戲中心、當軍師、投壺、彈棋、吃子棋、你是誰、卡冊）。

```
互動網頁/
├─ index.html episodes.html wiki.html request.html map.html city.html play.html
│  battle.html touhu.html danqi.html weiqi.html quiz.html cards.html     （13 個頁面）
├─ assets/
│  ├─ css/site.css          樣式（顏色 token 在 :root）
│  ├─ js/
│  │  ├─ config.js          ★ 平台連結、後端網址
│  │  ├─ data.js            ★ 所有內容（集數、人物、成語、查核、候選人、題目、測驗、戰役、地圖年份、城池地點）
│  │  ├─ core.js            共用程式（導覽列、分頁籤、播放器、資料儲存、武將卡、背景音樂）
│  │  └─ home / wiki / request / battle / map / city / cards / touhu / danqi / weiqi .js
│  ├─ img/                  圖示、分享預覽圖、cards/ 人物造型
│  └─ audio/bgm.mp3         背景音樂
├─ tools/check_data.js      資料檢查（改 data.js 後必跑）
├─ tools/make_links.js      產生 episode-links.md（貼到 YouTube／Spotify 說明欄的連結）
└─ backend/google-apps-script.gs   收集聽眾互動用的後端（副本）
```

AI agent 維護規範：[AGENTS.md](AGENTS.md)（Claude Code 讀 `CLAUDE.md`、Gemini／Antigravity 讀 `GEMINI.md`，兩者都指向 AGENTS.md）。

## 每週上新集數

完整流程見 [AGENTS.md §4](AGENTS.md)。簡單說，只要改 `assets/js/data.js`：

1. **EPISODES**：在最上面加一筆。`youtube` 填影片網址 `watch?v=` 後面那串，`spotify` 填單集網址 `/episode/` 後面那串。
   預告集數設 `status: "upcoming"`，上架後改成 `"published"`。
2. **PEOPLE**：新來賓加一筆人物檔案，`episode` 填集數代碼。
3. **IDIOMS / STORIES**：這集提到的成語或故事，`people`、`episode` 填對應的 id 和集數。
4. **TOPICS**：把錄好的題目 `status` 改成 `"aired"` 並填 `episode`；把下一集要錄的改成 `"recording"`。
5. **CANDIDATES**：已經上過節目的候選人可以移除，換上新名單。

## 讓投票和投稿「真的收集到」（Google 試算表，免費）

> ✅ **已設定完成**：試算表「三國別演了 聽眾互動」＋ Apps Script 專案「三國別演了 聽眾互動後端」（在 script.google.com 建立，程式裡的 `SHEET_ID` 指向該試算表）。以下步驟留作重建時參考。

沒設定時是**示範模式**：聽眾的投票、投稿只存在他自己的瀏覽器，數字是示範用的。

1. 開一個新的 Google 試算表，命名「三國別演了 聽眾互動」。
2. 選單 **擴充功能 → Apps Script**，把 `backend/google-apps-script.gs` 全部內容貼上，存檔。
   （想收到新投稿通知信，把第 10 行的 `NOTIFY_EMAIL` 填上你的信箱。）
3. 上方函式選單選 `setup` → 按 **執行**，第一次會要求授權，允許即可。試算表會多出「投票統計」「聽眾投稿」兩個工作表。
4. 右上 **部署 → 新增部署作業** → 類型選 **網頁應用程式**：
   - 執行身分：**我**
   - 誰可以存取：**所有人**
5. 複製部署網址（`https://script.google.com/macros/s/……/exec`），貼到 `assets/js/config.js` 的 `apiUrl`。
6. 重新整理網站，頂端的黃色「示範模式」提示消失，就代表連上了。

**審核投稿**：在「聽眾投稿」工作表把 `approved` 欄打勾，那則投稿才會出現在許願牆。孩子的投稿一律先經過你看過才公開。

> 之後如果修改了 Apps Script 程式碼，要用 **部署 → 管理部署作業 → 編輯 → 版本選「新版本」** 重新部署，網址不變。

## 放上網路

> ✅ **已設定完成**：GitHub repo `SnakeLee72/sanguo-dont-act` 連到 Cloudflare Pages。**push 到 `main` 約 30–60 秒後自動上線**，沒有 build 步驟。
> 如果 push 後 2 分鐘還沒更新，到 Cloudflare 後台 Workers & Pages → sanguo-dont-act → Deployments 查看。

## 小提醒

- 「每天 3 票」「每題按讚一次」是用聽眾瀏覽器記錄的，防的是手滑重複投，擋不住刻意灌票；排行榜請當作參考。
- 集數封面直接使用 YouTube 影片縮圖，上傳新影片後會自動出現。
