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
const thirdWork = document.querySelector(".third-item")
const thirdModal = document.querySelector(".third-modal")
const fourthWork = document.querySelector(".fourth-item")
const fourthModal = document.querySelector(".fourth-modal")
const fifthWork = document.querySelector(".fifth-item")
const fifthModal = document.querySelector(".fifth-modal")
const closeModalBtn = document.querySelector(".close-modal")

//TEST ANIM
const fredSlideFirst = document.querySelector(".work-slide-item-fred-first")
const fredSlideSecond = document.querySelector(".work-slide-item-fred-second")
const fredSlideThird = document.querySelector(".work-slide-item-fred-third")
const fredVideoFirst = document.querySelector(".work-slide-item-fred-first .video")
const fredVideoSecond = document.querySelector(".work-slide-item-fred-second .video")
const fredVideoThird = document.querySelector(".work-slide-item-fred-third .video")

const meiSlideFirst = document.querySelector(".work-slide-item-mei-first")
const meiSlideSecond = document.querySelector(".work-slide-item-mei-second")
const meiSlideThird = document.querySelector(".work-slide-item-mei-third")
const meiVideoFirst = document.querySelector(".work-slide-item-mei-first .video")
const meiVideoSecond = document.querySelector(".work-slide-item-mei-second .video")
const meiVideoThird = document.querySelector(".work-slide-item-mei-third .video")

const thymeSlideFirst = document.querySelector(".work-slide-item-thyme-first")
const thymeSlideSecond = document.querySelector(".work-slide-item-thyme-second")
const thymeSlideThird = document.querySelector(".work-slide-item-thyme-third")
const thymeVideoFirst = document.querySelector(".work-slide-item-thyme-first .video")
const thymeVideoSecond = document.querySelector(".work-slide-item-thyme-second .video")
const thymeVideoThird = document.querySelector(".work-slide-item-thyme-third .video")

const brandSlideFirst = document.querySelector(".work-slide-item-brand-first")
const brandSlideSecond = document.querySelector(".work-slide-item-brand-second")
const brandSlideThird = document.querySelector(".work-slide-item-brand-third")

const wigSlideFirst = document.querySelector(".work-slide-item-wig-first")
const wigSlideSecond = document.querySelector(".work-slide-item-wig-second")
const wigSlideThird = document.querySelector(".work-slide-item-wig-third")
const wigVideoFirst = document.querySelector(".work-slide-item-wig-first .video")
const wigVideoSecond = document.querySelector(".work-slide-item-wig-second .video")
const wigVideoThird = document.querySelector(".work-slide-item-wig-third .video")

fredSlideFirst.addEventListener("click", () => {fredVideoFirst.classList.remove("video-hidden")})
fredSlideSecond.addEventListener("click", () => {fredVideoSecond.classList.remove("video-hidden")})
fredSlideThird.addEventListener("click", () => {fredVideoThird.classList.remove("video-hidden")})

meiSlideFirst.addEventListener("click", () => {meiVideoFirst.classList.remove("video-hidden")})
meiSlideSecond.addEventListener("click", () => {meiVideoSecond.classList.remove("video-hidden")})
meiSlideThird.addEventListener("click", () => {meiVideoThird.classList.remove("video-hidden")})

thymeSlideFirst.addEventListener("click", () => {thymeVideoFirst.classList.remove("video-hidden")})
thymeSlideSecond.addEventListener("click", () => {thymeVideoSecond.classList.remove("video-hidden")})
thymeSlideThird.addEventListener("click", () => {thymeVideoThird.classList.remove("video-hidden")})

wigSlideFirst.addEventListener("click", () => {wigVideoFirst.classList.remove("video-hidden")})
wigSlideSecond.addEventListener("click", () => {wigVideoSecond.classList.remove("video-hidden")})
wigSlideThird.addEventListener("click", () => {wigVideoThird.classList.remove("video-hidden")})

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
thirdWork.addEventListener("click", () => {
  thirdModal.classList.remove("hidden")
  closeModalBtn.classList.remove("hidden")
  lenis.stop()
})
fourthWork.addEventListener("click", () => {
  fourthModal.classList.remove("hidden")
  closeModalBtn.classList.remove("hidden")
  lenis.stop()
})
fifthWork.addEventListener("click", () => {
  fifthModal.classList.remove("hidden")
  closeModalBtn.classList.remove("hidden")
  lenis.stop()
})

closeModalBtn.addEventListener("click", () => {
  firstModal.classList.add("hidden")
  secondModal.classList.add("hidden")
  thirdModal.classList.add("hidden")
  fourthModal.classList.add("hidden")
  fifthModal.classList.add("hidden")
  closeModalBtn.classList.add("hidden")
  lenis.start()
})

// SWIPER SETTER
var swiper = new Swiper('.swiper-container', {
  //loop: true,
  mousewheel: true,
  slidesPerView: 3,
  spaceBetween: 100,
  speed: 800,
  loopAddBlankSlides: true,
  centeredSlides: true,
  centerInsufficientSlides: true,
  autoplayDisableOnInteraction: false,
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
