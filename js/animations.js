(() => {
  "use strict";

  const query = (selector, scope = document) => scope.querySelector(selector);
  const queryAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactViewport = window.matchMedia("(max-width: 680px)").matches;
  const lowPowerDevice = compactViewport || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  const createFloaters = (layer) => {
    if (reducedMotion) return;
    const kind = layer.dataset.floaters;
    const count = kind === "memory"
      ? lowPowerDevice ? 6 : 12
      : kind === "final"
        ? lowPowerDevice ? 14 : 26
        : lowPowerDevice ? 12 : 22;
    const areHearts = kind === "memory";

    for (let index = 0; index < count; index += 1) {
      const floater = document.createElement("span");
      floater.className = `floater${areHearts ? " floater--heart" : ""}`;
      floater.style.setProperty("--top", `${-12 + Math.random() * 105}%`);
      floater.style.setProperty("--left", `${Math.random() * 100}%`);
      floater.style.setProperty("--size", `${areHearts ? 0.45 + Math.random() * 0.7 : 0.45 + Math.random() * 0.9}rem`);
      floater.style.setProperty("--rotation", `${-50 + Math.random() * 100}deg`);
      floater.style.setProperty("--drift", `${-5 + Math.random() * 10}rem`);
      floater.style.setProperty("--duration", `${7 + Math.random() * 8}s`);
      floater.style.setProperty("--delay", `${-Math.random() * 12}s`);
      layer.appendChild(floater);
    }
  };

  queryAll("[data-floaters]").forEach(createFloaters);

  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  if (compactViewport || window.matchMedia("(pointer: coarse)").matches) {
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  const hero = query("#home");
  const heroSky = query('[data-parallax="sky"]');
  const heroScene = query('[data-parallax="scene"]');

  if (hero && heroSky && heroScene && !compactViewport) {
    gsap.to(heroSky, {
      yPercent: 12,
      scale: 1.08,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(heroScene, {
      yPercent: -8,
      xPercent: 2,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // Pin each book long enough for its right page to open into the spread.
  queryAll(".chapter--paper, .chapter--midnight").forEach((chapter) => {
    const page = query(".book-page--right", chapter);
    const book = query(".open-book", chapter);
    if (!page || !book) return;

    ScrollTrigger.create({
      trigger: chapter,
      start: "top 64%",
      end: "bottom 36%",
      onEnter: () => chapter.classList.add("is-active"),
      onEnterBack: () => chapter.classList.add("is-active"),
      onLeaveBack: () => chapter.classList.remove("is-active"),
      onLeave: () => chapter.classList.remove("is-active")
    });

    gsap.fromTo(
      page,
      { rotateY: -28, x: 38 },
      {
        rotateY: 0,
        x: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: chapter,
          start: "top 72%",
          end: "top 18%",
          scrub: 1.1
        }
      }
    );

    gsap.fromTo(
      book,
      { y: 28, rotateX: 10 },
      {
        y: 0,
        rotateX: 5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: chapter,
          start: "top 85%",
          end: "top 28%",
          scrub: 1
        }
      }
    );
  });

  const galleryCards = queryAll("[data-gallery-card]");
  if (galleryCards.length) {
    gsap.fromTo(
      galleryCards,
      { y: 48, opacity: 0, rotate: (index) => (index % 2 ? 5 : -4) },
      {
        y: 0,
        opacity: 1,
        rotate: (index) => (index === 1 ? 3 : index === 3 ? 4 : index === 2 ? -1 : -2.5),
        stagger: compactViewport ? 0.08 : 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#moments",
          start: "top 68%",
          end: "top 20%",
          scrub: 0.8
        }
      }
    );
  }

  const letter = query("#letter");
  if (letter) {
    gsap.fromTo(
      ".letter-stage",
      { y: 40, rotate: 2 },
      {
        y: 0,
        rotate: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: letter, start: "top 80%", end: "top 28%", scrub: 0.9 }
      }
    );
  }

  const forever = query("#forever");
  if (forever && !compactViewport) {
    gsap.to(".forever-heart", {
      scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: forever, start: "top bottom", end: "bottom top", scrub: true }
    });
    gsap.to(".forever-couple", {
      yPercent: -7,
      ease: "none",
      scrollTrigger: { trigger: forever, start: "top bottom", end: "bottom top", scrub: true }
    });
  }

  // A tiny global progress variable lets future themes add a progress rail without another scroll listener.
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => document.documentElement.style.setProperty("--scroll-progress", self.progress.toFixed(3))
  });
})();
