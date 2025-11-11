import Swiper from "swiper"  

function slider() {
 
  // SWIPER SETTER
  var swiper = new Swiper('.swiper-container', { 
    mousewheel: true,
    slidesPerView: 3,
    spaceBetween: 1,
    speed: 800,
    loopAddBlankSlides: true,
    centeredSlides: true,
    centerInsufficientSlides: true, 
  });
}

export default slider 