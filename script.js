const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".site-nav");
const typingTitle = document.querySelector(".typing-title");
const progressBars = document.querySelectorAll(".skill-progress");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const backToTopBtn = document.querySelector(".back-to-top");
const heroSection = document.getElementById("home");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function typeText(el, speed = 55) {
  if (!el) return;
  const text = el.dataset.text || "";
  const textNode = document.createTextNode("");
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  el.textContent = "";
  el.append(textNode, cursor);
  let index = 0;

  const timer = setInterval(() => {
    textNode.textContent = text.slice(0, index);
    index += 1;

    if (index > text.length) {
      clearInterval(timer);
      setTimeout(() => {
        cursor.remove();
      }, 220);
    }
  }, speed);
}

function animateSkillBars() {
  progressBars.forEach((bar) => {
    const width = bar.dataset.width || "0%";
    bar.style.width = width;
  });
}

function resetSkillBars() {
  progressBars.forEach((bar) => {
    bar.style.width = "0%";
  });
}

function setupStaggerAnimations() {
  sections.forEach((section) => {
    const items = section.querySelectorAll(
      "h2, h3, p, li, blockquote, .timeline-item, .contact-card, .btn, .profile-photo"
    );

    let delay = 0;
    items.forEach((item) => {
      if (
        item.classList.contains("reveal-up") ||
        item.classList.contains("reveal-left") ||
        item.classList.contains("typing-title") ||
        item.classList.contains("timeline-item") ||
        item.classList.contains("contact-card")
      ) {
        return;
      }

      item.classList.add("stagger-item");
      item.style.transitionDelay = `${Math.min(delay, 420)}ms`;
      delay += 70;
    });
  });
}

setupStaggerAnimations();

function setupSplitFlowAnimations() {
  const flowGroups = document.querySelectorAll(".timeline, .grid-two, .contact-cards");

  flowGroups.forEach((group) => {
    const flowItems = group.querySelectorAll(".timeline-item, .contact-card");

    flowItems.forEach((item, index) => {
      item.classList.remove("reveal-up", "reveal-left", "delay-1", "delay-2");
      item.classList.add("flow-item");
      item.classList.add(index % 2 === 0 ? "flow-left" : "flow-right");
    });
  });
}

setupSplitFlowAnimations();

const revealElements = document.querySelectorAll(
  ".reveal-up, .reveal-left, .stagger-item, .flow-item"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");

        if (entry.target.id === "skills") {
          animateSkillBars();
        }
      } else {
        entry.target.classList.remove("show");

        if (entry.target.id === "skills") {
          resetSkillBars();
        }
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((el) => observer.observe(el));

const skillsSection = document.getElementById("skills");
if (skillsSection) observer.observe(skillsSection);

typeText(typingTitle);

function updateActiveNavLink() {
  const headerOffset = 110;
  const scrollPosition = window.scrollY + headerOffset;
  const pageBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;

  let currentSectionId = sections[0]?.id || "";

  if (pageBottom && sections.length > 0) {
    currentSectionId = sections[sections.length - 1].id;
  } else {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSectionId = section.id;
      }
    });
  }

  navLinks.forEach((link) => {
    const target = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", target === currentSectionId);
  });
}

updateActiveNavLink();
window.addEventListener("scroll", updateActiveNavLink);

const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
document.body.appendChild(scrollProgress);

function updateScrollProgress() {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress);

function updateBackToTopVisibility() {
  if (!backToTopBtn) return;
  const triggerPoint = heroSection
    ? heroSection.offsetTop + heroSection.offsetHeight - 120
    : 300;
  backToTopBtn.classList.toggle("visible", window.scrollY > triggerPoint);
}

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    backToTopBtn.classList.remove("bounce");
    void backToTopBtn.offsetWidth;
    backToTopBtn.classList.add("bounce");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

updateBackToTopVisibility();
window.addEventListener("scroll", updateBackToTopVisibility);
