# 維護指南（Gemini／Antigravity）

本專案的維護規範都寫在 [AGENTS.md](AGENTS.md)，開始任何修改前請先完整閱讀。
程式的設計重點、目前進度與待辦在 AGENTS.md 的 **§12 程式重點與交接現況**。

@AGENTS.md

## Antigravity 接手須知

- **語言**：網站內容與 commit 訊息都用繁體中文（台灣用語）。回報給站長也用繁體中文。
- **本機預覽**：在 repo 根目錄執行 `python -m http.server 8765`，用內建瀏覽器開 `http://localhost:8765`。不要用 file:// 直接開檔案。
- **沒有 build**：純 HTML／CSS／原生 JS，不要裝 npm 套件或框架。
- **上線流程**：改完 → `node tools/check_data.js`（有改 data.js 時必跑）→ 本機預覽（桌機＋375px 手機寬度、主控台無錯誤）→ 先問站長「要上線嗎？」→ 站長同意才 `git push origin main`（Cloudflare Pages 約 1 分鐘自動上線）→ 到正式網址確認。
- **不要動**：`config.js` 的 `apiUrl`、後端 Apps Script、Google 試算表、聽眾投稿（見 AGENTS.md §3、§8）。測試時不要對正式後端送出投票。
- **commit 署名**：訊息結尾加 `Co-Authored-By: Gemini (Antigravity)`，方便站長知道是誰改的。
- **完成一批更新**：在 AGENTS.md 的「更新紀錄」表格加一行。
