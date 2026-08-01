"use strict";

document.documentElement.classList.add("gift-ready", "reveal-ready");

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const compactViewport = window.matchMedia("(max-width: 720px)").matches;
const performanceViewport = window.matchMedia("(max-width: 900px)").matches;
const lowEndHardware = (
  (Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4) ||
  (Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4)
);
const leanVisualBudget = navigator.connection?.saveData === true || (
  lowEndHardware
);
const visualCount = (desktop, compact, lean) => (
  leanVisualBudget ? lean : performanceViewport ? compact : desktop
);

const safeStorage = {
  get(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The experience still works when storage is disabled.
    }
  }
};

const reasons = [
  { group: 0, text: "لأن قلبكِ طيب، حتى بعدما أعطتكِ الحياة أسبابًا كثيرة لتكوني أقسى." },
  { group: 0, text: "لأن قوتكِ لا تلغي رقتكِ، ورقتكِ لا تنتقص شيئًا من قوتكِ." },
  { group: 0, text: "لأن عفويتكِ تجعل اللحظات العادية أجمل من أي ترتيب مسبق." },
  { group: 0, text: "لأن ضحكتكِ تصل إلى قلبي قبل أن ينتهي صوتها." },
  { group: 0, text: "لأنكِ ذكية، وصاحبة رأي، ولا تخافين أن تقولي الحقيقة بحنان." },
  { group: 0, text: "لأنكِ تهتمين بالتفاصيل الصغيرة التي لا ينتبه لها إلا قلب يحب." },
  { group: 0, text: "لأن في عينيكِ هدوءًا يجعل العالم أقل ضجيجًا." },
  { group: 0, text: "لأنكِ جميلة حين تضحكين، وحين تفكرين، وحتى حين تصمتين." },
  { group: 0, text: "لأنكِ ديانتي بكل ما في النداء من حضور، ودندونتي بكل ما في الدلع من قرب." },
  { group: 1, text: "لأن أول لعبة على جواكر صارت ذكرى أحب أن أعود إليها دائمًا." },
  { group: 1, text: "لأن حديثًا قصيرًا معكِ يعرف كيف يتحول إلى ليلة كاملة من غير ملل." },
  { group: 1, text: "لأن صوتكِ في آخر الليل صار واحدًا من أكثر الأماكن أمانًا في يومي." },
  { group: 1, text: "لأنني معكِ أضحك على أبسط الأشياء وأمنحها عمرًا أطول." },
  { group: 1, text: "لأنني أستطيع أن أبكي أمامكِ من دون خجل، ثم أجد في صوتكِ ما يساعدني على الوقوف." },
  { group: 1, text: "لأن صراحتي معكِ لا تبحث عن الانتصار؛ تبحث عن أن أفهمكِ أكثر." },
  { group: 1, text: "لأنكِ تسألين عن يومي بصدق، وتستمعين للإجابة لا للكلمات فقط." },
  { group: 1, text: "لأنني حين كان النوم يغلبكِ في جواكر، كنتُ أبقى منتظرًا حتى تصحي لأكمل سهري معكِ." },
  { group: 1, text: "لأن ثلاثة أشهر معكِ حملت تفاصيل تكفي لتصبح حكاية كاملة." },
  { group: 2, text: "لأن اسمكِ على هاتفي يبدّل مزاج يومٍ كامل في لحظة." },
  { group: 2, text: "لأنني معكِ لا أبحث عن كلام مثالي؛ أستطيع أن أكون نفسي." },
  { group: 2, text: "لأنكِ تجعلينني أريد أن أعبّر أفضل، وأهتم أكثر، وأكون ألطف." },
  { group: 2, text: "لأن الشوق إليكِ يثبت لي كل يوم أن المسافة لا تقيس القرب الحقيقي." },
  { group: 2, text: "لأن فكرة اللقاء القادم صارت من الأمنيات التي تمنحني طاقة جميلة." },
  { group: 2, text: "لأنني حين أتخيّل أيامًا هادئة، أجد ضحكتكِ داخل الصورة." },
  { group: 2, text: "لأنكِ تستحقين حبًا يسمعكِ ويحترمكِ ويختاركِ بوضوح." },
  { group: 2, text: "لأن وجودكِ علّمني أن أجمل الأشياء قد تبدأ من صدفة صغيرة جدًا." },
  { group: 2, text: "لأنني أحبكِ اليوم بطريقة أصدق من الأمس، وأريد أن أحسن حبكِ غدًا." }
];

const reasonGroups = [
  { kicker: "تسعة أسباب فيكِ", title: "لأنكِ أنتِ", note: "01 — 09" },
  { kicker: "تسعة أسباب في حكايتي معكِ", title: "لأنكِ جعلتِها صادقة", note: "10 — 18" },
  { kicker: "تسعة أسباب في قلبي", title: "لأنكِ تغيّرين أيامي", note: "19 — 27" }
];

const comfortMessages = [
  {
    icon: "♡",
    title: "لما تشتاقيلي",
    short: "المسافة لا تغيّر مكانكِ",
    text: "يا دندونتي، أعرف أن المسافة لا تُهزم بجملة، لكن تذكّري أن لكِ مكانًا ثابتًا في يومي وقلبي. أغمضي عينيكِ لحظة، وتخيّلي أنكِ معي في إحدى سهراتي معكِ: لا شيء مستعجل، وأنا أسمعكِ حتى ينتهي كل الكلام."
  },
  {
    icon: "☾",
    title: "لما ما تقدري تنامي",
    short: "خذي هذا الهدوء معكِ",
    text: "اتركي اليوم خارج الغرفة يا ديانتي. خذي نفسًا بطيئًا، ثم واحدًا آخر. لا يجب أن تحلّي كل شيء الليلة. يكفي أن ترتاحي، وأن تعرفي أن صباحًا جديدًا ينتظركِ، وأن عزوزكِ يتمنى لكِ نومًا هادئًا وقلبًا أخف."
  },
  {
    icon: "☁",
    title: "لما يكون يومكِ ثقيلًا",
    short: "ليس عليكِ حمله وحدكِ",
    text: "اليوم الصعب لا يقول شيئًا سيئًا عنكِ؛ هو مجرد يوم، وسيمر. خفّفي عن قلبكِ، واحكي لي ما تستطيعين، واتركي ما لا تستطيعين لوقت آخر. أنا فخور بكِ حتى في الأيام التي يكون إنجازكِ الوحيد فيها أنكِ أكملتِها."
  },
  {
    icon: "☀",
    title: "لما تحتاجي ابتسامة",
    short: "تذكّري أول جولة جواكر",
    text: "ابتسمي هلق، ولو ابتسامة صغيرة! تذكّري أن لعبة ورق عادية قررت تعمل أجمل حركة وتعرّفني عليكِ. لو كانت جواكر تعرف النتيجة، كان لازم تعطيني كأسًا لأحلى صدفة، لا مجرد نقاط في اللعبة."
  },
  {
    icon: "✦",
    title: "لما تنسي قوتكِ",
    short: "أنا أراها حتى لو نسيتِها",
    text: "أنتِ أقوى مما تشعرين به الآن، لكن ليس مطلوبًا منكِ أن تكوني قوية طوال الوقت. القوة أحيانًا أن ترتاحي، أو تطلبي المساعدة، أو تقولي: تعبت. أنا أرى كم مررتِ بأشياء وبقي قلبكِ طيبًا، وهذا وحده بطولة."
  },
  {
    icon: "◇",
    title: "لما تشكّي بجمالكِ",
    short: "الجمال الذي أراه كامل",
    text: "يا ديانتي، أنتِ جميلة في الصورة وفي الصوت وفي تفاصيل لا تلتقطها الكاميرا: في اهتمامكِ، وفي طريقتكِ بالكلام، وفي قلبكِ حين يقلق على من يحب. لا تسمحي ليوم عابر أن يخفي عنكِ كل هذا الجمال."
  },
  {
    icon: "↺",
    title: "لما تزعلي مني",
    short: "زعلكِ يستحق أن أسمعه",
    text: "إذا فتحتِ هذا الظرف وأنتِ زعلانة مني، فلا أريد أن أربح نقاشًا وأخسركِ في الطريق. احكي لي بوضوح، وسأحاول أن أسمعكِ من غير دفاع ولا تقليل من شعوركِ. ما بيني وبينكِ يستحق اعتذارًا حين أخطئ، وحوارًا صادقًا دائمًا."
  },
  {
    icon: "27",
    title: "لما ترجعي لهديتكِ",
    short: "عيد الميلاد لا ينتهي هنا",
    text: "إذا عدتِ إلى هذه الصفحة بعد يوم ميلادكِ، فمعنى ذلك أن الهدية نجحت وصارت مكانًا صغيرًا لكِ. تذكّري: لم أصنعها ليوم واحد، بل لكل مرة تريدين فيها أن تعرفي كم أنتِ غالية. كل عام وأنتِ أجمل أعوامي القادمة."
  }
];

