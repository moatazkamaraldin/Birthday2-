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
    if (!ambient || reduceMotion) return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 32; index += 1) {
      const star = document.createElement("i");
      star.className = "ambient-star";
      star.style.setProperty("--x", `${Math.random() * 100}%`);
      star.style.setProperty("--y", `${Math.random() * 100}%`);
      star.style.setProperty("--size", `${1 + Math.random() * 2}px`);
      star.style.setProperty("--opacity", `${0.2 + Math.random() * 0.55}`);
      star.style.setProperty("--duration", `${2.5 + Math.random() * 4}s`);
      star.style.setProperty("--delay", `${-Math.random() * 5}s`);
      fragment.append(star);
    }
    for (let index = 0; index < 18; index += 1) {
      const piece = document.createElement("span");
      const type = index % 5 === 0 ? "rose" : index % 2 === 0 ? "petal" : "heart";
      piece.className = `ambient-love ambient-love--${type}`;
      if (type === "heart") piece.textContent = index % 3 ? "♡" : "♥";
      if (type === "rose") piece.textContent = "✿";
      piece.style.setProperty("--x", `${Math.random() * 100}%`);
      piece.style.setProperty("--size", `${9 + Math.random() * 14}px`);
      piece.style.setProperty("--alpha", `${0.16 + Math.random() * 0.3}`);
      piece.style.setProperty("--duration", `${16 + Math.random() * 16}s`);
      piece.style.setProperty("--delay", `${-Math.random() * 27}s`);
      piece.style.setProperty("--sway", `${(Math.random() - 0.5) * 90}px`);
      piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 190}px`);
      piece.style.setProperty("--spin", `${280 + Math.random() * 480}deg`);
      fragment.append(piece);
    }
    ambient.append(fragment);
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
