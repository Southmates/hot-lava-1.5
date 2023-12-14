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
// Handle swiper scroll
document.addEventListener("resize", checkMobile);
checkMobile();

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

// GSAP titles animations

// Function to wrap and apply overflow to chars
/* const wrapElements = (elems, wrapType, wrapClass) => {
  elems.forEach(char => {
      const wrapEl = document.createElement(wrapType);
      wrapEl.classList = wrapClass;
      char.parentNode.appendChild(wrapEl);
      wrapEl.appendChild(char);
  });
} */
// Check mobile to set start and end of trigger
let elStart
let elEnd

function setStartEnd() {
  let newStart = elStart
  let newEnd = elEnd

  if(newStart !== elStart || newEnd !== elEnd) {
    if(state === "large") {
      elStart = 'top+=120%'
      elEnd = 'top+=400%'
    } else {
      return
    }
  }
}
setStartEnd()

// Hero
const heroWelcome = [...document.querySelectorAll('.hero__title[data-splitting][data-effect17]')]

heroWelcome.forEach(title => {
        
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
      stagger: 0.18,
      delay: .5,
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'center top',
      }
  });

});

// Copyright
const copyright = [...document.querySelectorAll('.copyright__text[data-splitting][data-effect18]')]

copyright.forEach(title => {
        
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
      stagger: 0.15,
      delay: .5,
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'center top',
      }
  });

});

// Intro
const titleIntroFirst = [...document.querySelectorAll('.title-intro[data-splitting][data-effect1]')]
const titleIntroSecond = [...document.querySelectorAll('.title-second[data-splitting][data-effect2]')]
const phraseIntro = [...document.querySelectorAll('.paragraph-intro[data-splitting][data-effect3]')]

titleIntroFirst.forEach(title => {
        
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
      stagger: 0.1,
      scrollTrigger: {
          trigger: title,
          start: 'top bottom-=20%',
          end: 'center top+=20%',
          // scrub: true,
      }
  });

});
titleIntroSecond.forEach(title => {
        
  gsap.fromTo(title, {
      transformOrigin: '0% 50%',
  }, {
      ease: 'none',
      scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'top top',
          // scrub: true,
      }
  });

  gsap.fromTo(title.querySelectorAll('.word'), {
      'will-change': 'opacity',
      opacity: 0.1
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.18,
      scrollTrigger: {
          trigger: title,
          start: 'top bottom-=20%',
          end: 'center top+=20%',
          // scrub: true,
          // delay: 3,
          // duration: 2,
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
const kristi = [...document.querySelectorAll('.team__bio[data-splitting][data-effect19]')]
const phil = [...document.querySelectorAll('.team__bio[data-splitting][data-effect20]')]

aboutGreeting.forEach(title => {
        
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
      stagger: 0.15,
      scrollTrigger: {
          trigger: title,
          start: 'top bottom-=20%',
          end: 'center top+=20%',
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
kristi.forEach(title => {
        
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
          start: 'top bottom+=20%',
          end: 'center top+=20%',
          // scrub: true,
          delay: 3,
          duration: 2,
      }
  });

});
phil.forEach(title => {
        
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
          start: '+=10%',
          end: 'center top+=20%',
          // scrub: true,
          // markers: true
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
      stagger: 0.18,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
      }
  });

});
firstSlideTitle.forEach(title => {
        
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
      stagger: 0.2,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
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
      opacity: 0.1
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
      }
  });

});
secondSlideTitle.forEach(title => {
        
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
      stagger: 0.22,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
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
      opacity: 0.1
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
      }
  });

});
thirdSlideTitle.forEach(title => {
        
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
      stagger: 0.25,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
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
      opacity: 0.1
  }, 
  {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
      }
  });

});

// Our work
const ourWorkTitle = [...document.querySelectorAll('.section__h3[data-splitting][data-effect13]')]

ourWorkTitle.forEach(title => {
        
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
      stagger: 0.2,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
      }
  });
});

// Contact
const contactTitle = [...document.querySelectorAll('.contact-title[data-splitting][data-effect14]')]
// const contactPhrase = [...document.querySelectorAll('.section__p[data-splitting][data-effect15]')]
const contactInfo = [...document.querySelectorAll('.section__p[data-splitting][data-effect16]')]

contactTitle.forEach(title => {
        
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
      stagger: 0.2,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
      }
  });
});
contactInfo.forEach(title => {
        
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
      stagger: 0.8,
      scrollTrigger: {
          trigger: title,
          start: elStart,
          end: 'top+=400%',
      }
  });

});

// Call functions 
handleNav();

// Choose random slogan
randomSlogan()

// handleScrolHorizontal();
handleModal(); 

// Custom Cursor *
customCursor();

// Mute video when playing other or closing modal *
videoMuting();