const birthdayWishes = [
  "أن تستيقظي في أيام كثيرة وقلبكِ خفيف، بلا خوفٍ يسبق الصباح.",
  "أن يمنحكِ الله صحةً مطمئنة وطاقةً تكفي للأشياء التي تحبينها.",
  "أن تنامي كل ليلة وأنتِ راضية عن نفسكِ، حتى لو لم يكن اليوم مثاليًا.",
  "أن تضحكي من قلبكِ كثيرًا، لا مجاملةً ولا هروبًا، بل فرحًا حقيقيًا.",
  "أن يصلكِ خبر جميل في وقت لا تتوقعينه ويغيّر أسبوعًا كاملًا.",
  "أن يقترب حلم ظننتِ يومًا أنه بعيد أكثر مما ينبغي.",
  "أن تكوني ألطف مع نفسكِ من كل صوت حاول أن يقنعكِ أنكِ لا تكفين.",
  "أن يبقى حولكِ أشخاص يرون قلبكِ ويحفظون غيابكِ قبل حضوركِ.",
  "أن تملكي الشجاعة لتقولي «لا» لما يؤذيكِ، و«نعم» لما يشبهكِ.",
  "أن يأتيكِ رزق واسع وحلال يريح بالكِ ويفتح لأحلامكِ أبوابًا جديدة.",
  "أن تجدي في عملكِ أو دراستكِ خطوة تجعلكِ فخورة بما صنعتِه بنفسكِ.",
  "أن تزوري مكانًا جديدًا يترك في ذاكرتكِ ضوءًا وصورةً لا تُنسى.",
  "أن يبقى أهلكِ ومن تحبين بخير، وأن يطمئن قلبكِ عليهم دائمًا.",
  "أن يكون لكِ صباح هادئ، وقهوة على مهل، ويوم لا يطلب منكِ الركض.",
  "أن تتصاغر الأشياء التي تخيفكِ حين تقفين أمامها وتعرفين قوتكِ.",
  "أن تختاري ما تريدينه أنتِ، لا ما ينتظره الجميع منكِ.",
  "أن يُسمع صوتكِ بوضوح، وتُحترم حدودكِ، ولا تضطري لتبرير شعوركِ.",
  "أن تتعلمي شيئًا يحمّسكِ ويعيد إلى عينيكِ فضول البدايات.",
  "أن تمتلئ سنتكِ بلحظات صغيرة تستحق أن تُحفظ لا أن تمرّ بسرعة.",
  "أن تجمعني بكِ أيام أقرب، وصور أكثر، وضحك لا يقطعه ضعف الاتصال.",
  "أن يمنحكِ الانتظار صبرًا من غير أن يسرق منكِ بهجة الحاضر.",
  "أن تنظري إلى نفسكِ بفخر، كما أراكِ حين تتغلبين على يوم صعب.",
  "أن يحتفل بكِ من يحبكِ في الأيام العادية، لا في عيد ميلادكِ فقط.",
  "أن يتحول تعب قديم إلى حكمة، لا إلى بابٍ مغلق في وجه الفرح.",
  "أن يبقى إيمانكِ بالخير حيًا، حتى حين تتأخر الإجابات قليلًا.",
  "أن يصلكِ الحب بالشكل الذي يطمئنكِ: صادقًا، واضحًا، ومحترمًا.",
  "أن تعودي في عيدكِ القادم إلى هنا وتكتشفي أن أمنيات كثيرة صارت ذكريات حقيقية."
];

const nightMoments = [
  { at: 0, label: "أول الليل", datetime: "23:00", time: "11:00 مساءً", phrase: "«بلّشت أحكي معكِ… ولسّه الليل بأوله»", detail: "سؤال بسيط منكِ يفتح لي حكاية كاملة، وصوتكِ يجعل آخر يومي أخفّ." },
  { at: 18, label: "منتصف الليل", datetime: "00:30", time: "12:30 بعد منتصف الليل", phrase: "«طيب، اسمعي شو صار معي اليوم…»", detail: "أفتح لكِ تفاصيل لا تبدو مهمة لأحد، لأن اهتمامكِ يمنحها معنى آخر." },
  { at: 36, label: "ضحكة متأخرة", datetime: "02:00", time: "2:00 ليلًا", phrase: "«ضحكتكِ صحّت قلبي قبل البيت»", detail: "أعيد الجملة فقط لأسمع ضحكتكِ مرة أخرى، فتغدو الساعة أخفّ من دقيقة." },
  { at: 55, label: "وقت البوح", datetime: "03:30", time: "3:30 فجرًا", phrase: "«احكي لي بصراحة… أنا أسمعكِ»", detail: "يهدأ الليل، فأمنح صوتكِ كل انتباهي، وأحفظ ما تقولينه في مكان آمن من قلبي." },
  { at: 72, label: "حين تنامين", datetime: "04:30", time: "4:30 فجرًا", phrase: "«غلبكِ النوم؟ نامي يا دندونتي… سأنتظركِ»", detail: "كنتِ تنامين أحيانًا أثناء سهري معكِ على جواكر، فأبقى مستيقظًا أنتظر أن تصحي؛ لأن الليل من دون صوتكِ يفقد أجمل ما فيه." },
  { at: 86, label: "حين تصحين", datetime: "05:30", time: "5:30 فجرًا", phrase: "«صحيتِ؟ الآن رجع السهر حلو»", detail: "حين تعودين، أعود إلى الحكي معكِ كأن الليل بدأ للتو؛ فلا أحب النوم إلا حين تكونين موجودة معي." },
  { at: 100, label: "طلوع الشمس", datetime: "06:15", time: "6:15 صباحًا", phrase: "«طلعت الشمس… وأنا ما زلتُ أختاركِ لهذا اليوم وكل يوم»", detail: "يصبح الليل نهارًا أمام عينيكِ، وتطلع الشمس فعلًا؛ أمّا أنا فأصل إلى الصباح وأنا أكثر يقينًا بأن صوتكِ هو أجمل ما رافق ليلي." }
];

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function applyBelovedName(name) {
  $$('[data-beloved-name]').forEach(element => {
    element.textContent = name;
  });
}

