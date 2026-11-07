(() => {
  "use strict";

  const config = window.monthsaryConfig || {};
  const query = (selector, scope = document) => scope.querySelector(selector);
  const queryAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const firstName = config.boyfriendName || "A";
  const secondName = config.girlfriendName || "M";
  const coupleNames = `${firstName} & ${secondName}`;
  const shortNames = config.signatureName || `${firstName.charAt(0)} & ${secondName.charAt(0)}`;

  const values = {
    names: coupleNames,
    "names-short": shortNames,
    signatureName: config.signatureName || "ferg",
    date: config.monthsaryDate || "Your special date",
    months: config.monthsTogether || "—",
    message:
      config.personalMessage ||
      "Thank you for being part of my life. Every moment with you is special.",
    finalMessage:
      config.finalMessage ||
      "Here is to more months, more memories, and a lifetime together."
  };

  queryAll("[data-config]").forEach((element) => {
    const key = element.dataset.config;
    if (values[key] !== undefined) element.textContent = values[key];
  });

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const gallery = query("#gallery-grid");
  if (gallery && Array.isArray(config.gallery)) {
    gallery.innerHTML = config.gallery
      .map((item, index) => {
        const safeImage = escapeHtml(item.image || "");
        const safeAlt = escapeHtml(item.note || `Memory photo ${index + 1}`);
        return `
          <article class="gallery-card gallery-card--${index + 1} reveal-up" data-gallery-card>
            <div class="gallery-card__image photo-surface--gallery">
              <img src="${safeImage}" alt="${safeAlt}" loading="lazy" decoding="async">
              <span class="gallery-card__note">${escapeHtml(item.note || "Add your photo here")}</span>
              <span class="gallery-card__shine" aria-hidden="true"></span>
            </div>
            <div class="gallery-card__meta"><span>${escapeHtml(item.number || String(index + 1).padStart(2, "0"))}</span><span class="gallery-card__rule"></span><i class="bi bi-heart-fill" aria-hidden="true"></i></div>
            <h3>${escapeHtml(item.caption || "A beautiful day together.")}</h3>
          </article>
        `;
      })
      .join("");
  }

  const music = query("[data-music]");
  const musicToggle = query("[data-music-toggle]");
  const musicLabel = query("[data-music-label]");
  if (music && config.musicSrc) music.src = config.musicSrc;

  const setMusicState = (isPlaying, label) => {
    musicToggle?.classList.toggle("is-playing", isPlaying);
    musicToggle?.setAttribute("aria-pressed", String(isPlaying));
    musicToggle?.setAttribute("aria-label", label);
    if (musicLabel) musicLabel.textContent = label;
  };

  musicToggle?.addEventListener("click", async () => {
    if (!config.musicSrc) {
      setMusicState(false, "Add music in js/config.js");
      musicToggle.classList.add("is-notice");
      window.setTimeout(() => musicToggle.classList.remove("is-notice"), 900);
      return;
    }

    try {
      if (music.paused) {
        await music.play();
        setMusicState(true, "Pause music");
      } else {
        music.pause();
        setMusicState(false, "Play music");
      }
    } catch (error) {
      setMusicState(false, "Music could not start");
      console.info("Add a playable local audio file to enable the music control.", error);
    }
  });

  const letterStage = query("[data-letter-stage]");
  const letterToggle = query("[data-letter-toggle]");
  const letterStatus = query("#letter-status");
  letterToggle?.addEventListener("click", () => {
    const isOpen = letterStage.classList.toggle("is-open");
    letterToggle.setAttribute("aria-expanded", String(isOpen));
    query("span", letterToggle).textContent = isOpen ? "Close my letter" : "Open my letter";
    if (letterStatus) letterStatus.textContent = isOpen ? "The letter is open." : "The letter is closed.";
  });

  const burstLayer = query("[data-heart-burst]");
  const foreverButton = query("[data-forever-button]");
  foreverButton?.addEventListener("click", () => {
    document.body.classList.add("is-celebrating");
    if (burstLayer) {
      burstLayer.innerHTML = "";
      const symbols = ["♥", "✦", "♡", "·"];
      for (let index = 0; index < 36; index += 1) {
        const heart = document.createElement("span");
        heart.textContent = symbols[index % symbols.length];
        heart.style.setProperty("--x", `${(Math.random() - 0.5) * 90}vw`);
        heart.style.setProperty("--y", `${-20 - Math.random() * 70}vh`);
        heart.style.setProperty("--delay", `${Math.random() * 0.25}s`);
        heart.style.setProperty("--size", `${0.7 + Math.random() * 1.5}rem`);
        burstLayer.appendChild(heart);
      }
      window.setTimeout(() => {
        document.body.classList.remove("is-celebrating");
        burstLayer.innerHTML = "";
      }, reducedMotion ? 1000 : 3200);
    }
    foreverButton.blur();
  });

  const sections = queryAll(".story-section");
  const navLinks = queryAll("[data-nav-link]");
  const currentChapter = query("[data-current-chapter]");

  const setActiveChapter = (section) => {
    if (!section) return;
    const id = section.id;
    const chapter = section.dataset.chapter || "00";
    if (currentChapter) currentChapter.textContent = chapter;
    navLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.navLink === id));
  };

  if ("IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActiveChapter(visible[visible.length - 1].target);
      },
      { rootMargin: "-38% 0px -54%", threshold: 0 }
    );
    sections.forEach((section) => chapterObserver.observe(section));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 }
    );
    queryAll(".reveal-up").forEach((element) => revealObserver.observe(element));
  } else {
    queryAll(".reveal-up").forEach((element) => element.classList.add("is-visible"));
  }

  const updateHeader = () => {
    query("[data-header]")?.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    let pointerFrame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    window.addEventListener(
      "pointermove",
      (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (pointerFrame) return;
        pointerFrame = window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--pointer-x", `${pointerX}px`);
          document.documentElement.style.setProperty("--pointer-y", `${pointerY}px`);
          pointerFrame = 0;
        });
      },
      { passive: true }
    );
  }
})();
