import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import Lenis from '@studio-freight/lenis' 
import customCursor from './js/cursor.js'
import videoMuting from './js/videomuting.js'
import "splitting/dist/splitting.css"
import "splitting/dist/splitting-cells.css"
import Splitting from "splitting"
Splitting();
import { register } from 'swiper/element/bundle'
register()
// CSS Styles
import './style.scss'

gsap.registerPlugin(ScrollTrigger)

// Virtual smooth scroll (Lenis)
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update()
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Handle anchor menu (Lenis scrollTo) + background colors + link status (active)
function handleNav(){
  const aboutLink = document.querySelector(".about-link")
  const ourWayLink = document.querySelector(".how-we-work-link")
  const workLink = document.querySelector(".work-link")
  const contactLink = document.querySelector(".contact-link")
  
  const aboutEl = document.querySelector("#about-us")
  const ourWayEl = document.querySelector("#how-we-work")
  const workEl = document.querySelector("#work")
  const contactEl = document.querySelector("#contact")

  const mobileNavBtn = document.querySelector(".burger")
  const mobileNav = document.querySelector(".mobile")


  const setBlankMenu = () => {
    aboutLink.classList.remove("active")
    ourWayLink.classList.remove("active")
    workLink.classList.remove("active")
    contactLink.classList.remove("active")

    mobileNav.classList.add("hidden")
    mobileNavOpen = false
  }

  const setAboutMenu = () => {
    aboutLink.classList.add("active")
    ourWayLink.classList.remove("active")
    workLink.classList.remove("active")
    contactLink.classList.remove("active")

    mobileNav.classList.add("hidden")
    mobileNavOpen = false
  }

  const setOurWayMenu = () => {
    aboutLink.classList.remove("active")
    ourWayLink.classList.add("active")
    workLink.classList.remove("active")
    contactLink.classList.remove("active")

    mobileNav.classList.add("hidden")
    mobileNavOpen = false
  }

  const setWorkMenu = () => {
    workLink.classList.add("active")
    ourWayLink.classList.remove("active")
    aboutLink.classList.remove("active")
    contactLink.classList.remove("active")

    mobileNav.classList.add("hidden")
    mobileNavOpen = false
  }

  const setContactMenu = () => {
    contactLink.classList.add("active")
    aboutLink.classList.remove("active")
    ourWayLink.classList.remove("active")
    workLink.classList.remove("active")
    
    mobileNav.classList.add("hidden")
    mobileNavOpen = false
  }

  aboutLink.addEventListener("click", () => {lenis.scrollTo(aboutEl), setAboutMenu()})
  ourWayLink.addEventListener("click", () => {lenis.scrollTo(ourWayEl), setOurWayMenu()})
  workLink.addEventListener("click", () => {lenis.scrollTo(workEl), setWorkMenu()})
  contactLink.addEventListener("click", () => {lenis.scrollTo(contactEl), setContactMenu()})

  let mobileNavOpen = false

  mobileNavBtn.addEventListener("click", () => {
    if(mobileNavOpen) {
      mobileNav.classList.add("hidden")
      mobileNavOpen = false
    } else {
      mobileNav.classList.remove("hidden")
      mobileNavOpen = true
    }
  })  

  const container = document.querySelector(".main")
  const fadeHero = document.querySelector(".intro")
  const about = document.querySelector(".about")
  const howWeWork = document.querySelector(".how-we-work") 
  const work = document.querySelector(".work")
  const contact = document.querySelector(".contact")

  const hero = document.querySelector(".hero") 

  ScrollTrigger.create( {
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onEnter: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onEnterBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu())
  })

  ScrollTrigger.create( {
    trigger: fadeHero,
    start: 'top top',
    end: 'bottom +=75%',
    // markers: true,
    onEnter: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onLeave: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.out"}, setAboutMenu()),
    // onLeaveBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onEnterBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu())
  })

  ScrollTrigger.create( {
    trigger: about,
    start: 'top +=75%',
    end: 'bottom top',
    onEnter: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu()),
    onLeave: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.out"}, setOurWayMenu()),
    // onLeaveBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onEnterBack: () => {
      gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu())
      gsap.to('.team__card picture', {backgroundColor:"#108896", duration: 1, ease:"ease.in"})
    }
  })

  ScrollTrigger.create( {
    trigger: howWeWork,
    start: 'top 70%', 
    end: 'bottom top', 
    onEnter: () => {
      gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.in"}, setOurWayMenu())
      gsap.to('.team__card picture', {backgroundColor:"#1C374D", duration: 1, ease:"ease.in"})
    },
    onLeave: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.out"}, setWorkMenu()),
    onLeaveBack: () => {
      gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu())
      gsap.to('.team__card picture', {backgroundColor:"#108896", duration: 1, ease:"ease.in"})
    },
    onEnterBack: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.in"}, setOurWayMenu())
  })

  ScrollTrigger.create( {
    trigger: work,
    start: 'top 50%',
    end: 'bottom 20%', 
    onEnter: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.in"}, setWorkMenu()),
    onLeave: () => gsap.to(container, {backgroundColor:"#E69C24", duration: 1, ease:"ease.out"}, setContactMenu()), 
    onEnterBack: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.in"}, setWorkMenu())
  })

  ScrollTrigger.create( {
    trigger: contact,
    start: 'top 40%',
    end: 'bottom top', 
    onEnter: () => gsap.to(container, {backgroundColor:"#E69C24", duration: 1, ease:"ease.in"}, setContactMenu()),   
    onLeave: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.out"}, setBlankMenu()), 
    onLeaveBack: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.out"}, setWorkMenu()), 
  })
}