function createAmbientStars() {
  if (reducedMotion) return;
  const container = $("#ambientStars");
  if (!container) return;

  container.setAttribute("aria-hidden", "true");
  const fragment = document.createDocumentFragment();
  const isCompact = compactViewport;
  const starCount = visualCount(52, 18, 10);
  const starColors = ["#fff9f0", "#ffd166", "#ff304f", "#55d6b8", "#58b8ff", "#cbb8ff", "#ffffff"];
  const sparkleSymbols = ["\u2726", "\u2727", "\u22c6"];

  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement("i");
    const depth = index % 4;
    const isSparkle = index % 9 === 0 || index % 13 === 0;
    const color = starColors[(index * 3 + depth) % starColors.length];
    const size = isSparkle
      ? (isCompact ? 6 : 7) + Math.random() * (isCompact ? 5 : 7)
      : 1.35 + depth * 0.42 + Math.random() * 2.15;
    const opacity = 0.27 + depth * 0.075 + Math.random() * 0.3;

    star.className = `ambient-star ambient-star--depth-${depth}${isSparkle ? " ambient-star--sparkle" : ""}`;
    star.style.setProperty("--x", `${Math.random() * 100}%`);
    star.style.setProperty("--y", `${Math.random() * 100}%`);
    star.style.setProperty("--size", `${size.toFixed(2)}px`);
    star.style.setProperty("--opacity", opacity.toFixed(2));
    star.style.setProperty("--duration", `${2.2 + Math.random() * 5.1}s`);
    star.style.setProperty("--delay", `${-Math.random() * 7}s`);
    star.style.setProperty("--star-color", color);
    star.style.setProperty("--star-depth", `${depth}`);
    star.style.zIndex = `${depth}`;

    if (isSparkle) {
      star.textContent = sparkleSymbols[index % sparkleSymbols.length];
      star.style.width = "auto";
      star.style.height = "auto";
      star.style.borderRadius = "0";
      star.style.background = "transparent";
      star.style.color = color;
      star.style.fontFamily = "Georgia, 'Times New Roman', serif";
      star.style.fontSize = `${size.toFixed(2)}px`;
      star.style.fontStyle = "normal";
      star.style.lineHeight = "1";
      star.style.textShadow = `0 0 ${8 + depth * 3}px ${color}, 0 0 ${18 + depth * 4}px rgba(255, 199, 101, 0.32)`;
    } else {
      star.style.background = color;
      star.style.boxShadow = `0 0 ${5 + depth * 2}px ${color}, 0 0 ${12 + depth * 4}px rgba(255, 199, 101, ${0.12 + depth * 0.04})`;
    }

    fragment.appendChild(star);
  }
  container.appendChild(fragment);
}

function createFallingLove() {
  const container = $("#loveFall");
  if (!container || reducedMotion) return;

  container.setAttribute("aria-hidden", "true");
  const fragment = document.createDocumentFragment();
  const pieceCount = visualCount(26, 10, 6);
  const types = ["heart", "petal", "star", "heart", "rose", "petal", "heart", "star"];
  const hearts = ["\u2665", "\u2661", "\u2764"];
  const flowers = ["\u273f", "\u2740", "\u2698", "\ud83c\udf39"];
  const stars = ["\u2726", "\u2727", "\u22c6"];
  const palettes = [
    { color: "#ff304f", glow: "rgba(255, 48, 79, 0.54)" },
    { color: "#ff8a5b", glow: "rgba(255, 138, 91, 0.46)" },
    { color: "#ffd166", glow: "rgba(255, 209, 102, 0.46)" },
    { color: "#55d6b8", glow: "rgba(85, 214, 184, 0.42)" },
    { color: "#58b8ff", glow: "rgba(88, 184, 255, 0.44)" },
    { color: "#a47cff", glow: "rgba(164, 124, 255, 0.42)" },
    { color: "#fff9f0", glow: "rgba(255, 249, 240, 0.38)" }
  ];

  for (let index = 0; index < pieceCount; index += 1) {
    const piece = document.createElement("span");
    const type = types[index % types.length];
    const depth = index % 3;
    const palette = palettes[(index * 2 + depth) % palettes.length];
    const baseSize = [9, 13, 17][depth];
    const durationBase = [25, 20, 15][depth];

    piece.className = `falling-love falling-love--${type} falling-love--depth-${depth}`;
    if (type === "heart") piece.textContent = hearts[(index + depth) % hearts.length];
    if (type === "rose") piece.textContent = flowers[index % flowers.length];
    if (type === "star") piece.textContent = stars[index % stars.length];
    piece.style.setProperty("--x", `${Math.random() * 100}%`);
    piece.style.setProperty("--size", `${baseSize + Math.random() * (8 + depth * 3)}px`);
    piece.style.setProperty("--alpha", `${0.3 + depth * 0.09 + Math.random() * 0.22}`);
    piece.style.setProperty("--duration", `${durationBase + Math.random() * 11}s`);
    piece.style.setProperty("--delay", `${-Math.random() * 34}s`);
    piece.style.setProperty("--sway", `${(Math.random() - 0.5) * (95 + depth * 38)}px`);
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * (190 + depth * 70)}px`);
    piece.style.setProperty("--spin", `${300 + Math.random() * 660}deg`);
    piece.style.setProperty("--fall-color", palette.color);
    piece.style.setProperty("--fall-glow", palette.glow);
    piece.style.setProperty("--fall-depth", `${depth}`);
    piece.style.setProperty("--love-glow", palette.glow);
    piece.style.setProperty("--love-depth", `${[0.78, 1, 1.18][depth]}`);
    piece.style.setProperty("--love-blur", depth === 0 ? "0.28px" : "0px");
    piece.style.zIndex = `${depth}`;

    fragment.appendChild(piece);
  }

  container.appendChild(fragment);
}

function createSectionLoveRain() {
  if (reducedMotion) return;
  const sections = $$("main > section, main > aside");
  const pieceCount = visualCount(4, 0, 0);
  if (!pieceCount) return;
  const motifs = [
    { symbol: "\u2661", type: "heart" },
    { symbol: "\u2665", type: "heart" },
    { symbol: "\u2740", type: "flower" },
    { symbol: "\u2726", type: "star" },
    { symbol: "\u273f", type: "flower" },
    { symbol: "\u2764", type: "heart" },
    { symbol: "\u2727", type: "star" },
    { symbol: "\u2698", type: "flower" }
  ];
  const colors = ["#ff304f", "#ff8a5b", "#ffd166", "#55d6b8", "#58b8ff", "#a47cff", "#fff9f0"];
  const animatedLayers = [];

  sections.forEach((section, sectionIndex) => {
    const layer = document.createElement("div");
    layer.className = "section-love-rain";
    layer.setAttribute("aria-hidden", "true");

    for (let index = 0; index < pieceCount; index += 1) {
      const piece = document.createElement("i");
      const seed = sectionIndex * 31 + index * 47 + 11;
      const motif = motifs[(sectionIndex * 2 + index) % motifs.length];
      const depth = (sectionIndex + index) % 3;
      const color = colors[(sectionIndex + index * 2) % colors.length];

      piece.className = `section-love-rain__piece section-love-rain__piece--${motif.type} section-love-rain__piece--depth-${depth}`;
      piece.textContent = motif.symbol;
      piece.style.setProperty("--section-love-x", `${4 + (seed * 37) % 92}%`);
      piece.style.setProperty("--section-love-start", `${-8 + (sectionIndex * 17 + index * 43) % 108}%`);
      piece.style.setProperty("--section-love-size", `${14 + depth * 4 + (seed % 9)}px`);
      piece.style.setProperty("--section-love-delay", `${-(seed % 27)}s`);
      piece.style.setProperty("--section-love-duration", `${17 + (2 - depth) * 4 + (seed % 11)}s`);
      piece.style.setProperty("--section-love-drift", `${-95 + (seed * 13) % 190}px`);
      piece.style.setProperty("--section-love-color", color);
      piece.style.setProperty("--section-love-alpha", `${0.2 + depth * 0.07}`);
      piece.style.setProperty("--section-love-depth", `${depth}`);
      piece.style.setProperty("--section-depth", `${[0.8, 1, 1.18][depth]}`);
      piece.style.zIndex = `${depth}`;
      piece.style.fontWeight = motif.type === "heart" ? "700" : "600";
      layer.appendChild(piece);
    }

    section.prepend(layer);
    animatedLayers.push({ section, layer });
  });

  if ("IntersectionObserver" in window) {
    const rainObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const layer = entry.target.querySelector(":scope > .section-love-rain");
        layer?.classList.toggle("is-active", entry.isIntersecting);
      });
    }, { threshold: 0, rootMargin: "18% 0px" });
    animatedLayers.forEach(({ section }) => rainObserver.observe(section));
  } else {
    animatedLayers.forEach(({ layer }) => layer.classList.add("is-active"));
  }
}

function createHeartBurst(source = null, amount = 24) {
  if (reducedMotion) return;
  const container = $("#heartBursts");
  const colors = ["#ff304f", "#ff8a5b", "#ffd166", "#55d6b8", "#58b8ff", "#a47cff"];
  const heartCount = visualCount(Math.min(amount, 24), Math.min(amount, 14), Math.min(amount, 8));
  const bounds = source?.getBoundingClientRect();
  const originX = bounds ? window.innerWidth - (bounds.left + bounds.width / 2) : window.innerWidth / 2;
  const originY = bounds ? window.innerHeight - (bounds.top + bounds.height / 2) : window.innerHeight * 0.35;
  for (let index = 0; index < heartCount; index += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = index % 3 === 0 ? "♥" : "♡";
    heart.style.setProperty("--x", `${originX + (Math.random() - 0.5) * 70}px`);
    heart.style.setProperty("--y", `${originY + (Math.random() - 0.5) * 30}px`);
    heart.style.setProperty("--size", `${14 + Math.random() * 24}px`);
    heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 240}px`);
    heart.style.setProperty("--rotate", `${(Math.random() - 0.5) * 120}deg`);
    heart.style.setProperty("--duration", `${2.8 + Math.random() * 2.2}s`);
    heart.style.setProperty("--color", colors[index % colors.length]);
    container.appendChild(heart);
    window.setTimeout(() => heart.remove(), 5400);
  }
}

