import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import customCursor from "./utils/cursor.js";
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

  const setHomeMenu = () => {
    shopLinks.forEach(link => link.classList.remove("active"));
    aboutLinks.forEach(link => link.classList.remove("active"));
    ourWayLinks.forEach(link => link.classList.remove("active"));
    contactLinks.forEach(link => link.classList.remove("active"));
    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setAboutMenu = () => {
    shopLinks.forEach(link => link.classList.remove("active"));
    aboutLinks.forEach(link => link.classList.add("active"));
    ourWayLinks.forEach(link => link.classList.remove("active"));
    contactLinks.forEach(link => link.classList.remove("active"));
    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setOurWayMenu = () => {
    shopLinks.forEach(link => link.classList.remove("active"));
    aboutLinks.forEach(link => link.classList.remove("active"));
    ourWayLinks.forEach(link => link.classList.add("active"));
    contactLinks.forEach(link => link.classList.remove("active"));
    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setShopMenu = () => {
    shopLinks.forEach(link => link.classList.add("active"));
    ourWayLinks.forEach(link => link.classList.remove("active"));
    aboutLinks.forEach(link => link.classList.remove("active"));
    contactLinks.forEach(link => link.classList.remove("active"));
    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setContactMenu = () => {
    shopLinks.forEach(link => link.classList.remove("active"));
    contactLinks.forEach(link => link.classList.add("active"));
    aboutLinks.forEach(link => link.classList.remove("active"));
    ourWayLinks.forEach(link => link.classList.remove("active"));
    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  // Anchor navigation with smooth scroll
  // Use querySelectorAll to get all links (desktop and mobile)
  if (homeLinks.length > 0 && homeEl) {
    homeLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo(homeEl, { offset: 0, duration: 1.2 });
        setHomeMenu();
      });
    });
  }

  if (aboutLinks.length > 0 && aboutEl) {
    aboutLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo(aboutEl, { offset: 0, duration: 1.2 });
        setAboutMenu();
      });
    });
  }

  if (ourWayLinks.length > 0 && ourWayEl) {
    ourWayLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo(ourWayEl, { offset: 0, duration: 1.2 });
        setOurWayMenu();
      });
    });
  }

  if (shopLinks.length > 0 && shopEl) {
    shopLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo(shopEl, { offset: 0, duration: 1.2 });
        setShopMenu();
      });
    });
  }

  if (contactLinks.length > 0 && contactEl) {
    contactLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo(contactEl, { offset: 0, duration: 1.2 });
        setContactMenu();
      });
    });
  }

  // Mobile navigation toggle
  let mobileNavOpen = false;

  if (mobileNavBtn) {
    mobileNavBtn.addEventListener("click", () => {
      if (mobileNavOpen) {
        mobileNav.classList.add("hidden");
        mobileNavOpen = false;
      } else {
        mobileNav.classList.remove("hidden");
        mobileNavOpen = true;
      }
    });
  }

  if (mobileNavBtnClose) {
    mobileNavBtnClose.addEventListener("click", () => {
      mobileNav.classList.add("hidden");
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
  const homeLink = document.querySelector(".home-link");
  const aboutLink = document.querySelector(".about-link");
  const ourWayLink = document.querySelector(".how-we-work-link");
  const shopLink = document.querySelector(".shop-link");
  const contactLink = document.querySelector(".contact-link");

  const homeEl = document.querySelector("#home");
  const aboutEl = document.querySelector("#about-us");
  const ourWayEl = document.querySelector("#work");
  const shopEl = document.querySelector("#shop");
  const contactEl = document.querySelector("#contact");

  if (!homeLink || !aboutLink || !ourWayLink || !shopLink || !contactLink) return;

  const links = [
    { link: homeLink, element: homeEl, id: 'home' },
    { link: aboutLink, element: aboutEl, id: 'about' },
    { link: ourWayLink, element: ourWayEl, id: 'work' },
    { link: shopLink, element: shopEl, id: 'shop' },
    { link: contactLink, element: contactEl, id: 'contact' },
  ].filter(item => item.element); // Filtrar elementos que no existen

  // Función para actualizar el estado activo
  const updateActiveState = (activeId) => {
    links.forEach(({ link, id }) => {
      if (id === activeId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  // Crear ScrollTriggers para cada sección
  links.forEach(({ element, id }) => {
    if (!element) return;

    ScrollTrigger.create({
      trigger: element,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => updateActiveState(id),
      onEnterBack: () => updateActiveState(id),
      onLeave: () => {
        // Determinar qué sección es la siguiente
        const currentScroll = window.scrollY || window.pageYOffset;
        const viewportHeight = window.innerHeight;
        const centerPoint = currentScroll + viewportHeight / 2;

        // Encontrar la sección más cercana al centro del viewport
        let closestSection = null;
        let closestDistance = Infinity;

        links.forEach(({ element: el, id: sectionId }) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + currentScroll;
          const elementCenter = elementTop + rect.height / 2;
          const distance = Math.abs(centerPoint - elementCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = sectionId;
          }
        });

        if (closestSection) {
          updateActiveState(closestSection);
        }
      },
      onLeaveBack: () => {
        // Similar a onLeave pero para scroll hacia arriba
        const currentScroll = window.scrollY || window.pageYOffset;
        const viewportHeight = window.innerHeight;
        const centerPoint = currentScroll + viewportHeight / 2;

        let closestSection = null;
        let closestDistance = Infinity;

        links.forEach(({ element: el, id: sectionId }) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + currentScroll;
          const elementCenter = elementTop + rect.height / 2;
          const distance = Math.abs(centerPoint - elementCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = sectionId;
          }
        });

        if (closestSection) {
          updateActiveState(closestSection);
        }
      },
    });
  });

  // Estado inicial basado en la posición del scroll
  const updateInitialState = () => {
    const currentScroll = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const centerPoint = currentScroll + viewportHeight / 2;

    let closestSection = null;
    let closestDistance = Infinity;

    links.forEach(({ element: el, id: sectionId }) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + currentScroll;
      const elementCenter = elementTop + rect.height / 2;
      const distance = Math.abs(centerPoint - elementCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = sectionId;
      }
    });

    if (closestSection) {
      updateActiveState(closestSection);
    }
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
// customCursor();

// Initialize section-based body color changes
initSectionColors();
