(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis = null;
  let chatOpen = false;
  let chatLoading = false;
  let gsapBooted = false;
  let smoothScrollBooted = false;
  let galleryScrollUpdate = null;

  function safeStorage(storage, key, value) {
    try {
      if (value === undefined) return storage.getItem(key);
      storage.setItem(key, value);
      return value;
    } catch (_) {
      return null;
    }
  }

  function initLoader() {
    const loader = $("#loader");
    const bar = $("#loaderBar");
    const count = $("#loaderCount");
    const stage = $("#loaderStage");
    if (!loader || !bar || !count) return;

    let progress = prefersReducedMotion() ? 100 : 0;
    const startedAt = performance.now();
    const duration = 880;
    const finish = () => {
      bar.style.width = "100%";
      count.textContent = "100";
      if (stage) stage.textContent = "Arrival ready";
      window.setTimeout(() => {
        loader.classList.add("loader-done");
        window.setTimeout(() => { loader.hidden = true; }, 820);
      }, 140);
    };

    if (progress === 100) {
      finish();
      return;
    }

    const render = (now) => {
      const elapsed = now - startedAt;
      const linear = Math.min(elapsed / duration, 1);
      progress = Math.round((1 - Math.pow(1 - linear, 3)) * 100);
      bar.style.width = `${progress}%`;
      count.textContent = String(progress).padStart(3, "0");
      if (stage) {
        stage.textContent = progress < 38 ? "Loading fleet film" : progress < 72 ? "Connecting concierge" : "Preparing handover";
      }
      if (linear < 1) window.requestAnimationFrame(render);
      else finish();
    };

    window.requestAnimationFrame(render);
  }

  function scrollToTarget(target) {
    if (!target || !target.startsWith("#")) return false;
    const element = $(target);
    if (!element) return false;

    if (lenis && !prefersReducedMotion()) {
      lenis.scrollTo(element, { offset: -84, duration: 1.05 });
    } else {
      element.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
    if (history.replaceState) history.replaceState(null, "", target);
    return true;
  }

  function setMobileMenu(open) {
    const menu = $("#mobileNav");
    const button = $("#mobileMenuBtn");
    if (!menu || !button) return;
    menu.classList.toggle("active", open);
    button.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  }

  function initNavigation() {
    const nav = $("#siteNav");
    const menuButton = $("#mobileMenuBtn");

    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      if (nav) nav.classList.toggle("scrolled", y > 42);
      document.documentElement.style.setProperty("--page-scroll-progress", String(Math.max(0, Math.min(y / max, 1))));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    if (menuButton) {
      menuButton.addEventListener("click", () => setMobileMenu(!menuButton.classList.contains("open")));
    }

    $$("a[href^='#'], [data-scroll-target]").forEach((item) => {
      item.addEventListener("click", (event) => {
        const target = item.getAttribute("href") || item.dataset.scrollTarget;
        if (scrollToTarget(target)) {
          event.preventDefault();
          setMobileMenu(false);
        }
      });
    });
  }

  function initTheme() {
    const root = document.documentElement;
    const buttons = $$("#themeToggle, #mobileThemeToggle");
    const labels = $$("#themeToggleText, #mobileThemeToggleText");
    if (!buttons.length) return;

    const apply = (theme) => {
      const nextTheme = theme === "dark" ? "dark" : "light";
      root.setAttribute("data-theme", nextTheme);
      labels.forEach((label) => { label.textContent = nextTheme === "dark" ? "Dark" : "Light"; });
      buttons.forEach((button) => {
        button.setAttribute("aria-label", nextTheme === "dark" ? "Switch to light theme" : "Switch to dark theme");
        button.setAttribute("aria-pressed", String(nextTheme === "dark"));
      });
      safeStorage(localStorage, "pof-theme", nextTheme);
    };

    apply(safeStorage(localStorage, "pof-theme") || "light");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      });
    });
  }

  function initVideos() {
    const play = (video) => {
      if (!video || prefersReducedMotion()) return;
      const promise = video.play();
      if (promise && typeof promise.catch === "function") promise.catch(() => {});
    };

    $$(".hero-video.active, .scroll-3d-panel video").forEach(play);

    const heroVideos = $$(".hero-video");
    if (heroVideos.length > 1 && !prefersReducedMotion()) {
      let index = 0;
      window.setInterval(() => {
        heroVideos[index].classList.remove("active");
        index = (index + 1) % heroVideos.length;
        heroVideos[index].classList.add("active");
        play(heroVideos[index]);
      }, 5200);
    }

    const lazyVideos = $$("video[data-lazy-video]");
    if (!("IntersectionObserver" in window)) {
      lazyVideos.forEach(play);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) play(video);
        else video.pause();
      });
    }, { rootMargin: "80px 0px", threshold: 0.12 });

    lazyVideos.forEach((video) => observer.observe(video));
  }

  function initHoverEffects() {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return;

    $$(".fleet-row, .gallery-panel, .offer-runway div, .editorial-band figure, .story-media, .heli-media, .cinema-grid figure, .media-suite figure").forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        item.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
        item.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
      });

      item.addEventListener("pointerleave", () => {
        item.style.setProperty("--tilt-x", "0deg");
        item.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function initSmoothScroll() {
    if (prefersReducedMotion() || !window.Lenis) return;
    if (smoothScrollBooted) return;
    smoothScrollBooted = true;
    lenis = new window.Lenis({
      duration: 1.12,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.86,
      touchMultiplier: 1.05,
      lerp: 0.105
    });

    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }
    window.requestAnimationFrame(raf);

    lenis.on("scroll", () => {
      if (window.ScrollTrigger) window.ScrollTrigger.update();
      if (galleryScrollUpdate) galleryScrollUpdate();
    });
  }

  function initGsap() {
    if (prefersReducedMotion() || !window.gsap || !window.ScrollTrigger) return;
    if (gsapBooted) return;
    gsapBooted = true;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(".nav", { y: -24, opacity: 0 });
    gsap.set(".hero .kicker, .hero-copy, .hero-actions", { y: 30, opacity: 0 });
    gsap.set(".hero-title-line", { y: 46, opacity: 0, clipPath: "inset(0 0 100% 0)" });
    gsap.set(".hero-media", { scale: 1.14, filter: "brightness(0.78) saturate(1.18)" });
    gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.08 })
      .to(".nav", { y: 0, opacity: 1, duration: 0.58 }, 0)
      .to(".hero .kicker", { y: 0, opacity: 1, duration: 0.52 }, 0.04)
      .to(".hero-title-line", { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.72, stagger: 0.09 }, 0.1)
      .to(".hero-copy", { y: 0, opacity: 1, duration: 0.62 }, 0.28)
      .to(".hero-media", { scale: 1, filter: "brightness(1) saturate(1.05)", duration: 1.08 }, 0.04)
      .to(".hero-actions", { y: 0, opacity: 1, duration: 0.58 }, 0.52);

    gsap.to(".hero-title-line:first-child", {
      xPercent: -3.5,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });

    gsap.to(".hero-title-line:last-child", {
      xPercent: 2.5,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });

    gsap.to(".hero-media", {
      scale: 1.16,
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    gsap.to(".hero-orbit", {
      rotateZ: 70,
      rotateX: 12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.4 }
    });

    gsap.utils.toArray("main > section:not(.hero):not(.motion-gallery), .marquee, .footer").forEach((section) => {
      gsap.fromTo(section,
        { y: 86, opacity: 0.36, filter: "blur(14px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 92%", end: "top 48%", scrub: 0.85 }
        }
      );
    });

    gsap.utils.toArray(".flow-lines div, .fleet-row, .lease-lanes article, .faq-item, .heli-tags span, .offer-runway div, .cinema-copy-intro figure, .cinema-grid figure, .media-suite figure").forEach((item) => {
      gsap.fromTo(item,
        { y: 64, opacity: 0, rotateX: 5, transformPerspective: 1200 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 92%", toggleActions: "play none none reverse" }
        }
      );
    });

    gsap.utils.toArray(".fleet-row").forEach((row, index) => {
      gsap.fromTo(row,
        { rotateY: index % 2 === 0 ? -8 : 8, z: -80 },
        {
          rotateY: 0,
          z: 0,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top bottom", end: "center center", scrub: 0.8 }
        }
      );
    });

    gsap.utils.toArray(".gallery-row").forEach((row) => {
      const panels = $$(".gallery-panel", row);

      gsap.fromTo(panels,
        { opacity: 0.38, scale: 0.965, rotateX: 3, transformPerspective: 1400 },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.055,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none reverse" }
        }
      );
    });

    gsap.utils.toArray(".fleet-image-wrap img, .story-media video, .heli-video, .cinema-copy-intro img, .cinema-grid img, .cinema-grid video, .media-suite img, .media-suite video, .editorial-band img, .offer-runway img").forEach((media) => {
      gsap.to(media, {
        scale: 1.13,
        yPercent: -5,
        ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: 1.1 }
      });
    });

    gsap.utils.toArray(".story-media, .heli-media, .cinema-copy-intro figure, .cinema-grid figure, .media-suite figure, .editorial-band figure").forEach((media, index) => {
      gsap.fromTo(media,
        { rotateX: 7, rotateY: index % 2 === 0 ? -6 : 6, y: 80, opacity: 0.58, transformPerspective: 1400 },
        {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: media, start: "top 90%", end: "center 56%", scrub: 0.9 }
        }
      );
    });
  }

  function initGalleryScrollMotion() {
    if (prefersReducedMotion()) return;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const states = $$(".gallery-row").map((row) => ({
      row,
      viewport: $(".gallery-viewport", row),
      track: $(".gallery-track", row),
      previous: $('[data-gallery-move="previous"]', row),
      next: $('[data-gallery-move="next"]', row),
      current: null,
      target: 0,
      base: 0,
      travel: 0,
      manualOffset: 0,
      dragging: false,
      dragStartX: 0,
      dragStartOffset: 0
    })).filter((state) => state.track && state.viewport);
    if (!states.length) return;
    let frame = 0;
    let lastTime = performance.now();

    const update = (time) => {
      frame = 0;
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth || 1;
      const viewportHeight = window.innerHeight || 1;
      const elapsed = Math.min(Math.max(time - lastTime, 0), 64);
      const blend = 1 - Math.pow(0.0008, elapsed / 1000);
      let moving = false;
      lastTime = time;

      states.forEach((state) => {
        const rect = state.row.getBoundingClientRect();
        const verticalRun = Math.max(viewportHeight + rect.height, 1);
        const progress = Math.max(0, Math.min((viewportHeight - rect.top) / verticalRun, 1));
        const travel = Math.max(state.track.scrollWidth - viewportWidth, 0);
        const movesLeft = state.row.dataset.galleryDirection !== "ltr";

        state.travel = travel;
        state.base = movesLeft ? -travel * progress : -travel * (1 - progress);
        state.target = clamp(state.base + state.manualOffset, -travel, 0);
        if (state.current === null) state.current = state.target;
        state.current += (state.target - state.current) * blend;
        if (Math.abs(state.target - state.current) < 0.12) {
          state.current = state.target;
        } else {
          moving = true;
        }

        state.track.style.transform = `translate3d(${state.current.toFixed(2)}px, 0, 0)`;
        const laneProgress = travel > 0 ? Math.abs(state.target) / travel : 0;
        state.row.style.setProperty("--lane-progress", laneProgress.toFixed(4));
        if (state.previous) state.previous.disabled = state.target >= -0.5;
        if (state.next) state.next.disabled = state.target <= -travel + 0.5;
      });

      if (moving) frame = window.requestAnimationFrame(update);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    states.forEach((state) => {
      const stepBy = (direction) => {
        const panel = $(".gallery-panel", state.track);
        const gap = Number.parseFloat(getComputedStyle(state.track).columnGap || getComputedStyle(state.track).gap) || 0;
        const step = panel ? panel.getBoundingClientRect().width + gap : window.innerWidth * 0.72;
        state.manualOffset += direction * step;
        requestUpdate();
      };

      state.previous?.addEventListener("click", () => stepBy(1));
      state.next?.addEventListener("click", () => stepBy(-1));

      state.viewport.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || event.target.closest("a, button")) return;
        state.dragging = true;
        state.dragStartX = event.clientX;
        state.dragStartOffset = state.manualOffset;
        state.row.classList.add("is-dragging");
        state.viewport.setPointerCapture?.(event.pointerId);
      });

      state.viewport.addEventListener("pointermove", (event) => {
        if (!state.dragging) return;
        state.manualOffset = state.dragStartOffset + event.clientX - state.dragStartX;
        requestUpdate();
      });

      const finishDrag = (event) => {
        if (!state.dragging) return;
        state.dragging = false;
        state.row.classList.remove("is-dragging");
        if (state.viewport.hasPointerCapture?.(event.pointerId)) state.viewport.releasePointerCapture(event.pointerId);
      };

      state.viewport.addEventListener("pointerup", finishDrag);
      state.viewport.addEventListener("pointercancel", finishDrag);
    });

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("orientationchange", requestUpdate, { passive: true });
    galleryScrollUpdate = requestUpdate;
    document.documentElement.dataset.galleryMotion = "ready";
    requestUpdate();
  }

  function initCustomCursor() {
    const cursor = $("#cursorOrbit");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!cursor || !finePointer || prefersReducedMotion()) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let cursorFrame = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      cursor.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        cursorFrame = window.requestAnimationFrame(render);
      } else {
        cursorFrame = 0;
      }
    };

    window.setTimeout(() => document.body.classList.add("cursor-enhanced"), 850);
    document.addEventListener("pointermove", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add("visible");
      cursor.classList.toggle("is-active", Boolean(event.target.closest("a, button, input, [role='button']")));
      cursor.classList.toggle("is-media", Boolean(event.target.closest("img, video, .gallery-viewport")));
      if (!cursorFrame) cursorFrame = window.requestAnimationFrame(render);
    }, { passive: true });
    document.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"), { passive: true });
    document.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"), { passive: true });
    document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("visible"));
    window.addEventListener("blur", () => cursor.classList.remove("visible"));
  }

  function initFaq() {
    $$(".faq-question").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        if (!item) return;
        const open = item.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
        const toggle = $("span", button);
        if (toggle) toggle.textContent = open ? "-" : "+";
      });
    });
  }

  function currentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function conciergeReply(text) {
    const query = text.toLowerCase();
    if (query.includes("airport") || query.includes("dxb") || query.includes("delivery")) {
      return "Yes, POF Rental offers DXB airport delivery plus hotel and residence drop-off across Dubai. Send your arrival time, terminal, preferred car, and rental duration for the smoothest handover.";
    }
    if (query.includes("monthly") || query.includes("month") || query.includes("lease") || query.includes("long")) {
      return "Weekly rentals start from AED 2,500/week, monthly lease options from AED 8,500/month, and long-term plans from AED 6,000/month depending on the model.";
    }
    if (query.includes("deal") || query.includes("offer") || query.includes("sale") || query.includes("discount")) {
      return "The Exclusive Super Sale runs June 25 - July 1, 2026: Ferrari Purosangue and Ferrari 12 Cilindri from AED 3,399/day, plus Porsche 911 GT3 RS from AED 1,899/day.";
    }
    if (query.includes("ferrari") || query.includes("lamborghini") || query.includes("porsche") || query.includes("supercar")) {
      return "For supercars, Ferrari Purosangue gives V12 luxury, Ferrari 12 Cilindri is pure V12 theatre, Lamborghini Huracan EVO is dramatic, and Porsche 911 GT3 RS is the precise driver's car.";
    }
    if (query.includes("chauffeur") || query.includes("driver")) {
      return "Chauffeur service is available for executives and VIP guests with advance booking. Share the date, itinerary, pickup location, and preferred vehicle tier.";
    }
    if (query.includes("price") || query.includes("deposit") || query.includes("fee")) {
      return "Pricing is confirmed clearly before booking, with no hidden fees and no-deposit options on select models. The final rate depends on vehicle, duration, delivery location, and seasonal availability.";
    }
    return "Welcome to POF Rental. I can help with fleet options, pricing, airport delivery, chauffeur service, Chinese EVs, and long-term leases. Share your date, delivery area, duration, and preferred style.";
  }

  function appendMessage(role, text) {
    const messages = $("#chatMessages");
    if (!messages) return;
    const message = document.createElement("div");
    message.className = `chat-msg ${role}`;

    const wrap = document.createElement("div");
    wrap.className = "chat-bubble-wrap";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text;
    const time = document.createElement("div");
    time.className = "chat-time";
    time.textContent = currentTime();
    wrap.append(bubble, time);
    message.appendChild(wrap);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function setChatTyping(show) {
    const messages = $("#chatMessages");
    if (!messages) return;
    $("#chatTyping")?.remove();
    if (!show) return;

    const message = document.createElement("div");
    message.className = "chat-msg bot typing";
    message.id = "chatTyping";
    message.setAttribute("aria-label", "Aria is typing");
    const wrap = document.createElement("div");
    wrap.className = "chat-bubble-wrap";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerHTML = "<span></span><span></span><span></span>";
    wrap.appendChild(bubble);
    message.appendChild(wrap);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function setChatNudge(open, remember = false) {
    const nudge = $("#chatNudge");
    if (!nudge) return;
    nudge.classList.toggle("visible", open);
    nudge.setAttribute("aria-hidden", String(!open));
    if (remember) safeStorage(sessionStorage, "pof-chat-nudge-seen-v16", "true");
  }

  function setChatOpen(open) {
    const panel = $("#chatbotWindow");
    const trigger = $("#chatTrigger");
    if (!panel || !trigger) return;

    chatOpen = open;
    panel.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", String(!open));
    trigger.classList.toggle("active", open);
    if (open) trigger.classList.add("seen");
    trigger.setAttribute("aria-label", open ? "Close chat with Aria" : "Open chat with Aria");
    trigger.setAttribute("aria-expanded", String(open));
    if (open) setChatNudge(false, true);
    if (open && window.matchMedia("(min-width: 721px)").matches) window.setTimeout(() => $("#chatInput")?.focus(), 120);
  }

  function updateChatInput() {
    const input = $("#chatInput");
    const send = $("#chatSend");
    if (!input || !send) return;
    send.disabled = chatLoading || input.value.trim().length === 0;
    input.disabled = chatLoading;
  }

  function sendChat(text) {
    const value = String(text || "").trim();
    if (!value || chatLoading) return;
    const input = $("#chatInput");
    if (input) input.value = "";
    setChatOpen(true);
    appendMessage("user", value);
    chatLoading = true;
    setChatTyping(true);
    updateChatInput();
    window.setTimeout(() => {
      setChatTyping(false);
      appendMessage("bot", conciergeReply(value));
      chatLoading = false;
      updateChatInput();
    }, 720);
  }

  function initChat() {
    appendMessage("bot", "Welcome to POF Rental. I'm Aria, your Dubai luxury fleet concierge. Are you looking to explore our fleet, check availability, or enquire about a long-term lease?");
    $("#chatTrigger")?.addEventListener("click", () => setChatOpen(!chatOpen));
    $("#chatClose")?.addEventListener("click", () => setChatOpen(false));
    $("#chatForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      sendChat($("#chatInput")?.value || "");
    });
    $("#chatInput")?.addEventListener("input", updateChatInput);
    $$("[data-chat-text]").forEach((button) => button.addEventListener("click", () => sendChat(button.dataset.chatText)));
    $("#chatNudgeAction")?.addEventListener("click", () => {
      setChatNudge(false, true);
      setChatOpen(true);
    });
    $("#chatNudgeClose")?.addEventListener("click", () => setChatNudge(false, true));
    if (window.matchMedia("(min-width: 721px)").matches) {
      window.setTimeout(() => {
        if (!chatOpen && safeStorage(sessionStorage, "pof-chat-nudge-seen-v16") !== "true") setChatNudge(true);
      }, 4200);
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && chatOpen) setChatOpen(false);
    });
    updateChatInput();
  }

  function initExitPopup() {
    const popup = $("#exitPopup");
    if (!popup) return;
    const armedAt = Date.now() + 30000;
    const show = () => {
      if (safeStorage(sessionStorage, "pof-exit-popup-seen") === "true") return;
      safeStorage(sessionStorage, "pof-exit-popup-seen", "true");
      popup.hidden = false;
    };
    document.addEventListener("mouseout", (event) => {
      if (Date.now() >= armedAt && window.scrollY > 600 && event.clientY <= 8 && !event.relatedTarget) show();
    });
    if (window.innerWidth <= 768) window.setTimeout(show, 45000);
    $$("[data-close-exit]").forEach((button) => button.addEventListener("click", () => { popup.hidden = true; }));
  }

  function boot() {
    if (document.documentElement.dataset.pofBooted === "true") return;
    document.documentElement.dataset.pofBooted = "true";
    initLoader();
    initNavigation();
    initTheme();
    initVideos();
    initHoverEffects();
    initSmoothScroll();
    initGsap();
    initGalleryScrollMotion();
    initCustomCursor();
    window.addEventListener("load", initSmoothScroll, { once: true });
    window.addEventListener("load", initGsap, { once: true });
    initFaq();
    initChat();
    initExitPopup();
  }

  function bootAfterHydration() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(boot);
    });
  }

  if (document.documentElement.dataset.pofReactHydrated === "true") {
    bootAfterHydration();
  } else {
    window.addEventListener("pof:react-hydrated", bootAfterHydration, { once: true });
  }
}());