function createConfetti(amount = 70) {
  if (reducedMotion) {
    showToast(`كل عام وأنتِ بخير يا ${safeStorage.get("diana-gift-name", "ديانتي")} ✦`);
    return;
  }
  const colors = ["#ff304f", "#ff8a5b", "#ffd166", "#55d6b8", "#58b8ff", "#a47cff", "#fff9f0"];
  const pieceCount = visualCount(Math.min(amount, 70), Math.min(amount, 42), Math.min(amount, 26));
  for (let index = 0; index < pieceCount; index += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${Math.random() * 100}vw`);
    piece.style.setProperty("--w", `${5 + Math.random() * 7}px`);
    piece.style.setProperty("--h", `${8 + Math.random() * 13}px`);
    piece.style.setProperty("--color", colors[index % colors.length]);
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 280}px`);
    piece.style.setProperty("--spin", `${360 + Math.random() * 900}deg`);
    piece.style.setProperty("--duration", `${3.2 + Math.random() * 2.6}s`);
    piece.style.setProperty("--delay", `${Math.random() * 0.8}s`);
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 6800);
  }
}

function setupEntryGate() {
  const gate = $("#entryGate");
  const openButton = $("#openGift");
  const main = $("#mainContent");
  const backgroundItems = $$('body > *').filter(element => element !== gate && element.tagName !== "SCRIPT");
  const storedValue = safeStorage.get("diana-gift-name", "");
  const storedName = ["دندونتي", "ديانتي"].includes(storedValue) ? storedValue : "";

  document.body.classList.add("gift-locked");
  backgroundItems.forEach(element => { element.inert = true; });
  if (typeof gate.showModal === "function") gate.showModal();
  else gate.setAttribute("open", "");
  gate.addEventListener("cancel", event => event.preventDefault());

  if (storedName) {
    const storedChoice = $$('[data-name-choice]').find(button => button.dataset.nameChoice === storedName);
    storedChoice?.classList.add("is-selected");
    storedChoice?.setAttribute("aria-pressed", "true");
    openButton.disabled = false;
    applyBelovedName(storedName);
  }

  window.requestAnimationFrame(() => {
    const selected = $('.name-choice button.is-selected');
    (selected || $('.name-choice button'))?.focus({ preventScroll: true });
  });

  $$('[data-name-choice]').forEach(button => {
    button.setAttribute("aria-pressed", button.classList.contains("is-selected") ? "true" : "false");
    button.addEventListener("click", () => {
      $$('[data-name-choice]').forEach(item => {
        item.classList.remove("is-selected");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");
      openButton.disabled = false;
      applyBelovedName(button.dataset.nameChoice);
      safeStorage.set("diana-gift-name", button.dataset.nameChoice);
    });
  });

  openButton.addEventListener("click", () => {
    gate.classList.add("is-leaving");
    createHeartBurst(openButton, 32);
    window.setTimeout(() => {
      if (typeof gate.close === "function" && gate.open) gate.close();
      else gate.removeAttribute("open");
      gate.hidden = true;
      backgroundItems.forEach(element => { element.inert = false; });
      document.body.classList.remove("gift-locked");
      main.focus({ preventScroll: true });
    }, reducedMotion ? 20 : 680);
  });
}

function setupScrollExperience() {
  const topbar = $("#topbar");
  const progress = $("#scrollProgress");
  let ticking = false;

  const updateScroll = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const percent = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
    progress.style.setProperty("--progress", `${percent}%`);
    topbar.classList.toggle("is-scrolled", window.scrollY > 18);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });
  updateScroll();

  const revealElements = $$('[data-reveal]');
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(element => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    revealElements.forEach(element => revealObserver.observe(element));
  }

  const navLinks = $$('.chapter-nav a');
  const sections = $$('.chapter[id]');
  if ("IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }, { threshold: [0.2, 0.45, 0.7], rootMargin: "-25% 0px -45%" });
    sections.forEach(section => chapterObserver.observe(section));
  }
}

