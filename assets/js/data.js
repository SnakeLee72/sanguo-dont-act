/* ============================================================
   三國別演了｜網站內容資料（每週更新只要改這個檔案）
   ------------------------------------------------------------
   📻 EPISODES   節目單集（新的一集加在最上面）
   👤 PEOPLE     小百科：人物
   📖 IDIOMS     小百科：成語 / 名句
   🔍 STORIES    小百科：故事史實查核（verdict: true 正史有載 / fiction 小說虛構 / adapted 史實改編）
   🗳️ CANDIDATES 點播台：下一位來賓候選人
   📋 TOPICS     點播台：題目看板（status: collecting 募集中 / recording 錄製中 / aired 已播出）
   🎭 PERSONA_QUIZ 「你是哪位三國人物」測驗
   陣營 faction：wei 魏 / shu 蜀 / wu 吳 / qun 群雄
   id 只能用英文小寫，互相引用時就填 id。
   ============================================================ */

const HOSTS = [
  { id: "caocao", name: "曹操", role: "問動機 × 招募官", line: "人才！這是人才啊！合約呢？", faction: "wei" },
  { id: "zhugeliang", name: "諸葛亮", role: "想辦法 × 還原歷史現場", line: "莫急，容亮翻一下訪綱。", faction: "shu" },
  { id: "xiaoqiao", name: "小喬", role: "問真話 × 靈魂拷問", line: "等等——這段是不是又在演？", faction: "wu" }
];

/* ---------------- 📻 節目單集 ---------------- */
const EPISODES = [
  {
    code: "SB02", type: "sp", status: "upcoming", person: "",
    title: "孫子兵法：謀攻篇＋軍形篇",
    question: "最高明的贏法是不吵架，「不戰而屈人之兵」到底怎麼做得到？",
    lesson: "",
    desc: "《三國別演了 × 孫子兵法》第二集預告！最高明的勝利不是硬碰硬，而是「不戰而屈人之兵」與「先勝而後求戰」，敬請期待！",
    date: "", length: "", youtube: "", spotify: "",
    related: { people: ["caocao", "zhugeliang", "xiaoqiao"], idioms: [], stories: [] }
  },
  {
    code: "EP11", type: "ep", status: "upcoming", person: "",
    title: "黃月英來作客",
    question: "別人用外表或刻板印象貼你標籤時，怎麼用實力說話？",
    lesson: "",
    desc: "第 11 集預告！傳說中才華出眾、卻常被外表標籤評價的黃月英要來作客了！你想問她什麼？快到點播台投稿！",
    date: "", length: "", youtube: "", spotify: "",
    related: { people: ["zhugeliang"], idioms: [], stories: [] }
  },
  {
    code: "SP03", type: "sp", status: "published", person: "",
    title: "黃仁勳 11 天驚奇回歸 CEO！",
    question: "古代皇帝被迫退位後，真的還能『王者歸來』嗎？",
    lesson: "真正厲害的團隊，不只要找回能扛大局的核心人物，更要把制度與信任補得比以前更牢；就算主角暫時離席，大家也能穩穩接住每一場考驗！",
    desc: "輝達執行長黃仁勳辭職 11 天後全票回歸 CEO！從明英宗奪門之變、唐中宗神龍政變、拿破崙百日王朝、溥儀 12 天復辟，到司馬懿高平陵之變，看懂「人回來了」為何還要補好規矩。",
    date: "2026-11-24", length: "15:30",
    youtube: "pao8GvnPp7E", spotify: "08JZfZFdSQX31TKstCs7jx",
    related: { people: ["simayi", "caocao", "zhugeliang"], idioms: ["dongshan"], stories: ["duomen", "shenlong", "fupi-12days", "gaopingling"] }
  },
  {
    code: "SB01", type: "sp", status: "published", person: "",
    title: "孫子兵法：始計篇＋作戰篇",
    question: "開打之前，先學會按計算機",
    lesson: "真正的贏家不是靠運氣衝鋒，而是在出發前就把條件算清楚、把時間用在刀口上；多一分準備，就多十分勝算。",
    desc: "《三國別演了 × 孫子兵法》第一集！曹操帶大家讀《始計篇》「道天地將法」與《作戰篇》時間成本，從官渡之戰和孫臏「減灶誘敵」看懂怎麼用算的贏過強敵。",
    date: "2026-11-23", length: "16:09",
    youtube: "M7B5zoL1uu4", spotify: "6BQBAwXKOXVXhwOpJZcWY5",
    related: { people: ["caocao", "zhugeliang", "xiaoqiao"], idioms: ["guisheng", "chubuyi"], stories: ["sunwu-era", "guandu-odds", "sunbin-stove"] }
  },
  {
    code: "QA01", type: "sp", label: "聽眾問答", status: "published", person: "",
    title: "聽眾問答番外篇",
    question: "三國士兵上廁所、赤兔馬吃多少？",
    lesson: "歷史不只是英雄的傳說，更是無數生活智慧的累積；把眼前的每一件小事做好，就是最強大的本事。",
    desc: "QA01 聽眾問答特別企劃！五個歷史課本不寫的生活大難題：軍營廁所怎麼解決？赤兔馬一天吃多少草？沒有手機怎麼傳軍情？盔甲到底有多重？十萬大軍每天吃什麼？",
    date: "2026-11-22", length: "15:08",
    youtube: "SHmXhc9b0YI", spotify: "6XqcxUrFszBvYamOFG9qLu",
    related: { people: ["lvbu", "guanyu", "caocao", "zhugeliang"], idioms: ["liangcao", "zhengedaidan"], stories: ["chitu", "yinfu", "menzhonghuo"] }
  },
  {
    code: "MV02", type: "mv", label: "曹操主題曲", status: "published", person: "caocao",
    title: "「唯才是舉」曹操主題曲 MV",
    question: "西裝筆挺、燙金合約，Disco 節拍唱出唯才是舉！",
    lesson: "",
    desc: "曹操主題曲《唯才是舉》Disco-Funk，西裝筆挺、燙金合約，Disco 節拍唱出唯才是舉。",
    date: "2026-11-20", length: "3:52",
    youtube: "SnFuB_FvTZw", spotify: "",
    related: { people: ["caocao"], idioms: ["weicai"], stories: ["fenxin"] }
  },
  {
    code: "EP10", type: "ep", status: "published", person: "caocao",
    title: "曹操來作客",
    question: "被罵成大反派的人，到底在想什麼？",
    lesson: "每個人心裡都有光明與黑暗兩面；懂得信任別人、給人機會，你就是英雄；一旦被恐懼和多疑控制，就會變成自己最討厭的樣子。",
    desc: "第十集里程碑特別企劃！平時最愛審問別人、動不動就發招募合約的曹操，這次坐上來賓審問椅，接受諸葛亮與小喬聯手發問。",
    date: "2026-11-20", length: "18:10",
    youtube: "0yt0wnfUFz8", spotify: "64yrgZec61MQphmlTgC9GT",
    related: { people: ["caocao"], idioms: [], stories: ["tuxian", "fenxin", "lvboshe", "ningwo"] }
  },
  {
    code: "SP02", type: "sp", status: "published", person: "",
    title: "選舉季特別企劃",
    question: "古代沒有投票箱，怎麼選出好官員？",
    lesson: "真正的選才，看的是品德與實力，而不是交情與標籤；把票投給你想要的生活，你就贏了。",
    desc: "漢朝的察舉制怎麼變調？曹操為什麼喊出「唯才是舉」？九品中正制為什麼變成「上品無寒門，下品無勢族」？科舉和「名落孫山」又是什麼時候才出現的？",
    date: "2026-11-19", length: "13:22",
    youtube: "JQxtwqEa0Wo", spotify: "1NCZ0YJvZOFrGvfaeE2yF7",
    related: { people: ["caocao"], idioms: ["weicai", "shangpin", "mingluo"], stories: ["keju", "xiaolian", "qiuxian", "jiupin"] }
  },
  {
    code: "PV", type: "mv", label: "預告片", status: "published", person: "",
    title: "《三國別演了》頻道預告片",
    question: "曹操問動機，諸葛亮想辦法，小喬問真話！",
    lesson: "",
    desc: "歷史課本太無聊？《三國演義》演得太誇張？一分鐘認識三位主持人和最公正的史官提醒。",
    date: "2026-11-18", length: "1:04",
    youtube: "IdKcLJpr0XE", spotify: "3U9rsxhQf6eN2LRTXnyW7a",
    related: { people: ["caocao", "zhugeliang", "xiaoqiao"], idioms: [], stories: [] }
  },
  {
    code: "EP09", type: "ep", status: "published", person: "luxun",
    title: "陸遜來作客",
    question: "被當成沒經驗的書呆子，怎麼用冷靜證明自己？",
    lesson: "真正的實力，不需要靠大嗓門證明；把委屈化為冷靜，結果自然會替你說話。",
    desc: "五萬兵馬、堅守半年、一把火燒掉劉備的七百里連營——東吳最年輕的大都督，到底憑什麼讓一群老將心服口服？",
    date: "2026-11-18", length: "17:20",
    youtube: "LHsRCTOHJlQ", spotify: "2V2EZyWyvvnTOIZ44jFuhC",
    related: { people: ["luxun", "liubei", "guanyu"], idioms: ["guamu"], stories: ["baizhentu", "huoshao", "anjian"] }
  },
  {
    code: "SP01", type: "sp", status: "published", person: "",
    title: "三國成語故事",
    question: "成語背後的故事，你都知道嗎？",
    lesson: "成語不只是課本裡的四個字，更是古人在關鍵時刻做出的真實選擇；看懂故事的細節，就能找到解決問題的智慧。",
    desc: "望梅止渴、賠了夫人又折兵、樂不思蜀——三位主持人親自下場當說書人，把當年的現場畫面演給大家聽。",
    date: "2026-11-16", length: "13:33",
    youtube: "9JTMe2Ijv40", spotify: "4Pug5nGokJ1kjobk1mWA0s",
    related: { people: ["caocao", "sunquan", "liubei"], idioms: ["wangmei", "peile", "lebusishu"], stories: ["meirenji"] }
  },
  {
    code: "EP08", type: "ep", status: "published", person: "simayi",
    title: "司馬懿來作客",
    question: "別人都在搶第一的時候，懂得沉住氣有多重要？",
    lesson: "真正的贏家，不是跑得最快的人，而是看得最遠、沉得住氣的人。",
    desc: "五丈原對峙，諸葛亮送來一套女人衣服羞辱他，他笑著收下，轉頭就問諸葛亮每天吃幾碗飯。",
    date: "2026-11-16", length: "16:37",
    youtube: "pMlcAaBMCiI", spotify: "4viZXfURQt70YTZcct0g19",
    related: { people: ["simayi", "zhugeliang"], idioms: [], stories: ["kongcheng", "jinguo"] }
  },
  {
    code: "EP07", type: "ep", status: "published", person: "liubei",
    title: "劉備來作客",
    question: "一直失敗又一直重新開始，怎麼讓大家願意陪你走下去？",
    lesson: "只要守住善良與誠信，身邊永遠會有願意陪你重新開始的夥伴。",
    desc: "沒錢、沒兵、沒地盤，把三國諸侯都投靠過一輪，為什麼關張趙諸葛還死心塌地跟著他？",
    date: "2026-11-15", length: "18:39",
    youtube: "kv_yXxfsLis", spotify: "3LEGpIAJ78i0G5FoE9E0I7",
    related: { people: ["liubei", "zhugeliang", "zhangfei"], idioms: ["sangu", "yushui"], stories: ["shuaidou", "bianduyou", "sangu"] }
  },
  {
    code: "EP06", type: "ep", status: "published", person: "sunquan",
    title: "孫權來作客",
    question: "年紀輕輕就要扛大事，別人不服氣怎麼辦？",
    lesson: "真正的領導力，不是要求每個人都畏懼你，而是懂得借重眾人的智慧，並在風浪來臨時，成為大家最安定的依靠。",
    desc: "十八歲接下整個江東，面對一群不服氣的老臣，他拔劍砍斷桌角，決定和曹操一戰。",
    date: "2026-11-15", length: "18:53",
    youtube: "UqBc-oQ9WTo", spotify: "2lF9WLr2JrthaGZmQZKywM",
    related: { people: ["sunquan", "zhouyu"], idioms: [], stories: ["kanan", "shezhan"] }
  },
  {
    code: "EP05", type: "ep", status: "published", person: "zhangfei",
    title: "張飛來作客",
    question: "脾氣一來就忍不住，怎麼學會當情緒的主人？",
    lesson: "真正的強大，不是嗓門比別人大、拳頭比別人硬，而是生氣的時候，依然管得住自己的脾氣。",
    desc: "打仗超勇猛、對大哥二哥超講義氣，但全天下都知道他脾氣超級暴躁。生氣的時候，他心裡到底在想什麼？",
    date: "2026-11-14", length: "16:08",
    youtube: "OiCcrk4KVPU", spotify: "1XcJxtZGeAQwGGsQWDvzLk",
    related: { people: ["zhangfei", "liubei"], idioms: [], stories: ["bianduyou", "duanqiao"] }
  },
  {
    code: "EP04", type: "ep", status: "published", person: "guanyu",
    title: "關羽來作客",
    question: "講信用跟太驕傲，中間的界線到底在哪裡？",
    lesson: "真正的自信，不是覺得自己永遠不會錯，而是在擁有實力的同時，依然懂得尊重別人、聽進提醒。",
    desc: "斬顏良報恩、封金掛印離去、水淹七軍威震華夏，最後卻因為太驕傲大意失荊州。",
    date: "2026-11-13", length: "14:17",
    youtube: "M6FtxI-XIYE", spotify: "1q62LQHd1dP9IMB0JWhsfW",
    related: { people: ["guanyu", "caocao", "luxun"], idioms: ["dayi", "guamu"], stories: ["wuguan", "wenjiu", "guagu"] }
  },
  {
    code: "EP03", type: "ep", status: "published", person: "zhouyu",
    title: "周瑜來作客",
    question: "遇到比自己優秀的人，除了嫉妒還能怎麼辦？",
    lesson: "真正的強大，不是希望別人變弱，而是把別人的優秀當成自己進步的標準。",
    desc: "小說說他嫉妒諸葛亮、氣到吐血，正史卻說他心胸寬廣。赤壁之戰的火，其實是誰放的？",
    date: "2026-11-13", length: "15:42",
    youtube: "4qK4ckDDqHA", spotify: "1ZwQxI52cqMZmqErWZsOGP",
    related: { people: ["zhouyu", "zhugeliang", "xiaoqiao"], idioms: ["jisheng", "gukou"], stories: ["chibi", "caochuan"] }
  },
  {
    code: "EP02", type: "ep", status: "published", person: "lvbu",
    title: "呂布來作客",
    question: "能力很強，就能讓別人重新相信你嗎？",
    lesson: "真正的實力，不只是贏過別人，而是讓人放心把背後交給你。",
    desc: "武藝天下第一，卻換過六次陣營：殺丁原、殺董卓、奪兗州、奪徐州。",
    date: "2026-11-13", length: "12:25",
    youtube: "u_3a21oadMI", spotify: "2PUEFVipU0EQQKqEfZSESp",
    related: { people: ["lvbu", "liubei", "caocao"], idioms: [], stories: ["yuanmen", "sanying"] }
  },
  {
    code: "EP01", type: "ep", status: "published", person: "zhaoyun",
    title: "趙雲來作客",
    question: "真正勇敢的人也會害怕嗎？",
    lesson: "真正的勇敢，不是什麼都不怕，而是知道害怕時，下一步該做什麼。",
    desc: "長坂坡的真實歷史：趙雲保護年幼的劉禪與甘夫人，史書只記了一句話，七進七出又是怎麼來的？",
    date: "2026-11-13", length: "14:31",
    youtube: "aFy2Ny_8ToY", spotify: "2kLcGXsVZnTqnwVrglrFvQ",
    related: { people: ["zhaoyun", "liubei"], idioms: ["yishendan"], stories: ["changban", "qijin"] }
  },
  {
    code: "MV", type: "mv", status: "published", person: "",
    title: "三國別演了｜主題曲 MV",
    question: "曹操打鼓、諸葛亮撫琴、小喬彈琵琶！",
    lesson: "演義很精彩，真相更好玩。",
    desc: "三位主持人登上戲台，一起唱出節目的主題曲。",
    date: "", length: "",
    youtube: "16Z4QY-HXtA", spotify: "",
    related: { people: ["caocao", "zhugeliang", "xiaoqiao"], idioms: [], stories: [] }
  }
];

