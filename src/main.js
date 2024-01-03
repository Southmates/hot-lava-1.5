import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import customCursor from "./js/cursor.js";
import videoMuting from "./js/videomuting.js";
import Ukiyo from "ukiyojs";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
Splitting();
import { register } from "swiper/element/bundle";
register();
// CSS Styles
import "./style.scss";

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
  const workLink = document.querySelector(".work-link");
  const contactLink = document.querySelector(".contact-link");

  const aboutEl = document.querySelector("#about-us");
  const ourWayEl = document.querySelector("#how-we-work");
  const workEl = document.querySelector("#work");
  const contactEl = document.querySelector("#contact");

  const mobileNavBtn = document.querySelector(".burger");
  const mobileNavBtnClose = document.querySelector(".close");
  const mobileNav = document.querySelector(".mobile");

  const setBlankMenu = () => {
    aboutLink.classList.remove("active");
    ourWayLink.classList.remove("active");
    workLink.classList.remove("active");
    contactLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setAboutMenu = () => {
    aboutLink.classList.add("active");
    ourWayLink.classList.remove("active");
    workLink.classList.remove("active");
    contactLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setOurWayMenu = () => {
    aboutLink.classList.remove("active");
    ourWayLink.classList.add("active");
    workLink.classList.remove("active");
    contactLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setWorkMenu = () => {
    workLink.classList.add("active");
    ourWayLink.classList.remove("active");
    aboutLink.classList.remove("active");
    contactLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  const setContactMenu = () => {
    contactLink.classList.add("active");
    aboutLink.classList.remove("active");
    ourWayLink.classList.remove("active");
    workLink.classList.remove("active");

    mobileNav.classList.add("hidden");
    mobileNavOpen = false;
  };

  aboutLink.addEventListener("click", () => {
    lenis.scrollTo(aboutEl), setAboutMenu();
  });
  ourWayLink.addEventListener("click", () => {
    lenis.scrollTo(ourWayEl), setOurWayMenu();
  });
  workLink.addEventListener("click", () => {
    lenis.scrollTo(workEl), setWorkMenu();
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

  const container = document.querySelector(".main");
  const fadeHero = document.querySelector(".intro");
  const about = document.querySelector(".about");
  const howWeWork = document.querySelector(".how-we-work");
  const work = document.querySelector(".work");
  const contact = document.querySelector(".contact");

  const hero = document.querySelector(".hero");

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom top",
    onEnter: () =>
      gsap.to(
        container,
        { backgroundColor: "#EE512F", duration: 1, ease: "ease.in" },
        setBlankMenu()
      ),
    onEnterBack: () =>
      gsap.to(
        container,
        { backgroundColor: "#EE512F", duration: 1, ease: "ease.in" },
        setBlankMenu()
      ),
  });

  ScrollTrigger.create({
    trigger: fadeHero,
    start: "top top",
    end: "bottom +=75%",
    // markers: true,
    onEnter: () =>
      gsap.to(
        container,
        { backgroundColor: "#EE512F", duration: 1, ease: "ease.in" },
        setBlankMenu()
      ),
    onLeave: () =>
      gsap.to(
        container,
        { backgroundColor: "#108896", duration: 1, ease: "ease.out" },
        setAboutMenu()
      ),
    // onLeaveBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onEnterBack: () =>
      gsap.to(
        container,
        { backgroundColor: "#EE512F", duration: 1, ease: "ease.in" },
        setBlankMenu()
      ),
  });

  ScrollTrigger.create({
    trigger: about,
    start: "top +=75%",
    end: "bottom top",
    onEnter: () =>
      gsap.to(
        container,
        { backgroundColor: "#108896", duration: 1, ease: "ease.in" },
        setAboutMenu()
      ),
    onLeave: () =>
      gsap.to(
        container,
        { backgroundColor: "#1C374D", duration: 1, ease: "ease.out" },
        setOurWayMenu()
      ),
    // onLeaveBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onEnterBack: () => {
      gsap.to(
        container,
        { backgroundColor: "#108896", duration: 1, ease: "ease.in" },
        setAboutMenu()
      );
      gsap.to(".team__card picture", {
        backgroundColor: "#108896",
        duration: 1,
        ease: "ease.in",
      });
    },
  });

  ScrollTrigger.create({
    trigger: howWeWork,
    start: "top 70%",
    end: "bottom top",
    onEnter: () => {
      gsap.to(
        container,
        { backgroundColor: "#1C374D", duration: 1, ease: "ease.in" },
        setOurWayMenu()
      );
      gsap.to(".team__card picture", {
        backgroundColor: "#1C374D",
        duration: 1,
        ease: "ease.in",
      });
    },
    onLeave: () =>
      gsap.to(
        container,
        { backgroundColor: "#1C374D", duration: 1, ease: "ease.out" },
        setWorkMenu()
      ),
    onLeaveBack: () => {
      gsap.to(
        container,
        { backgroundColor: "#108896", duration: 1, ease: "ease.in" },
        setAboutMenu()
      );
      gsap.to(".team__card picture", {
        backgroundColor: "#108896",
        duration: 1,
        ease: "ease.in",
      });
    },
    onEnterBack: () =>
      gsap.to(
        container,
        { backgroundColor: "#1C374D", duration: 1, ease: "ease.in" },
        setOurWayMenu()
      ),
  });

  ScrollTrigger.create({
    trigger: work,
    start: "top 50%",
    end: "bottom 20%",
    onEnter: () =>
      gsap.to(
        container,
        { backgroundColor: "#1C374D", duration: 1, ease: "ease.in" },
        setWorkMenu()
      ),
    onLeave: () =>
      gsap.to(
        container,
        { backgroundColor: "#E69C24", duration: 1, ease: "ease.out" },
        setContactMenu()
      ),
    onEnterBack: () =>
      gsap.to(
        container,
        { backgroundColor: "#1C374D", duration: 1, ease: "ease.in" },
        setWorkMenu()
      ),
  });

  ScrollTrigger.create({
    trigger: contact,
    start: "top 40%",
    end: "bottom top",
    onEnter: () =>
      gsap.to(
        container,
        { backgroundColor: "#E69C24", duration: 1, ease: "ease.in" },
        setContactMenu()
      ),
    onLeave: () =>
      gsap.to(
        container,
        { backgroundColor: "#1C374D", duration: 1, ease: "ease.out" },
        setBlankMenu()
      ),
    onLeaveBack: () =>
      gsap.to(
        container,
        { backgroundColor: "#1C374D", duration: 1, ease: "ease.out" },
        setWorkMenu()
      ),
  });
}

// Scrolling "Team Members" horizontally
function handleScrolHorizontal() {
  const membersSection = document.querySelector(".team");
  let sectionItems = gsap.utils.toArray(".team__card");

  gsap.to(sectionItems, {
    xPercent: -90 * (sectionItems.length - 1),
    ease: "sine.out",
    scrollTrigger: {
      trigger: membersSection,
      pin: true,
      scrub: 2,
      // end: "+=100%" + membersSection.offsetWidth
      end: "+=100%",
      // end: "bottom",
    },
  });
}

var state = "";
function checkMobile() {
  var newState = state;
  if (innerWidth > 1023) {
    newState = "large";
  } else {
    newState = "mobile";
  }

  if (newState !== state) {
    if (newState === "large") {
      handleScrolHorizontal();
    } else {
      return;
    }

    state = newState;
  }
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
// Handle swiper scroll
document.addEventListener("resize", checkMobile);
checkMobile();

// Assign random slogan
const sloganContainer = document.querySelector(".slogan p");
let slogans = [
  "*You’re going to like it here.",
  "*Always non-toxic.",
  "*Served fresh daily.",
  "*Ideas may be hot to the touch.",
  "*Jerk-free zone.",
  "*Cannot be duplicated.",
  "*There’s no limit.",
  "*Creative discretion is not advised.",
  "*Do not try this at home.",
  "*We go with the flow.",
];

function randomSlogan() {
  let randomValue;
  randomValue = slogans[Math.floor(Math.random() * slogans.length)];

  sloganContainer.append(randomValue);
}

// Function to set video source
// const video = document.querySelector(".hero .wrapper video");
// let videoSource = document.createElement("source");

// videoSource.setAttribute("type", "video/mp4");

// function handleVideoSource() {
//   if (innerWidth > 480) {
//     videoSource.setAttribute(
//       "src",
//       "https://player.vimeo.com/progressive_redirect/playback/891441750/rendition/1080p/file.mp4?loc=external&signature=fda31ffe3b21ba36b3a3aa3b65e4746b7a94eda1389a7ab609de05b7d73a8079"
//     );
//   } else {
//     videoSource.setAttribute(
//       "src",
//       "https://player.vimeo.com/progressive_redirect/playback/891441750/rendition/540p/file.mp4?loc=external&signature=d93949a51886c059f163ef7f5780a6ce113c39ca9152aee94a4989038997c855"
//     );
//   }

//   video.appendChild(videoSource);
// }

// GSAP animations
// Hero
const logo = document.querySelector(".logo");
const burguer = document.querySelector(".burguer-btn");
const heroWelcome = [
  ...document.querySelectorAll(".hero__title[data-splitting][data-effect17]"),
];
const copyright = document.querySelector(".copyright__text");
const slogan = document.querySelector(".slogan");
const lastWord = document.querySelector(".last-brand")

// Logo
gsap.fromTo(
  logo,
  {
    "will-change": "opacity",
    opacity: 0,
    y: -30
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
    y: -30
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
// Hero Title
heroWelcome.forEach((title) => {
  /* gsap.fromTo(
    title,
    {
      transformOrigin: "0% 50%",
    },s
    {
      ease: "none",
      scrollTrigger: {
        trigger: title,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    }
  ); */

  gsap.fromTo(
    title.querySelectorAll(".word"),
    {
      "will-change": "opacity",
      opacity: 0.1,
    },
    {
      ease: "none",
      opacity: 1,
      stagger: 0.18,
      delay: 0.5,
      scrollTrigger: {
        trigger: title,
        start: "top bottom",
        end: "center top",
      },
    }
  );
});
// Main titles
const titles = document.querySelectorAll(".title");

titles.forEach((title) => {
  gsap.fromTo(
    title,
    {
      "will-change": "opacity",
      opacity: 0.1,
      x: -10
    },
    {
      ease: "none",
      opacity: 1,
      x: 0,
      stagger: 0.18,
      delay: 0.2,
      scrollTrigger: {
        trigger: title,
        start: "top bottom",
        end: "center top",
      },
    }
  );
});
// Copyright
gsap.fromTo(
  copyright,
  {
    "will-change": "opacity",
    opacity: 0,
    y: -30
  },
  {
    ease: "power1.inOut",
    opacity: 1,
    delay: 0.8,
    y: 0,
    scrollTrigger: {
      trigger: copyright,
      start: "top bottom",
      end: "center top",
    },
  }
);
// Slogan
gsap.fromTo(
  slogan,
  {
    "will-change": "opacity",
    opacity: 0,
    y: -30
  },
  {
    ease: "power1.inOut",
    opacity: 1,
    delay: 0.8,
    y: 0,
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
    y: +60
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

// Images parallax
const images_prllx = document.querySelectorAll(".parallax");
images_prllx.forEach(image => {
  new Ukiyo(image, { 
    speed: 3,
    scale: 1.1,
  });
});


// Call functions
handleNav();

// Set video
// handleVideoSource();

// Choose random slogan
randomSlogan();

// handleScrolHorizontal();
handleModal();

// Custom Cursor *
customCursor();

// Mute video when playing other or closing modal *
videoMuting();
