/* ============================================================
   三國別演了｜網站設定
   ------------------------------------------------------------
   apiUrl：聽眾投票、點播、許願要「真的收集到你手上」，
           請照 README.md 建立 Google 試算表後端，
           把部署出來的網址（https://script.google.com/macros/s/.../exec）貼在這裡。
           留空 "" = 示範模式（資料只存在聽眾自己的瀏覽器，數字為示範用）。
   ============================================================ */
const SITE = {
  name: "三國別演了",
  slogan: "《三國演義》沒說的，今天當面問清楚！",
  about: "曹操、諸葛亮與小喬跨越時空，在現代主持一個人物訪談 Podcast。每集邀請一位三國人物，請他親自回答當年到底發生了什麼、為什麼做出那個決定、後人對他的印象是否公平。歷史喜劇＋史實查核，從小學生到大人都聽得懂，適合全家一起收聽。",
  youtube: "https://www.youtube.com/@Snake-yl3il/videos",
  youtubeSubscribe: "https://www.youtube.com/@Snake-yl3il?sub_confirmation=1",
  spotify: "https://open.spotify.com/show/3x36G48NufkZM1Er2Mvp2b",
  apiUrl: "https://script.google.com/macros/s/AKfycbx3D2hTO1Vsz_RhNWpr7Hyc7IarZXWG2wpjrIYQnvMAqMNIY-CzROm31BfneUlZEPxJ/exec",
  guestVotesPerDay: 3   // 每位聽眾每天可投「下一位來賓」幾票
};