/* ---------------- 👤 人物 ---------------- */
const PEOPLE = [
  {
    id: "zhaoyun", name: "趙雲", zi: "子龍", faction: "shu", life: "？－229", role: "guest", episode: "EP01",
    tags: ["常山趙子龍", "一身是膽"],
    oneLine: "劉備身邊最可靠的護衛將軍，長坂坡亂軍中保護了年幼的劉禪。",
    history: [
      "長坂坡之戰，劉備拋下妻兒逃走，趙雲抱著年幼的劉禪、保護甘夫人脫險。",
      "漢水之戰，他大開營門、偃旗息鼓，曹軍懷疑有埋伏而退兵，劉備讚他「子龍一身都是膽也」（見《趙雲別傳》）。",
      "個性謹慎，曾勸劉備不要因私怨攻打東吳。"
    ],
    myths: [
      { novel: "長坂坡「七進七出」，斬曹營名將五十餘員。", truth: "史書只記了他保護劉禪的一句話，七進七出是小說加油添醋。" }
    ],
    quizBlurb: "你平常不搶鋒頭，但關鍵時刻最靠得住。你知道害怕，但更知道下一步該做什麼。"
  },
  {
    id: "lvbu", name: "呂布", zi: "奉先", faction: "qun", life: "？－198", role: "guest", episode: "EP02",
    tags: ["人中呂布", "飛將"],
    oneLine: "武藝天下第一，卻因反覆換陣營而失去所有人信任。",
    history: [
      "先殺義父丁原投靠董卓，又和王允合謀殺了董卓。",
      "曾奪取兗州、徐州，最後在下邳被曹操擒住處死。",
      "「轅門射戟」是真的：他一箭射中遠處的戟，化解了劉備與袁術的衝突。",
      "有名馬赤兔，時人說「人中有呂布，馬中有赤兔」。"
    ],
    myths: [
      { novel: "虎牢關「三英戰呂布」，劉關張聯手大戰呂布。", truth: "正史沒有這場戰鬥，是小說創作。" },
      { novel: "張飛罵他「三姓家奴」，還有貂蟬「連環計」。", truth: "這些都出自小說；正史只記載他和董卓的侍女私下往來。" }
    ],
    quizBlurb: "你實力超強、反應超快，但要記得：讓人放心把背後交給你，比贏過別人更重要。"
  },
  {
    id: "zhouyu", name: "周瑜", zi: "公瑾", faction: "wu", life: "175－210", role: "guest", episode: "EP03",
    tags: ["美周郎", "赤壁主帥"],
    oneLine: "赤壁之戰的真正主帥，正史形容他心胸寬大、氣度恢弘。",
    history: [
      "《三國志》說他「性度恢廓」，很能團結人心。",
      "赤壁之戰由他和程普統軍，採納黃蓋的詐降火攻之計，大敗曹操。",
      "精通音樂，演奏有錯一定會回頭看，有「曲有誤，周郎顧」之說。",
      "妻子是小喬；36 歲時在準備攻打益州的途中病逝。"
    ],
    myths: [
      { novel: "嫉妒諸葛亮，被「三氣」後吐血而死，臨終喊「既生瑜，何生亮」。", truth: "全是小說虛構，他是病逝的。" },
      { novel: "草船借箭、借東風都是諸葛亮的功勞。", truth: "火攻是周瑜和黃蓋策劃的；草船借箭的原型是孫權的船。" }
    ],
    quizBlurb: "你很有才華，也懂得欣賞別人的優秀。別人越強，你越想變得更好。"
  },
  {
    id: "guanyu", name: "關羽", zi: "雲長", faction: "shu", life: "？－220", role: "guest", episode: "EP04",
    tags: ["武聖", "萬人敵"],
    oneLine: "重義氣、守信用，卻也因太驕傲而大意失荊州。",
    history: [
      "被曹操俘虜後，在白馬斬顏良報恩，然後「盡封其所賜，拜書告辭」回到劉備身邊。",
      "水淹七軍、擒于禁，威震華夏。",
      "手臂中箭後「刮骨療毒」是真的，還一邊喝酒吃肉談笑。",
      "看不起盟友孫權、與後方守將不和，最後被呂蒙、陸遜偷襲失去荊州。"
    ],
    myths: [
      { novel: "過五關斬六將。", truth: "那六位守關將領在正史中查無此人。" },
      { novel: "溫酒斬華雄、華容道義釋曹操。", truth: "華雄是孫堅斬的；華容道放曹操也是小說創作。" },
      { novel: "幫他刮骨療毒的是華佗。", truth: "史書只說是「醫」，沒寫是誰，華佗當時可能已經過世。" }
    ],
    quizBlurb: "你超講信用、說到做到。要小心的是：再強的人，也要聽得進別人的提醒。"
  },
  {
    id: "zhangfei", name: "張飛", zi: "益德", faction: "shu", life: "？－221", role: "guest", episode: "EP05",
    tags: ["萬人敵", "長坂橋"],
    oneLine: "勇猛過人又講義氣，但脾氣暴躁、對部下缺乏體諒。",
    history: [
      "長坂坡斷後，他據水斷橋，瞪眼橫矛大喊：「身是張益德也，可來共決死！」曹軍沒人敢靠近。",
      "義釋嚴顏：敬佩對方的骨氣而放了他，還待為賓客。",
      "陳壽評他「暴而無恩」，最後被部下范彊、張達殺害。",
      "正史寫作「益德」，小說才寫成「翼德」。"
    ],
    myths: [
      { novel: "張飛怒鞭督郵。", truth: "正史裡動手打督郵的其實是劉備！" }
    ],
    quizBlurb: "你熱血、講義氣、超有行動力！練習在生氣時先深呼吸，你會變得更強大。"
  },
  {
    id: "sunquan", name: "孫權", zi: "仲謀", faction: "wu", life: "182－252", role: "guest", episode: "EP06",
    tags: ["吳大帝", "碧眼兒"],
    oneLine: "十八歲接掌江東，懂得用人，後來成為東吳的開國皇帝。",
    history: [
      "兄長孫策遇刺，臨終交代「內事不決問張昭，外事不決問周瑜」。",
      "赤壁戰前拔刀砍斷桌角：「再有人說要投降，就跟這張桌子一樣！」（《江表傳》）",
      "曹操看到他的軍容讚嘆：「生子當如孫仲謀。」",
      "重用周瑜、魯肅、呂蒙、陸遜，229 年稱帝。"
    ],
    myths: [
      { novel: "諸葛亮「舌戰群儒」「智激孫權」，孫權才決定抗曹。", truth: "是周瑜、魯肅的分析讓孫權下定決心，舌戰群儒是小說加工。" }
    ],
    quizBlurb: "你很年輕就扛起責任，懂得聽大家意見，在關鍵時刻勇敢做決定。"
  },
  {
    id: "liubei", name: "劉備", zi: "玄德", faction: "shu", life: "161－223", role: "guest", episode: "EP07",
    tags: ["蜀漢昭烈帝", "弘毅寬厚"],
    oneLine: "前半生一直打敗仗，卻總能讓頂尖人才死心塌地跟隨。",
    history: [
      "投靠過公孫瓚、陶謙、呂布、曹操、袁紹、劉表，屢敗屢戰。",
      "三顧茅廬是真的：「凡三往，乃見」，終於請到諸葛亮。",
      "陳壽評他「弘毅寬厚，知人待士」；他也會親自上陣，還親手鞭打過督郵。",
      "夷陵之戰被陸遜火燒連營，退回白帝城，臨終託孤給諸葛亮。"
    ],
    myths: [
      { novel: "趙雲救回阿斗，劉備把孩子摔在地上收買人心。", truth: "「摔阿斗」是小說加工。" },
      { novel: "劉關張「桃園三結義」。", truth: "正史說三人「恩若兄弟」，但沒有結拜儀式的記載。" }
    ],
    quizBlurb: "你可能不是最厲害的那個，但你真誠、守信用，大家都願意陪你重新開始。"
  },
  {
    id: "simayi", name: "司馬懿", zi: "仲達", faction: "wei", life: "179－251", role: "guest", episode: "EP08",
    tags: ["沉得住氣", "晉朝奠基者"],
    oneLine: "三國最會沉住氣的人，靠耐心熬過所有對手。",
    history: [
      "五丈原和諸葛亮對峙，堅守不戰，拖垮蜀軍的糧草。",
      "諸葛亮送來女人衣服羞辱他，他照樣冷靜，還問使者諸葛亮吃多少、睡多少。",
      "晚年裝病裝糊塗騙過曹爽，再發動高平陵之變掌握大權。",
      "孫子司馬炎後來建立晉朝，結束三國。"
    ],
    myths: [
      { novel: "被諸葛亮的「空城計」嚇退十五萬大軍。", truth: "當時司馬懿正在千里外討伐孟達，根本不在現場。" }
    ],
    quizBlurb: "你很有耐心、看得很遠。別人急著搶第一，你懂得等待最好的時機。"
  },
  {
    id: "luxun", name: "陸遜", zi: "伯言", faction: "wu", life: "183－245", role: "guest", episode: "EP09",
    tags: ["書生大都督", "火燒連營"],
    oneLine: "被老將看不起的年輕書生，用冷靜和耐心打贏夷陵之戰。",
    history: [
      "寫信給關羽，故意把自己說得很謙卑，讓關羽放鬆戒備，為呂蒙奪荊州鋪路。",
      "夷陵之戰堅守半年不出，等蜀軍疲憊，再用火攻攻破四十多座營寨。",
      "老將們不服，他按著劍說：「僕雖書生，受命主上。」——「書生」是他的自稱。"
    ],
    myths: [
      { novel: "追擊劉備時被諸葛亮的「八陣圖」困住。", truth: "小說虛構；正史是陸遜擔心曹魏偷襲，主動收兵。" }
    ],
    quizBlurb: "就算被看輕，你也不急著辯解，而是冷靜把事情做好，讓結果替你說話。"
  },
  {
    id: "caocao", name: "曹操", zi: "孟德", faction: "wei", life: "155－220", role: "host", episode: "EP10",
    tags: ["主持人", "唯才是舉", "詩人"],
    oneLine: "節目主持人之一。統一北方的政治家、軍事家，也是傑出的詩人。",
    history: [
      "二十歲時被推舉為「孝廉」，開始當官（《三國志・武帝紀》）。",
      "多次下《求賢令》，主張「唯才是舉」，不看出身只看能力。",
      "官渡之戰以少勝多打敗袁紹，統一北方。",
      "赤壁之戰敗給孫劉聯軍。",
      "寫下〈短歌行〉〈觀滄海〉等名作，「對酒當歌，人生幾何」就是他的句子。"
    ],
    myths: [
      { novel: "說出「寧教我負天下人，休教天下人負我」。", truth: "史料原句是「寧我負人，毋人負我」，而且只見於注引的野史，小說把它放大改寫了。" }
    ],
    quizBlurb: "你眼光精準、愛才惜才，看到有能力的人就想拉進團隊！"
  },
  {
    id: "zhugeliang", name: "諸葛亮", zi: "孔明", faction: "shu", life: "181－234", role: "host", episode: "",
    tags: ["主持人", "臥龍", "蜀漢丞相"],
    oneLine: "節目主持人之一。蜀漢丞相，以〈隆中對〉和〈出師表〉聞名。",
    history: [
      "劉備三顧茅廬，他提出〈隆中對〉，規劃天下三分。",
      "劉備說：「孤之有孔明，猶魚之有水也。」",
      "治理蜀漢賞罰分明，多次北伐，最後病逝於五丈原。"
    ],
    myths: [
      { novel: "草船借箭、借東風、空城計、七星燈續命。", truth: "這些都是小說為了突顯他的神機妙算而創作的。" }
    ],
    quizBlurb: "你喜歡把事情想清楚、規劃周全，是大家最信任的軍師。"
  },
  {
    id: "xiaoqiao", name: "小喬", zi: "", faction: "wu", life: "生卒不詳", role: "host", episode: "",
    tags: ["主持人", "周瑜之妻"],
    oneLine: "節目主持人之一。正史只留下一句「瑜納小橋」，連本名都不知道。",
    history: [
      "《三國志・周瑜傳》記載：孫策娶大喬，周瑜娶小喬。",
      "史書原本寫作「橋」，後人才寫成「喬」。",
      "唐朝杜牧寫「銅雀春深鎖二喬」，宋朝蘇軾寫「遙想公瑾當年，小喬初嫁了」。"
    ],
    myths: [
      { novel: "曹操發動赤壁之戰，是為了搶二喬。", truth: "這是小說和詩人的想像，正史沒有這種說法。" }
    ],
    quizBlurb: ""
  }
];

