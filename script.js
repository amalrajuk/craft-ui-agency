/**
 * CRAFT UI - Interactive Engine & GSAP Animations
 * Matching DeplotAi aesthetic with heightened polish & interactivity
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // =========================================================================
  // 1. PRELOADER
  // =========================================================================
  const preloader = document.getElementById("preloader");
  const preloaderProgress = document.getElementById("preloaderProgress");
  const preloaderDot = document.getElementById("preloaderDot");
  const preloaderText = document.getElementById("preloaderText");

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);

      if (preloaderProgress) preloaderProgress.style.width = "100%";
      if (preloaderDot) preloaderDot.style.left = "100%";
      if (preloaderText) preloaderText.textContent = "ENGINE ONLINE [ 100% ]";

      setTimeout(() => {
        if (preloader) preloader.classList.add("fade-out");
        initHeroAnimations();
      }, 400);
    } else {
      if (preloaderProgress) preloaderProgress.style.width = `${progress}%`;
      if (preloaderDot) preloaderDot.style.left = `${progress}%`;
      if (preloaderText) preloaderText.textContent = `INITIALIZING ENGINE [ ${progress}% ]`;
    }
  }, 100);

  // =========================================================================
  // 2. AUDIO SYNTHESIZER (Web Audio API)
  // =========================================================================
  let soundEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playTone(freq = 600, duration = 0.08, type = "sine") {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  const soundToggle = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggle.style.color = soundEnabled ? "var(--accent)" : "inherit";
      soundToggle.style.borderColor = soundEnabled ? "var(--accent)" : "inherit";
      if (soundEnabled) {
        playTone(880, 0.12, "sine");
      }
    });
  }

  // Hover tone on interactive elements
  document.querySelectorAll("a, button, .service-box, .portfolio-card").forEach(el => {
    el.addEventListener("mouseenter", () => {
      playTone(520, 0.05, "sine");
    });
  });

  // =========================================================================
  // 3. CUSTOM CURSOR
  // =========================================================================
  const cursor = document.getElementById("customCursor");
  const follower = document.getElementById("customCursorFollower");

  if (cursor && follower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function renderFollower() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(renderFollower);
    }
    renderFollower();

    // Enlarge cursor on interactive items
    document.querySelectorAll("a, button, input, select, textarea, .service-box, .portfolio-card, .filter-btn").forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(2.2)";
        cursor.style.backgroundColor = "var(--accent)";
        follower.style.transform = "translate(-50%, -50%) scale(1.6)";
        follower.style.borderColor = "var(--accent)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.backgroundColor = "var(--accent)";
        follower.style.transform = "translate(-50%, -50%) scale(1)";
        follower.style.borderColor = "rgba(0, 240, 255, 0.5)";
      });
    });
  }

  // =========================================================================
  // 4. GSAP SCROLLTRIGGER STACKING PANELS (Signature DeplotAi Interaction)
  // =========================================================================
  function initStackingPanels() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
      ignoreMobileResize: true
    });

    const panels = document.querySelectorAll(".stack-panel");

    panels.forEach((panel, i) => {
      // Pin panels 1 and above so they stack smoothly as cards
      if (i > 0) {
        ScrollTrigger.create({
          trigger: panel,
          start: () => panel.offsetHeight > window.innerHeight ? "bottom bottom" : "top top",
          end: () => "+=" + window.innerHeight,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          id: `panel-stack-${i}`,
          invalidateOnRefresh: true
        });
      }
    });

    // Parallax hero titles and 3D grid
    const heroTitles = document.getElementById("heroTitles");
    const heroGrid = document.getElementById("heroGrid");
    const heroPanel = document.getElementById("hero");

    if (heroTitles && heroPanel) {
      gsap.to(heroTitles, {
        scrollTrigger: {
          trigger: heroPanel,
          start: "top top",
          end: "bottom top",
          scrub: 0.6
        },
        y: -160,
        opacity: 0.1,
        ease: "none"
      });
    }

    if (heroGrid && heroPanel) {
      gsap.to(heroGrid, {
        scrollTrigger: {
          trigger: heroPanel,
          start: "top top",
          end: "bottom top",
          scrub: 1
        },
        y: 120,
        rotateX: 20,
        scale: 1.15,
        opacity: 0.2,
        ease: "none"
      });
    }
  }

  // Hero entrance reveal
  function initHeroAnimations() {
    if (window.gsap) {
      gsap.from(".hero-tag", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".hero-title-outline", { y: 60, opacity: 0, duration: 1, delay: 0.2, ease: "power4.out" });
      gsap.from(".hero-title-solid", { y: 60, opacity: 0, duration: 1, delay: 0.35, ease: "power4.out" });
      gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8, delay: 0.5, ease: "power3.out" });
      gsap.from(".hero-cta-group", { y: 20, opacity: 0, duration: 0.8, delay: 0.65, ease: "power3.out" });
      gsap.from(".hero-stats-row", { opacity: 0, y: 20, duration: 0.8, delay: 0.8, ease: "power3.out" });
    }
    initStackingPanels();
  }

  // =========================================================================
  // 5. THEME TOGGLE
  // =========================================================================
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const htmlRoot = document.documentElement;

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      htmlRoot.setAttribute("data-theme", newTheme);

      if (themeIcon) {
        themeIcon.setAttribute("data-lucide", newTheme === "dark" ? "sun" : "moon");
        if (window.lucide) lucide.createIcons();
      }
      playTone(750, 0.08, "triangle");
    });
  }

  // =========================================================================
  // 6. MOBILE MENU
  // =========================================================================
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
      });
    });
  }

  // =========================================================================
  // 7. PORTFOLIO FILTERING
  // =========================================================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      playTone(600, 0.08, "sine");

      portfolioCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
          if (window.gsap) {
            gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          } else {
            card.style.opacity = "1";
          }
        } else {
          card.style.display = "none";
        }
      });

      // Refresh ScrollTrigger after DOM layout shift
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  });

  // =========================================================================
  // 8. CONTACT FORM SUBMISSION
  // =========================================================================
  const contactForm = document.getElementById("contactForm");
  const transmitBtn = document.getElementById("transmitBtn");
  const formStatusMsg = document.getElementById("formStatusMsg");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const service = document.getElementById("contactService").value;
      const message = document.getElementById("contactMessage").value.trim();

      if (!name || !email || !message) return;

      playTone(850, 0.2, "square");
      if (transmitBtn) {
        transmitBtn.innerHTML = `<span>TRANSMITTING BRIEF...</span>`;
        transmitBtn.disabled = true;
      }

      setTimeout(() => {
        if (transmitBtn) {
          transmitBtn.innerHTML = `<span>TRANSMISSION COMPLETE</span> <i data-lucide="check-circle" style="width: 20px; height: 20px;"></i>`;
          transmitBtn.style.background = "#00f0ff";
          transmitBtn.style.color = "#020001";
        }
        if (formStatusMsg) {
          formStatusMsg.classList.add("success");
          formStatusMsg.textContent = `THANK YOU ${name.toUpperCase()}! BRIEF RECEIVED FOR ${service.toUpperCase()}. WE WILL CONNECT WITHIN 12 HOURS.`;
        }

        contactForm.reset();
        playTone(1050, 0.3, "sine");
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
          if (transmitBtn) {
            transmitBtn.innerHTML = `<span>Transmit Project Brief</span> <i data-lucide="send" style="width: 20px; height: 20px;"></i>`;
            transmitBtn.disabled = false;
            if (window.lucide) lucide.createIcons();
          }
        }, 5000);
      }, 1000);
    });
  }

  // =========================================================================
  // 9. CLIENT REVIEW SUBMISSION MODAL
  // =========================================================================
  const reviewModal = document.getElementById("reviewModal");
  const openReviewModalBtn = document.getElementById("openReviewModalBtn");
  const closeReviewModalBtn = document.getElementById("closeReviewModalBtn");
  const reviewSubmitForm = document.getElementById("reviewSubmitForm");
  const starRatingSelect = document.getElementById("starRatingSelect");
  const storiesGrid = document.getElementById("storiesGrid");

  let currentRating = 5;

  if (starRatingSelect) {
    const stars = starRatingSelect.querySelectorAll(".star");
    stars.forEach(star => {
      star.addEventListener("click", () => {
        currentRating = parseInt(star.getAttribute("data-value"));
        stars.forEach(s => {
          const val = parseInt(s.getAttribute("data-value"));
          if (val <= currentRating) {
            s.classList.add("selected");
          } else {
            s.classList.remove("selected");
          }
        });
        playTone(700, 0.05, "sine");
      });
    });
  }

  if (openReviewModalBtn && reviewModal) {
    openReviewModalBtn.addEventListener("click", () => {
      reviewModal.classList.add("open");
      playTone(600, 0.08, "sine");
    });
  }

  if (closeReviewModalBtn && reviewModal) {
    closeReviewModalBtn.addEventListener("click", () => {
      reviewModal.classList.remove("open");
    });

    reviewModal.addEventListener("click", (e) => {
      if (e.target === reviewModal) {
        reviewModal.classList.remove("open");
      }
    });
  }

  if (reviewSubmitForm && storiesGrid) {
    reviewSubmitForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("reviewName").value.trim();
      const role = document.getElementById("reviewRole").value.trim();
      const text = document.getElementById("reviewText").value.trim();

      if (!name || !text) return;

      // Create new review card
      const newCard = document.createElement("div");
      newCard.className = "story-card";
      newCard.innerHTML = `
        <div>
          <div class="story-stars">
            ${Array(currentRating).fill('<i data-lucide="star" style="fill: currentColor; width: 18px; height: 18px;"></i>').join('')}
          </div>
          <p class="story-quote">"${text}"</p>
        </div>
        <div class="story-author-wrap">
          <img src="assets/logo.jpg" alt="${name}" class="story-avatar">
          <div>
            <h4 class="story-author-name">${name}</h4>
            <span class="story-author-role">${role}</span>
          </div>
        </div>
      `;

      storiesGrid.prepend(newCard);
      if (window.lucide) lucide.createIcons();

      playTone(950, 0.25, "sine");
      reviewModal.classList.remove("open");
      reviewSubmitForm.reset();

      alert("Thank you! Your verified client review has been published.");

      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  }

  // =========================================================================
  // 10. AI ASSISTANT CHATBOT WIDGET ("CraftBot")
  // =========================================================================
  const chatbotTrigger = document.getElementById("chatbotTrigger");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotCloseBtn = document.getElementById("chatbotCloseBtn");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotSendBtn = document.getElementById("chatbotSendBtn");
  const quickActionBtns = document.querySelectorAll(".quick-action-btn");

  if (chatbotTrigger && chatbotWindow) {
    chatbotTrigger.addEventListener("click", () => {
      chatbotWindow.classList.toggle("open");
      playTone(680, 0.1, "sine");
      if (chatbotWindow.classList.contains("open")) {
        chatbotInput.focus();
      }
    });
  }

  if (chatbotCloseBtn && chatbotWindow) {
    chatbotCloseBtn.addEventListener("click", () => {
      chatbotWindow.classList.remove("open");
    });
  }

  function appendChatMessage(text, sender = "bot") {
    if (!chatbotMessages) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function handleBotResponse(query) {
    const q = query.toLowerCase();
    let reply = "";

    if (q.includes("service") || q.includes("what do you do") || q.includes("offer")) {
      reply = `We provide 9 core digital capabilities at <strong>Craft UI</strong>:<br>
      • Animated & 3D WebGL Experiences<br>
      • High-Converting Business Websites<br>
      • Custom Headless Shopify & E-Commerce<br>
      • AI Chatbots & Customer Automation<br>
      • SaaS Control Planes & CMS Dashboards<br>
      • Full Agency Web Development & UI Design.`;
    } else if (q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("rate")) {
      reply = `Our project pricing is tailored to client requirements:<br>
      • <strong>High-Impact Business Websites:</strong> Starting from ₹25,000 / $350<br>
      • <strong>Custom 3D / Animated WebGL Sites:</strong> Starting from ₹55,000 / $700<br>
      • <strong>Full E-Commerce & SaaS Apps:</strong> Custom quoted.<br>
      Every project includes responsive design, SEO optimization, and 30-day post-launch support.`;
    } else if (q.includes("3d") || q.includes("animated") || q.includes("webgl")) {
      reply = `Yes! 3D and WebGL experiences are our signature craft. We utilize <strong>Three.js, GLSL custom shaders, and GSAP ScrollTrigger</strong> to create 60 FPS fluid interactive websites that elevate your brand reputation.`;
    } else if (q.includes("start") || q.includes("project") || q.includes("contact") || q.includes("hire")) {
      reply = `Starting a project with Craft UI is seamless! You can scroll to our <a href="#contact" style="color: var(--accent); text-decoration: underline;" onclick="document.getElementById('chatbotWindow').classList.remove('open')">Contact Section</a> and send a transmission brief, or email us directly at <strong>hello@craftui.studio</strong>.`;
    } else if (q.includes("location") || q.includes("where") || q.includes("kerala")) {
      reply = `Our development studio is based in <strong>Kerala, India</strong>, and we engineer digital products for agencies and creators worldwide (remote global delivery).`;
    } else {
      reply = `Thank you for asking! Craft UI is dedicated to delivering pixel-perfect, lightning-fast digital products. Would you like to review our <a href="#services" style="color: var(--accent);" onclick="document.getElementById('chatbotWindow').classList.remove('open')">Services</a> or <a href="#contact" style="color: var(--accent);" onclick="document.getElementById('chatbotWindow').classList.remove('open')">Start a Project</a>?`;
    }

    setTimeout(() => {
      appendChatMessage(reply, "bot");
      playTone(800, 0.08, "sine");
    }, 400);
  }

  function sendUserMessage() {
    if (!chatbotInput) return;
    const text = chatbotInput.value.trim();
    if (!text) return;

    appendChatMessage(text, "user");
    chatbotInput.value = "";
    playTone(650, 0.06, "sine");
    handleBotResponse(text);
  }

  if (chatbotSendBtn) {
    chatbotSendBtn.addEventListener("click", sendUserMessage);
  }

  if (chatbotInput) {
    chatbotInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        sendUserMessage();
      }
    });
  }

  quickActionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const query = btn.getAttribute("data-query");
      appendChatMessage(query, "user");
      playTone(650, 0.06, "sine");
      handleBotResponse(query);
    });
  });

});
