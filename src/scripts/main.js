import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { handleDynamicContentResize } from "./utils/dynamic-resize.js";
import { initSectionColors } from "./utils/section-colors.js";
import { createVideoPlayer } from "./utils/video-player.js";
import { createModal } from "./utils/modal.js";

import { register } from "swiper/element/bundle";
register();

// Reset scroll position on page reload
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Initialize Lenis smooth scroll
export const lenis = new Lenis({
  duration: 2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
  autoRaf: false, // Disable auto RAF since we're using GSAP ticker
});

// Sync Lenis with ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);

// Integrate Lenis with GSAP ticker for better performance
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable lag smoothing to prevent delays in scroll animations
gsap.ticker.lagSmoothing(0);

// Make lenis available globally for components
window.lenis = lenis;

// Navigation handler with anchor scrolling and menu state
function handleNav() {
  const homeLinks = document.querySelectorAll(".home-link");
  const aboutLinks = document.querySelectorAll(".about-link");
  const ourWayLinks = document.querySelectorAll(".how-we-work-link");
  const shopLinks = document.querySelectorAll(".shop-link");
  const contactLinks = document.querySelectorAll(".contact-link");

  const homeEl = document.querySelector("#home");
  const aboutEl = document.querySelector("#about-us");
  const ourWayEl = document.querySelector("#work");
  const shopEl = document.querySelector("#shop");
  const contactEl = document.querySelector("#contact");

  const mobileNavBtn = document.querySelector(".burger");
  const mobileNavBtnClose = document.querySelector(".close");
  const mobileNav = document.querySelector(".mobile");

  // While Lenis is doing a programmatic scroll, keep the clicked item active
  // to avoid flicker when ScrollTrigger enters/leaves boundaries mid-scroll.
  function lockActiveMenu(id, durationMs = 1500) {
    window.__menuActiveLockId = id;
    window.__menuActiveLockUntil = Date.now() + durationMs;
  }

  function closeMobileMenu() {
    if (!mobileNav) return;
    // If the menu is open, close it with the GSAP out animation
    if (!mobileNav.classList.contains("hidden")) {
      animateMenuOut();
    } else {
      mobileNav.classList.add("hidden");
    }
    mobileNavOpen = false;
  }

  const setHomeMenu = () => {
    homeLinks.forEach(link => link.classList.add("active"));
    shopLinks.forEach(link => link.classList.remove("active"));
    aboutLinks.forEach(link => link.classList.remove("active"));
    ourWayLinks.forEach(link => link.classList.remove("active"));
    contactLinks.forEach(link => link.classList.remove("active"));
    closeMobileMenu();
  };

  const setAboutMenu = () => {
    homeLinks.forEach(link => link.classList.remove("active"));
    shopLinks.forEach(link => link.classList.remove("active"));
    aboutLinks.forEach(link => link.classList.add("active"));
    ourWayLinks.forEach(link => link.classList.remove("active"));
    contactLinks.forEach(link => link.classList.remove("active"));
    closeMobileMenu();
  };

  const setOurWayMenu = () => {
    homeLinks.forEach(link => link.classList.remove("active"));
    shopLinks.forEach(link => link.classList.remove("active"));
    aboutLinks.forEach(link => link.classList.remove("active"));
    ourWayLinks.forEach(link => link.classList.add("active"));
    contactLinks.forEach(link => link.classList.remove("active"));
    closeMobileMenu();
  };

  const setShopMenu = () => {
    homeLinks.forEach(link => link.classList.remove("active"));
    shopLinks.forEach(link => link.classList.add("active"));
    ourWayLinks.forEach(link => link.classList.remove("active"));
    aboutLinks.forEach(link => link.classList.remove("active"));
    contactLinks.forEach(link => link.classList.remove("active"));
    closeMobileMenu();
  };

  const setContactMenu = () => {
    homeLinks.forEach(link => link.classList.remove("active"));
    shopLinks.forEach(link => link.classList.remove("active"));
    contactLinks.forEach(link => link.classList.add("active"));
    aboutLinks.forEach(link => link.classList.remove("active"));
    ourWayLinks.forEach(link => link.classList.remove("active"));
    closeMobileMenu();
  };

  // Anchor navigation with smooth scroll
  // Use querySelectorAll to get all links (desktop and mobile)
  if (homeLinks.length > 0 && homeEl) {
    homeLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lockActiveMenu("home", 1600);
        lenis.scrollTo(homeEl, { offset: 0, duration: 1.2 });
        setHomeMenu();
      });
    });
  }

  if (aboutLinks.length > 0 && aboutEl) {
    aboutLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lockActiveMenu("about", 1600);
        lenis.scrollTo(aboutEl, { offset: 0, duration: 1.2 });
        setAboutMenu();
      });
    });
  }

  if (ourWayLinks.length > 0 && ourWayEl) {
    ourWayLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lockActiveMenu("work", 1600);
        lenis.scrollTo(ourWayEl, { offset: 0, duration: 1.2 });
        setOurWayMenu();
      });
    });
  }

  if (shopLinks.length > 0 && shopEl) {
    shopLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lockActiveMenu("shop", 1600);
        lenis.scrollTo(shopEl, { offset: 0, duration: 1.2 });
        setShopMenu();
      });
    });
  }

  if (contactLinks.length > 0 && contactEl) {
    contactLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lockActiveMenu("contact", 1600);
        lenis.scrollTo(contactEl, { offset: 0, duration: 1.2 });
        setContactMenu();
      });
    });
  }

  // Mobile navigation toggle with animations
  let mobileNavOpen = false;
  
  // Custom ease for smooth Awwwards-style animation
  const customEase = "power4.inOut";
  
  // Initialize menu items state when menu is hidden
  function initializeMenuState() {
    const navLinks = mobileNav.querySelectorAll(".nav ul li a");
    const contactText = mobileNav.querySelector(".contact p");
    const contactEmail = mobileNav.querySelector(".contact a");
    
    gsap.set([navLinks], {
      opacity: 0,
      y: 100,
    });
    gsap.set([contactText, contactEmail], {
      opacity: 0,
      y: 60,
    });
  }
  
  // Animate mobile menu items in
  function animateMenuIn() {
    const navLinks = mobileNav.querySelectorAll(".nav ul li a");
    const contactText = mobileNav.querySelector(".contact p");
    const contactEmail = mobileNav.querySelector(".contact a");
    
    // Animate nav links with stagger - smoother timing
    if (navLinks.length > 0) {
      gsap.to(navLinks, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: {
          amount: 0.2,
          from: "start"
        },
        ease: customEase,
      });
    }
    
    // Animate contact text - smoother delay
    if (contactText) {
      gsap.to(contactText, {
        opacity: 0.5,
        y: 0,
        duration: 1,
        delay: 1,
        ease: customEase,
      });
    }
    
    // Animate email - smoother delay
    if (contactEmail) {
      gsap.to(contactEmail, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        delay: 1,
        ease: customEase,
      });
    }
  }
  
  // Animate mobile menu items out
  function animateMenuOut() {
    const navLinks = mobileNav.querySelectorAll(".nav ul li a");
    const contactText = mobileNav.querySelector(".contact p");
    const contactEmail = mobileNav.querySelector(".contact a");
    
    // Animate out (reverse order) - smoother
    const tl = gsap.timeline({
      onComplete: () => {
        mobileNav.classList.add("hidden");
        initializeMenuState();
      }
    });
    
    if (contactEmail) {
      tl.to(contactEmail, {
        opacity: 0,
        y: -60,
        duration: 0.4,
        ease: "power4.inOut",
      });
    }
    
    if (contactText) {
      tl.to(contactText, {
        opacity: 0,
        y: -60,
        duration: 0.6,
        ease: "power4.inOut",
      }, "-=0.4");
    }
    
    if (navLinks.length > 0) {
      tl.to(navLinks, {
        opacity: 0,
        y: -100,
        duration: 0.4,
        stagger: {
          amount: 0.2,
          from: "end"
        },
        ease: "power4.inOut",
      }, "-=1.5");
    }
  }
  
  // Initialize menu state on load
  if (mobileNav) {
    initializeMenuState();
  }

  if (mobileNavBtn) {
    mobileNavBtn.addEventListener("click", () => {
      if (mobileNavOpen) {
        animateMenuOut();
        mobileNavOpen = false;
      } else {
        mobileNav.classList.remove("hidden");
        mobileNavOpen = true;
        animateMenuIn();
        // Small delay to ensure menu is visible before animating
        // setTimeout(() => {
        //   animateMenuIn();
        // }, 10);
      }
    });
  }

  if (mobileNavBtnClose) {
    mobileNavBtnClose.addEventListener("click", () => {
      animateMenuOut();
      mobileNavOpen = false;
    });
  }
}