/* ---------------- 📖 成語 / 名句 ---------------- */
const IDIOMS = [
  {
    id: "wangmei", word: "望梅止渴", sourceType: "other", source: "《世說新語》",
    meaning: "用空想來安慰自己，暫時滿足願望。",
    story: "曹操行軍時找不到水，士兵口渴得走不動。曹操說：「前面有一大片梅林，梅子又酸又甜！」士兵一聽口水直流，撐到了有水源的地方。",
    example: "考試前一直想著放假要去哪裡玩，簡直是望梅止渴。",
    people: ["caocao"], episode: "SP01"
  },
  {
    id: "peile", word: "賠了夫人又折兵", sourceType: "novel", source: "《三國演義》",
    meaning: "想占便宜，結果不但沒得到，反而損失更多。",
    story: "孫權想用妹妹當誘餌把劉備騙來扣留，換回荊州，沒想到劉備娶了孫夫人還平安脫身，追兵也被打敗。正史中孫劉聯姻是真的，但美人計、錦囊、甘露寺相親都是小說虛構。",
    example: "他想偷懶抄作業，結果被老師抓到還要重寫兩次，真是賠了夫人又折兵。",
    people: ["sunquan", "liubei"], episode: "SP01"
  },
  {
    id: "lebusishu", word: "樂不思蜀", sourceType: "history", source: "《三國志》注引《漢晉春秋》",
    meaning: "形容快樂得忘了回家，或忘了根本。",
    story: "蜀漢滅亡後，劉禪被帶到洛陽。司馬昭問他：「很想念蜀國吧？」劉禪說：「此間樂，不思蜀。」",
    example: "表弟到遊樂園玩得樂不思蜀，叫了好幾次都不肯回家。",
    people: ["liubei"], episode: "SP01"
  },
  {
    id: "sangu", word: "三顧茅廬", sourceType: "history", source: "《三國志・諸葛亮傳》、〈出師表〉",
    meaning: "誠心誠意地一再邀請。",
    story: "劉備想請諸葛亮出山，前後去了三次才見到他。諸葛亮在〈出師表〉也寫：「先帝……三顧臣於草廬之中。」",
    example: "社長三顧茅廬，終於請到學姐回來指導社團。",
    people: ["liubei", "zhugeliang"], episode: "EP07"
  },
  {
    id: "yushui", word: "如魚得水", sourceType: "history", source: "《三國志・諸葛亮傳》",
    meaning: "遇到和自己非常投合的人或環境。",
    story: "劉備和諸葛亮越來越親近，關羽張飛不太高興。劉備說：「孤之有孔明，猶魚之有水也。」",
    example: "他轉到美術班後如魚得水，每天都很開心。",
    people: ["liubei", "zhugeliang"], episode: "EP07"
  },
  {
    id: "yishendan", word: "一身是膽", sourceType: "history", source: "《三國志》注引《趙雲別傳》",
    meaning: "形容膽量極大、非常勇敢。",
    story: "漢水之戰，趙雲大開營門、偃旗息鼓，曹軍以為有埋伏而退。劉備隔天去看，讚嘆：「子龍一身都是膽也。」",
    example: "消防員衝進火場救人，真是一身是膽。",
    people: ["zhaoyun"], episode: "EP01"
  },
  {
    id: "guamu", word: "刮目相看", sourceType: "history", source: "《三國志》注引《江表傳》",
    meaning: "別人已經進步了，要用新的眼光看待他。",
    story: "呂蒙原本不愛讀書，在孫權勸說下發憤苦讀。魯肅和他聊天後大吃一驚，呂蒙說：「士別三日，即更刮目相待。」後來呂蒙和陸遜聯手奪下荊州。",
    example: "他暑假每天練琴，開學後的表演讓大家刮目相看。",
    people: ["sunquan", "guanyu", "luxun"], episode: "EP04"
  },
  {
    id: "dayi", word: "大意失荊州", sourceType: "other", source: "俗語（由史實而來）",
    meaning: "因為粗心大意而造成重大失敗。",
    story: "關羽北上攻打樊城，看不起東吳，後方防備鬆懈，被呂蒙「白衣渡江」偷襲，丟了荊州。",
    example: "最後一題以為很簡單沒檢查，結果大意失荊州。",
    people: ["guanyu", "luxun"], episode: "EP04"
  },
  {
    id: "jisheng", word: "既生瑜，何生亮", sourceType: "novel", source: "《三國演義》第五十七回",
    meaning: "感嘆有了自己，為什麼還要有一個比自己更強的對手。",
    story: "小說寫周瑜被諸葛亮三次氣到，臨死仰天長嘆這句話。但正史中周瑜心胸寬廣，是在準備出兵時病逝的。",
    example: "（使用時要知道：這句話是小說幫周瑜「加的台詞」喔！）",
    people: ["zhouyu", "zhugeliang"], episode: "EP03"
  },
  {
    id: "gukou", word: "周郎顧曲", sourceType: "history", source: "《三國志・周瑜傳》",
    meaning: "形容精通音樂、懂得欣賞。",
    story: "周瑜年輕時就精通音樂，就算喝了酒，聽到演奏有錯也一定會回頭看，當時人說：「曲有誤，周郎顧。」",
    example: "音樂老師一聽就知道哪裡彈錯，真有周郎顧曲的本事。",
    people: ["zhouyu"], episode: "EP03"
  },
  {
    id: "weicai", word: "唯才是舉", sourceType: "history", source: "曹操〈求賢令〉（《三國志・武帝紀》）",
    meaning: "只要有才能，就推舉任用，不看出身和名聲。",
    story: "西元 210 年，曹操發布〈求賢令〉，說「唯才是舉，吾得而用之」。後來他又多次下令：就算名聲不完美，只要有真本事，都歡迎來魏國做事。在重視家世的漢末，這是很大膽的人才政策。",
    example: "選班級幹部應該唯才是舉，而不是只投給好朋友。",
    people: ["caocao"], episode: "SP02"
  },
  {
    id: "shangpin", word: "上品無寒門，下品無勢族", sourceType: "history", source: "《晉書・劉毅傳》",
    meaning: "好評價全給了名門世家，出身平凡的人再優秀也很難出頭。",
    story: "曹丕當上皇帝時，採用陳群的建議設立「九品中正制」，由中正官把人才評成九個等級。本來是想公平選才，後來評等越來越看家世。西晉大臣劉毅批評：「上品無寒門，下品無勢族。」",
    example: "如果比賽只看你爸媽是誰，那就變成「上品無寒門，下品無勢族」了。",
    people: ["caocao"], episode: "SP02"
  },
  {
    id: "mingluo", word: "名落孫山", sourceType: "other", source: "宋・范公偁《過庭錄》",
    meaning: "考試或選拔沒有被錄取。",
    story: "宋朝有個叫孫山的人去考試，排在錄取榜的最後一名。同鄉託他帶兒子一起去考，回來問結果，孫山說：「解名盡處是孫山，賢郎更在孫山外。」意思是：榜單最後一名是我，你兒子在我後面——沒考上。這是宋朝的故事，跟三國沒有關係喔！",
    example: "他這次科展名落孫山，但決定明年再挑戰。",
    people: [], episode: "SP02"
  },
  {
    id: "liangcao", word: "兵馬未動，糧草先行", sourceType: "other", source: "俗語（古代兵法常理）",
    meaning: "出兵打仗前必須先準備並運送糧食與物資；做事前先把後勤和準備工作做好。",
    story: "軍隊行軍前要由輜重部隊押運糧草。漢末士兵隨身攜帶的乾糧叫「糗糧（炒麵）」，是把小麥或小米炒熟磨粉，加冷水攪成糊就能吞下；大軍駐紮、糧車趕到時，火頭軍才煮小米飯、燉豆子或醃肉。官渡之戰曹操燒掉袁紹在烏巢的糧草，袁軍還沒被正面打垮就潰散了。",
    example: "舉辦校外教學前要先確認便當、飲水和路線，「兵馬未動，糧草先行」才不會手忙腳亂。",
    people: ["caocao"], episode: "QA01"
  },
  {
    id: "zhengedaidan", word: "枕戈待旦", sourceType: "other", source: "《晉書・劉琨傳》",
    meaning: "枕著兵器等待天亮，形容時刻保持戒備、不敢鬆懈。",
    story: "漢末三國士兵的鐵製札甲重達二十多公斤，在後方安全時可以脫下休息；但進入前線交戰區隨時可能被夜襲，就必須穿戴全套盔甲、抱著武器坐著打盹，連鞋子都不能脫。後來《晉書》記錄劉琨寫信說自己「枕戈待旦」，成為形容戰備警戒的成語。",
    example: "明天就是決賽了，我們今晚把資料檢查好、枕戈待旦，全力以赴！",
    people: ["zhaoyun", "zhugeliang"], episode: "QA01"
  },
  {
    id: "guisheng", word: "兵貴勝，不貴久", sourceType: "other", source: "《孫子兵法・作戰篇》",
    meaning: "打仗與做事重點在迅速達成目標、解決問題，最忌拖延過久消耗資源與士氣。",
    story: "《孫子兵法・作戰篇》幫軍隊算了一筆帳：十萬大軍每天糧草、車馬維修消耗龐大，戰事拖久了士兵疲憊、物價大漲，再強的國家也會被拖垮，因此強調「兵貴勝，不貴久」。",
    example: "複習功課最怕拖延，專心把題目一次弄懂，「兵貴勝，不貴久」，就能早點去休息。",
    people: ["caocao"], episode: "SB01"
  },
  {
    id: "chubuyi", word: "攻其無備，出其不意", sourceType: "other", source: "《孫子兵法・始計篇》",
    meaning: "趁對手還沒防備、沒有預料到的時候行動，就能掌握主動權（也常說「出其不意，攻其不備」）。",
    story: "孫武在《始計篇》提醒「兵者，詭道也」，打仗要先「計算」對手的弱點，強的時候假裝弱、近的時候讓對方以為還遠，「攻其無備，出其不意」才不會跟人硬碰硬。",
    example: "我們隊伍調整了傳球戰術，趁對手還在觀察時攻其無備，一下子就先馳得點。",
    people: ["caocao", "zhugeliang"], episode: "SB01"
  },
  {
    id: "dongshan", word: "東山再起", sourceType: "history", source: "《晉書・謝安傳》",
    meaning: "原本退隱或失勢的人，經過沉潛等待後，再次回到重要職位、重新站上舞台。",
    story: "東晉名相謝安年輕時辭官隱居在會稽東山，大家都在等他出山幫忙。後來國家面臨危機，他重新擔任宰相，並在淝水之戰帶領東晉以少勝多，留下「東山再起」這句成語。",
    example: "他在這次比賽失利後沒有放棄，花半年重新調整節奏，明年果然東山再起拿下冠軍！",
    people: ["simayi"], episode: "SP03"
  }
];

