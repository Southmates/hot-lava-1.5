import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import Lenis from '@studio-freight/lenis' 
import customCursor from './js/cursor.js';
import videoMuting from './js/videomuting.js';

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
    end: 'bottom top',
    onEnter: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onLeave: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.out"}, setAboutMenu()),
    onLeaveBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onEnterBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu())
  })

  ScrollTrigger.create( {
    trigger: about,
    start: 'top +=40%',
    end: 'bottom top',
    // markers: true,
    onEnter: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu()),
    // onLeave: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.out"}, setOurWayMenu()),
    // onLeaveBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
    onEnterBack: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu())
  })

  ScrollTrigger.create( {
    trigger: howWeWork,
    start: 'top +=75%', 
    end: 'bottom top',
    onEnter: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.in"}, setOurWayMenu()),
    onLeave: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.out"}, setWorkMenu()),
    onLeaveBack: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu()),
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
    start: 'top 20%',
    end: 'bottom bottom',
    onEnter: () => gsap.to(container, {backgroundColor:"#E69C24", duration: 1, ease:"ease.in"}, setContactMenu()), 
    onLeaveBack: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.out"}, setWorkMenu()),
  })
}

// Scrolling "Team Members" horizontally
function handleScrolHorizontal() {
  const membersSection = document.querySelector(".team")
  let sectionItems = gsap.utils.toArray(".team__card")

  gsap.to(sectionItems, {
    xPercent: -95 * (sectionItems.length - 1),
    ease: "sine.out",
    scrollTrigger: {
      trigger: membersSection,
      pin: true,
      scrub: 2, 
      end: "+=0" + membersSection.offsetWidth
    }
  })
}

// Handle modal, stop/start Lenis
function handleModal() { 

  let closeModalBtn = document.querySelector(".js-close");
  closeModalBtn.addEventListener("click", () => { 
    closeModalBtn.classList.add("hidden")
    
    lenis.start()
  })
}

// Call functions 
handleNav();
handleScrolHorizontal();
handleModal();
handleBg();

// Custom Cursor *
customCursor();

// Mute video when playing other or closing modal *
videoMuting();