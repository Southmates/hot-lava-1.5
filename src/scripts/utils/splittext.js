import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

/**
 * Initialize SplitText animation for a title element
 * @param {HTMLElement} title - The title element to animate
 * @param {Object} options - Configuration options
 * @param {string|HTMLElement} options.trigger - ScrollTrigger trigger element (default: parent .container)
 * @param {string} options.start - ScrollTrigger start position (default: "top 50%")
 * @param {number} options.delay - Delay before destroying SplitText in ms (default: 1000)
 */
export function initSplitText(title, options = {}) {
  if (!title) return;

  const container = title.closest(".container") || options.trigger || title.parentElement;
  const isFooter = container?.closest(".contact") || container?.closest("footer");
  
  const start = options.start || (isFooter ? "top 80%" : "top 50%");

  // Split text into words
  const split = new SplitText(title, {
    type: "words",
    wordsClass: "word",
  });

  // Set initial state
  gsap.set(split.words, {
    opacity: 0,
    y: 50,
  });

  // Animate on scroll
  gsap.to(split.words, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.05,
    ease: "power2.out",
    onComplete: () => {
      // Destroy SplitText after delay
      setTimeout(() => {
        split.revert();
      }, options.delay || 1000);
    },
    scrollTrigger: {
      trigger: container,
      start: start,
      toggleActions: "play none none none",
    },
  });
}

