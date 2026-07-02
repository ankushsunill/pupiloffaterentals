(function () {
  "use strict";

  const WHATSAPP_BASE = "https://wa.me/?text=";
  const DEFAULT_THEME = "dark";
  const CHAT_ENDPOINT = window.POF_CHAT_ENDPOINT || "";
  const HERO_LABELS = [
    "Close-up performance details in motion",
    "Open-air supercar arrival sequence",
    "Track-bred sports presence",
    "Palm-lined Dubai delivery drive",
    "Electric luxury movement"
  ];

  const fleet = [
    { brand: "Mercedes-AMG", name: "G63 AMG", hp: "577", torque: "850Nm", sprint: "4.2", price: "2,500", img: "media/2 3.webp" },
    { brand: "Ferrari", name: "Roma Spider", hp: "620", torque: "760Nm", sprint: "3.4", price: "4,200", img: "media/01 2.webp" },
    { brand: "Lamborghini", name: "Huracan EVO", hp: "640", torque: "600Nm", sprint: "2.9", price: "5,500", img: "media/01.webp" },
    { brand: "Rolls-Royce", name: "Ghost", hp: "563", torque: "900Nm", sprint: "4.8", price: "6,800", img: "media/DSC07812.webp" },
    { brand: "Bentley", name: "Continental GT", hp: "542", torque: "770Nm", sprint: "4.0", price: "4,800", img: "media/4.webp" },
    { brand: "Porsche", name: "Cayenne Turbo GT", hp: "640", torque: "800Nm", sprint: "3.3", price: "2,800", img: "media/44.webp" },
    { brand: "McLaren", name: "Artura", hp: "671", torque: "720Nm", sprint: "3.0", price: "4,900", img: "media/4 2.webp" },
    { brand: "Range Rover", name: "Autobiography", hp: "523", torque: "750Nm", sprint: "4.6", price: "2,200", img: "media/range-rover-autobiography.webp" }
  ];

  const quickSuggestions = [
    "Current deals & offers",
    "Best car for a business trip",
    "Airport delivery info",
    "Monthly lease rates",
    "Compare Ferrari vs Lamborghini",
    "Chinese EV options"
  ];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function whatsappUrl(message) {
    return WHATSAPP_BASE + encodeURIComponent(message);
  }

  function currentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function safeStorage(storage, key, value) {
    try {
      if (value === undefined) return storage.getItem(key);
      storage.setItem(key, value);
      return value;
    } catch (_) {
      return null;
    }
  }


  function onScrollRaf(update, includeResize = false) {
    let ticking = false;
    const run = () => {
      ticking = false;
      update();
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(run);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    if (includeResize) window.addEventListener("resize", requestUpdate);
  }

  function loadVideo(video) {
    if (!video || video.dataset.videoLoaded === "true") return;
    video.querySelectorAll("source[data-src]").forEach((source) => {
      source.src = source.dataset.src;
    });
    video.dataset.videoLoaded = "true";
    video.load();
  }

  function shouldUseMotionMedia() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const constrainedNetwork = connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ""));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !constrainedNetwork && !reducedMotion;
  }

  function playVideo(video) {
    if (!video || !shouldUseMotionMedia()) return;
    loadVideo(video);
    const play = video.play();
    if (play && typeof play.catch === "function") play.catch(() => { });
  }

  function buildLoaderTicks() {
    const ticks = $("#ringTicks");
    if (!ticks) return;

    const svgNS = "http://www.w3.org/2000/svg";
    for (let i = 0; i < 24; i += 1) {
      const angle = i * 15 * Math.PI / 180;
      const r1 = 50;
      const r2 = 54;
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", String(60 + r1 * Math.cos(angle)));
      line.setAttribute("y1", String(60 + r1 * Math.sin(angle)));
      line.setAttribute("x2", String(60 + r2 * Math.cos(angle)));
      line.setAttribute("y2", String(60 + r2 * Math.sin(angle)));
      line.setAttribute("stroke", "rgba(201,168,76,0.4)");
      line.setAttribute("stroke-width", i % 6 === 0 ? "1.5" : "0.5");
      ticks.appendChild(line);
    }
  }

  function syncLoaderTheme() {
    const loader = $("#loader");
    if (!loader) return;
    loader.dataset.theme = document.documentElement.dataset.theme || DEFAULT_THEME;
  }

  function initLoader() {
    syncLoaderTheme();
    const loader = $("#loader");
    const bar = $("#loaderBar");
    const count = $("#loaderCount");
    if (!loader || !bar || !count) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let progress = reducedMotion ? 100 : 0;

    const finish = () => {
      const logoWrap = $(".loader-logo-wrap");
      const navLogo = $(".nav-logo-img");

      if (!reducedMotion && logoWrap && navLogo) {
        const source = logoWrap.getBoundingClientRect();
        const target = navLogo.getBoundingClientRect();
        const dx = target.left + target.width / 2 - (source.left + source.width / 2);
        const dy = target.top + target.height / 2 - (source.top + source.height / 2);
        const scale = Math.max(0.42, Math.min(0.82, target.width / source.width));

        loader.style.setProperty("--loader-dx", `${dx}px`);
        loader.style.setProperty("--loader-dy", `${dy}px`);
        loader.style.setProperty("--loader-scale", String(scale));
        loader.classList.add("loader-merging");

        window.setTimeout(() => {
          loader.classList.add("loader-done");
          loader.hidden = true;
        }, 620);
        return;
      }

      loader.classList.add("loader-done");
      window.setTimeout(() => {
        loader.hidden = true;
      }, 320);
    };

    if (reducedMotion) {
      bar.style.width = "100%";
      count.textContent = "100";
      finish();
      return;
    }

    const interval = window.setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 18 + 12);
      bar.style.width = progress + "%";
      count.textContent = String(Math.floor(progress)).padStart(3, "0");
      if (progress >= 100) {
        window.clearInterval(interval);
        window.setTimeout(finish, 120);
      }
    }, 34);
  }

  function applyTheme(theme) {
    const nextTheme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    safeStorage(localStorage, "pof-theme", nextTheme);
    syncLoaderTheme();

    $$("[data-theme-toggle]").forEach((button) => {
      const isDark = nextTheme === "dark";
      button.textContent = isDark ? "⏾" : "☀︎";
      button.setAttribute("aria-label", isDark ? "Current theme: dark. Switch to light theme" : "Current theme: light. Switch to dark theme");
      button.setAttribute("title", isDark ? "Dark theme" : "Light theme");
    });
  }

  function initTheme() {
    const defaultVersion = "dark-2026-07";
    if (safeStorage(localStorage, "pof-theme-default-version") !== defaultVersion) {
      safeStorage(localStorage, "pof-theme", DEFAULT_THEME);
      safeStorage(localStorage, "pof-theme-manual", "false");
      safeStorage(localStorage, "pof-theme-default-version", defaultVersion);
    }

    const hasManualTheme = safeStorage(localStorage, "pof-theme-manual") === "true";
    applyTheme(hasManualTheme ? safeStorage(localStorage, "pof-theme") || DEFAULT_THEME : DEFAULT_THEME);
    $$("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        safeStorage(localStorage, "pof-theme-manual", "true");
        applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
      });
    });
  }

  function scrollToSection(target) {
    if (!target || !target.startsWith("#")) return false;
    const element = $(target);
    if (!element) return false;

    element.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
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
    const progressBar = $("#navProgress");
    const menuButton = $("#mobileMenuBtn");

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      if (nav) nav.classList.toggle("scrolled", scrollY > 64);
      if (progressBar) progressBar.style.width = `${(scrollY / maxScroll) * 100}%`;
    };

    onScrollRaf(onScroll);

    if (menuButton) {
      menuButton.addEventListener("click", () => {
        setMobileMenu(!menuButton.classList.contains("open"));
      });
    }

    $$("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = link.getAttribute("href");
        if (scrollToSection(target)) {
          event.preventDefault();
          setMobileMenu(false);
        }
      });
    });

    $$("[data-scroll-target]").forEach((button) => {
      button.addEventListener("click", () => scrollToSection(button.dataset.scrollTarget));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMobileMenu(false);
        closeExitPopup();
        setChatOpen(false);
      }
    });
  }

  function initHero() {
    const videos = $$(".hero-video");
    const label = $("#heroSlideLabel");
    const videoWrap = $("#heroVideoWrap");
    const dots = $$('[data-hero-dot]');
    const previews = $$('[data-hero-preview]');
    if (videos.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const allowHeroVideo = shouldUseMotionMedia();
    let active = 0;
    let timer = null;
    let heroVisible = true;

    const startTimer = () => {
      window.clearInterval(timer);
      if (!reducedMotion && allowHeroVideo && videos.length > 1) timer = window.setInterval(() => setActive(active + 1), 7000);
    };

    const setActive = (index, userAction = false) => {
      active = ((index % videos.length) + videos.length) % videos.length;
      videos.forEach((video, currentIndex) => {
        const isActive = currentIndex === active;
        video.classList.toggle("active", isActive);
        if (isActive && heroVisible && allowHeroVideo && !reducedMotion) {
          playVideo(video);
        } else {
          video.pause();
        }
      });
      dots.forEach((dot) => dot.classList.toggle("active", Number(dot.dataset.heroDot) === active));
      previews.forEach((preview) => preview.classList.toggle("active", Number(preview.dataset.heroPreview) === active));
      if (label) label.textContent = HERO_LABELS[active] || HERO_LABELS[0];
      if (userAction) startTimer();
    };

    dots.forEach((dot) => dot.addEventListener("click", () => setActive(Number(dot.dataset.heroDot), true)));
    previews.forEach((preview) => preview.addEventListener("click", () => setActive(Number(preview.dataset.heroPreview), true)));

    if ("IntersectionObserver" in window && videoWrap) {
      const observer = new IntersectionObserver((entries) => {
        heroVisible = entries.some((entry) => entry.isIntersecting);
        if (heroVisible) {
          if (allowHeroVideo && !reducedMotion) playVideo(videos[active]);
          startTimer();
        } else {
          window.clearInterval(timer);
          videos.forEach((video) => video.pause());
        }
      }, { threshold: 0.08 });
      observer.observe(videoWrap);
    }

    setActive(0);
    startTimer();

    const onScroll = () => {
      if (!videoWrap) return;
      const hero = $(".hero");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      videoWrap.style.transform = `translate3d(0, ${progress * 8}%, 0) scale(${1 + progress * 0.025})`;
      document.documentElement.style.setProperty("--hero-progress", progress.toFixed(3));
    };
    onScrollRaf(onScroll);
  }

  function initReveal() {
    const revealItems = $$(".fade-up, .section-motion, .motion-child");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach((item) => observer.observe(item));
  }

  function initSectionMotion() {
    $$("main > section:not(.hero), .sale-ticker, .footer").forEach((section, index) => {
      section.classList.add("section-motion", index % 2 === 0 ? "from-left" : "from-right");
    });

    $$(".lease-card, .why-item, .promo-deal, .about-feature, .airport-card, .faq-item, .promo-card").forEach((item, index) => {
      item.classList.add("motion-child", index % 2 === 0 ? "from-left" : "from-right");
      item.style.setProperty("--motion-delay", `${Math.min(index % 4, 3) * 80}ms`);
    });
  }

  function initScrollMotion() {
    if (window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches) return;

    const animatedSections = $$(".section-motion");
    if (animatedSections.length === 0) return;

    let lastScrollY = -1;
    const update = () => {
      const scrollY = Math.round(window.scrollY || document.documentElement.scrollTop || 0);
      if (Math.abs(scrollY - lastScrollY) < 24) return;
      lastScrollY = scrollY;

      const viewport = window.innerHeight || 1;
      animatedSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
        section.style.setProperty("--scroll-progress", progress.toFixed(2));
      });
    };

    onScrollRaf(update, true);
  }

  function fleetCard(car) {
    const message = `Hello POF Rental, I want to book the ${car.name}. Please share availability and price.`;
    return `
      <article class="scroll-car-card fade-up">
        <div class="scroll-car-img-wrap">
          <img src="${car.img}" alt="${car.name}" class="scroll-car-img" loading="lazy" decoding="async">
        </div>
        <div class="scroll-car-info">
          <div class="scroll-car-brand">${car.brand}</div>
          <div class="scroll-car-name">${car.name}</div>
          <div class="scroll-car-specs">
            <div class="scroll-car-spec"><span class="scroll-spec-val">${car.hp}</span><span class="scroll-spec-label">HP</span></div>
            <div class="scroll-car-spec"><span class="scroll-spec-val">${car.torque}</span><span class="scroll-spec-label">Torque</span></div>
            <div class="scroll-car-spec"><span class="scroll-spec-val">${car.sprint}s</span><span class="scroll-spec-label">0-100</span></div>
          </div>
          <div class="scroll-car-footer">
            <div class="scroll-car-price">AED ${car.price} <span>/day</span></div>
            <a class="mini-book-link" href="${whatsappUrl(message)}" target="_blank" rel="noreferrer">Book</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderFleetRows() {
    const rowOne = $("[data-scroll-row='left']");
    const rowTwo = $("[data-scroll-row='right']");
    if (!rowOne || !rowTwo) return;

    const firstRow = fleet.slice(0, 4);
    const secondRow = fleet.slice(4);
    rowOne.innerHTML = [...firstRow, ...firstRow].map(fleetCard).join("");
    rowTwo.innerHTML = [...secondRow, ...secondRow].map(fleetCard).join("");
  }

  function initFleetScroll() {
    const section = $(".fleet-scroll-section");
    const rows = $$("[data-scroll-row]");
    if (!section || rows.length === 0) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));

      rows.forEach((row) => {
        const wrapperWidth = row.parentElement ? row.parentElement.clientWidth : window.innerWidth;
        const distance = Math.max(row.scrollWidth - wrapperWidth, 220);
        const direction = row.dataset.scrollRow === "right" ? -1 : 1;
        const x = direction === 1 ? -distance * progress : -distance + distance * progress;
        row.style.transform = `translate3d(${x}px, 0, 0)`;
      });
    };

    onScrollRaf(update, true);
  }

  function initCards() {
    $$(".car-card").forEach((card) => {
      const image = $(".car-card-img", card);
      if (!image) return;

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        image.style.transform = `translate(${x * 15}px, ${y * 10}px) scale(1.08)`;
        card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        image.style.transform = "";
        card.style.transform = "";
      });
    });

    if (!window.matchMedia("(pointer: fine) and (min-width: 1180px)").matches) return;

    $$(".lease-card, .why-item, .promo-deal, .about-feature, .airport-card, .faq-item, .promo-card").forEach((surface) => {
      surface.classList.add("interactive-surface");
    });
  }

  function initFAQ() {
    $$(".faq-question").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        if (!item) return;
        const isOpen = item.classList.toggle("open");
        button.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  function getConciergeReply(text) {
    const query = text.toLowerCase();
    const normalized = query
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!normalized) {
      return "I'm here with you. Send me a quick note about dates, vehicle style, or budget and I will guide you.";
    }

    if (/\b(how are you|how r you|how are u|how do you do|how is it going|how's it going)\b/.test(normalized)) {
      return "I'm good, thank you for asking. How are you doing today? If you are planning a Dubai rental, I can also help you pick the right car.";
    }

    if (/^(hi|hello|hey|yo|hiya|good morning|good afternoon|good evening|salam|assalam|asalam)\b/.test(normalized)) {
      return "Hello, welcome to POF Rental. I'm Aria, your Dubai luxury fleet concierge. How can I help today - booking, prices, airport delivery, or car recommendations?";
    }

    if (/\b(i am good|i m good|im good|i am fine|i m fine|im fine|doing good|doing well|all good|great|fine thanks)\b/.test(normalized)) {
      return "Glad to hear that. What can I help you with today - a supercar for the day, an airport delivery, or a monthly lease?";
    }

    if (/\b(thank you|thanks|appreciate|thank)\b/.test(normalized)) {
      return "You're very welcome. If you share your date, delivery area, and preferred car style, I can help narrow the best options.";
    }

    if (/\b(bye|goodbye|see you|talk later)\b/.test(normalized)) {
      return "Goodbye for now. When you are ready, send your dates and preferred car category and POF Rental can help with availability.";
    }

    if (/\b(who are you|your name|what are you)\b/.test(normalized)) {
      return "I'm Aria, the POF Rental concierge assistant. I can help with Dubai fleet options, pricing guidance, airport delivery, chauffeur requests, and long-term lease choices.";
    }

    if (/\b(help|what can you do|support)\b/.test(normalized)) {
      return "I can help you compare cars, check what details are needed for availability, explain airport delivery, suggest monthly lease options, and prepare a WhatsApp booking message.";
    }

    if (/\b(location|where are you|address|map)\b/.test(normalized)) {
      return "POF Rental serves Dubai, UAE, with delivery to hotels, residences, and DXB airport. Share your delivery area and rental date for the most accurate guidance.";
    }

    if (/\b(contact|phone|number|call|whatsapp|talk to human|agent)\b/.test(normalized)) {
      return "You can use the WhatsApp button in this chat for the fastest concierge response. Include your rental date, delivery location, vehicle preference, and rental duration.";
    }

    if (/\b(open|hours|timing|time|24 7|available now)\b/.test(normalized)) {
      return "Concierge support is positioned for 24/7 assistance. For live availability, send your preferred car, pickup time, and delivery location through WhatsApp.";
    }

    if (/\b(document|license|licence|passport|id|requirements)\b/.test(normalized)) {
      return "For most rentals, you should be ready with a valid driving license, ID or passport details, and your delivery location. Requirements can vary by residency and vehicle category.";
    }

    if (/\b(cheap|budget|lowest|affordable|best price|value)\b/.test(normalized)) {
      return "For best value, compare weekly or monthly rates instead of daily pricing. Prestige SUVs and Chinese luxury EVs often give the strongest comfort-to-price balance.";
    }

    if (query.includes("airport") || query.includes("dxb") || query.includes("pickup") || query.includes("delivery")) {
      return "Yes, POF Rental offers DXB airport delivery plus hotel and residence drop-off across Dubai. For a smooth handover, send your arrival time, terminal, preferred car, and rental duration.";
    }

    if (query.includes("monthly") || query.includes("month") || query.includes("lease") || query.includes("long")) {
      return "For longer stays, weekly rentals start from AED 2,500/week, monthly lease options from AED 8,500/month, and 3-12 month plans from AED 6,000/month depending on the model. Prestige SUVs and Chinese luxury EVs are often the strongest monthly value.";
    }

    if (query.includes("business") || query.includes("recommend") || query.includes("choose") || query.includes("which car")) {
      return "For business travel, I would suggest a Mercedes-AMG G63, Range Rover Autobiography, or Rolls-Royce Ghost. For a sharper weekend drive, Porsche 911 GT3 RS or Ferrari Roma Spider feel more special. Tell me your occasion and number of passengers for a tighter recommendation.";
    }

    if (/\b(family|kids|child|children|suv|space|luggage|bags)\b/.test(normalized)) {
      return "For family comfort or luggage space, I would lean toward a Range Rover Autobiography, Mercedes-AMG G63, Porsche Cayenne Turbo GT, or a luxury Chinese SUV. Share passenger count and bags for a better fit.";
    }

    if (query.includes("chinese") || query.includes("ev") || query.includes("electric") || query.includes("byd") || query.includes("zeekr") || query.includes("hongqi")) {
      return "The Chinese luxury fleet focuses on Jetour, BYD, Zeekr, and Hongqi models. They are ideal if you want premium interiors, advanced cabin tech, and electric or hybrid comfort for Dubai city driving.";
    }

    if (query.includes("ferrari") || query.includes("lamborghini") || query.includes("porsche") || query.includes("supercar")) {
      return "For supercars, the Ferrari Purosangue is a luxury performance SUV, Ferrari 12 Cilindri is pure V12 theatre, Lamborghini Huracan EVO is the dramatic choice, and Porsche 911 GT3 RS is the precise driver's car. I can help compare them for comfort, status, or performance.";
    }

    if (query.includes("chauffeur") || query.includes("driver")) {
      return "Chauffeur service is available for executives and VIP guests with advance booking. Share the date, itinerary, pickup location, and preferred vehicle tier so the concierge can prepare a quote.";
    }

    if (query.includes("deal") || query.includes("offers") || query.includes("sale") || query.includes("discount") || query.includes("promotion")) {
      return "The headline offer is the Exclusive Super Sale from June 25 to July 1, 2026: Ferrari Purosangue and Ferrari 12 Cilindri from AED 3,399/day, plus Porsche 911 GT3 RS from AED 1,899/day. Share your rental date and I can guide you to the fastest booking path.";
    }

    if (query.includes("deposit") || query.includes("hidden") || query.includes("fee") || query.includes("price")) {
      return "Pricing is confirmed clearly before booking, with no hidden fees and no-deposit options on select models. The final rate depends on the vehicle, rental duration, delivery location, and seasonal availability.";
    }

    if (query.includes("available") || query.includes("availability") || query.includes("book") || query.includes("reserve")) {
      return "To check availability quickly, share your rental date, duration, delivery location, and preferred car or category. For the fastest human confirmation, use the WhatsApp button and include those details.";
    }

    return "I can help with fleet options, pricing, airport delivery, chauffeur service, Chinese EVs, and long-term leases. Tell me your date, location, rental duration, and the kind of experience you want - comfort, status, performance, or best value.";
  }

  async function resolveChatReply(text) {
    if (!CHAT_ENDPOINT) return getConciergeReply(text);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          brand: "POF Rental",
          context: "Dubai luxury car rental concierge"
        }),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      return data.reply || data.message || getConciergeReply(text);
    } catch (_) {
      return getConciergeReply(text);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  let chatOpen = false;
  let chatLoading = false;

  function appendChatMessage(role, text, options = {}) {
    const messages = $("#chatMessages");
    if (!messages) return null;

    const message = document.createElement("div");
    message.className = `chat-msg ${role}${options.error ? " error" : ""}`;

    if (role === "bot") {
      const avatar = document.createElement("div");
      avatar.className = "chat-avatar-dot";
      avatar.innerHTML = "&#10022;";
      message.appendChild(avatar);
    }

    const wrap = document.createElement("div");
    wrap.className = "chat-bubble-wrap";

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);

    const time = document.createElement("div");
    time.className = "chat-time";
    time.textContent = currentTime();
    wrap.appendChild(time);

    if (options.suggestions) {
      const suggestions = document.createElement("div");
      suggestions.className = "chat-suggestions";
      quickSuggestions.forEach((suggestion) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chat-suggestion";
        button.textContent = suggestion;
        button.addEventListener("click", () => sendChatMessage(suggestion));
        suggestions.appendChild(button);
      });
      wrap.appendChild(suggestions);
    }

    message.appendChild(wrap);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function appendTyping() {
    const messages = $("#chatMessages");
    if (!messages) return null;

    const message = document.createElement("div");
    message.className = "chat-msg bot";
    message.innerHTML = `
      <div class="chat-avatar-dot">&#10022;</div>
      <div class="chat-bubble-wrap">
        <div class="chatbot-typing" aria-label="Aria is typing">
          <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>
      </div>
    `;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function updateChatInput() {
    const input = $("#chatInput");
    const send = $("#chatSend");
    if (!input || !send) return;
    send.disabled = chatLoading || input.value.trim().length === 0;
    input.disabled = chatLoading;
  }

  function sendChatMessage(rawText) {
    const input = $("#chatInput");
    const text = String(rawText || "").trim();
    if (!text || chatLoading) return;

    setChatOpen(true);
    $$(".chat-suggestions").forEach((el) => el.remove());
    if (input) input.value = "";
    appendChatMessage("user", text);

    chatLoading = true;
    updateChatInput();
    const typing = appendTyping();

    window.setTimeout(async () => {
      if (typing) typing.remove();
      appendChatMessage("bot", await resolveChatReply(text));
      chatLoading = false;
      updateChatInput();
      if (input) input.focus();
    }, 560 + Math.random() * 520);
  }

  function setChatOpen(open) {
    const windowEl = $("#chatbotWindow");
    const trigger = $("#chatTrigger");
    const icon = $("#chatTriggerIcon");
    const input = $("#chatInput");
    if (!windowEl || !trigger || !icon) return;

    chatOpen = open;
    windowEl.classList.toggle("open", chatOpen);
    windowEl.setAttribute("aria-hidden", String(!chatOpen));
    trigger.classList.toggle("active", chatOpen);
    trigger.setAttribute("aria-label", chatOpen ? "Close chat with Aria" : "Open chat with Aria");
    icon.innerHTML = chatOpen ? "&times;" : "&#10022;";

    if (chatOpen && input) {
      window.setTimeout(() => input.focus(), 120);
    }
  }

  function initChat() {
    appendChatMessage(
      "bot",
      "Welcome to POF Rental. I'm Aria, your Dubai luxury fleet concierge. Are you looking to explore our fleet, check availability, or enquire about a long-term lease?",
      { suggestions: true }
    );

    const trigger = $("#chatTrigger");
    const close = $("#chatClose");
    const form = $("#chatForm");
    const input = $("#chatInput");

    if (trigger) trigger.addEventListener("click", () => setChatOpen(!chatOpen));
    if (close) close.addEventListener("click", () => setChatOpen(false));

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        sendChatMessage(input ? input.value : "");
      });
    }

    if (input) input.addEventListener("input", updateChatInput);
    $$(".quick-action-btn[data-chat-text]").forEach((button) => {
      button.addEventListener("click", () => sendChatMessage(button.dataset.chatText));
    });
    updateChatInput();
  }

  function showExitPopup() {
    const popup = $("#exitPopup");
    if (!popup || safeStorage(sessionStorage, "pof-exit-popup-seen") === "true") return;
    safeStorage(sessionStorage, "pof-exit-popup-seen", "true");
    popup.hidden = false;
  }

  function closeExitPopup() {
    const popup = $("#exitPopup");
    if (popup) popup.hidden = true;
  }

  function initExitPopup() {
    document.addEventListener("mouseout", (event) => {
      const leavingTop = event.clientY <= 8;
      const leavingDocument = !event.relatedTarget && !event.toElement;
      if (leavingTop || leavingDocument) showExitPopup();
    });

    window.setTimeout(() => {
      if (window.innerWidth <= 768) showExitPopup();
    }, 14000);

    $$("[data-close-exit]").forEach((button) => {
      button.addEventListener("click", closeExitPopup);
    });
  }

  function initCursor() {
    const cursor = $(".cursor");
    const follower = $(".cursor-follower");
    if (!cursor || !follower || window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    document.addEventListener("mouseover", (event) => {
      if (event.target.closest("a, button, input, [data-cursor='hover']")) {
        cursor.classList.add("hover");
        follower.classList.add("hover");
      }
    });

    document.addEventListener("mouseout", () => {
      cursor.classList.remove("hover");
      follower.classList.remove("hover");
    });

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      window.requestAnimationFrame(animate);
    };
    animate();
  }

  function initLazyVideos() {
    const videos = $$('video[data-lazy-video="true"]:not(.hero-video)');
    if (videos.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      videos.forEach((video) => playVideo(video));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          playVideo(video);
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }, { rootMargin: "180px 0px", threshold: 0.05 });

    videos.forEach((video) => observer.observe(video));
  }

  function initMediaFallbacks() {
    $$(".car-card-img, .scroll-car-img, .experience-card img, .about-visual-img").forEach((media) => {
      if (media.tagName !== "IMG") return;
      media.addEventListener("error", () => {
        if (media.dataset.fallbackApplied === "true") return;
        media.dataset.fallbackApplied = "true";
        media.src = "media/01.webp";
      });
    });
  }

  function initMagneticButtons() {
    const targets = $$(".magnetic, .btn-primary, .btn-secondary, .nav-cta, .car-card-btn, .mini-book-link, .hero-preview");
    if (!window.matchMedia("(pointer: fine) and (min-width: 1180px)").matches) return;

    targets.forEach((target) => {
      target.addEventListener("mousemove", (event) => {
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        target.style.setProperty("--magnetic-x", `${x * 0.12}px`);
        target.style.setProperty("--magnetic-y", `${y * 0.12}px`);
      });
      target.addEventListener("mouseleave", () => {
        target.style.setProperty("--magnetic-x", "0px");
        target.style.setProperty("--magnetic-y", "0px");
      });
    });
  }

  function initLanguageButtons() {
    $$(".footer-language").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".footer-language").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildLoaderTicks();
    renderFleetRows();
    initSectionMotion();
    initTheme();
    initLoader();
    initNavigation();
    initHero();
    initReveal();
    initScrollMotion();
    initFleetScroll();
    initCards();
    initLazyVideos();
    initMediaFallbacks();
    initMagneticButtons();
    initFAQ();
    initChat();
    initExitPopup();
    // Disabled by default: custom cursor animation can cause scroll jank on hosted builds.
    // initCursor();
    initLanguageButtons();
  });
}());