const cinematicSceneMap = new Map([
  ["welcome", {
    accent: "#ff304f",
    secondary: "#58b8ff",
    gold: "#ffd166",
    glow: "rgba(88, 184, 255, 0.34)"
  }],
  ["celebration", {
    accent: "#ff8a5b",
    secondary: "#55d6b8",
    gold: "#ffd166",
    glow: "rgba(85, 214, 184, 0.32)"
  }],
  ["story", {
    accent: "#ff6f91",
    secondary: "#ffad5c",
    gold: "#ffe08a",
    glow: "rgba(255, 111, 145, 0.31)"
  }],
  ["gallery", {
    accent: "#ff8a5b",
    secondary: "#55cfe0",
    gold: "#ffe071",
    glow: "rgba(85, 207, 224, 0.32)"
  }],
  ["night", {
    accent: "#8d7cff",
    secondary: "#43c6ff",
    gold: "#c9dcff",
    glow: "rgba(67, 198, 255, 0.34)"
  }],
  ["dictionary", {
    accent: "#55d6b8",
    secondary: "#58b8ff",
    gold: "#d8f6a8",
    glow: "rgba(85, 214, 184, 0.32)"
  }],
  ["reasons", {
    accent: "#f53f76",
    secondary: "#ff9a52",
    gold: "#ffd166",
    glow: "rgba(245, 63, 118, 0.34)"
  }],
  ["poetry", {
    accent: "#a47cff",
    secondary: "#5175ff",
    gold: "#f0c77a",
    glow: "rgba(164, 124, 255, 0.32)"
  }],
  ["wishes", {
    accent: "#ffd166",
    secondary: "#55d6b8",
    gold: "#ff9f70",
    glow: "rgba(85, 214, 184, 0.31)"
  }],
  ["letter", {
    accent: "#d91f45",
    secondary: "#a47cff",
    gold: "#f3d18a",
    glow: "rgba(217, 31, 69, 0.36)"
  }],
  ["comfort", {
    accent: "#55d6b8",
    secondary: "#9a8cff",
    gold: "#bfe7ff",
    glow: "rgba(85, 214, 184, 0.31)"
  }],
  ["tomorrow", {
    accent: "#ff9a70",
    secondary: "#58b8ff",
    gold: "#ffe08a",
    glow: "rgba(255, 154, 112, 0.31)"
  }],
  ["timecapsule", {
    accent: "#5175ff",
    secondary: "#45d4c2",
    gold: "#e4c783",
    glow: "rgba(69, 212, 194, 0.31)"
  }],
  ["finale", {
    accent: "#ff304f",
    secondary: "#58b8ff",
    gold: "#ffd166",
    glow: "rgba(255, 48, 79, 0.4)"
  }],
  ["library", {
    accent: "#a47cff",
    secondary: "#55d6b8",
    gold: "#ffd166",
    glow: "rgba(164, 124, 255, 0.32)"
  }]
]);

function setupCinematicSceneTransitions() {
  const root = document.documentElement;
  const body = document.body;
  const scenes = [...cinematicSceneMap.keys()]
    .map(scene => document.getElementById(scene))
    .filter(Boolean);
  if (!body || !scenes.length) return;

  scenes.forEach(section => {
    section.dataset.scene = section.id;
    section.classList.add("cinematic-scene");
  });

  root.classList.add("scene-transition-ready");
  body.classList.add("scene-transition-ready");

  if (window.CSS?.registerProperty) {
    [
      ["--scene-accent", "#ff304f"],
      ["--scene-secondary", "#58b8ff"],
      ["--scene-gold", "#ffd166"],
      ["--scene-glow", "rgba(88, 184, 255, 0.34)"]
    ].forEach(([name, initialValue]) => {
      try {
        window.CSS.registerProperty({ name, syntax: "<color>", inherits: true, initialValue });
      } catch {
        // A property may already be registered by the stylesheet or another script.
      }
    });
  }

  if (!reducedMotion && !performanceViewport && !leanVisualBudget) {
    const transition = ["--scene-accent", "--scene-secondary", "--scene-gold", "--scene-glow"]
      .map(property => `${property} 1050ms cubic-bezier(0.22, 1, 0.36, 1)`)
      .join(", ");
    root.style.transition = transition;
  }

  let activeScene = "";
  let frame = 0;

  const applyScene = scene => {
    if (!cinematicSceneMap.has(scene) || scene === activeScene) return;
    const palette = cinematicSceneMap.get(scene);
    const previousScene = activeScene;
    activeScene = scene;

    root.style.setProperty("--scene-accent", palette.accent);
    root.style.setProperty("--scene-secondary", palette.secondary);
    root.style.setProperty("--scene-gold", palette.gold);
    root.style.setProperty("--scene-glow", palette.glow);
    root.dataset.activeScene = scene;
    body.dataset.activeScene = scene;

    if (previousScene) body.classList.remove(`scene-is-${previousScene}`);
    body.classList.add(`scene-is-${scene}`);
  };

  const pickSceneAtViewportFocus = () => {
    frame = 0;
    const viewportHeight = Math.max(window.innerHeight, 1);
    const focusLine = viewportHeight * 0.44;
    let bestScene = scenes[0].id;
    let bestScore = Number.NEGATIVE_INFINITY;

    scenes.forEach(section => {
      const rect = section.getBoundingClientRect();
      const overlap = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
      const visibleRatio = overlap / Math.max(1, Math.min(rect.height, viewportHeight));
      const containsFocus = rect.top <= focusLine && rect.bottom >= focusLine;
      const centerDistance = Math.abs((rect.top + rect.bottom) / 2 - focusLine) / viewportHeight;
      const score = visibleRatio * 2.4 + (containsFocus ? 2 : 0) - centerDistance;

      if (score > bestScore) {
        bestScore = score;
        bestScene = section.id;
      }
    });

    applyScene(bestScene);
  };

  const scheduleScenePick = () => {
    if (!frame) frame = window.requestAnimationFrame(pickSceneAtViewportFocus);
  };

  if ("IntersectionObserver" in window) {
    const sceneObserver = new IntersectionObserver(scheduleScenePick, {
      threshold: [0, 0.08, 0.2, 0.4, 0.65],
      rootMargin: "-12% 0px -12%"
    });
    scenes.forEach(section => sceneObserver.observe(section));
    window.addEventListener("resize", scheduleScenePick, { passive: true });
  } else {
    window.addEventListener("scroll", scheduleScenePick, { passive: true });
    window.addEventListener("resize", scheduleScenePick, { passive: true });
  }

  pickSceneAtViewportFocus();
}

