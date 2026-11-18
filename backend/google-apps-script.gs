/**
 * 三國別演了｜聽眾互動後端（Google Apps Script + Google 試算表）
 * ------------------------------------------------------------
 * 收集：下一位來賓投票、題目按讚、今日史實查核、聽眾投稿（許願燈籠）
 * 設定步驟請看同資料夾的 README.md
 *
 * 審核投稿：在「聽眾投稿」工作表把 approved 欄打勾，該則投稿就會出現在網站的許願牆。
 */

// 有新投稿時寄通知信給你（留空 '' 就不寄）
const NOTIFY_EMAIL = '';

const VOTES = '投票統計';
const WISHES = '聽眾投稿';
const VOTE_HEADER = ['key', 'count', 'updated'];
const WISH_HEADER = ['id', 'time', 'type', 'content', 'nickname', 'grade', 'host', 'approved'];
const KEY_RULE = /^(guest|topic|poll|wish|persona):[a-z0-9:_-]{1,50}$/i;

/** 第一次使用：在編輯器選這個函式按「執行」，會自動建立工作表 */
function setup() {
  sheet_(VOTES, VOTE_HEADER);
  sheet_(WISHES, WISH_HEADER);
}

function doGet() {
  return out_(stats_());
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return out_({ ok: false, error: 'bad json' }); }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (body.action === 'vote') vote_(String(body.key || ''));
    else if (body.action === 'wish') wish_(body);
    else return out_({ ok: false, error: 'unknown action' });
  } finally {
    lock.releaseLock();
  }
  return out_({ ok: true });
}

/* ---------------- 內部函式 ---------------- */
function sheet_(name, header) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, header.length).setFontWeight('bold');
  }
  return sh;
}

function vote_(key) {
  if (!KEY_RULE.test(key)) return;
  const sh = sheet_(VOTES, VOTE_HEADER);
  const last = sh.getLastRow();
  if (last > 1) {
    const keys = sh.getRange(2, 1, last - 1, 1).getValues();
    for (let i = 0; i < keys.length; i++) {
      if (keys[i][0] === key) {
        const cell = sh.getRange(i + 2, 2);
        cell.setValue((Number(cell.getValue()) || 0) + 1);
        sh.getRange(i + 2, 3).setValue(new Date());
        return;
      }
    }
  }
  sh.appendRow([key, 1, new Date()]);
}

function clip_(v, n) { return String(v == null ? '' : v).replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, n); }

function wish_(b) {
  const content = clip_(b.content, 300);
  if (content.length < 2) return;
  const sh = sheet_(WISHES, WISH_HEADER);
  const id = Utilities.getUuid().replace(/-/g, '').slice(0, 10);
  // 開頭是 = + - @ 的文字加上 ' ，避免被試算表當成公式
  const safe = (s) => /^[=+\-@]/.test(s) ? "'" + s : s;
  sh.appendRow([id, new Date(), safe(clip_(b.type, 10)), safe(content), safe(clip_(b.nickname, 20)), clip_(b.grade, 12), clip_(b.host, 10), false]);
  sh.getRange(sh.getLastRow(), 8).insertCheckboxes();
  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(NOTIFY_EMAIL, '【三國別演了】新投稿：' + content.slice(0, 20),
      '暱稱：' + b.nickname + '\n年級：' + b.grade + '\n類型：' + b.type + '\n想問：' + b.host + '\n\n' + content +
      '\n\n到試算表把 approved 打勾，就會出現在許願牆。\n' + SpreadsheetApp.getActive().getUrl());
  }
}

function stats_() {
  const votes = {};
  const vs = sheet_(VOTES, VOTE_HEADER);
  if (vs.getLastRow() > 1) {
    vs.getRange(2, 1, vs.getLastRow() - 1, 2).getValues().forEach(r => { if (r[0]) votes[r[0]] = Number(r[1]) || 0; });
  }
  const wishes = [];
  const ws = sheet_(WISHES, WISH_HEADER);
  if (ws.getLastRow() > 1) {
    ws.getRange(2, 1, ws.getLastRow() - 1, WISH_HEADER.length).getValues().forEach(r => {
      if (r[7] === true) {
        wishes.push({ id: r[0], type: r[2], content: r[3], nickname: r[4], grade: r[5], host: r[6], votes: votes['wish:' + r[0]] || 0 });
      }
    });
  }
  return { ok: true, votes: votes, wishes: wishes };
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