// Scrolling "Team Members" horizontally
function handleScrolHorizontal() {
  const membersSection = document.querySelector(".team")
  let sectionItems = gsap.utils.toArray(".team__card")

  gsap.to(sectionItems, {
    xPercent: -90 * (sectionItems.length - 1),
    ease: "sine.out",
    scrollTrigger: {
      trigger: membersSection,
      pin: true,
      scrub: 2, 
      // end: "+=100%" + membersSection.offsetWidth
      end: "+=100%"
    }
  })
}

var state = "";
function checkMobile() {
  var newState = state;
  if (innerWidth > 1023) {
    newState = "large";
  } else {
    newState = "mobile";
  }

  console.log(state);

  if(newState !== state) {
    if(newState === "large") {
      handleScrolHorizontal();
    } else {
      return
    }

    state = newState;
  }
}

// Handle modal, stop/start Lenis
function handleModal() { 

  const worksTrigger = document.querySelectorAll('.js-work');
  const modalSliders = document.querySelectorAll('.work__slider');
  const closeModalBtn = document.querySelector(".js-close");
  const modalTarget = document.querySelector(".modal");

  // --> 1. Open modal, stop body scroll and activate slider
  worksTrigger.forEach(item => {
    item.addEventListener('click', item => {

      modalTarget.classList.add("is-active");
      
      // Find slide that matches the clicked data atrribute and display it
      let targetSlide = item.target.dataset.slide;  
 
      document.querySelector(`[data-client=${targetSlide}]`).hidden = false;
 
      lenis.stop();
    })
  })  
 

  // --> 2. Close modal, hide slider and restart scroll
  closeModalBtn.addEventListener("click", closeModal)

  function closeModal(){ 
    modalTarget.classList.remove("is-active");
  
    // Apply hidden attribute to all swiper slider
    modalSliders.forEach( slider => slider.hidden = true);
 
    lenis.start();
  }
}

// Assign random slogan
const sloganContainer = document.querySelector(".slogan p")
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
  "*We go with the flow."
]

function randomSlogan() {
  let randomValue
  randomValue = slogans[(Math.floor(Math.random() * slogans.length))]

  sloganContainer.append(randomValue)
}
randomSlogan()

// GSAP titles animations

const wrapElements = (elems, wrapType, wrapClass) => {
  elems.forEach(char => {
      const wrapEl = document.createElement(wrapType);
      wrapEl.classList = wrapClass;
      char.parentNode.appendChild(wrapEl);
      wrapEl.appendChild(char);
  });
}