function setupNightJourney() {
  const slider = $("#nightSlider");
  const experience = $("#nightExperience");
  const sky = $("#nightSky");
  const time = $("#nightTime");
  const phrase = $("#nightPhrase");
  const detail = $("#nightDetail");
  const wave = $("#voiceWave");
  const stars = $("#nightStars");
  const stageLabel = $("#nightStageLabel");
  const progress = $("#nightProgress");
  const progressFill = $("#nightProgressFill");
  const progressValue = $("#nightProgressValue");
  let lastMomentIndex = -1;

  if (!slider || !experience || !sky || !time || !phrase || !detail || !wave) return;
  const stageButtons = $$("[data-night-value]", experience);

  wave.replaceChildren();
  const waveBarCount = visualCount(28, 16, 10);
  for (let index = 0; index < waveBarCount; index += 1) {
    const bar = document.createElement("i");
    bar.style.setProperty("--wave-height", `${12 + Math.random() * 55}px`);
    bar.style.setProperty("--wave-speed", `${0.7 + Math.random() * 1.2}s`);
    bar.style.setProperty("--wave-delay", `${-Math.random() * 1.5}s`);
    wave.appendChild(bar);
  }

  if (stars) {
    stars.replaceChildren();
    const nightStarCount = visualCount(42, 18, 10);
    for (let index = 0; index < nightStarCount; index += 1) {
      const star = document.createElement("i");
      star.style.setProperty("--star-x", `${(index * 37 + 7) % 98}%`);
      star.style.setProperty("--star-y", `${(index * 53 + 11) % 76}%`);
      star.style.setProperty("--star-size", `${1 + (index % 4) * 0.55}px`);
      star.style.setProperty("--star-delay", `${-(index % 12) * 0.24}s`);
      star.style.setProperty("--star-speed", `${1.8 + (index % 7) * 0.28}s`);
      stars.appendChild(star);
    }
  }

  const clamp = value => Math.max(0, Math.min(1, value));
  const update = () => {
    const value = Number(slider.value);
    const journey = value / 100;
    const predawn = clamp((value - 24) / 56);
    const dawn = clamp((value - 62) / 38);
    const starOpacity = 1 - clamp((value - 38) / 57);
    const moonOpacity = 1 - clamp((value - 50) / 42);
    const aurora = 0.16 + clamp(1 - Math.abs(value - 54) / 54) * 0.7;
    const daylight = clamp((value - 80) / 20);

    experience.style.setProperty("--journey", journey.toFixed(3));
    experience.style.setProperty("--predawn", predawn.toFixed(3));
    experience.style.setProperty("--dawn", dawn.toFixed(3));
    experience.style.setProperty("--star-opacity", starOpacity.toFixed(3));
    experience.style.setProperty("--moon-opacity", moonOpacity.toFixed(3));
    experience.style.setProperty("--aurora-opacity", aurora.toFixed(3));
    experience.style.setProperty("--daylight", daylight.toFixed(3));
    experience.style.setProperty("--sun-rise", `${dawn * 215}px`);
    experience.style.setProperty("--sun-scale", (0.72 + daylight * 0.38).toFixed(3));
    experience.style.setProperty("--moon-drop", `${journey * 112}px`);
    experience.style.setProperty("--moon-drift", `${journey * -26}px`);
    experience.style.setProperty("--slider-progress", `${value}%`);

    const momentIndex = nightMoments.reduce((found, item, index) => value >= item.at ? index : found, 0);
    const moment = nightMoments[momentIndex];
    slider.setAttribute("aria-valuetext", `${moment.time} — ${moment.phrase.replace(/[«»]/g, "")}`);
    experience.dataset.nightStage = String(momentIndex);

    if (progress) progress.setAttribute("aria-valuenow", String(value));
    if (progressFill) progressFill.style.width = `${value}%`;
    if (progressValue) progressValue.textContent = `${Math.round(value).toLocaleString("ar-EG")}٪`;
    if (stageLabel) stageLabel.textContent = moment.label;
    stageButtons.forEach((button, index) => {
      const active = index === momentIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (momentIndex !== lastMomentIndex) {
      time.textContent = moment.time;
      time.setAttribute("datetime", moment.datetime);
      phrase.textContent = moment.phrase;
      detail.textContent = moment.detail;
      lastMomentIndex = momentIndex;
    }
  };
  slider.addEventListener("input", update);
  stageButtons.forEach(button => {
    button.addEventListener("click", () => {
      slider.value = button.dataset.nightValue;
      update();
    });
  });
  update();

  const meaningButton = $("#voiceMeaning");
  const quote = $("#voiceQuote");
  meaningButton.addEventListener("click", () => {
    const willOpen = quote.hidden;
    quote.hidden = !willOpen;
    meaningButton.setAttribute("aria-expanded", String(willOpen));
    meaningButton.firstChild.textContent = willOpen ? "أغلقي السطر " : "افتحي السطر الذي يشبه قلبي ";
  });
}

function setupLoveDictionary() {
  const cards = $$('.dictionary-card');
  const status = $('#dictionaryStatus');
  let opened = 0;

  cards.forEach(card => {
    const word = $('b', card)?.textContent.trim() || 'الكلمة';
    const meaning = $('.dictionary-card__meaning', card);
    card.addEventListener('click', () => {
      if (card.getAttribute('aria-expanded') === 'true') return;
      card.setAttribute('aria-expanded', 'true');
      card.classList.add('is-open');
      meaning.hidden = false;
      card.setAttribute('aria-label', `${word}: ${meaning.textContent.trim()}`);
      opened += 1;
      status.textContent = opened === cards.length
        ? 'فتحتِ قاموسي لكِ كاملًا… وبقيت كلمات كثيرة لم أكتبها بعد ♡'
        : `فتحتِ ${opened} من ${cards.length} كلمات`;
      if (opened === cards.length) createHeartBurst(card, 22);
    });
  });
}

function setupPhotoGallery() {
  const dialog = $("#photoModal");
  const image = $("#photoModalImage");
  const title = $("#photoModalTitle");
  const closeButton = $("#closePhotoModal");
  const cards = $$("[data-gallery-src]");
  if (!dialog || !image || !title || !cards.length) return;

  const close = () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  };

  cards.forEach(card => {
    card.addEventListener("click", () => {
      image.src = card.dataset.gallerySrc;
      image.alt = card.dataset.galleryAlt || "صورة من ألبوم دندونتي";
      title.textContent = card.dataset.galleryCaption || "لقطة أحبها";
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      createHeartBurst(card, 8);
    });
  });

  closeButton?.addEventListener("click", close);
  dialog.addEventListener("click", event => {
    if (event.target === dialog) close();
  });
}

function setupBirthdayWishes() {
  const grid = $('#birthdayWishesGrid');
  const randomButton = $('#randomBirthdayWish');
  const status = $('#birthdayWishStatus');
  const cards = [];

  birthdayWishes.forEach((wish, index) => {
    const article = document.createElement('article');
    article.className = 'birthday-wish-card';
    article.tabIndex = -1;
    article.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><b aria-hidden="true">♥</b><p>${wish}</p>`;
    grid.appendChild(article);
    cards.push(article);
  });

  randomButton.addEventListener('click', () => {
    cards.forEach(card => card.classList.remove('is-chosen'));
    const index = Math.floor(Math.random() * cards.length);
    const chosen = cards[index];
    chosen.classList.add('is-chosen');
    status.textContent = `أمنية اليوم رقم ${index + 1}: ${birthdayWishes[index]}`;
    chosen.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(() => chosen.focus({ preventScroll: true }), reducedMotion ? 0 : 420);
    createHeartBurst(randomButton, 16);
  });
}

function setupReasons() {
  const container = $("#reasonsGrid");
  const stored = safeStorage.get("diana-gift-open-reasons", []);
  const openIndexes = new Set(Array.isArray(stored) ? stored.filter(index => Number.isInteger(index) && index >= 0 && index < reasons.length) : []);
  const buttons = [];

  reasonGroups.forEach((group, groupIndex) => {
    const section = document.createElement("section");
    section.className = "reason-group";
    section.innerHTML = `
      <div class="reason-group__heading">
        <div><p>${group.kicker}</p><h3>${group.title}</h3></div>
        <span>${group.note}</span>
      </div>
      <div class="reason-group__grid"></div>`;
    const grid = $(".reason-group__grid", section);

    reasons.filter(reason => reason.group === groupIndex).forEach(reason => {
      const index = reasons.indexOf(reason);
      const number = String(index + 1).padStart(2, "0");
      const button = document.createElement("button");
      button.className = "reason-card";
      button.type = "button";
      button.dataset.index = String(index);
      button.setAttribute("aria-label", `افتحي السبب ${index + 1}`);
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = `
        <span class="reason-card__inner">
          <span class="reason-card__front"><span>السبب ${number}</span><b>♡</b><small>اضغطي لتفتحيه</small></span>
          <span class="reason-card__back"><span>${number}</span><p>${reason.text}</p></span>
        </span>`;
      button.addEventListener("click", () => openReason(index, true));
      buttons[index] = button;
      grid.appendChild(button);
    });
    container.appendChild(section);
  });

  const count = $("#reasonCount");
  const status = $("#reasonStatus");
  const progress = $("#reasonProgressBar");
  const hiddenGift = $("#hiddenGift");
  const randomButton = $("#randomReason");
  const openAllButton = $("#openAllReasons");
  let openingAll = false;

  function updateReasonState(announce = false) {
    const opened = openIndexes.size;
    count.textContent = String(opened);
    progress.style.setProperty("--reason-progress", `${(opened / reasons.length) * 100}%`);
    if (!openingAll || opened === reasons.length) {
      if (opened === 0) status.textContent = "لم تُفتح أي بطاقة بعد";
      else if (opened < reasons.length) status.textContent = `فتحتِ ${opened} وبقي ${reasons.length - opened}`;
      else status.textContent = "فتحتِ القلوب السبعة والعشرين كلها";
    }

    randomButton.disabled = opened === reasons.length;
    openAllButton.disabled = openingAll || opened === reasons.length;
    if (opened === reasons.length) {
      openAllButton.textContent = "كلها مفتوحة ♡";
      if (hiddenGift.hidden) {
        hiddenGift.hidden = false;
        window.requestAnimationFrame(() => hiddenGift.classList.add("is-visible"));
        if (announce) {
          createHeartBurst(buttons[26], 30);
          showToast("ظهر السبب الثامن والعشرون ✦");
        }
      }
    }
  }

  function openReason(index, announce = false) {
    if (openIndexes.has(index) || !buttons[index]) return;
    openIndexes.add(index);
    const button = buttons[index];
    button.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", `السبب ${index + 1}: ${reasons[index].text}`);
    safeStorage.set("diana-gift-open-reasons", [...openIndexes].sort((a, b) => a - b));
    updateReasonState(announce);
  }

  openIndexes.forEach(index => {
    if (!buttons[index]) return;
    buttons[index].classList.add("is-open");
    buttons[index].setAttribute("aria-expanded", "true");
    buttons[index].setAttribute("aria-label", `السبب ${index + 1}: ${reasons[index].text}`);
  });
  updateReasonState(false);

  randomButton.addEventListener("click", () => {
    const unopened = reasons.map((_, index) => index).filter(index => !openIndexes.has(index));
    if (!unopened.length) return;
    const index = unopened[Math.floor(Math.random() * unopened.length)];
    openReason(index, true);
    buttons[index].scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    window.setTimeout(() => buttons[index].focus({ preventScroll: true }), reducedMotion ? 0 : 450);
  });

  openAllButton.addEventListener("click", () => {
    const unopened = reasons.map((_, index) => index).filter(index => !openIndexes.has(index));
    openingAll = true;
    openAllButton.disabled = true;
    unopened.forEach((index, order) => {
      window.setTimeout(() => {
        openReason(index, order === unopened.length - 1);
        if (order === unopened.length - 1) openingAll = false;
      }, reducedMotion ? 0 : order * 65);
    });
  });
}

function setupLetter() {
  const envelope = $("#letterEnvelope");
  const button = $("#openLetter");
  const paper = $("#letterPaper");
  button.addEventListener("click", () => {
    envelope.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    window.setTimeout(() => {
      paper.hidden = false;
      paper.classList.add("is-opening");
      paper.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }, reducedMotion ? 20 : 520);
  }, { once: true });
}

function setupComfortMessages() {
  const grid = $("#comfortGrid");
  const modal = $("#messageModal");
  const modalIcon = $("#modalIcon");
  const modalTitle = $("#modalTitle");
  const modalText = $("#modalText");

  comfortMessages.forEach((message, index) => {
    const button = document.createElement("button");
    button.className = "comfort-card";
    button.type = "button";
    button.innerHTML = `<span class="comfort-card__number">${String(index + 1).padStart(2, "0")}</span><span class="comfort-card__icon" aria-hidden="true">${message.icon}</span><h3>${message.title}</h3><small>${message.short}</small>`;
    button.addEventListener("click", () => {
      modalIcon.textContent = message.icon;
      modalTitle.textContent = message.title.replace(/^لما\s/, "");
      modalText.textContent = message.text;
      if (typeof modal.showModal === "function") modal.showModal();
      else modal.setAttribute("open", "");
    });
    grid.appendChild(button);
  });

  const closeMessageModal = () => {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  };
  $("#closeModal").addEventListener("click", closeMessageModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeMessageModal();
  });
}

function setupDreamBuilder() {
  const labels = {
    place: "أين أبدأ معكِ؟",
    mood: "ما الذي يملأ الوقت؟",
    ending: "بماذا أختمه معكِ؟"
  };
  const selections = {};
  const result = $("#dreamResult");
  const chosenName = () => safeStorage.get("diana-gift-name", "ديانتي");

  $$('[data-dream-group]').forEach(fieldset => {
    const group = fieldset.dataset.dreamGroup;
    fieldset.dataset.label = labels[group];
    $$('button', fieldset).forEach(button => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        $$('button', fieldset).forEach(item => {
          item.classList.remove("is-selected");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-selected");
        button.setAttribute("aria-pressed", "true");
        selections[group] = button.dataset.value;
        if (Object.keys(selections).length === 3) {
          result.textContent = `موعدكِ معي يبدأ ${selections.place}، ${selections.mood}، وأختمه ${selections.ending}. هذا موعدكِ يا ${chosenName()} ♡`;
          result.classList.add("is-complete");
          showToast("حفظتُ شكل موعدي الصغير معكِ ♡");
        } else {
          result.textContent = `اختاري ${3 - Object.keys(selections).length} من التفاصيل المتبقية.`;
        }
      });
    });
  });
}

function setupTimeCapsule() {
  const capsule = $('#timeCapsuleBox');
  const closed = $('#capsuleClosed');
  const button = $('#openCapsule');
  const letter = $('#capsuleLetter');

  button.addEventListener('click', () => {
    capsule.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    createHeartBurst(button, 28);
    window.setTimeout(() => {
      closed.hidden = true;
      letter.hidden = false;
      letter.classList.add('is-opening');
      letter.focus({ preventScroll: true });
      letter.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }, reducedMotion ? 20 : 520);
  }, { once: true });
}

function setupCandlesAndWish() {
  const candles = $("#candles");
  const status = $("#candleStatus");
  const blowButton = $("#blowAllCandles");
  const lights = [];
  let celebrated = false;
  let blowingAll = false;

  const updateCandles = () => {
    const remaining = lights.filter(light => !light.classList.contains("is-out")).length;
    if (remaining > 0) {
      if (!blowingAll) status.textContent = `${remaining} ${remaining === 1 ? "ضوء ينتظر" : "ضوءًا تنتظر"} أمنيتكِ`;
      return;
    }
    blowingAll = false;
    status.textContent = "أُطفئت الأضواء… أطلقي أمنيتكِ ✦";
    blowButton.disabled = true;
    blowButton.textContent = "وصلت النفخة ♡";
    if (!celebrated) {
      celebrated = true;
      createConfetti(76);
      createHeartBurst(blowButton, 32);
    }
  };

  const extinguish = light => {
    if (light.classList.contains("is-out")) return;
    light.classList.add("is-out");
    light.setAttribute("aria-pressed", "true");
    light.setAttribute("aria-label", `${light.getAttribute("aria-label")}، مطفأ`);
    updateCandles();
  };

  for (let index = 0; index < 27; index += 1) {
    const light = document.createElement("button");
    light.className = "candle-light";
    light.type = "button";
    light.setAttribute("aria-label", `إطفاء الضوء ${index + 1}`);
    light.setAttribute("aria-pressed", "false");
    light.addEventListener("click", () => extinguish(light));
    lights.push(light);
    candles.appendChild(light);
  }

  blowButton.addEventListener("click", () => {
    blowingAll = true;
    lights.filter(light => !light.classList.contains("is-out")).forEach((light, index, remaining) => {
      window.setTimeout(() => extinguish(light), reducedMotion ? 0 : index * Math.max(22, 500 / remaining.length));
    });
  });

  const textarea = $("#birthdayWish");
  const counter = $("#wishCount");
  const seal = $("#sealWish");
  const sealed = $("#sealedWish");
  const label = $('label[for="birthdayWish"]');
  const footer = $(".wish-vault__footer");

  textarea.addEventListener("input", () => {
    counter.textContent = `${textarea.value.length} / 180`;
    seal.disabled = textarea.value.trim().length === 0;
  });

  seal.addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    textarea.value = "";
    textarea.hidden = true;
    label.hidden = true;
    footer.hidden = true;
    sealed.hidden = false;
    blowingAll = true;
    createConfetti(54);
    lights.filter(light => !light.classList.contains("is-out")).forEach((light, index) => {
      window.setTimeout(() => extinguish(light), reducedMotion ? 0 : index * 28);
    });
    sealed.focus({ preventScroll: true });
    sealed.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  });

  $("#replayCelebration").addEventListener("click", event => {
    createConfetti(90);
    createHeartBurst(event.currentTarget, 36);
  });
}

function setupAmbientAudio() {
  const button = $("#soundToggle");
  if (!button) return;
  const label = $(".sound-toggle__label", button);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const BPM = 92;
  const SECONDS_PER_BEAT = 60 / BPM;
  const LOOP_GAP_BEATS = 3;
  const frequencies = {
    C3: 130.81,
    F3: 174.61,
    G3: 196,
    G4: 392,
    A4: 440,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    F5: 698.46,
    G5: 783.99
  };
  const melody = [
    ["G4", 0.5], ["G4", 0.5], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
    ["G4", 0.5], ["G4", 0.5], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
    ["G4", 0.5], ["G4", 0.5], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 1],
    ["F5", 0.5], ["F5", 0.5], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2]
  ];
  const bassLine = ["C3", "G3", "G3", "C3", "F3", "C3", "G3", "C3"];
  let context = null;
  let masterGain = null;
  let loopTimer = null;
  let playing = false;
  const activeSources = new Set();

  const keepSource = source => {
    activeSources.add(source);
    source.addEventListener("ended", () => activeSources.delete(source), { once: true });
  };

  const scheduleTone = (frequency, start, beats) => {
    if (!context || !masterGain) return;
    const duration = beats * SECONDS_PER_BEAT;
    const end = start + Math.max(0.32, duration * 0.92);
    const main = context.createOscillator();
    const mainGain = context.createGain();
    const sparkle = context.createOscillator();
    const sparkleGain = context.createGain();

    main.type = "triangle";
    main.frequency.setValueAtTime(frequency, start);
    sparkle.type = "sine";
    sparkle.frequency.setValueAtTime(frequency * 2, start);

    mainGain.gain.setValueAtTime(0.0001, start);
    mainGain.gain.exponentialRampToValueAtTime(0.09, start + 0.035);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, end);
    sparkleGain.gain.setValueAtTime(0.0001, start);
    sparkleGain.gain.exponentialRampToValueAtTime(0.018, start + 0.025);
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, Math.min(end, start + 0.48));

    main.connect(mainGain).connect(masterGain);
    sparkle.connect(sparkleGain).connect(masterGain);
    keepSource(main);
    keepSource(sparkle);
    main.start(start);
    sparkle.start(start);
    main.stop(end + 0.04);
    sparkle.stop(Math.min(end + 0.04, start + 0.52));
  };

  const scheduleBassPulse = (frequency, start) => {
    if (!context || !masterGain) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.032, start + 0.045);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + SECONDS_PER_BEAT * 1.6);
    oscillator.connect(gain).connect(masterGain);
    keepSource(oscillator);
    oscillator.start(start);
    oscillator.stop(start + SECONDS_PER_BEAT * 1.7);
  };

  const scheduleMelody = () => {
    if (!playing || !context) return;
    const start = context.currentTime + 0.08;
    let cursor = 0;
    melody.forEach(([note, beats]) => {
      scheduleTone(frequencies[note], start + cursor * SECONDS_PER_BEAT, beats);
      cursor += beats;
    });
    bassLine.forEach((note, index) => {
      scheduleBassPulse(frequencies[note], start + index * 3 * SECONDS_PER_BEAT);
    });
    const nextLoopIn = (cursor + LOOP_GAP_BEATS) * SECONDS_PER_BEAT * 1000;
    loopTimer = window.setTimeout(scheduleMelody, nextLoopIn);
  };

  const stop = async () => {
    playing = false;
    window.clearTimeout(loopTimer);
    activeSources.forEach(source => {
      try { source.stop(); } catch { /* The source may already have ended. */ }
    });
    activeSources.clear();
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "تشغيل موسيقى عيد الميلاد");
    document.body.classList.remove("audio-on");
    label.textContent = "موسيقى عيد الميلاد";
    if (context) {
      try { await context.close(); } catch { /* no-op */ }
      context = null;
      masterGain = null;
    }
  };

  button.addEventListener("click", async () => {
    if (playing) {
      await stop();
      return;
    }
    if (!AudioContextClass) {
      showToast("المتصفح لا يدعم موسيقى عيد الميلاد التفاعلية، لكن الهدية كاملة بدونها ♡");
      return;
    }
    context = new AudioContextClass();
    try {
      await context.resume();
    } catch {
      showToast("لم تبدأ الموسيقى بعد؛ جرّبي الضغط مرة أخرى ♡");
      await stop();
      return;
    }
    masterGain = context.createGain();
    masterGain.gain.setValueAtTime(0.58, context.currentTime);
    masterGain.connect(context.destination);
    playing = true;
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "إيقاف موسيقى عيد الميلاد");
    document.body.classList.add("audio-on");
    label.textContent = "إيقاف الموسيقى";
    scheduleMelody();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) stop();
  });
  window.addEventListener("pagehide", () => {
    if (playing) stop();
  });
}

function setupBirthdayOverture() {
  const button = $("#startParty");
  if (!button) return;

  button.addEventListener("click", event => {
    createConfetti(110);
    createHeartBurst(event.currentTarget, 38);
    const soundButton = $("#soundToggle");
    if (soundButton?.getAttribute("aria-pressed") !== "true") soundButton?.click();
    button.classList.add("is-celebrating");
    button.innerHTML = 'بدأ احتفالكِ يا دندونتي <span aria-hidden="true">♥</span>';
    showToast("هذه ليلتكِ أنتِ… وكل الفرح فيها لكِ ♡");
  }, { once: true });
}

function scheduleDecorativeLayers() {
  const renderLayers = () => {
    createAmbientStars();
    createFallingLove();
    createSectionLoveRain();
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(renderLayers, { timeout: 900 });
  } else {
    window.setTimeout(renderLayers, 90);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupEntryGate();
  setupScrollExperience();
  setupCinematicSceneTransitions();
  setupNightJourney();
  setupPhotoGallery();
  setupLoveDictionary();
  setupReasons();
  setupBirthdayWishes();
  setupLetter();
  setupComfortMessages();
  setupDreamBuilder();
  setupTimeCapsule();
  setupCandlesAndWish();
  setupAmbientAudio();
  setupBirthdayOverture();
  scheduleDecorativeLayers();

  $("#heartBurst").addEventListener("click", event => createHeartBurst(event.currentTarget, 30));
});