/* ---------------- 🔍 故事史實查核 ---------------- */
const STORIES = [
  { id: "changban", title: "趙雲長坂坡救阿斗", verdict: "true", people: ["zhaoyun"], episode: "EP01",
    novel: "趙雲單騎在曹軍中殺進殺出，懷抱阿斗突圍。", history: "《趙雲傳》記載他「身抱弱子」，保護劉禪與甘夫人脫險。只有一句話，但是真的！" },
  { id: "qijin", title: "趙雲七進七出、斬將五十餘員", verdict: "fiction", people: ["zhaoyun"], episode: "EP01",
    novel: "趙雲在長坂坡七進七出，砍倒曹營名將五十多人。", history: "正史完全沒有這些細節，是小說為了讓場面更熱血而加的。" },
  { id: "yuanmen", title: "呂布轅門射戟", verdict: "true", people: ["lvbu", "liubei"], episode: "EP02",
    novel: "呂布說若一箭射中遠處的戟，雙方就罷兵，結果真的射中。", history: "《呂布傳》確實有記載，他用這招化解了袁術攻打劉備的危機。" },
  { id: "sanying", title: "三英戰呂布", verdict: "fiction", people: ["lvbu", "liubei", "guanyu", "zhangfei"], episode: "EP02",
    novel: "虎牢關前，劉備、關羽、張飛三兄弟聯手大戰呂布。", history: "正史沒有這場戰鬥，是小說創作。" },
  { id: "chibi", title: "赤壁之戰用火攻打敗曹操", verdict: "true", people: ["zhouyu", "caocao"], episode: "EP03",
    novel: "諸葛亮借東風，周瑜火燒赤壁。", history: "火攻是真的，由周瑜統軍、黃蓋詐降放火。但「借東風」是小說讓諸葛亮搶戲。" },
  { id: "caochuan", title: "諸葛亮草船借箭", verdict: "adapted", people: ["zhugeliang", "zhouyu", "sunquan"], episode: "EP03",
    novel: "諸葛亮在大霧中派草船靠近曹營，騙到十萬支箭。", history: "原型是孫權：他坐大船去看曹軍，船一邊中箭太多快翻了，就調頭讓另一邊也中箭（《魏略》）。是孫權的事，也不是故意借箭。" },
  { id: "wuguan", title: "關羽過五關斬六將", verdict: "fiction", people: ["guanyu", "caocao"], episode: "EP04",
    novel: "關羽離開曹營時一路闖關，殺了六名守將。", history: "正史中曹操說「彼各為其主，勿追也」，讓關羽平安離開。" },
  { id: "wenjiu", title: "關羽溫酒斬華雄", verdict: "fiction", people: ["guanyu"], episode: "EP04",
    novel: "關羽出戰前曹操倒了杯熱酒，酒還沒涼就斬了華雄。", history: "正史中斬華雄的是孫堅（孫權的爸爸）。" },
  { id: "guagu", title: "關羽刮骨療毒", verdict: "true", people: ["guanyu"], episode: "EP04",
    novel: "華佗為關羽刮骨，關羽一邊下棋一邊忍痛。", history: "刮骨療毒是真的，關羽還一邊喝酒吃肉談笑；但醫生沒寫名字，不是華佗。" },
  { id: "bianduyou", title: "張飛怒鞭督郵", verdict: "adapted", people: ["zhangfei", "liubei"], episode: "EP05",
    novel: "督郵勒索劉備，張飛氣得把他綁在樹上鞭打。", history: "鞭打督郵是真的，但動手的是劉備本人！小說改到張飛頭上。" },
  { id: "duanqiao", title: "張飛據水斷橋喝退曹軍", verdict: "true", people: ["zhangfei"], episode: "EP05",
    novel: "張飛站在長坂橋上一聲大吼，嚇死曹將夏侯傑。", history: "據水斷橋、大喊「可來共決死」是真的；嚇死人則是小說加的。" },
  { id: "kanan", title: "孫權拔刀砍桌決定抗曹", verdict: "true", people: ["sunquan"], episode: "EP06",
    novel: "孫權拔劍砍下桌角，宣布要和曹操決戰。", history: "記載在《江表傳》中，是真實的史料記錄。" },
  { id: "shezhan", title: "諸葛亮舌戰群儒", verdict: "fiction", people: ["zhugeliang", "sunquan"], episode: "EP06",
    novel: "諸葛亮到東吳，把一群主張投降的文臣一一辯倒。", history: "諸葛亮確實出使東吳，但舌戰群儒的場面是小說創作。" },
  { id: "shuaidou", title: "劉備摔阿斗", verdict: "fiction", people: ["liubei", "zhaoyun"], episode: "EP07",
    novel: "劉備把趙雲救回的阿斗摔在地上：「為了你這孩子，差點損我一員大將！」", history: "正史沒有這件事，是小說的藝術加工。" },
  { id: "sangu", title: "劉備三顧茅廬", verdict: "true", people: ["liubei", "zhugeliang"], episode: "EP07",
    novel: "劉備冒著風雪去了三次，終於見到諸葛亮。", history: "「凡三往，乃見」——去三次是真的；風雪等細節是小說加的。" },
  { id: "kongcheng", title: "諸葛亮空城計", verdict: "fiction", people: ["zhugeliang", "simayi"], episode: "EP08",
    novel: "諸葛亮大開城門在城樓彈琴，嚇退司馬懿十五萬大軍。", history: "當時司馬懿在千里外的新城討伐孟達，兩人根本沒碰面。" },
  { id: "jinguo", title: "諸葛亮送女裝羞辱司馬懿", verdict: "true", people: ["simayi", "zhugeliang"], episode: "EP08",
    novel: "諸葛亮送來女人的衣服，罵司馬懿不敢出戰。", history: "正史有載！司馬懿照樣堅守不戰，拖垮蜀軍。" },
  { id: "baizhentu", title: "陸遜被困八陣圖", verdict: "fiction", people: ["luxun", "zhugeliang"], episode: "EP09",
    novel: "陸遜追擊劉備，誤入石頭陣出不來，靠黃承彥帶路脫困。", history: "小說虛構。陸遜是擔心曹魏偷襲而主動收兵。" },
  { id: "huoshao", title: "陸遜火燒連營", verdict: "true", people: ["luxun", "liubei"], episode: "EP09",
    novel: "陸遜放火燒毀劉備七百里連營。", history: "正史記載他命士兵「各持一把茅」火攻，攻破四十多座營寨。" },
  { id: "anjian", title: "陸遜按劍訓諸將", verdict: "true", people: ["luxun"], episode: "EP09",
    novel: "老將們不服年輕的陸遜。", history: "陸遜按劍說「僕雖書生，受命主上」，要大家服從軍令。是真的！" },
  { id: "meirenji", title: "孫權美人計、甘露寺相親", verdict: "adapted", people: ["sunquan", "liubei"], episode: "SP01",
    novel: "孫權假裝嫁妹，想騙劉備來扣留，結果被諸葛亮的錦囊破解。", history: "孫權把妹妹嫁給劉備是真的政治聯姻；美人計、錦囊、甘露寺都是小說虛構。" },
  /* claimLabel：這則說法不是出自小說時，用來取代「小說這樣演」的標題 */
  { id: "xiaolian", title: "曹操是靠『舉孝廉』當上官的", verdict: "true", people: ["caocao"], episode: "SP02", claimLabel: "常見說法",
    novel: "漢朝沒有考試，是由地方官推薦「孝順又清廉」的人去當官。", history: "《三國志・武帝紀》：「年二十，舉孝廉為郎。」是真的！不過到了東漢末年，推薦常變成看關係、看家世，當時還有順口溜諷刺「察孝廉，父別居」。" },
  { id: "qiuxian", title: "曹操公開徵才：品德有缺點也沒關係", verdict: "true", people: ["caocao"], episode: "SP02", claimLabel: "常見說法",
    novel: "曹操下令：只要有本事，就算名聲不好也可以來應徵。", history: "是真的！曹操從 210 年起多次下〈求賢令〉，甚至說就算「不仁不孝」，只要有治國用兵的本事都要推薦上來。" },
  { id: "jiupin", title: "曹丕用『九品中正制』選人才", verdict: "true", people: ["caocao"], episode: "SP02", claimLabel: "常見說法",
    novel: "曹操的兒子曹丕把人才評成九個等級來選官。", history: "是真的！220 年曹丕採用陳群的建議設立九品中正制。但後來越來越看家世，變成「上品無寒門，下品無勢族」。" },
  { id: "keju", title: "三國時代用『科舉考試』選官員", verdict: "fiction", verdictText: "沒這回事", people: [], episode: "SP02", claimLabel: "常見誤會",
    novel: "古裝劇裡三國的人也要進京趕考、考狀元。", history: "別演了！科舉是隋朝才開始、唐朝才發揚光大的，三國時代完全沒有科舉考試。「名落孫山」更是宋朝的故事。" },
  { id: "tuxian", title: "許攸來投降，曹操光著腳跑出去迎接", verdict: "adapted", verdictText: "有出處，但不是正史正文", people: ["caocao"], episode: "EP10", claimLabel: "常見說法",
    novel: "官渡之戰打到最緊張的時候，袁紹的謀士許攸半夜跑來投降，曹操高興到連鞋子都來不及穿，光著腳衝出帳篷迎接。", history: "這段出自裴松之注引的《曹瞞傳》，不是《三國志》正文。《曹瞞傳》是吳國人寫的，常常專挑曹操的糗事來寫，所以聽聽就好，記得它的出處。" },
  { id: "fenxin", title: "曹操燒掉部下寫給袁紹的信", verdict: "true", people: ["caocao"], episode: "EP10", claimLabel: "常見說法",
    novel: "官渡之戰打贏後，士兵搜出一大箱部下偷偷寫給袁紹的信，曹操看都沒看就一把火燒掉。", history: "是真的！《三國志・武帝紀》記載曹操在袁紹的文書裡找到許都和軍中的人寫的信，全部燒掉。裴松之注引《魏氏春秋》還記下他說的話：「當紹之強，孤猶不能自保，而況眾人乎！」——袁紹那麼強的時候，連我都不確定能不能撐住，何況是大家呢？" },
  { id: "lvboshe", title: "曹操誤殺呂伯奢一家", verdict: "adapted", people: ["caocao"], episode: "EP10",
    novel: "曹操逃難時借住呂伯奢家，聽見磨刀聲以為要害他，殺了全家，才發現人家是要殺豬請他吃飯；離開時在路上遇見買酒回來的呂伯奢，也把他殺了。", history: "《三國志》正文沒有記載這件事，只有裴松之注引了三種說法，而且說法不一：《魏書》說是呂家的人想搶曹操的東西，《世語》和孫盛《雜記》說是曹操起疑心才動手。路上殺掉呂伯奢本人，是《三國演義》第 4 回加上去的。" },
  { id: "ningwo", title: "曹操說『寧教我負天下人，休教天下人負我』", verdict: "adapted", people: ["caocao"], episode: "EP10",
    novel: "曹操殺錯人以後說：「寧教我負天下人，休教天下人負我！」", history: "這句話出自裴松之注引的孫盛《雜記》，原句是「寧我負人，毋人負我」，意思是寧可我對不起別人，也不要讓別人對不起我。《三國演義》把「人」放大成「天下人」，讓曹操看起來更壞。" },
  { id: "chitu", title: "赤兔馬被曹操送給關羽，最後絕食而死", verdict: "adapted", people: ["lvbu", "guanyu", "caocao"], episode: "QA01",
    novel: "《三國演義》寫呂布死後，曹操為了拉攏關羽把赤兔馬送給他；後來關羽過世、馬被東吳奪走，竟不吃草料絕食而死。", history: "赤兔馬是真的！《三國志・呂布傳》記載「布有良馬曰赤兔」，裴松之注引《曹瞞傳》也記下時人流傳「人中有呂布，馬中有赤兔」。不過正史沒有記載曹操把赤兔馬送給關羽，也沒有絕食而死的故事，那是《三國演義》為了襯托英雄忠義所做的經典改編。" },
  { id: "yinfu", title: "三國時代用『一首詩當密碼本』傳軍情", verdict: "fiction", verdictText: "時代不對喔", people: ["zhugeliang"], episode: "QA01", claimLabel: "常見誤會",
    novel: "古代打仗怕密信被偷看，諸葛亮會用一首四十個字的詩當密碼本，每個字代表不同的戰況。", history: "用一首四十個字的五言詩當成軍用密碼表的「字驗」，是北宋兵書《武經總要》才記載的方法，三國時期還沒有！《六韜》記載的古代軍用密信「陰符」，是用八種不同長短的竹條或符節代表大勝、請兵等軍情，連信使自己都看不懂。" },
  { id: "menzhonghuo", title: "曹操在花園大門寫『活』字，嫌門蓋太大", verdict: "adapted", verdictText: "出自《世說新語》", people: ["caocao"], episode: "QA01", claimLabel: "民間故事",
    novel: "工匠幫曹操蓋好花園大門請他驗收，曹操沒說話，只在門上寫了個「活」字就走。楊修一看就懂：門裡面加個活就是「闊」字，意思是嫌門蓋得太寬了！", history: "這個機智猜謎出自南朝《世說新語・捷悟》篇（《三國演義》也有採用），屬於後人流傳的筆記趣聞，並不是陳壽《三國志》正史的記載。" },
  { id: "sunwu-era", title: "孫武是三國時代的軍師嗎？", verdict: "fiction", verdictText: "早了七百年", people: ["caocao"], episode: "SB01", claimLabel: "常見誤會",
    novel: "三國人物常常引用《孫子兵法》，有人因此以為孫武也是三國時期的軍事家。", history: "不是喔！孫武是春秋末期的人，比三國早了約七百年。曹操非常喜歡讀《孫子兵法》，還親自替它寫了現存最早的註釋本《孫子略解》。" },
  { id: "guandu-odds", title: "官渡之戰時，袁紹的兵力約是曹操的五倍", verdict: "true", people: ["caocao"], episode: "SB01", claimLabel: "史實提醒",
    novel: "袁紹兵強馬壯南下攻打曹操，許多人都以為曹操兵力太少撐不住。", history: "是真的！官渡之戰時袁紹擁有四州兵馬，兵力約是曹操的五倍，但曹操先用計算與判斷分散敵軍、再奇襲烏巢糧倉，成功以少勝多。" },
  { id: "sunbin-stove", title: "孫臏『減灶誘敵』，故意少砌爐灶把龐涓引進埋伏圈", verdict: "true", people: [], episode: "SB01", claimLabel: "兵法典故",
    novel: "齊國軍師孫臏與魏將龐涓交戰時，每天刻意減少軍營裡煮飯用的爐灶數量，裝作士兵大量逃亡。", history: "《史記・孫子吳起列傳》確實有記載！第一天十萬灶、第二天五萬灶、第三天三萬灶，龐涓果然上當只帶輕騎兵追擊，最後中伏大敗，正是《孫子兵法》「能而示之不能」的經典運用。" },
  { id: "duomen", title: "明英宗被弟弟關了七年，後來撞門搶回皇位、當了兩次皇帝", verdict: "true", people: [], episode: "SP03", claimLabel: "正史記載",
    novel: "皇帝在打仗時被抓走，回國後反而被繼位的弟弟關進南宮鎖了七年，最後趁夜撞門重新坐回龍椅！", history: "這是《明史・英宗本紀》記載的真實歷史！1449 年明英宗在土木堡之變被俘，弟弟景泰帝繼位；隔年放回後卻被軟禁南宮近七年，直到 1457 年景泰帝重病，大臣趁夜撞門扶他復辟（「奪門之變」），改元天順，成為明朝唯一兩度登基的皇帝。" },
  { id: "shenlong", title: "唐中宗當皇帝才五十幾天就被母親武則天廢掉，二十多年後又被大臣請回來", verdict: "true", people: [], episode: "SP03", claimLabel: "正史記載",
    novel: "剛繼位的皇帝被自己媽媽廢掉流放十幾年，直到二十多年後大臣發動政變，才又迎回長安恢復大唐國號。", history: "《舊唐書・中宗本紀》與《資治通鑑》都有記載！684 年唐中宗李顯剛即位約五十餘日便被武則天廢為廬陵王；直到 705 年武則天病重，宰相張柬之等發動「神龍政變」迎回李顯復位。可惜他回來後仍沒管好內部亂象，數年後再度出事。" },
  { id: "fupi-12days", title: "清朝最後一位皇帝溥儀退位五年後曾經復辟，但只撐了十二天", verdict: "true", people: [], episode: "SP03", claimLabel: "近代史實",
    novel: "民國建立好幾年之後，突然有人帶兵把已經退位的溥儀重新推上龍椅，結果不到半個月就垮台。", history: "是真的！1917 年 7 月 1 日軍閥張勳衝進北京擁立溥儀復辟，因全國反彈與各路軍隊討伐，到 7 月 12 日便宣告失敗，前後僅僅十二天（史稱「張勳復辟」）。" },
  { id: "gaopingling", title: "三國時代有皇帝被廢又復位？其實是司馬懿被架空後一夜奪回實權", verdict: "adapted", verdictText: "三國沒有皇帝復辟", people: ["simayi", "caocao"], episode: "SP03", claimLabel: "常見誤會",
    novel: "聽完歷代皇帝復辟，有人好奇《三國志》裡是不是也有皇帝下台後又重登大寶。", history: "正史《三國志》裡沒有皇帝二度登基喔！漢獻帝、曹芳、劉禪、孫亮等退位或被廢後都沒有再復位。不過西元 249 年，70 歲的司馬懿被曹爽架空成沒有兵權的「太傅」，最後趁對方出城掃墓發動「高平陵之變」，一天之內奪回曹魏軍政大權（見《三國志・齊王紀》《晉書・宣帝紀》）。" },
];

/* ---------------- 🗳️ 下一位來賓候選人 ---------------- */
const CANDIDATES = [
  { id: "huangzhong", name: "黃忠", faction: "shu", teaser: "七十歲還能定軍山斬夏侯淵？老當益壯的秘訣！" },
  { id: "machao", name: "馬超", faction: "shu", teaser: "錦馬超真的把曹操追到割鬚棄袍嗎？" },
  { id: "dianwei", name: "典韋", faction: "wei", teaser: "用生命守護曹操的貼身保鑣。" },
  { id: "huatuo", name: "華佗", faction: "qun", teaser: "神醫真的想幫曹操開腦嗎？" },
  { id: "diaochan", name: "貂蟬", faction: "qun", teaser: "四大美女之一……但她真的存在嗎？" },
  { id: "sunce", name: "孫策", faction: "wu", teaser: "小霸王打下江東，為什麼那麼年輕就走了？" },
  { id: "lusu", name: "魯肅", faction: "wu", teaser: "小說把他寫成老好人，正史卻是戰略高手！" },
  { id: "lvmeng", name: "呂蒙", faction: "wu", teaser: "從不讀書到讓人刮目相看，白衣渡江的主角。" },
  { id: "jiangwei", name: "姜維", faction: "shu", teaser: "諸葛亮的接班人，一個人扛起北伐。" },
  { id: "dongzhuo", name: "董卓", faction: "qun", teaser: "大反派也有話要說？" },
  { id: "liushan", name: "劉禪", faction: "shu", teaser: "「樂不思蜀」的阿斗，真的是扶不起嗎？" },
  { id: "guojia", name: "郭嘉", faction: "wei", teaser: "曹操最信任的天才軍師。" }
];

