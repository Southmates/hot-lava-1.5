import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

/**
 * Create a parallax effect on an element
 * @param {HTMLElement|string} target - Element to animate (selector string or HTMLElement)
 * @param {Object} options - Configuration options
 * @param {HTMLElement|string} [options.trigger] - ScrollTrigger trigger element (default: target)
 * @param {number} [options.speed=0.5] - Parallax speed (0 = no movement, 1 = normal scroll, >1 = faster)
 * @param {string} [options.direction='y'] - Parallax direction: 'y' (vertical) or 'x' (horizontal)
 * @param {string} [options.start='top bottom'] - ScrollTrigger start position
 * @param {string} [options.end='bottom top'] - ScrollTrigger end position
 * @param {string} [options.ease='none'] - GSAP easing function
 */
export function initParallax(target, options = {}) {
  // Get target element
  const targetElement = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!targetElement) {
    console.warn('Parallax: Target element not found', target);
    return null;
  }

  // Get trigger element (default to target)
  const triggerElement = options.trigger
    ? (typeof options.trigger === 'string' 
        ? document.querySelector(options.trigger) 
        : options.trigger)
    : targetElement;

  if (!triggerElement) {
    console.warn('Parallax: Trigger element not found', options.trigger);
    return null;
  }

  // Configuration
  const speed = options.speed || 0.5;
  const direction = options.direction || 'y';
  const start = options.start || 'top bottom';
  const end = options.end || 'bottom top';
  const ease = options.ease || 'none';

  // Calculate movement distance
  // Speed of 0.5 means element moves at half the scroll speed
  // Speed of 1 means element moves at same speed as scroll (no parallax)
  // Speed of 2 means element moves twice as fast as scroll
  const movement = direction === 'y' 
    ? { y: speed * 100 } 
    : { x: speed * 100 };

  // Create parallax animation
  const animation = gsap.to(targetElement, {
    ...movement,
    ease: ease,
    scrollTrigger: {
      trigger: triggerElement,
      start: start,
      end: end,
      scrub: true, // Smooth parallax that follows scroll
    },
  });

  return animation;
}

/**
 * Create multiple parallax effects at once
 * @param {Array} configs - Array of parallax configurations
 * Each config should have: { target, trigger?, speed?, direction?, start?, end?, ease? }
 */
export function initParallaxMultiple(configs) {
  if (!Array.isArray(configs)) {
    console.warn('Parallax: configs must be an array');
    return [];
  }

  return configs.map(config => {
    const { target, ...options } = config;
    return initParallax(target, options);
  });
}

