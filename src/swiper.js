import Swiper from "swiper"
import 'swiper/css'

import './style.scss'
//import './cursor.scss'
 
// SWIPER SETTER
var swiper = new Swiper('.swiper-container', {
  //loop: true,
  mousewheel: true,
  slidesPerView: 3,
  spaceBetween: 1,
  speed: 800,
  loopAddBlankSlides: true,
  centeredSlides: true,
  // centerInsufficientSlides: true,
  // autoplayDisableOnInteraction: false,
});
 