// Intro
const titleIntroFirst = [...document.querySelectorAll('.title-intro[data-splitting][data-effect1]')]
const titleIntroSecond = [...document.querySelectorAll('.title-second[data-splitting][data-effect2]')]
const phraseIntro = [...document.querySelectorAll('.paragraph-intro[data-splitting][data-effect3]')]

titleIntroFirst.forEach(title => {

  const chars = title.querySelectorAll('.char');

  gsap.fromTo(chars, { 
      'will-change': 'opacity, transform', 
      opacity: 0, 
      yPercent: 2, 
      scaleY: 1.2, 
      scaleX: 0.9, 
      transformOrigin: '50% 0%' 
  }, 
  {
      duration: 3,
      ease: 'back.inOut(2)',
      opacity: 1,
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      stagger: 0.03,
      scrollTrigger: {
          trigger: title,
          start: 'center bottom+=50%',
          end: 'bottom top+=40%',
          // scrub: true
      }
  });

});
titleIntroSecond.forEach(title => {
        
  const chars = title.querySelectorAll('.char');
  
  chars.forEach(char => gsap.set(char.parentNode, { perspective: 1000 })); 
  
  gsap.fromTo(chars, { 
      'will-change': 'opacity, transform', 
      opacity: 0.2,
      z: -20
  }, 
  {
      ease: 'back.out(1.2)',
      opacity: 1,
      z: 0,
      stagger: 0.04,
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'bottom top',
          // scrub: true,
          duration: 2
      }
  });

});
phraseIntro.forEach(title => {
        
  gsap.fromTo(title, {
      transformOrigin: '0% 50%',
  }, {
      ease: 'none',
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
      }
  });

  gsap.fromTo(title.querySelectorAll('.word'), {
      'will-change': 'opacity',
      opacity: 0.1
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
          trigger: title,
          start: 'top bottom-=20%',
          end: 'center top+=20%',
          // scrub: true,
          delay: 3,
          duration: 2,
      }
  });

});

// About
const aboutGreeting = [...document.querySelectorAll('.section__h3[data-splitting][data-effect4]')]
const aboutPhrase = [...document.querySelectorAll('.section__p[data-splitting][data-effect5]')]

aboutGreeting.forEach(title => {
        
  const chars = title.querySelectorAll('.char');
  
  chars.forEach(char => gsap.set(char.parentNode, { perspective: 1000 })); 
  
  gsap.fromTo(chars, {
    'will-change': 'opacity, transform', 
    transformOrigin: '50% 100%',
    opacity: 0,
    rotationX: 40
  }, 
  {
    ease: 'power4',
    opacity: 1,
    stagger:  {
      each: 0.03,
      from: 'random'
    },
    rotationX: 0,
    duration: 3,
    scrollTrigger: {
      trigger: title,
      start: 'center bottom',
      end: 'bottom top+=20%',
      // scrub: true,
    }
  });
  
});
aboutPhrase.forEach(title => {
        
  gsap.fromTo(title, {
      transformOrigin: '0% 50%',
  }, {
      ease: 'none',
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
      }
  });

  gsap.fromTo(title.querySelectorAll('.word'), {
      'will-change': 'opacity',
      opacity: 0.1
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
          trigger: title,
          start: 'top bottom-=20%',
          end: 'center top+=20%',
          // scrub: true,
          delay: 3,
          duration: 2,
      }
  });

});

// How we work
const howTitle = [...document.querySelectorAll('.section__h3[data-splitting][data-effect6]')]
const firstSlideTitle = [...document.querySelectorAll('.section__h3[data-splitting][data-effect7]')]
const firstSlideInfo = [...document.querySelectorAll('.section__p[data-splitting][data-effect8]')]
const secondSlideTitle = [...document.querySelectorAll('.section__h3[data-splitting][data-effect9]')]
const secondSlideInfo = [...document.querySelectorAll('.section__p[data-splitting][data-effect10]')]
const thirdSlideTitle = [...document.querySelectorAll('.section__h3[data-splitting][data-effect11]')]
const thirdSlideInfo = [...document.querySelectorAll('.section__p[data-splitting][data-effect12]')]

