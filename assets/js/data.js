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
    code: "EP10", type: "ep", status: "upcoming", person: "caocao",
    title: "曹操來作客：主持人反轉大審問",
    question: "平常都是他發合約，這次換他坐上來賓椅！",
    lesson: "",
    desc: "第十集特別企劃！曹操坐上來賓椅，由諸葛亮與小喬聯手發問。你想問曹操什麼？快到點播台投稿！",
    date: "", length: "", youtube: "", spotify: "",
    related: { people: ["caocao"], idioms: ["wangmei"], stories: [] }
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
    novel: "古裝劇裡三國的人也要進京趕考、考狀元。", history: "別演了！科舉是隋朝才開始、唐朝才發揚光大的，三國時代完全沒有科舉考試。「名落孫山」更是宋朝的故事。" }
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
  { id: "t-caocao", type: "人物", title: "曹操坐上來賓椅：主持人反轉大審問", status: "recording", episode: "EP10" },
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
   places 座標用 400×300 的示意圖，不按比例。 */
const BATTLES = [
  {
    id: "guandu", title: "官渡之戰", year: "西元 200 年（建安五年）",
    role: "caocao", foe: "袁紹",
    status: "published",
    teaser: "兵比對手少很多、糧食快吃完了——換你當曹操，五個關鍵決定，你能以少勝多嗎？",
    introSay: { who: "caocao", say: "這一場我最有經驗了……不過這次換你來決定，我不劇透！" },
    intro: "東漢末年，北方最強的是袁紹，他擁有四個州、兵多糧足。曹操控制皇帝所在的許都，地盤小、兵也少。西元 200 年，袁紹大軍南下，雙方在黃河南岸的官渡決戰。現在，你就是曹操。",
    people: ["caocao", "guanyu"], episodes: ["EP04"],
    terrain: [
      { type: "river", name: "黃河", d: "M10 62 C 80 50, 140 78, 210 72 S 330 92, 392 118" }
    ],
    places: {
      liyang: { x: 318, y: 46, name: "黎陽", side: "yuan" },
      baima: { x: 312, y: 126, name: "白馬", side: "cao" },
      yanjin: { x: 170, y: 92, name: "延津", side: "" },
      wuchao: { x: 236, y: 128, name: "烏巢", side: "yuan" },
      yuanying: { x: 176, y: 150, name: "袁紹大營", side: "yuan" },
      guandu: { x: 150, y: 190, name: "官渡", side: "cao" },
      xu: { x: 196, y: 268, name: "許都", side: "cao" }
    },
    steps: [
      {
        id: "1", place: "白馬", map: { focus: ["baima", "yanjin"], arrows: [["guandu", "yanjin", "feint"], ["yanjin", "baima", "cao"], ["liyang", "baima", "yuan"]] },
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
        id: "2", place: "延津", map: { focus: ["yanjin"], arrows: [["baima", "yanjin", "cao"], ["liyang", "yanjin", "yuan"]] },
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
        id: "3", place: "官渡", map: { focus: ["guandu", "yuanying"], arrows: [["yuanying", "guandu", "yuan"]] },
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
        id: "4", place: "烏巢", map: { focus: ["wuchao"], arrows: [["guandu", "wuchao", "cao"], ["yuanying", "guandu", "yuan"]] },
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
        id: "5", place: "官渡", map: { focus: ["guandu"], arrows: [["guandu", "liyang", "cao"]] },
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
  }
];