/* ---------------- 📋 題目看板 ---------------- */
const TOPICS = [
  { id: "t-sp03", type: "故事", title: "時事特輯 SP03：黃仁勳 11 天回歸 CEO vs 歷史上的皇帝歸位", status: "aired", episode: "SP03" },
  { id: "t-sb01", type: "故事", title: "孫子兵法 SB01：始計篇與作戰篇，開打前先學會按計算機", status: "aired", episode: "SB01" },
  { id: "t-qa01", type: "生活", title: "聽眾問答 QA01：軍營廁所、赤兔馬食量、盔甲多重", status: "aired", episode: "QA01" },
  { id: "t-yueying", type: "人物", title: "黃月英來作客：打破刻板印象、用實力說話", status: "recording", episode: "EP11" },
  { id: "t-caocao", type: "人物", title: "曹操坐上來賓椅：主持人反轉大審問", status: "aired", episode: "EP10" },
  { id: "t-food", type: "生活", title: "三國人每天吃什麼？有沒有刷牙？", status: "collecting" },
  { id: "t-diaochan", type: "故事", title: "貂蟬到底存不存在？", status: "collecting" },
  { id: "t-chibi-who", type: "故事", title: "赤壁之戰到底誰的功勞最大？", status: "collecting" },
  { id: "t-poem", type: "詩詞", title: "課本裡的三國詩詞：杜牧、蘇軾寫的是真的嗎？", status: "collecting" },
  { id: "t-idiom2", type: "成語", title: "成語第二彈：刮目相看、如魚得水、司馬昭之心", status: "collecting" },
  { id: "t-weapon", type: "生活", title: "青龍偃月刀、方天畫戟，三國真的有這些兵器嗎？", status: "collecting" },
  { id: "t-kongcheng", type: "故事", title: "空城計到底有沒有發生？", status: "aired", episode: "EP08" },
  { id: "t-caochuan", type: "故事", title: "草船借箭是誰的點子？", status: "aired", episode: "EP03" },
  { id: "t-sp01", type: "成語", title: "望梅止渴、樂不思蜀背後的故事", status: "aired", episode: "SP01" },
  { id: "t-sp02", type: "生活", title: "古代沒有投票箱，怎麼選出好官員？", status: "aired", episode: "SP02" }
];

/* ---------------- 🎭 你是哪位三國人物 ---------------- */
const PERSONA_QUIZ = [
  { q: "分組報告，大家都不想當組長，你會……", options: [
    { t: "我來！先幫大家分工。", p: ["sunquan", "liubei"] },
    { t: "我負責最難的部分，交給我。", p: ["zhaoyun", "guanyu"] },
    { t: "先觀察一下，等最好的時機再出手。", p: ["simayi", "luxun"] },
    { t: "誰的組最強，我就去哪一組！", p: ["lvbu"] } ] },
  { q: "朋友考得比你好，你心裡想……", options: [
    { t: "好厲害！我要問他怎麼讀的。", p: ["zhouyu", "liubei"] },
    { t: "哼，下次我一定贏回來！", p: ["lvbu", "zhangfei"] },
    { t: "沒關係，我照自己的步調慢慢來。", p: ["simayi"] },
    { t: "我會默默努力，讓大家刮目相看。", p: ["luxun", "sunquan"] } ] },
  { q: "被別人誤會的時候，你通常……", options: [
    { t: "當場大聲說清楚！", p: ["zhangfei", "guanyu"] },
    { t: "先冷靜，用行動證明自己。", p: ["luxun", "zhaoyun"] },
    { t: "笑笑不生氣，時間會證明一切。", p: ["simayi", "zhouyu"] },
    { t: "找大家一起聊聊，把話講開。", p: ["liubei", "sunquan"] } ] },
  { q: "你最喜歡的下課活動是……", options: [
    { t: "打球、跑步，動起來最開心！", p: ["zhangfei", "lvbu"] },
    { t: "彈琴、畫畫，做點有美感的事。", p: ["zhouyu"] },
    { t: "下棋、玩策略遊戲。", p: ["simayi", "luxun"] },
    { t: "和一大群朋友聊天。", p: ["liubei", "sunquan"] },
    { t: "幫老師或同學的忙。", p: ["zhaoyun", "guanyu"] } ] },
  { q: "朋友跟你借了東西一直沒還，你會……", options: [
    { t: "直接去要回來！", p: ["zhangfei", "lvbu"] },
    { t: "提醒一次，相信他會還。", p: ["guanyu", "liubei"] },
    { t: "先不說，看看他什麼時候想起來。", p: ["simayi"] },
    { t: "想一個不傷感情的方法提醒他。", p: ["zhouyu", "luxun", "sunquan"] } ] },
  { q: "如果你有一個超能力，你想要……", options: [
    { t: "永遠不會害怕。", p: ["zhaoyun"] },
    { t: "天下無敵的力量。", p: ["lvbu", "guanyu"] },
    { t: "看穿每個人在想什麼。", p: ["simayi", "zhouyu"] },
    { t: "讓大家都願意跟我一起努力。", p: ["liubei", "sunquan"] },
    { t: "生氣時能瞬間冷靜。", p: ["zhangfei", "luxun"] } ] },
  { q: "你最想聽到別人怎麼稱讚你？", options: [
    { t: "「有你在，我就放心了。」", p: ["zhaoyun", "liubei"] },
    { t: "「你說到做到，超有信用！」", p: ["guanyu"] },
    { t: "「你好有耐心，好沉得住氣。」", p: ["simayi", "luxun"] },
    { t: "「你好有才華，又很大方！」", p: ["zhouyu"] },
    { t: "「你超勇敢、超講義氣！」", p: ["zhangfei", "lvbu", "sunquan"] } ] }
];

/* ---------------- ⚔️ 你來當軍師（戰役抉擇） ----------------
   每場戰役 5 個左右的關鍵時刻；real: true 是當年真正的選擇。
   投票鍵：poll:<戰役id>-<步驟id>:<選項k>（例如 poll:guandu-1:b），不可改 id。
   places 座標用 400×300 的示意圖，不按比例；icon: city|capital|camp|grain|ford。
   map.arrows 第三格填 sides 的 key 或 "feint"（佯攻）；map.fx: [地點 id 或 [x, y], clash|fire|flag, 陣營]。 */