howTitle.forEach(title => {

  const chars = title.querySelectorAll('.char');

  gsap.fromTo(chars, { 
    'will-change': 'opacity, transform', 
    opacity: 0, 
    yPercent: 3, 
    scaleY: 1.2, 
    scaleX: 0.9, 
    transformOrigin: '50% 0%' 
  }, 
  {
    duration: 3,
    ease: 'back.inOut(2)',
    opacity: 1,
    yPercent: 0,
    scaleY: 1,
    scaleX: 1,
    stagger: 0.03,
    scrollTrigger: {
      trigger: title,
      start: 'center bottom+=50%',
      end: 'bottom top+=40%',
      // scrub: true
    }
  });
});
firstSlideTitle.forEach(title => {
        
  const chars = title.querySelectorAll('.char');
  wrapElements(chars, 'span', 'char-wrap');

  gsap.fromTo(chars, { 
    'will-change': 'transform', 
    transformOrigin: '0% 50%',
    xPercent: 20,
    opacity: 0
  }, 
  {
    duration: 3,
    ease: 'expo',
    xPercent: 0,
    opacity: 1,
    stagger: 0.042,
    scrollTrigger: {
        trigger: title,
        start: 'top+=120%',
        end: 'top+=400%',
        //markers: true,
        //toggleActions: "play resume resume reset",
    }
  });

});
firstSlideInfo.forEach(title => {
        
  gsap.fromTo(title, {
      transformOrigin: '0% 50%',
  }, {
      ease: 'none',
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
      }
  });

  gsap.fromTo(title.querySelectorAll('.word'), {
      'will-change': 'opacity',
      opacity: 0
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
          trigger: title,
          start: 'top+=120%',
          end: 'top+=400%',
          // scrub: true,
          delay: 3,
          duration: 2,
      }
  });

});
secondSlideTitle.forEach(title => {
        
  const chars = title.querySelectorAll('.char');
  wrapElements(chars, 'span', 'char-wrap');

  gsap.fromTo(chars, { 
    'will-change': 'transform', 
    transformOrigin: '0% 50%',
    xPercent: 20,
    opacity: 0
  }, 
  {
    duration: 3,
    ease: 'expo',
    xPercent: 0,
    opacity: 1,
    stagger: 0.042,
    scrollTrigger: {
        trigger: title,
        start: 'top+=120%',
        end: 'top+=400%',
        //markers: true,
        //toggleActions: "play resume resume reset",
    }
  });

});
secondSlideInfo.forEach(title => {
        
  gsap.fromTo(title, {
      transformOrigin: '0% 50%',
  }, {
      ease: 'none',
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
      }
  });

  gsap.fromTo(title.querySelectorAll('.word'), {
      'will-change': 'opacity',
      opacity: 0
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
          trigger: title,
          start: 'top+=120%',
          end: 'top+=400%',
          // scrub: true,
          delay: 3,
          duration: 2,
      }
  });

});
thirdSlideTitle.forEach(title => {
        
  const chars = title.querySelectorAll('.char');
  wrapElements(chars, 'span', 'char-wrap');

  gsap.fromTo(chars, { 
    'will-change': 'transform', 
    transformOrigin: '0% 50%',
    xPercent: 20,
    opacity: 0
  }, 
  {
    duration: 3,
    ease: 'expo',
    xPercent: 0,
    opacity: 1,
    stagger: 0.042,
    scrollTrigger: {
        trigger: title,
        start: 'top+=120%',
        end: 'top+=400%',
        //markers: true,
        //toggleActions: "play resume resume reset",
    }
  });

});
thirdSlideInfo.forEach(title => {
        
  gsap.fromTo(title, {
      transformOrigin: '0% 50%',
  }, {
      ease: 'none',
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
      }
  });

  gsap.fromTo(title.querySelectorAll('.word'), {
      'will-change': 'opacity',
      opacity: 0
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
          trigger: title,
          start: 'top+=120%',
          end: 'top+=400%',
          // scrub: true,
          delay: 3,
          duration: 2,
      }
  });

});

// Call functions 
handleNav();

// Handle swiper scroll
document.addEventListener("resize", checkMobile);
checkMobile();

// handleScrolHorizontal();
handleModal(); 

// Custom Cursor *
customCursor();

// Mute video when playing other or closing modal *
videoMuting();
