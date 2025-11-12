import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import customCursor from "./cursor.js";  

import { register } from "swiper/element/bundle";
register();

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

gsap.registerPlugin(ScrollTrigger);

// Virtual smooth scroll (Lenis)
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Handle anchor menu (Lenis scrollTo) + background colors + link status (active)
function handleNav() {
  const aboutLink = document.querySelector(".about-link");
  const ourWayLink = document.querySelector(".how-we-work-link");
  // const workLink = document.querySelector(".work-link");
  const shopLink = document.querySelector(".shop-link");
  const contactLink = document.querySelector(".contact-link");

  const aboutEl = document.querySelector("#about-us");
  const ourWayEl = document.querySelector("#how-we-work");
  // const workEl = document.querySelector("#work");
  const shopEl = document.querySelector("#shop");
  const contactEl = document.querySelector("#contact");

  const mobileNavBtn = document.querySelector(".burger");
  const mobileNavBtnClose = document.querySelector(".close");
  const mobileNav = document.querySelector(".mobile");

  const setBlankMenu = () => {
    shopLink.classList.remove("active");
    aboutLink.classList.remove("active");
    ourWayLink.classList.remove("active");
    // workLink.classList.remove("active");
    contactLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setAboutMenu = () => {
    shopLink.classList.remove("active");
    aboutLink.classList.add("active");
    ourWayLink.classList.remove("active");
    // workLink.classList.remove("active");
    contactLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setOurWayMenu = () => {
    shopLink.classList.remove("active");
    aboutLink.classList.remove("active");
    ourWayLink.classList.add("active");
    // workLink.classList.remove("active");
    contactLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  // const setWorkMenu = () => {
  //   shopLink.classList.remove("active");
  //   workLink.classList.add("active");
  //   ourWayLink.classList.remove("active");
  //   aboutLink.classList.remove("active");
  //   contactLink.classList.remove("active");

  //   mobileNav.classList.add("hidden");
  //   mobileNavOpen = false;
  // };

  const setShopMenu = () => {
    shopLink.classList.add("active");
    // workLink.classList.remove("active");
    ourWayLink.classList.remove("active");
    aboutLink.classList.remove("active");
    contactLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setContactMenu = () => {
    shopLink.classList.remove("active");
    contactLink.classList.add("active");
    aboutLink.classList.remove("active");
    ourWayLink.classList.remove("active");
    // workLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  aboutLink.addEventListener("click", () => {
    lenis.scrollTo(aboutEl), setAboutMenu();
  });
  ourWayLink.addEventListener("click", () => {
    lenis.scrollTo(ourWayEl), setOurWayMenu();
  });
  // workLink.addEventListener("click", () => {
  //   lenis.scrollTo(workEl), setWorkMenu();
  // });
  shopLink.addEventListener("click", () => {
    lenis.scrollTo(shopEl), setShopMenu();
  });
  contactLink.addEventListener("click", () => {
    lenis.scrollTo(contactEl), setContactMenu();
  });

  let mobileNavOpen = false;

  mobileNavBtn.addEventListener("click", () => {
    if (mobileNavOpen) {
      mobileNav.classList.add("hidden");
      mobileNavOpen = false;
    } else {
      mobileNav.classList.remove("hidden");
      mobileNavOpen = true;
    }
  });

  mobileNavBtnClose.addEventListener("click", () => {
    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  });

  // const container = document.querySelector(".main");
  // const fadeHero = document.querySelector(".intro");
  // const about = document.querySelector(".about");
  // const howWeWork = document.querySelector(".how-we-work");
  // const work = document.querySelector(".work");
  // const shop = document.querySelector(".shop");
  // const contact = document.querySelector(".contact");
  // const hero = document.querySelector(".hero");
} 

// Handle modal, stop/start Lenis
function handleModal() {
  const worksTrigger = document.querySelectorAll(".js-work");
  const modalSliders = document.querySelectorAll(".work__slider");
  const closeModalBtn = document.querySelector(".js-close");
  const modalTarget = document.querySelector(".modal");

  // --> 1. Open modal, stop body scroll and activate slider
  worksTrigger.forEach((item) => {
    item.addEventListener("click", (item) => {
      modalTarget.classList.add("is-active");

      // Find slide that matches the clicked data atrribute and display it
      let targetSlide = item.target.dataset.slide;

      document.querySelector(`[data-client=${targetSlide}]`).hidden = false;

      lenis.stop();
    });
  });

  // --> 2. Close modal, hide slider and restart scroll
  closeModalBtn.addEventListener("click", closeModal);

  function closeModal() {
    modalTarget.classList.remove("is-active");

    // Apply hidden attribute to all swiper slider
    modalSliders.forEach((slider) => (slider.hidden = true));

    lenis.start();
  }
}
 
 
// ---> GSAP animations
// Hero
const logo = document.querySelector(".logo");
const burguer = document.querySelector(".burguer-btn");
 
const heroLogo = document.querySelectorAll(".logo-container"); 
const copyright = document.querySelector(".copyright__text");
const slogan = document.querySelector(".slogan");
const navbar = document.querySelector(".navbar");
const lastWord = document.querySelector(".last-brand");

// Logo
gsap.fromTo(
  logo,
  {
    "will-change": "opacity",
    opacity: 0,
    y: -30,
  },
  {
    ease: "power1.inOut",
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: logo,
      start: "top bottom",
      end: "center top",
    },
  }
);

// Burguer
gsap.fromTo(
  burguer,
  {
    "will-change": "opacity",
    opacity: 0,
    y: -30,
  },
  {
    ease: "power1.inOut",
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: burguer,
      start: "top bottom",
      end: "center top",
    },
  }
);
 

// Logo Hero
gsap.fromTo(
  heroLogo,
  {
    "will-change": "opacity",
    opacity: 0,
    y: 30,
  },
  {
    ease: "power1.inOut",
    opacity: 1,
    delay: 1.2,
    y: 0,
    scrollTrigger: {
      trigger: slogan,
      start: "top bottom",
      end: "center top",
    },
  }
);

// Main titles
// const titles = document.querySelectorAll(".title");

// titles.forEach((title) => {
//   gsap.fromTo(
//     title,
//     {
//       "will-change": "opacity",
//       opacity: 0.1,
//       x: -10,
//     },
//     {
//       ease: "none",
//       opacity: 1,
//       x: 0,
//       stagger: 0.18,
//       delay: 0.2,
//       scrollTrigger: {
//         trigger: title,
//         start: "top bottom",
//         end: "center top",
//       },
//     }
//   );
// }); 

// Copyright
gsap.fromTo(
  copyright,
  {
    "will-change": "opacity",
    opacity: 0,
    y: 30,
  },
  {
    ease: "power1.inOut",
    opacity: 1,
    delay: 1.2,
    y: 0,
    scrollTrigger: {
      trigger: copyright,
      start: "top bottom",
      end: "center top",
    },
  }
);

// Navbar
gsap.fromTo(
  navbar,
  {
    "will-change": "opacity",
    opacity: 0,
    x: 30,
  },
  {
    ease: "power1.inOut",
    opacity: 1,
    delay: 1.5,
    x: 0,
    scrollTrigger: {
      trigger: slogan,
      start: "top bottom",
      end: "center top",
    },
  }
); 

// Last brand
gsap.fromTo(
  lastWord,
  {
    "will-change": "opacity",
    opacity: 0,
    y: +60,
  },
  {
    ease: "power1.inOut",
    opacity: 1,
    delay: 0.5,
    y: 0,
    scrollTrigger: {
      trigger: lastWord,
      start: "top bottom",
      end: "center top",
    },
  }
);

// Header visibility based on hero viewport
function handleHeaderVisibility() {
  const header = document.querySelector(".header");
  const hero = document.querySelector(".hero");

  if (!header || !hero) return;

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom top",
    onLeave: () => {
      // Hero se va hacia arriba → añadir .is-active
      header.classList.add("is-active");
    },
    onEnterBack: () => {
      // Hero vuelve al viewport → quitar .is-active
      header.classList.remove("is-active");
    },
  });
}

// Call functions
handleNav();
 
// handleScrolHorizontal();
handleModal();

// Header visibility
handleHeaderVisibility();

// Custom Cursor *
customCursor();
 

 