const BATTLES = [
  {
    id: "guandu", title: "官渡之戰", year: "西元 200 年（建安五年）",
    role: "caocao", foe: "袁紹", seal: "官渡之戰",
    sides: { cao: { name: "曹操軍", flag: "曹", color: "var(--wei)" }, yuan: { name: "袁紹軍", flag: "袁", color: "var(--qun)" } },
    status: "published",
    teaser: "兵比對手少很多、糧食快吃完了——換你當曹操，五個關鍵決定，你能以少勝多嗎？",
    introSay: { who: "caocao", say: "這一場我最有經驗了……不過這次換你來決定，我不劇透！" },
    intro: "東漢末年，北方最強的是袁紹，他擁有四個州、兵多糧足。曹操控制皇帝所在的許都，地盤小、兵也少。西元 200 年，袁紹大軍南下，雙方在黃河南岸的官渡決戰。現在，你就是曹操。",
    people: ["caocao", "guanyu"], episodes: ["EP04"],
    terrain: [
      { type: "mountains", at: [[44, 40, 12], [64, 36, 15], [86, 42, 11], [36, 214, 11], [54, 224, 15], [72, 232, 10]] },
      { type: "grass", at: [[112, 128], [262, 196], [300, 168], [96, 262], [282, 244], [244, 84], [372, 158]] },
      { type: "river", name: "黃河", label: 27, d: "M10 62 C 80 50, 140 78, 210 72 S 330 92, 392 118" }
    ],
    places: {
      liyang: { x: 318, y: 46, name: "黎陽", side: "yuan", icon: "city" },
      baima: { x: 312, y: 126, name: "白馬", side: "cao", icon: "city" },
      yanjin: { x: 170, y: 92, name: "延津", side: "", icon: "ford" },
      wuchao: { x: 236, y: 128, name: "烏巢", side: "yuan", icon: "grain" },
      yuanying: { x: 176, y: 150, name: "袁紹大營", side: "yuan", icon: "camp" },
      guandu: { x: 150, y: 190, name: "官渡", side: "cao", icon: "camp" },
      xu: { x: 196, y: 268, name: "許都", side: "cao", icon: "capital" }
    },
    steps: [
      {
        id: "1", place: "白馬", map: { focus: ["baima", "yanjin"], arrows: [["guandu", "yanjin", "feint"], ["yanjin", "baima", "cao"], ["liyang", "baima", "yuan"]], fx: [["baima", "clash"]] },
        scene: "袁紹派大將顏良包圍白馬城，守城的東郡太守劉延快撐不住了。你的兵比袁紹少很多，如果正面硬拚，很可能被袁紹的主力包圍。",
        q: "白馬快被攻破了，你要怎麼救？",
        options: [
          { k: "a", t: "全軍立刻衝去白馬，跟顏良正面對決！", who: "zhugeliang", say: "兵少還正面對撞，袁紹的主力一到，就變成以卵擊石了。" },
          { k: "b", t: "先假裝要從延津渡河、偷襲袁紹後方，等他分兵，再快速回頭救白馬。", who: "caocao", say: "嘿嘿，這招我熟。聲東擊西，讓對手自己把兵分散。", real: true },
          { k: "c", t: "白馬守不住了，乾脆放棄，保存實力。", who: "xiaoqiao", say: "那城裡的人怎麼辦？他們還在等主公來救耶。" }
        ],
        reveal: "曹操採用謀士荀攸的計策：先帶兵到延津，裝作要渡河繞到袁紹背後。袁紹果然分兵往西去攔。曹操趁機急行軍趕到白馬，派張遼、關羽打先鋒。關羽望見顏良的旗幟，騎馬衝進大軍之中擊敗顏良，白馬之圍就此解除。（那時關羽暫時在曹操陣營。）",
        source: "《三國志・武帝紀》《三國志・關羽傳》",
        lesson: "打不過全部，就想辦法讓對手分散。"
      },
      {
        id: "2", place: "延津", map: { focus: ["yanjin"], arrows: [["baima", "yanjin", "cao"], ["liyang", "yanjin", "yuan"]], fx: [["yanjin", "clash"]] },
        scene: "救下白馬後，你帶著白馬的百姓和物資車隊沿著黃河往西撤。袁紹派大將文醜，和當時投靠袁紹的劉備，帶著五六千名騎兵追上來。你身邊的騎兵還不到六百。",
        q: "追兵越來越近，你要怎麼辦？",
        options: [
          { k: "a", t: "大家快逃回營地，能跑多快就跑多快！", who: "xiaoqiao", say: "帶著一大串車子，跑得過騎兵嗎？我看很懸。" },
          { k: "b", t: "叫騎兵卸下馬鞍休息，把物資車隊留在路上當誘餌。", who: "caocao", say: "敵人看到滿地好東西，你猜他們會先打仗，還是先搶東西？", real: true },
          { k: "c", t: "原地排好陣形，跟他們拚了！", who: "zhugeliang", say: "六百對五六千……勇氣可嘉，但算術不太及格。" }
        ],
        reveal: "將領們都主張退回營地，荀攸卻說：這些物資正是用來引誘敵人的，怎麼能撤走！曹操讓騎兵解下馬鞍、放馬休息。袁紹的騎兵趕到後，看到物資就分散去搶。曹操等到時機成熟，一聲令下全體上馬，以不到六百騎打敗對方，文醜在這一戰中陣亡。",
        source: "《三國志・武帝紀》",
        lesson: "看穿對手想要什麼，就能讓他自己亂掉。"
      },
      {
        id: "3", place: "官渡", map: { focus: ["guandu", "yuanying"], arrows: [["yuanying", "guandu", "yuan"]], fx: [["guandu", "clash"]] },
        scene: "雙方在官渡對峙好幾個月。袁紹堆起土山、搭高樓往你的營裡射箭，大家走路都要頂著盾牌；你造出能拋石頭的「霹靂車」把高樓打垮。袁紹改挖地道，你就挖長溝擋住。可是——你的糧食快吃完了，士兵也累壞了。",
        q: "快撐不下去了，你要怎麼辦？",
        options: [
          { k: "a", t: "撤回許都，先保住根據地再說。", who: "xiaoqiao", say: "退回去是安全了，可是袁紹會乖乖放過你嗎？" },
          { k: "b", t: "先別慌，寫信和留守許都的荀彧商量，再咬牙撐一下。", who: "caocao", say: "我當年真的寫了這封信。最難的時候，要找對的人商量。", real: true },
          { k: "c", t: "孤注一擲，全軍衝出營地跟袁紹決戰！", who: "zhugeliang", say: "對方兵多糧足，最希望的就是你沉不住氣。" }
        ],
        reveal: "曹操真的動過撤退的念頭，寫信給荀彧商量。荀彧回信說：現在糧食雖然少，但還不像當年楚漢在滎陽、成皋相持那麼慘；雙方都撐到極限時，局面一定會出現變化，「此用奇之時，不可失也」——現在正是出奇制勝的時機，千萬不能錯過。曹操決定堅持下去。",
        source: "《三國志・荀彧傳》《三國志・武帝紀》",
        lesson: "最難熬的時候，往往也是轉機快來的時候。"
      },
      {
        id: "4", place: "烏巢", map: { focus: ["wuchao"], arrows: [["guandu", "wuchao", "cao"], ["yuanying", "guandu", "yuan"]], fx: [["wuchao", "fire"]] },
        scene: "就在這時，袁紹的謀士許攸跑來投靠你。他說：袁紹的糧車都屯在烏巢，由淳于瓊帶兵看守，只要派兵偷襲、燒掉糧草，袁軍很快就會自己垮掉。可是身邊的人都懷疑：這會不會是陷阱？",
        q: "要不要相信許攸？",
        options: [
          { k: "a", t: "太可疑了，不理他，繼續守營。", who: "zhugeliang", say: "謹慎是好事，但千載難逢的機會，也可能就這樣溜走了。" },
          { k: "b", t: "相信他！留人守營，自己親自帶五千人連夜偷襲烏巢。", who: "caocao", say: "這種關鍵時刻，老闆一定要親自上場。", real: true },
          { k: "c", t: "半信半疑，派一小隊人去試試看就好。", who: "xiaoqiao", say: "如果是真的，兵太少打不下來；如果是假的，還是白白損失。一半相信，兩邊都顧不好喔。" }
        ],
        reveal: "曹操身邊很多人懷疑，只有荀攸和賈詡勸他出兵。曹操留曹洪守大營，親自帶步兵和騎兵五千人連夜出發，天亮時趕到烏巢，擊敗淳于瓊，燒掉袁軍的糧草。袁紹派去攻打曹營的張郃、高覽，聽說烏巢失守，乾脆投降曹操。袁軍全面潰散，袁紹只帶著八百名騎兵渡過黃河逃走。",
        source: "《三國志・武帝紀》《三國志・袁紹傳》",
        lesson: "看準機會，就要全力出手。"
      },
      {
        id: "5", place: "官渡", map: { focus: ["guandu"], arrows: [["guandu", "liyang", "cao"]], fx: [["guandu", "flag", "cao"]] },
        scene: "打贏了！清點袁紹留下的東西時，士兵搬來一大疊信。打開一看，竟然有不少是你的部下和許都的官員，偷偷寫給袁紹的信——當時大家都以為你會輸。",
        q: "這些信，你要怎麼處理？",
        options: [
          { k: "a", t: "一封一封查清楚，把寫信的人都找出來處罰！", who: "xiaoqiao", say: "這樣一來，營裡每個人都會睡不著覺吧……" },
          { k: "b", t: "看都不看，全部燒掉。", who: "caocao", say: "袁紹那麼強的時候，連我都不知道能不能撐住，何況是大家呢？", real: true },
          { k: "c", t: "偷偷留起來，以後誰不聽話就拿出來。", who: "zhugeliang", say: "用把柄管人，大家只會怕你，不會真心跟著你。" }
        ],
        reveal: "根據《三國志》裴松之注引《魏氏春秋》，曹操把這些信全部燒掉，說：「當紹之強，孤猶不能自保，而況眾人乎！」意思是：袁紹那麼強的時候，連我都不確定能不能保住自己，何況是大家呢？原本心裡不安的人都放下心來，更願意跟著他。",
        source: "《三國志・武帝紀》裴松之注引《魏氏春秋》",
        lesson: "體諒別人一時的害怕，能換來真心的跟隨。"
      }
    ],
    myths: [
      { verdict: "adapted", claim: "《三國演義》這樣演", text: "關羽先斬顏良、再誅文醜，一個人包辦袁紹的兩員大將。",
        truth: "擊敗顏良的確實是關羽，《三國志・關羽傳》有記載；但文醜是在延津之戰中陣亡，史書沒有說是關羽殺的。" },
      { verdict: "adapted", claim: "常見說法", text: "袁紹七十萬大軍，曹操只有七萬，差了整整十倍。",
        truth: "《三國志・武帝紀》說袁紹挑選精兵十萬、騎兵一萬，曹操這邊「兵不滿萬」。不過裴松之認為曹軍不可能這麼少，這個數字可能寫得偏小。可以確定的是：曹操的兵比較少，但雙方實際差多少，史書沒有精確答案。" },
      { verdict: "adapted", verdictText: "有出處，但不是正史正文", claim: "常見說法", text: "許攸來投靠時，曹操高興到光著腳跑出去迎接。",
        truth: "這段出自裴松之注引的《曹瞞傳》，不是《三國志》正文。《曹瞞傳》是吳國人寫的，常常專挑曹操的糗事來寫，所以聽聽就好，記得它的出處。" }
    ],
    endings: [
      { min: 5, title: "你就是曹操本人吧？！", text: "五個決定都和曹操當年一模一樣。曹操：人才！這是人才啊！合約呢？" },
      { min: 3, title: "官渡名軍師", text: "大部分關鍵都被你抓到了，再差一點點，就能把袁紹的糧草燒個精光。" },
      { min: 0, title: "另類奇謀家", text: "你走了一條和曹操不一樣的路。歷史沒辦法重來，但想想看：如果照你的選法，結局會變成怎樣？" }
    ]
  },
  {
    id: "chibi", title: "赤壁之戰", year: "西元 208 年（建安十三年）",
    role: "zhouyu", foe: "曹操", seal: "赤壁之戰",
    sides: {
      cao: { name: "曹操軍", flag: "曹", color: "var(--wei)" },
      wu: { name: "孫權軍", flag: "吳", color: "var(--wu)" },
      liu: { name: "劉備軍", flag: "劉", color: "var(--shu)" }
    },
    status: "published",
    teaser: "曹操號稱八十萬大軍順江而下——換你當周瑜，五個關鍵決定，你能以少勝多、火燒赤壁嗎？",
    introSay: { who: "xiaoqiao", say: "夫君……啊不是，這位軍師，這一場就交給你了！" },
    intro: "曹操統一北方後，大軍南下。西元 208 年，他拿下荊州，準備順著長江往東，消滅江東的孫權。江東上上下下人心惶惶。這一次，你是孫權手下的將領——周瑜。",
    people: ["zhouyu", "zhugeliang", "caocao"], episodes: ["EP03"], stories: ["chibi", "caochuan"],
    terrain: [
      { type: "mountains", at: [[258, 266, 11], [278, 258, 15], [298, 268, 10], [140, 40, 11], [160, 34, 14]] },
      { type: "lake", name: "洞庭湖", x: 128, y: 246, rx: 38, ry: 18 },
      { type: "grass", at: [[118, 150], [132, 160], [150, 146], [104, 162], [250, 228], [200, 40], [372, 70]] },
      { type: "river", name: "長江", label: 24, below: true, d: "M10 112 C 70 118, 110 196, 170 196 S 240 160, 270 138 S 320 92, 340 118 S 372 180, 392 196" }
    ],
    places: {
      changban: { x: 66, y: 64, name: "長坂", side: "", icon: "ford" },
      jiangling: { x: 44, y: 98, name: "江陵", side: "cao", icon: "city" },
      huarong: { x: 136, y: 136, name: "華容", side: "", icon: "city" },
      wulin: { x: 214, y: 150, name: "烏林", side: "cao", icon: "camp" },
      chibi: { x: 236, y: 200, name: "赤壁", side: "wu", icon: "camp" },
      xiakou: { x: 300, y: 82, name: "夏口", side: "liu", icon: "city" },
      chaisang: { x: 352, y: 214, name: "柴桑", side: "wu", icon: "capital" }
    },
    steps: [
      {
        id: "1", place: "柴桑", map: { focus: ["chaisang"], arrows: [["jiangling", "wulin", "cao"]] },
        scene: "曹操寫信給孫權：「今治水軍八十萬眾，方與將軍會獵於吳。」意思是要帶八十萬水軍來東吳「打獵」。孫權的大臣們嚇壞了，張昭等人都勸孫權投降。魯肅建議孫權把你從鄱陽找回來商量。",
        q: "孫權問你：打，還是降？",
        options: [
          { k: "a", t: "曹軍太強了，投降比較安全。", who: "caocao", say: "好好好！周郎果然是人才，合約我已經準備好了！" },
          { k: "b", t: "分析曹軍的弱點，勸孫權開戰。", who: "xiaoqiao", say: "我就知道夫君會這樣說！", real: true },
          { k: "c", t: "先拖著不回答，看曹操會不會自己退兵。", who: "zhugeliang", say: "拖下去，等曹操把荊州的兵和船整頓好，就更難打了。" }
        ],
        reveal: "周瑜對孫權說，曹操這次犯了好幾個兵家大忌：北方的馬超、韓遂還沒平定，曹操有後顧之憂；北方士兵不習慣坐船打仗；天氣寒冷，戰馬沒有草料；遠道而來水土不服，一定會生病。孫權聽完，據說拔刀砍斷面前的桌子：「誰再說要投降，就跟這張桌子一樣！」",
        source: "《三國志・周瑜傳》；曹操的信與孫權砍桌子出自裴松之注引《江表傳》",
        lesson: "對手看起來很強時，先冷靜找出他的弱點。"
      },
      {
        id: "2", place: "夏口", map: { focus: ["xiakou", "chaisang"], arrows: [["changban", "xiakou", "liu"], ["chaisang", "xiakou", "wu"]] },
        scene: "曹操大軍南下時，劉備在長坂被追上，一路逃到夏口，和劉表的長子劉琦會合。諸葛亮親自來到柴桑，想說服孫權聯手。可是劉備剛打了敗仗，兵力不多……",
        q: "要不要和劉備聯手抗曹？",
        options: [
          { k: "a", t: "不用！東吳自己打就好，免得功勞被分走。", who: "xiaoqiao", say: "夫君，打架的時候多一個朋友，總比多一個敵人好吧？" },
          { k: "b", t: "聯手！一起對付共同的敵人。", who: "zhugeliang", say: "亮千里迢迢跑這一趟，等的就是這句話。", real: true },
          { k: "c", t: "叫劉備先去前線擋曹軍，我們在後面看情況。", who: "caocao", say: "讓別人去擋刀？這招我欣賞……不過劉備可沒那麼好騙。" }
        ],
        reveal: "諸葛亮到柴桑見孫權，分析局勢：劉備雖然在長坂吃了敗仗，但關羽的水軍和劉琦的士兵加起來還有兩萬人左右；曹軍遠道而來，就像「強弩之末」——射了很遠的箭，到最後連薄薄的絲綢都穿不透；北方人不習慣水戰，荊州百姓也不是真心歸順曹操。孫權聽了很高興，派周瑜、程普、魯肅帶水軍三萬人，跟著諸葛亮去和劉備會合。",
        source: "《三國志・諸葛亮傳》",
        lesson: "面對強大的對手，找到同伴一起面對。"
      },
      {
        id: "3", place: "赤壁", map: { focus: ["chibi", "wulin"], arrows: [["xiakou", "chibi", "wu"], ["wulin", "chibi", "cao"]], fx: [["chibi", "clash"]] },
        scene: "聯軍在赤壁和曹軍相遇。曹軍裡已經有很多人生病，第一次交手就被打退，退到長江北岸的烏林紮營，雙方隔著長江對峙。你的部將黃蓋觀察到：曹軍的戰船一艘接一艘，船頭船尾都連在一起。",
        q: "敵人比我們多，對峙下去怎麼辦？",
        options: [
          { k: "a", t: "全軍划船衝過去，正面決戰！", who: "zhugeliang", say: "人家比我們多好幾倍，正面硬碰，算盤怎麼打都不划算。" },
          { k: "b", t: "曹軍的船連在一起——用火攻！", who: "caocao", say: "……這一題可以跳過嗎？", real: true },
          { k: "c", t: "繼續等，等曹軍病到自己撤退。", who: "xiaoqiao", say: "等是可以等，可是萬一曹軍適應了這裡，病都好了呢？" }
        ],
        reveal: "黃蓋向周瑜建議：「今寇眾我寡，難與持久。然觀操軍船艦首尾相接，可燒而走也。」——敵人多、我們少，拖久了對我們不利；但曹軍的船首尾相連，可以用火燒，讓他們逃走！周瑜採納了這個計策。",
        source: "《三國志・周瑜傳》",
        lesson: "仔細觀察，對手最大的特點，也可能是他最大的弱點。"
      },
      {
        id: "4", place: "烏林", map: { focus: ["wulin"], arrows: [["chibi", "wulin", "wu"]], fx: [["wulin", "fire"]] },
        scene: "火攻的計畫定了，可是問題來了：火船要怎麼靠近曹營，又不被發現？",
        q: "要怎麼把火船送到曹營旁邊？",
        options: [
          { k: "a", t: "趁半夜偷偷划過去點火。", who: "zhugeliang", say: "曹營一定有人站崗，船隊一靠近就會被發現。" },
          { k: "b", t: "讓黃蓋寫信假裝投降，再帶著裝滿柴草的船「來投降」。", who: "caocao", say: "……這招我當年真的信了。不准笑。", real: true },
          { k: "c", t: "從南岸往北岸射火箭。", who: "xiaoqiao", say: "長江那麼寬，火箭射得到對岸嗎？" }
        ],
        reveal: "黃蓋準備了幾十艘戰船，裝滿柴草、澆上油，用布幕蓋住、插上旗子，先寫信給曹操說要投降，船後面還綁著逃生用的小船。船隊靠近時，曹軍士兵都伸長脖子看，指著說：「黃蓋來投降了！」黃蓋一聲令下，所有船同時點火。當時風勢很強，大火一路燒到岸上的營寨，曹軍大敗。",
        source: "《三國志・周瑜傳》",
        lesson: "讓對手放下戒心，比硬闖更有效。"
      },
      {
        id: "5", place: "華容", map: { focus: ["huarong", "jiangling"], arrows: [["wulin", "huarong", "cao"], ["huarong", "jiangling", "cao"], ["chibi", "jiangling", "wu"]], fx: [["wulin", "flag", "wu"]] },
        scene: "曹軍大敗，曹操帶著剩下的兵馬從陸路往江陵撤退。",
        q: "曹操逃走了，你要怎麼做？",
        options: [
          { k: "a", t: "乘勝追擊！水路、陸路一起追。", who: "caocao", say: "喂喂，給我留點面子好不好……", real: true },
          { k: "b", t: "見好就收，回柴桑慶功。", who: "zhugeliang", say: "曹操還留著江陵這個大據點，這時候收手，等於讓他喘口氣。" },
          { k: "c", t: "派人去華容道埋伏，等曹操經過時再放他走。", who: "xiaoqiao", say: "等等——華容道放走曹操那段，是《三國演義》寫的吧？" }
        ],
        reveal: "劉備和周瑜水陸並進，一路追到南郡。曹操走的華容道又濕又泥濘，只好讓體弱的士兵背草鋪路，人馬才勉強通過。曹操留下曹仁守江陵，自己回到北方。周瑜接著和曹仁在江陵相持一年多，曹仁才撤走。赤壁之戰後，曹操再也沒能南下統一天下，三國鼎立的局面慢慢形成。",
        source: "《三國志・周瑜傳》《三國志・武帝紀》；華容道的路況出自裴松之注引《山陽公載記》",
        lesson: "勝利之後也要把握機會，別讓對手喘過氣。"
      }
    ],
    myths: [
      { verdict: "fiction", claim: "《三國演義》這樣演", text: "諸葛亮趁大霧派草船靠近曹營，「借」到十萬支箭。",
        truth: "赤壁之戰的史書沒有這件事。裴松之注引《魏略》記載，幾年後孫權坐大船去看曹軍，船的一邊中了太多箭快翻了，孫權就讓船掉頭，另一邊也中箭，船才恢復平衡。小說把類似的故事搬到諸葛亮身上。" },
      { verdict: "fiction", claim: "《三國演義》這樣演", text: "諸葛亮登上七星壇作法，「借」來東南風。",
        truth: "《三國志・周瑜傳》只說放火時「時風盛猛」，裴注引《江表傳》說「時東南風急」。風是自然吹來的，周瑜他們把握住了時機，史書沒有提到任何人作法。" },
      { verdict: "fiction", claim: "《三國演義》這樣演", text: "周瑜當眾痛打黃蓋，演一齣「苦肉計」騙曹操。",
        truth: "正史只記載黃蓋寫信假裝投降，沒有挨打這一段。「周瑜打黃蓋，一個願打一個願挨」這句俗語，是從小說來的。" },
      { verdict: "fiction", claim: "《三國演義》這樣演", text: "關羽在華容道攔住曹操，念在舊情放他一馬。",
        truth: "裴注引《山陽公載記》寫了曹操在華容道的狼狽，但完全沒有關羽。這是小說為了表現關羽重義氣而創作的情節。" },
      { verdict: "adapted", claim: "常見說法", text: "曹操有八十三萬大軍。",
        truth: "曹操自己在信裡說「八十萬」（《江表傳》），但周瑜估計：曹操從北方帶來的不過十五六萬，加上劉表投降的部隊七八萬；北方兵走了很遠的路已經很疲憊，降兵也還在觀望。「八十萬」比較像是嚇人用的數字。" }
    ],
    endings: [
      { min: 5, title: "你就是周公瑾本人吧？！", text: "五個決定都和周瑜一樣。小喬：夫君，是你嗎？" },
      { min: 3, title: "赤壁名將", text: "大部分關鍵都被你抓到了，曹操的戰船已經開始冒煙了！" },
      { min: 0, title: "另類奇謀家", text: "你走了一條和周瑜不一樣的路。歷史沒辦法重來，但想想看：如果照你的選法，結局會變成怎樣？" }
    ]
  },
  {
    id: "yiling", title: "夷陵之戰", year: "西元 221–222 年（章武元年至二年）",
    role: "luxun", foe: "劉備", seal: "夷陵之戰",
    sides: {
      wu: { name: "吳軍", flag: "吳", color: "var(--wu)" },
      liu: { name: "劉備軍", flag: "漢", color: "var(--shu)" }
    },
    status: "published",
    teaser: "劉備親率大軍為關羽報仇，吳國老將都不服你這個年輕書生——換你當陸遜，五個關鍵決定，你沉得住氣嗎？",
    introSay: { who: "xiaoqiao", say: "東吳的未來，就交給你了，陸都督！" },
    intro: "西元 219 年，關羽丟了荊州、兵敗身亡，劉備和孫權從盟友變成仇人。221 年，劉備稱帝後，親自率領大軍順著長江東下，要為關羽報仇。孫權任命年輕的陸遜為大都督，帶領五萬吳軍迎戰。這一次，你就是陸遜。",
    people: ["luxun", "liubei", "zhugeliang"], episodes: ["EP09", "EP07"], stories: ["huoshao", "anjian", "baizhentu"],
    terrain: [
      { type: "mountains", at: [[22, 50, 12], [44, 40, 16], [70, 52, 12], [100, 42, 14], [128, 54, 11], [36, 150, 13], [64, 160, 16], [96, 152, 11], [150, 186, 13], [178, 196, 10], [190, 64, 15], [214, 58, 11]] },
      { type: "camps", side: "liu", at: [[128, 112], [150, 122], [170, 130], [188, 140], [206, 150]] },
      { type: "grass", at: [[300, 228], [340, 92], [360, 236], [276, 96], [236, 250]] },
      { type: "river", name: "長江", label: 86, below: true, d: "M10 96 C 50 100, 80 116, 120 112 S 190 134, 240 168 S 320 186, 392 172" }
    ],
    places: {
      baidi: { x: 30, y: 82, name: "白帝城", side: "liu", icon: "city" },
      zigui: { x: 98, y: 122, name: "秭歸", side: "liu", icon: "camp" },
      maan: { x: 200, y: 92, name: "馬鞍山", side: "", icon: "camp" },
      xiaoting: { x: 226, y: 150, name: "猇亭", side: "liu", icon: "camp" },
      yidao: { x: 262, y: 214, name: "夷道", side: "wu", icon: "city" },
      luxun: { x: 314, y: 140, name: "陸遜大營", side: "wu", icon: "camp" }
    },
    steps: [
      {
        id: "1", place: "夷陵", map: { focus: ["luxun"], arrows: [["baidi", "zigui", "liu"], ["zigui", "xiaoting", "liu"]] },
        scene: "劉備大軍順著長江東下，一路攻進吳國，士氣正旺。吳軍將領有的是孫策時代的老將，有的是孫家的親戚，看你這個年輕書生當主帥，都不太服氣，個個吵著要馬上出戰。",
        q: "劉備來勢洶洶，你要怎麼應戰？",
        options: [
          { k: "a", t: "立刻迎戰，讓大家看看我的本事！", who: "caocao", say: "年輕人想證明自己，可以理解……但對手正在氣頭上，硬碰最吃虧。" },
          { k: "b", t: "先退一步，把山路讓給劉備，等他累了再說。", who: "xiaoqiao", say: "以退為進，陸都督好沉得住氣！", real: true },
          { k: "c", t: "再派人向劉備求和。", who: "zhugeliang", say: "孫權其實派人求和過，連亮的哥哥諸葛瑾都寫了信……主公還是沒答應。" }
        ],
        reveal: "陸遜對將領們說：劉備大軍剛東下，銳氣正盛，又佔據高處和險要，很難一下子攻破；萬一失利，損失就大了。這裡不是平原，而是山路，劉備的大軍施展不開，在山林之間只會越來越疲憊，等他露出破綻再出手。將領們還是不服，陸遜按著劍說：自己雖然是個書生，但受了主公的命令，大家要各守本分、聽從指揮。",
        source: "《三國志・陸遜傳》；求和信見《三國志・諸葛瑾傳》",
        lesson: "對手氣勢最旺的時候，不一定要正面接招。"
      },
      {
        id: "2", place: "夷道", map: { focus: ["yidao"], arrows: [["xiaoting", "yidao", "liu"]], fx: [["yidao", "clash"]] },
        scene: "劉備的先頭部隊包圍了夷道城，守城的是孫家宗室孫桓。孫桓派人來求救，將領們都說：「孫桓是主公的家族，被圍得這麼緊，怎麼可以不救？」",
        q: "要不要派兵去救孫桓？",
        options: [
          { k: "a", t: "馬上救！自己人不能不管。", who: "xiaoqiao", say: "講義氣是好事，可是一出兵，就正好落入劉備的節奏了。" },
          { k: "b", t: "先不救，相信孫桓守得住。", who: "caocao", say: "敢對主公的親戚說「你先撐著」……這小子膽子不小，我喜歡。", real: true },
          { k: "c", t: "叫孫桓先投降，保住性命。", who: "zhugeliang", say: "城還守得住就投降，也太可惜了吧？" }
        ],
        reveal: "陸遜說：孫桓很得士兵的心，城牆堅固、糧食充足，不用擔心；等我的計策一施展，就算不去救，夷道之圍也會自己解除。後來陸遜大破劉備，夷道果然解圍。孫桓見到陸遜時說：「之前我真的怪你不來救我，到今天才知道，你的調度自有道理。」",
        source: "《三國志・陸遜傳》",
        lesson: "看清全局，不被一時的情緒帶著走。"
      },
      {
        id: "3", place: "猇亭", map: { focus: ["xiaoting"], arrows: [["xiaoting", "luxun", "liu"]] },
        scene: "劉備派將領吳班帶著幾千人，在平地上紮營，天天來叫陣挑戰。吳軍將領看到對方人不多，都摩拳擦掌想出擊。",
        q: "對方只有幾千人，要不要出擊？",
        options: [
          { k: "a", t: "人這麼少，全軍出擊一口氣吃掉！", who: "xiaoqiao", say: "太好打的仗，常常不是真的好打喔。" },
          { k: "b", t: "按兵不動，這裡面一定有詐。", who: "zhugeliang", say: "……被看穿了。這一招，本來是主公的妙計。", real: true },
          { k: "c", t: "派一小隊人去試試看。", who: "caocao", say: "小隊出去萬一中埋伏，正好送對方一場勝利，幫他們鼓舞士氣。" }
        ],
        reveal: "將領們都想出擊，陸遜卻說：「此必有譎，且觀之。」——這裡面一定有詐，先看看再說。果然，劉備知道計策不成，只好讓埋伏在山谷裡的八千名士兵走出來。原來吳班只是誘餌！",
        source: "《三國志・陸遜傳》",
        lesson: "看起來太容易的機會，先想想背後有沒有陷阱。"
      },
      {
        id: "4", place: "猇亭", map: { focus: ["xiaoting"], arrows: [["luxun", "xiaoting", "wu"]], fx: [[[150, 122], "fire"], [[188, 140], "fire"], ["xiaoting", "fire"]] },
        scene: "從正月一直對峙到夏天，劉備的軍隊在山林間連紮了幾十座營寨。天氣炎熱，士兵越來越疲憊、士氣也低落了。你先派兵試著攻打一座營寨，卻沒有成功，將領們抱怨：「白白損失兵力！」",
        q: "時機到了嗎？你要怎麼決戰？",
        options: [
          { k: "a", t: "再等等，還不是時候。", who: "xiaoqiao", say: "已經等了半年，現在正是對方最累的時候，再等下去，機會可能就溜走了。" },
          { k: "b", t: "叫每個士兵帶一把茅草，放火燒營！", who: "caocao", say: "營寨連在樹林裡，又是大熱天……這把火，我在赤壁看過。", real: true },
          { k: "c", t: "集中全軍，從正面一座一座硬攻。", who: "zhugeliang", say: "剛剛試攻一座都不順利了，幾十座要攻到什麼時候？" }
        ],
        reveal: "陸遜說：「吾已曉破之之術。」——我已經知道怎麼打敗他了。他下令每個士兵拿一把茅草，用火攻營寨。火勢一起，各路吳軍同時進攻，一口氣攻破劉備四十多座營寨。劉備退到馬鞍山，連夜突圍，靠著驛站的人把丟下的盔甲堆在山路上燒起來擋住追兵，才逃回白帝城。諸葛亮後來嘆氣說：要是法正還在，一定能勸住主公不要東征。",
        source: "《三國志・陸遜傳》；諸葛亮的話見《三國志・法正傳》",
        lesson: "耐心等待，是為了在最好的時機出手。"
      },
      {
        id: "5", place: "白帝城", map: { focus: ["baidi"], arrows: [["maan", "baidi", "liu"], ["xiaoting", "maan", "liu"]], fx: [["luxun", "flag", "wu"]] },
        scene: "劉備逃進白帝城。吳軍大獲全勝，徐盛、潘璋等將領紛紛上書：「劉備一定抓得到，請讓我們繼續進攻！」",
        q: "要不要追進白帝城？",
        options: [
          { k: "a", t: "追！活捉劉備，一舉滅掉蜀漢！", who: "zhugeliang", say: "……這一題，亮選擇不回答。" },
          { k: "b", t: "見好就收，撤兵防備北方的魏國。", who: "caocao", say: "我兒子曹丕正在北邊等著撿便宜呢……這小子看得懂。", real: true },
          { k: "c", t: "派人去白帝城勸劉備投降。", who: "xiaoqiao", say: "劉備那麼倔強的人，會投降嗎？我看很難喔。" }
        ],
        reveal: "陸遜和朱然、駱統認為：魏國的曹丕正在集結大軍，表面上說要幫吳國打劉備，心裡其實別有打算，於是決定撤兵。沒多久，魏軍果然分三路攻打吳國。如果吳軍深入追擊，就會兩面受敵。後來孫權派人向劉備求和，劉備答應了。第二年，劉備在白帝城病逝，臨終前把兒子劉禪託付給諸葛亮。",
        source: "《三國志・陸遜傳》《三國志・先主傳》",
        lesson: "贏的時候，更要看清楚下一個危險在哪裡。"
      }
    ],
    myths: [
      { verdict: "fiction", claim: "《三國演義》這樣演", text: "陸遜追到魚腹浦，誤闖諸葛亮用石頭擺的「八陣圖」，差點被困在裡面出不來。",
        truth: "正史沒有這件事。陸遜是自己判斷魏國可能偷襲，主動撤兵。魚腹浦一帶確實有傳說是諸葛亮留下的八陣圖遺跡，但陸遜被困是小說創作。" },
      { verdict: "adapted", claim: "常見說法", text: "劉備「連營七百里」，被陸遜一把火燒光。",
        truth: "「七百里營」出自魏國皇帝曹丕的評論（《三國志・文帝紀》）：他一聽說劉備這樣紮營，就斷定劉備不懂打仗。《陸遜傳》記載的是劉備從巫峽一路紮了幾十座營寨，陸遜火攻攻破四十多座。距離可能被說得誇張，但連營被火攻是真的。" },
      { verdict: "fiction", claim: "《三國演義》這樣演", text: "關羽的兒子關興在亂軍中打敗潘璋，奪回父親的青龍偃月刀。",
        truth: "正史裡潘璋一直活到 234 年才過世，並沒有在夷陵之戰被關興打敗。「青龍偃月刀」也是小說的設定，史書沒有記載關羽用的是什麼兵器。" }
    ],
    endings: [
      { min: 5, title: "你就是陸伯言本人吧？！", text: "五個決定都和陸遜一樣。誰說書生不能當大將？" },
      { min: 3, title: "夷陵名都督", text: "大部分關鍵時刻你都沉住氣了，再多一點耐心，就是完美的陸遜！" },
      { min: 0, title: "另類奇謀家", text: "你走了一條和陸遜不一樣的路。歷史沒辦法重來，但想想看：如果照你的選法，結局會變成怎樣？" }
    ]
  }
];

