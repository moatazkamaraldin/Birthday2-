(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupScrollUI() {
    const progress = $("#readingProgress");
    const nav = $("#companionNav");
    const topButton = $("#backToTop");

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      if (progress) progress.style.width = `${amount * 100}%`;
      nav?.classList.toggle("is-scrolled", window.scrollY > 24);
      topButton?.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.75);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
    update();
  }

  function setupReveals() {
    const elements = $$('[data-reveal]');
    if (!elements.length || reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    elements.forEach((element) => observer.observe(element));
  }

  function setupAmbient() {
    const ambient = $("#companionAmbient");
    if (!ambient) return;

    const compact = window.matchMedia("(max-width: 680px)").matches;
    const randomBetween = (minimum, maximum) => minimum + Math.random() * (maximum - minimum);
    const edgePosition = () => {
      const edge = Math.random() < 0.5;
      return edge ? randomBetween(2, compact ? 28 : 31) : randomBetween(compact ? 72 : 69, 98);
    };
    const fragment = document.createDocumentFragment();
    const starField = document.createElement("div");
    const fallingLayer = document.createElement("div");
    starField.className = "ambient-starfield";
    fallingLayer.className = "ambient-fall";

    const starCount = compact ? 34 : 54;
    for (let index = 0; index < starCount; index += 1) {
      const star = document.createElement("i");
      const starSize = randomBetween(compact ? 2 : 2.4, compact ? 4.8 : 6);
      star.className = `ambient-star ambient-star--${index % 5 === 0 ? "rose" : index % 3 === 0 ? "ivory" : "gold"}`;
      star.style.setProperty("--x", `${Math.random() * 100}%`);
      star.style.setProperty("--y", `${Math.random() * 100}%`);
      star.style.setProperty("--size", `${starSize.toFixed(1)}px`);
      star.style.setProperty("--star-glow", `${(starSize * 2.7).toFixed(1)}px`);
      star.style.setProperty("--star-ray", `${(starSize * 3.5).toFixed(1)}px`);
      star.style.setProperty("--opacity", `${randomBetween(0.38, 0.9).toFixed(2)}`);
      star.style.setProperty("--duration", `${randomBetween(2.6, 6.8).toFixed(1)}s`);
      star.style.setProperty("--delay", `${-randomBetween(0, 7).toFixed(1)}s`);
      star.style.setProperty("--star-drift", `${randomBetween(-12, 12).toFixed(0)}px`);
      starField.append(star);
    }

    const movingTypes = [
      ["heart", "\u2665"],
      ["petal", ""],
      ["sparkle", "\u2726"],
      ["heart-outline", "\u2661"],
      ["rose", "\u273F"],
      ["rosebud", "\uD83C\uDF39"],
      ["petal", ""],
      ["star", "\u2727"]
    ];
    const fallingCount = reduceMotion ? (compact ? 7 : 10) : (compact ? 20 : 30);
    for (let index = 0; index < fallingCount; index += 1) {
      const piece = document.createElement("span");
      const [type, symbol] = movingTypes[index % movingTypes.length];
      const inQuietCenter = !reduceMotion && index % 7 === 0;
      const pieceSize = randomBetween(compact ? 14 : 17, compact ? 26 : 36);
      const sway = randomBetween(-80, 80);
      piece.className = `ambient-love ambient-love--${type}${reduceMotion ? " ambient-love--static" : ""}${inQuietCenter ? " ambient-love--quiet" : ""}`;
      piece.textContent = symbol;
      piece.style.setProperty("--x", `${inQuietCenter ? randomBetween(32, 68).toFixed(1) : edgePosition().toFixed(1)}%`);
      piece.style.setProperty("--y", `${randomBetween(5, 91).toFixed(1)}%`);
      piece.style.setProperty("--size", `${pieceSize.toFixed(1)}px`);
      piece.style.setProperty("--petal-width", `${(pieceSize * 0.68).toFixed(1)}px`);
      piece.style.setProperty("--alpha", `${randomBetween(inQuietCenter ? 0.22 : 0.44, inQuietCenter ? 0.38 : 0.78).toFixed(2)}`);
      piece.style.setProperty("--duration", `${randomBetween(13, 25).toFixed(1)}s`);
      piece.style.setProperty("--delay", `${-randomBetween(0, 25).toFixed(1)}s`);
      piece.style.setProperty("--sway", `${sway.toFixed(0)}px`);
      piece.style.setProperty("--sway-back", `${(-sway * 0.42).toFixed(0)}px`);
      piece.style.setProperty("--drift", `${randomBetween(-150, 150).toFixed(0)}px`);
      piece.style.setProperty("--spin", `${randomBetween(320, 760).toFixed(0)}deg`);
      piece.style.setProperty("--start-rotate", `${randomBetween(-35, 35).toFixed(0)}deg`);
      piece.style.setProperty("--blur", `${index % 11 === 0 ? 0.7 : 0}px`);
      fallingLayer.append(piece);
    }

    fragment.append(starField, fallingLayer);
    ambient.append(fragment);

    document.addEventListener("visibilitychange", () => {
      ambient.classList.toggle("is-paused", document.hidden);
    });
  }

  function burstHearts(target) {
    if (reduceMotion) return;
    const rect = target.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    for (let index = 0; index < 7; index += 1) {
      const heart = document.createElement("span");
      heart.className = "heart-pop";
      heart.textContent = index % 3 ? "♥" : "✦";
      heart.style.left = `${originX + (Math.random() - 0.5) * 50}px`;
      heart.style.top = `${originY + (Math.random() - 0.5) * 25}px`;
      heart.style.setProperty("--heart-x", `${(Math.random() - 0.5) * 100}px`);
      heart.style.setProperty("--heart-rotate", `${(Math.random() - 0.5) * 70}deg`);
      heart.style.setProperty("--heart-size", `${13 + Math.random() * 15}px`);
      document.body.append(heart);
      heart.addEventListener("animationend", () => heart.remove(), { once: true });
    }
  }

  function setupWishes() {
    const cards = $$("[data-wish-card]");
    const randomButton = $("#randomWish");
    const keptCount = $("#keptCount");
    const status = $("#wishStatus");
    if (!cards.length) return;

    const refreshCount = () => {
      const count = cards.filter((card) => card.classList.contains("is-kept")).length;
      if (keptCount) keptCount.textContent = String(count);
    };

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const kept = card.classList.toggle("is-kept");
        card.setAttribute("aria-pressed", String(kept));
        if (status) {
          const title = $("h2", card)?.textContent || "هذه الأمنية";
          status.textContent = kept ? `احتفظ قلبكِ بأمنية «${title}» ♡` : `أعدنا أمنية «${title}» إلى الباقة.`;
        }
        if (kept) burstHearts(card);
        refreshCount();
      });
    });

    randomButton?.addEventListener("click", () => {
      cards.forEach((card) => card.classList.remove("is-selected"));
      const card = cards[Math.floor(Math.random() * cards.length)];
      card.classList.add("is-selected");
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      window.setTimeout(() => {
        card.focus({ preventScroll: true });
        if (!card.classList.contains("is-kept")) {
          card.click();
        } else {
          const title = $("h2", card)?.textContent || "هذه الأمنية";
          if (status) status.textContent = `اختار قلبكِ اليوم أمنية «${title}» ♡`;
          burstHearts(card);
        }
      }, reduceMotion ? 0 : 520);
      window.setTimeout(() => card.classList.remove("is-selected"), 1500);
    });

    refreshCount();
  }

  function setupHeartButtons() {
    $$('[data-heart-button]').forEach((button) => button.addEventListener("click", () => burstHearts(button)));
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupScrollUI();
    setupReveals();
    setupAmbient();
    setupWishes();
    setupHeartButtons();
  });
}());