// Main modal handler - coordinates modal and video player
function handleModal() {
  const worksTrigger = document.querySelectorAll(".js-work");
  
  // Create independent controllers
  const videoPlayer = createVideoPlayer();
  const modal = createModal(lenis);
  
  // Connect them
  modal.setVideoPlayer(videoPlayer);

  // Setup work triggers
  worksTrigger.forEach((item) => {
    item.addEventListener("click", (e) => {
      const workItem = e.currentTarget;
      const videoUrl = workItem.dataset.video;
      
      if (!videoUrl?.trim()) return;

      const nameElement = workItem.querySelector('.name p');
      const workName = nameElement?.textContent || '';
      const brandElement = workItem.querySelector('.brand');
      const workBrand = brandElement?.textContent || '';
      const targetSlide = workItem.dataset.slide;

      modal.open(videoUrl, workName, workBrand, targetSlide);
    });
  });
}

// Header visibility based on hero viewport
function handleHeaderVisibility() {
  const header = document.querySelector(".header");
  const hero = document.querySelector(".hero");

  if (!header || !hero) return;

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom 33%",
    onLeave: () => {
      header.classList.add("is-active");
    },
    onEnterBack: () => {
      header.classList.remove("is-active");
    },
  });
}

// Update active menu state based on scroll position
function handleActiveMenuState() {
  const homeLinkGroup = document.querySelectorAll(".home-link");
  const aboutLinkGroup = document.querySelectorAll(".about-link");
  const ourWayLinkGroup = document.querySelectorAll(".how-we-work-link");
  const shopLinkGroup = document.querySelectorAll(".shop-link");
  const contactLinkGroup = document.querySelectorAll(".contact-link");

  const homeEl = document.querySelector("#home");
  const aboutEl = document.querySelector("#about-us");
  const ourWayEl = document.querySelector("#work");
  const shopEl = document.querySelector("#shop");
  const contactEl = document.querySelector("#contact");

  const sections = [
    { links: homeLinkGroup, element: homeEl, id: 'home' },
    { links: aboutLinkGroup, element: aboutEl, id: 'about' },
    { links: ourWayLinkGroup, element: ourWayEl, id: 'work' },
    { links: shopLinkGroup, element: shopEl, id: 'shop' },
    { links: contactLinkGroup, element: contactEl, id: 'contact' },
  ].filter(item => item.element); // Filtrar elementos que no existen

  if (!sections.length) return;

  // Función para actualizar el estado activo
  const setActive = (activeId) => {
    // Respect temporary lock during programmatic scrollTo
    const lockUntil = window.__menuActiveLockUntil || 0;
    const lockId = window.__menuActiveLockId || null;
    if (Date.now() < lockUntil && lockId && activeId !== lockId) {
      return;
    }

    sections.forEach(({ links: linkNodes, id }) => {
      linkNodes.forEach((lnk) => {
        if (id === activeId) {
          lnk.classList.add("active");
        } else {
          lnk.classList.remove("active");
        }
      });
    });
  };

  // Compute closest section to viewport center (robust for all sections, including Shop)
  const getClosestSectionId = () => {
    const viewportCenter = window.innerHeight / 2;
    let closestId = null;
    let closestDistance = Infinity;

    sections.forEach(({ element, id }) => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - center);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = id;
      }
    });

    return closestId;
  };

  // Single ScrollTrigger that updates active state on scroll
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 0,
    end: "max",
    onUpdate: () => {
      const id = getClosestSectionId();
      if (id) setActive(id);
    },
  });

  // Estado inicial basado en la posición del scroll
  const updateInitialState = () => {
    const id = getClosestSectionId();
    if (id) setActive(id);
  };

  // Actualizar estado inicial después de que todo esté cargado
  if (document.readyState === 'complete') {
    setTimeout(updateInitialState, 100);
  } else {
    window.addEventListener('load', () => {
      setTimeout(updateInitialState, 100);
    });
  }
}

// Initialize all functions
handleNav();
handleModal();
handleHeaderVisibility();
handleActiveMenuState();
handleDynamicContentResize(lenis);

// Initialize section-based body color changes
initSectionColors();