/* ---------------- 🗺️ 三國地圖時間軸 ----------------
   每個關鍵年份一筆；regions 依「州」劃分（荊州、揚州、益州再分南北），值為 [勢力, 地圖上的名字]。
   勢力：han 東漢｜cao 曹操・魏｜sun 孫氏・吳｜liu 劉備・蜀漢｜qun 其他群雄｜jin 晉
   地區 id：liang 涼州 sili 司隸 bing 并州 you 幽州 ji 冀州 qing 青州 yan 兗州 xu 徐州 yu 豫州
            huainan 淮南 jiangdong 江東 jingbei 荊北 jingnan 荊南 hanzhong 漢中 yi 益州 jiao 交州
   城市 id：luoyang changan xu ye chengdu jianye xiangyang jiangling wuchang
   era 是當年的年號；疆界是示意，只標出每一區「主要」由誰控制。 */
const TIMELINE = [
  {
    year: 184, era: "中平元年（東漢）", title: "黃巾之亂",
    text: "張角帶領「黃巾軍」起事，天下大亂。朝廷讓各地自己招兵平亂，曹操、劉備、孫堅都在這時候登場，各地的州牧、太守也慢慢掌握了兵權。",
    source: "《後漢書・靈帝紀》《三國志・武帝紀》《三國志・先主傳》",
    regions: {
      liang: ["han", ""], sili: ["han", "東漢"], bing: ["han", ""], you: ["han", ""], ji: ["han", ""], qing: ["han", ""],
      yan: ["han", ""], xu: ["han", ""], yu: ["han", ""], huainan: ["han", ""], jiangdong: ["han", ""],
      jingbei: ["han", ""], jingnan: ["han", ""], hanzhong: ["han", ""], yi: ["han", ""], jiao: ["han", ""]
    },
    capitals: ["luoyang"],
    marks: [{ x: 423, y: 104, label: "張角起事" }],
    guests: ["caocao", "liubei", "guanyu", "zhangfei"]
  },
  {
    year: 196, era: "建安元年（東漢）", title: "群雄割據・曹操迎獻帝",
    text: "東漢朝廷名存實亡，各地軍閥互相爭地盤。196 年，曹操把漢獻帝迎到許縣，從此可以用皇帝的名義號令天下。呂布搶下了徐州，孫策在江東打下自己的地盤。",
    source: "《三國志・武帝紀》《三國志・呂布傳》《三國志・孫破虜討逆傳》",
    regions: {
      liang: ["qun", "馬騰・韓遂"], sili: ["qun", "李傕・郭汜"], bing: ["qun", ""], you: ["qun", "公孫瓚"], ji: ["qun", "袁紹"], qing: ["qun", "袁紹"],
      yan: ["cao", "曹操"], xu: ["qun", "呂布"], yu: ["cao", "曹操"], huainan: ["qun", "袁術"], jiangdong: ["sun", "孫策"],
      jingbei: ["qun", "劉表"], jingnan: ["qun", "劉表"], hanzhong: ["qun", "張魯"], yi: ["qun", "劉璋"], jiao: ["qun", "士燮"]
    },
    labelAt: { 曹操: "yan", 劉表: "jingnan" },
    capitals: ["xu"],
    marks: [],
    guests: ["caocao", "lvbu", "liubei"]
  },
  {
    year: 200, era: "建安五年（東漢）", title: "官渡之戰",
    text: "北方兩強對決：袁紹擁有冀、青、幽、并四州，曹操控制皇帝所在的許都。曹操以少勝多，從此成為北方霸主。同一年，孫策過世，弟弟孫權接手江東。",
    source: "《三國志・武帝紀》《三國志・袁紹傳》《三國志・吳主傳》",
    regions: {
      liang: ["qun", "馬騰・韓遂"], sili: ["cao", ""], bing: ["qun", "袁紹"], you: ["qun", "袁紹"], ji: ["qun", "袁紹"], qing: ["qun", "袁紹"],
      yan: ["cao", "曹操"], xu: ["cao", ""], yu: ["cao", ""], huainan: ["cao", ""], jiangdong: ["sun", "孫權"],
      jingbei: ["qun", "劉表"], jingnan: ["qun", "劉表"], hanzhong: ["qun", "張魯"], yi: ["qun", "劉璋"], jiao: ["qun", "士燮"]
    },
    labelAt: { 劉表: "jingnan" },
    capitals: ["xu", "ye"],
    battle: "guandu",
    marks: [],
    guests: ["caocao", "guanyu", "liubei", "sunquan"]
  },
  {
    year: 208, era: "建安十三年（東漢）", title: "赤壁之戰",
    text: "曹操統一北方後南下，劉表的兒子劉琮投降，荊州落入曹操手中。孫權和劉備聯手，在赤壁用火攻打敗曹軍，天下三分的局面開始成形。",
    source: "《三國志・武帝紀》《三國志・周瑜傳》《三國志・先主傳》",
    regions: {
      liang: ["qun", "馬超・韓遂"], sili: ["cao", ""], bing: ["cao", ""], you: ["cao", ""], ji: ["cao", "曹操"], qing: ["cao", ""],
      yan: ["cao", ""], xu: ["cao", ""], yu: ["cao", ""], huainan: ["cao", ""], jiangdong: ["sun", "孫權"],
      jingbei: ["cao", ""], jingnan: ["cao", ""], hanzhong: ["qun", "張魯"], yi: ["qun", "劉璋"], jiao: ["qun", "士燮"]
    },
    capitals: ["xu", "ye"],
    battle: "chibi",
    marks: [],
    guests: ["zhouyu", "zhugeliang", "sunquan", "liubei", "zhaoyun", "caocao"]
  },
  {
    year: 214, era: "建安十九年（東漢）", title: "劉備取益州",
    text: "赤壁之後，劉備先拿下荊州南部，再在 214 年取得益州，讓關羽留守荊州。曹操平定了西北的關中和涼州，孫權則收服交州，把根據地搬到建業。",
    source: "《三國志・先主傳》《三國志・武帝紀》《三國志・吳主傳》《三國志・步騭傳》",
    regions: {
      liang: ["cao", ""], sili: ["cao", ""], bing: ["cao", ""], you: ["cao", ""], ji: ["cao", "曹操"], qing: ["cao", ""],
      yan: ["cao", ""], xu: ["cao", ""], yu: ["cao", ""], huainan: ["cao", ""], jiangdong: ["sun", "孫權"],
      jingbei: ["cao", ""], jingnan: ["liu", "關羽"], hanzhong: ["qun", "張魯"], yi: ["liu", "劉備"], jiao: ["sun", ""]
    },
    capitals: ["xu", "ye", "chengdu", "jianye"],
    marks: [],
    guests: ["liubei", "zhugeliang", "guanyu", "zhangfei", "zhaoyun"]
  },
  {
    year: 219, era: "建安二十四年（東漢）", title: "關羽失荊州",
    text: "劉備在漢中打敗曹軍，自稱漢中王。關羽北上圍攻樊城，大雨讓漢水氾濫，曹軍七支部隊被大水淹沒，關羽「威震華夏」。但孫權派呂蒙、陸遜偷襲荊州，關羽兵敗身亡。",
    source: "《三國志・先主傳》《三國志・關羽傳》《三國志・呂蒙傳》《三國志・陸遜傳》",
    regions: {
      liang: ["cao", ""], sili: ["cao", ""], bing: ["cao", ""], you: ["cao", ""], ji: ["cao", "曹操"], qing: ["cao", ""],
      yan: ["cao", ""], xu: ["cao", ""], yu: ["cao", ""], huainan: ["cao", ""], jiangdong: ["sun", "孫權"],
      jingbei: ["cao", ""], jingnan: ["sun", ""], hanzhong: ["liu", ""], yi: ["liu", "劉備"], jiao: ["sun", ""]
    },
    capitals: ["xu", "ye", "chengdu", "jianye"],
    marks: [{ x: 352, y: 192, label: "樊城" }],
    guests: ["guanyu", "luxun", "liubei", "sunquan", "caocao"]
  },
  {
    year: 222, era: "魏 黃初三年・蜀漢 章武二年・吳 黃武元年", title: "三國鼎立・夷陵之戰",
    text: "220 年曹操過世，兒子曹丕取代漢朝建立魏國；劉備在成都稱帝，國號仍是「漢」，後人稱為蜀漢；孫權被封為吳王，229 年也稱帝。劉備為關羽報仇東征，卻在夷陵被陸遜打敗。",
    source: "《三國志・文帝紀》《三國志・先主傳》《三國志・吳主傳》",
    regions: {
      liang: ["cao", ""], sili: ["cao", ""], bing: ["cao", ""], you: ["cao", ""], ji: ["cao", "魏"], qing: ["cao", ""],
      yan: ["cao", ""], xu: ["cao", ""], yu: ["cao", ""], huainan: ["cao", ""], jiangdong: ["sun", "吳"],
      jingbei: ["cao", ""], jingnan: ["sun", ""], hanzhong: ["liu", ""], yi: ["liu", "蜀漢"], jiao: ["sun", ""]
    },
    capitals: ["luoyang", "chengdu", "wuchang"],
    battle: "yiling",
    marks: [],
    guests: ["luxun", "liubei", "sunquan"]
  },
  {
    year: 234, era: "魏 青龍二年・蜀漢 建興十二年・吳 嘉禾三年", title: "諸葛亮北伐・五丈原",
    text: "劉備過世後，諸葛亮輔佐劉禪，從 228 年起多次北伐魏國，對手正是司馬懿。234 年，諸葛亮在五丈原病逝，北伐就此告一段落。",
    source: "《三國志・諸葛亮傳》《晉書・宣帝紀》",
    regions: {
      liang: ["cao", ""], sili: ["cao", ""], bing: ["cao", ""], you: ["cao", ""], ji: ["cao", "魏"], qing: ["cao", ""],
      yan: ["cao", ""], xu: ["cao", ""], yu: ["cao", ""], huainan: ["cao", ""], jiangdong: ["sun", "吳"],
      jingbei: ["cao", ""], jingnan: ["sun", ""], hanzhong: ["liu", ""], yi: ["liu", "蜀漢"], jiao: ["sun", ""]
    },
    capitals: ["luoyang", "chengdu", "jianye"],
    marks: [{ x: 257, y: 158, label: "五丈原" }],
    guests: ["zhugeliang", "simayi"]
  },
  {
    year: 263, era: "魏 景元四年・蜀漢 炎興元年・吳 永安六年", title: "魏滅蜀",
    text: "魏國大將鄧艾、鍾會攻入蜀地，劉禪投降，蜀漢滅亡。這時魏國真正掌權的，已經是司馬懿的兒子司馬昭。",
    source: "《三國志・後主傳》《三國志・鄧艾傳》",
    regions: {
      liang: ["cao", ""], sili: ["cao", ""], bing: ["cao", ""], you: ["cao", ""], ji: ["cao", "魏"], qing: ["cao", ""],
      yan: ["cao", ""], xu: ["cao", ""], yu: ["cao", ""], huainan: ["cao", ""], jiangdong: ["sun", "吳"],
      jingbei: ["cao", ""], jingnan: ["sun", ""], hanzhong: ["cao", ""], yi: ["cao", "魏"], jiao: ["sun", ""]
    },
    capitals: ["luoyang", "jianye"],
    marks: [],
    guests: ["simayi"]
  },
  {
    year: 280, era: "晉 太康元年", title: "晉統一天下",
    text: "265 年，司馬懿的孫子司馬炎取代魏國，建立晉朝。280 年，晉軍順著長江而下，吳國末代皇帝孫皓投降。三國時代正式結束，天下重新統一。",
    source: "《晉書・武帝紀》《三國志・三嗣主傳》",
    regions: {
      liang: ["jin", ""], sili: ["jin", ""], bing: ["jin", ""], you: ["jin", ""], ji: ["jin", "晉"], qing: ["jin", ""],
      yan: ["jin", ""], xu: ["jin", ""], yu: ["jin", ""], huainan: ["jin", ""], jiangdong: ["jin", ""],
      jingbei: ["jin", ""], jingnan: ["jin", ""], hanzhong: ["jin", ""], yi: ["jin", ""], jiao: ["jin", ""]
    },
    capitals: ["luoyang"],
    marks: [{ x: 508, y: 216, label: "孫皓投降" }],
    guests: ["simayi"]
  }
];

