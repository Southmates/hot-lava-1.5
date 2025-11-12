import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

/**
 * Initialize SplitText animation for an element
 * @param {Element} element - The element to animate
 * @param {Object} [options] - Configuration options
 * @param {string} [options.type='words'] - Split type: 'words' or 'lines'
 * @param {string|HTMLElement} [options.trigger] - ScrollTrigger trigger element (default: parent .container)
 * @param {string} [options.start] - ScrollTrigger start position (default: "top 50%")
 * @param {number} [options.delay=1000] - Delay before destroying SplitText in ms
 */
export function initSplitText(element, options = {}) {
  if (!element || !(element instanceof HTMLElement)) return;

  const container = element.closest(".container") || options.trigger || element.parentElement;
  const isFooter = container?.closest(".contact") || container?.closest("footer");
  
  const start = options.start || (isFooter ? "top 80%" : "top 50%");
  const splitType = options.type || "words";

  // Split text by type
  const split = new SplitText(element, {
    type: splitType,
    ...(splitType === "words" ? { wordsClass: "word" } : { linesClass: "line" }),
  });

  // Get the split elements based on type
  const splitElements = splitType === "words" ? split.words : split.lines;

  // Set initial state
  gsap.set(splitElements, {
    opacity: 0,
    y: 50,
  });

  // Animate on scroll
  gsap.to(splitElements, {
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

