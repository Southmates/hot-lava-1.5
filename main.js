import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import Lenis from '@studio-freight/lenis'
import MouseFollower from "mouse-follower"
import Swiper from "swiper"
import { register } from 'swiper/element/bundle';

import './style.scss'
//import './cursor.scss'

gsap.registerPlugin(ScrollTrigger)

// LENIS SETUP
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update()
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// LENIS ANCHOR NAVIGATION
const aboutLink = document.querySelector(".about-link")
const ourWayLink = document.querySelector(".our-way-link")
const workLink = document.querySelector(".work-link")
const contactLink = document.querySelector(".contact-link")
const aboutEl = document.querySelector("#about-us")
const ourWayEl = document.querySelector("#our-way")
const workEl = document.querySelector("#work")
const contactEl = document.querySelector("#contact")
const mobileNavBtn = document.querySelector(".mobile-nav")
const mobileNav = document.querySelector(".mobile")
let mobileNavOpen = false

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

mobileNavBtn.addEventListener("click", () => {
  if(mobileNavOpen) {
    mobileNav.classList.add("hidden")
    mobileNavOpen = false
  } else {
    mobileNav.classList.remove("hidden")
    mobileNavOpen = true
  }
})

// GSAP BACKGROUND COLOR CHANGES
const container = document.querySelector(".main")
const hero = document.querySelector(".hero")
const fadeHero = document.querySelector(".fade-hero-section")
const about = document.querySelector(".about-section")
const howWeWork = document.querySelector(".how-we-work")
const ourWay = document.querySelector(".our-way-wrapper")
const work = document.querySelector(".our-work-wrapper")
const contact = document.querySelector(".contact")

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
  start: 'top top',
  end: '+=490%',
  onEnter: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu()),
  onLeave: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.out"}, setOurWayMenu()),
  onLeaveBack: () => gsap.to(container, {backgroundColor:"#EE512F", duration: 1, ease:"ease.in"}, setBlankMenu()),
  onEnterBack: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu())
})
ScrollTrigger.create( {
  trigger: howWeWork,
  start: '+=10%',
  end: '+=1720%',
  onEnter: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.in"}, setWorkMenu()),
  onLeave: () => gsap.to(container, {backgroundColor:"#FCA720", duration: 1, ease:"ease.out"}, setContactMenu()),
  onLeaveBack: () => gsap.to(container, {backgroundColor:"#108896", duration: 1, ease:"ease.in"}, setAboutMenu()),
  onEnterBack: () => gsap.to(container, {backgroundColor:"#1C374D", duration: 1, ease:"ease.in"}, setWorkMenu())
})

// GSAP HORIZONTAL SCROLL
//MEMBERS
const membersSection = document.querySelector(".members")
let sectionItems = gsap.utils.toArray(".member-item")

gsap.to(sectionItems, {
  xPercent: -155 * (sectionItems.length - 1),
  ease: "sine.out",
  scrollTrigger: {
    trigger: membersSection,
    pin: true,
    scrub: 2,
    //snap: 1 / (sectionItems.length - 1),
    end: "+=0" + membersSection.offsetWidth
  }
})

// HOW WE WORK
const howWeWorkSection = document.querySelector(".our-way-wrapper")
let howWeWorkItems = gsap.utils.toArray(".how-we-work-item")

gsap.to(howWeWorkItems, {
  xPercent: -120.9 * (howWeWorkItems.length - 1),
  ease: "sine.out",
  scrollTrigger: {
    trigger: howWeWorkSection,
    pin: true,
    scrub: 2,
    end: "+=" + howWeWorkSection.offsetWidth
  }
})

// WORKS MODAL
const firstWork = document.querySelector(".first-item")
const firstModal = document.querySelector(".first-modal")
const secondWork = document.querySelector(".second-item")
const secondModal = document.querySelector(".second-modal")
const closeModalBtn = document.querySelector(".close-modal")

//TEST ANIM
const slideFirst = document.querySelector(".work-slide-item-fred-first")
const slideSecond = document.querySelector(".work-slide-item-fred-second")
const slideThird = document.querySelector(".work-slide-item-fred-third")

const videoFirst = document.querySelector(".work-slide-item-fred-first .video")
const videoSecond = document.querySelector(".work-slide-item-fred-second .video")
const videoThird = document.querySelector(".work-slide-item-fred-third .video")

slideFirst.addEventListener("click", () => {
  videoFirst.classList.remove("hidden")
})
slideSecond.addEventListener("click", () => {
  videoSecond.classList.remove("hidden")
})
slideThird.addEventListener("click", () => {
  videoThird.classList.remove("hidden")
})

firstWork.addEventListener("click", () => {
  firstModal.classList.remove("hidden")
  closeModalBtn.classList.remove("hidden")
  lenis.stop()
})
secondWork.addEventListener("click", () => {
  secondModal.classList.remove("hidden")
  closeModalBtn.classList.remove("hidden")
  lenis.stop()
})

closeModalBtn.addEventListener("click", () => {
  firstModal.classList.add("hidden")
  secondModal.classList.add("hidden")
  closeModalBtn.classList.add("hidden")
  lenis.start()
})

// SWIPER SETTER

var swiper = new Swiper('.swiper-container', {
  loop: true,
  mousewheel: true,
  slidesPerView: 3,
  spaceBetween: 100,
  speed: 800,
  loopAddBlankSlides: true,
  centeredSlides: true,
  centerInsufficientSlides: true
});

// BLOB CURSOR FOLLOWER SETUP ANS STATE MANAGEMENT
MouseFollower.registerGSAP(gsap);

const cursor = new MouseFollower({
  el: null,
  container: document.body,
  className: 'mf-cursor',
  innerClassName: 'mf-cursor-inner',
  textClassName: 'mf-cursor-text',
  mediaClassName: 'mf-cursor-media',
  mediaBoxClassName: 'mf-cursor-media-box',
  iconSvgClassName: 'mf-svgsprite',
  iconSvgNamePrefix: '-',
  iconSvgSrc: '',
  dataAttr: 'cursor',
  hiddenState: '-hidden',
  textState: '-text',
  iconState: '-icon',
  activeState: '-active',
  mediaState: '-media',
  stateDetection: {
      '-pointer': 'a,button',
      '-hidden': 'iframe'
  },
  visible: true,
  visibleOnState: false,
  speed: 0.55,
  ease: 'expo.out',
  overwrite: true,
  skewing: 0,
  skewingText: 2,
  skewingIcon: 2,
  skewingMedia: 2,
  skewingDelta: 0.001,
  skewingDeltaMax: 0.15,
  stickDelta: 0.15,
  showTimeout: 20,
  hideOnLeave: true,
  hideTimeout: 300,
  hideMediaTimeout: 300
});