/* ---------------- 🏯 走進三國城池（2.5D 示意城） ----------------
   city.html 地圖上的 11 個探索點。id 對應 city.js 裡的位置，不可改；文字可以改。
   link 選填：{ href, text } 延伸連結。 */
const CITY_SPOTS = [
  { id: "chengchi", name: "城牆與護城河", sub: "「城池」兩個字的由來",
    text: "「城池」這個詞，「城」是城牆，「池」是城外一圈的護城河。漢代的城牆大多用泥土一層一層夯打結實，叫做「夯土」，又高又厚；外面再挖一條河，敵人要攻城，得先想辦法過河。",
    fact: "成語「城門失火，殃及池魚」：城門著火了，大家從護城河舀水救火，河水被舀乾，河裡的魚就遭殃了。比喻被不相干的事情連累。",
    source: "成語出自北齊杜弼〈檄梁文〉；夯土城牆見漢代城址考古" },
  { id: "chengmen", name: "城門與門樓", sub: "天亮開門，天黑關門",
    text: "城門是進出城的通道，門上蓋著高高的「門樓」，可以瞭望，也可以從上面防守。白天開門讓人進出，天黑就關起來。按上面的「夜晚」看看城門的樣子！",
    fact: "三國時攻城很辛苦：要搭雲梯爬城牆、推衝車撞城門。官渡之戰時，袁紹還堆起土山、蓋高樓往曹營裡射箭，曹操就造了能拋石頭的「霹靂車」反擊。",
    source: "《三國志・武帝紀》", link: { href: "battle.html#guandu", text: "⚔️ 換你當曹操：官渡之戰" } },
  { id: "jiaolou", name: "角樓", sub: "城牆四個角的瞭望台",
    text: "城牆的四個角最容易被敵人兩面包夾，所以會蓋上高高的角樓。士兵站在樓上站崗，四面八方都看得清楚。",
    fact: "東漢的墓裡常常挖出陶土做的「陶樓」模型，有的好幾層高，樓上還站著拿弓箭的小陶人，讓我們知道當時的樓長什麼樣子。",
    source: "東漢陶樓明器（各地漢墓出土）" },
  { id: "taishou", name: "太守府", sub: "一郡的官府",
    text: "三國時，一個「郡」最大的地方官是「太守」（封國裡叫「相」）。太守府就是他辦公的地方：處理政事、審案子、收稅、維持治安。",
    fact: "曹操年輕時當過濟南相。濟南國十幾個縣的官員，很多都巴結權貴、貪污收賄，曹操一上任，就上奏免掉了其中八個。",
    source: "《三國志・武帝紀》", link: { href: "wiki.html#p=caocao", text: "📜 曹操的人物檔案" } },
  { id: "shi", name: "市集", sub: "城裡做生意的地方",
    text: "漢代的城裡有專門做生意的「市」，四周圍著牆、開著市門，在固定時間開市。賣菜、賣布、賣陶器的攤子一排一排，中間的「市樓」是管理市場的官員辦公和瞭望的地方。",
    fact: "四川出土過東漢的「市井」畫像磚，上面刻著四面開門的市場、一排排店鋪，正中間就是一座市樓。",
    source: "東漢市井畫像磚（四川出土）" },
  { id: "li", name: "里", sub: "一格一格的住宅區",
    text: "城裡的住家被劃分成一個個「里」，每個里四周有牆，只能從里門進出。鄰居們住在同一個里，互相認識、互相照應。",
    fact: "劉備小時候，家旁邊有一棵五丈多高的大桑樹，遠遠看去像馬車的頂蓋。劉備和小朋友在樹下玩，說：「我將來一定要坐這樣的車！」",
    source: "《三國志・先主傳》", link: { href: "wiki.html#p=liubei", text: "📜 劉備的人物檔案" } },
  { id: "cang", name: "糧倉", sub: "打仗最重要的東西",
    text: "官府的糧倉存放收來的稅糧和軍糧，有圓圓的「囷」，也有長方形的「倉」，地板通常會墊高，防潮又防老鼠。打仗的時候，「糧草」往往決定勝負。",
    fact: "官渡之戰的關鍵，就是曹操親自帶兵偷襲烏巢，燒掉了袁紹的糧草，袁軍因此大亂。",
    source: "《三國志・武帝紀》", link: { href: "battle.html#guandu", text: "⚔️ 換你當曹操：官渡之戰" } },
  { id: "wuku", name: "武庫", sub: "存放兵器的倉庫",
    text: "武庫是存放兵器的倉庫，刀、劍、戟、弓箭、盔甲都收在這裡，平時有人看守，要打仗時才發給士兵。",
    fact: "考古學家在西漢長安城挖到一座很大的武庫遺址，出土了鐵刀、鐵劍、戟和大量箭頭。",
    source: "漢長安城武庫遺址（考古發掘）" },
  { id: "ting", name: "亭", sub: "大路旁的治安站",
    text: "城外的大路上，大約每十里設一個「亭」，有亭長負責抓盜賊、維持治安，也讓趕路的人停下來休息。",
    fact: "漢朝的開國皇帝劉邦，年輕時就當過「泗水亭長」。西漢名將李廣有一次晚上經過霸陵亭，被喝醉的霸陵尉攔下：「現在的將軍都不能在晚上通行，何況是以前的將軍！」只好在亭下過了一夜。",
    source: "《漢書・百官公卿表》《史記・高祖本紀》《史記・李將軍列傳》" },
  { id: "tuntian", name: "屯田", sub: "曹操讓大軍吃飽的辦法",
    text: "東漢末年到處打仗，很多田地都荒廢了，軍隊常常沒飯吃。曹操在許都附近招募百姓開墾荒地、種植糧食，這就是「屯田」。",
    fact: "屯田的第一年，就收成了上百萬斛的糧食，曹操的軍隊從此比較不愁軍糧，這是他能在北方站穩腳步的原因之一。",
    source: "《三國志・武帝紀》及裴松之注引《魏書》", link: { href: "map.html#196", text: "🗺️ 看 196 年的天下" } },
  { id: "wubao", name: "塢堡", sub: "大家族的小城堡",
    text: "東漢末年天下大亂，有錢有勢的大家族把自己的莊園圍上高牆、蓋起望樓，變成一座小城堡，叫做「塢堡」，用來保護家人和鄉親。",
    fact: "曹操的猛將許褚，年輕時就聚集了宗族幾千戶人家，築起堅固的營壘，抵抗來搶劫的賊寇。",
    source: "《三國志・許褚傳》" }
];
