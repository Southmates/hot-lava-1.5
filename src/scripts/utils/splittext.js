import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

/**
 * Initialize SplitText animation for an element using Intersection Observer
 * @param {Element} element - The element to animate
 * @param {Object} [options] - Configuration options
 * @param {string} [options.type='words'] - Split type: 'words' or 'lines'
 * @param {string|HTMLElement} [options.trigger] - Intersection Observer trigger element (default: parent .container)
 * @param {string} [options.start] - Start position: '50%' or '80%' (default: "50%")
 * @param {number} [options.delay=1000] - Delay before destroying SplitText in ms
 */
export function initSplitText(element, options = {}) {
  if (!element || !(element instanceof HTMLElement)) return;

  const container = element.closest(".container") || options.trigger || element.parentElement;
  if (!container) return;

  const isFooter = container.closest(".contact") || container.closest("footer");
  
  // Calculate threshold based on start position
  // "top 50%" means when 50% of container is visible = 0.5 threshold
  // "top 80%" means when 80% of container is visible = 0.8 threshold
  const startPosition = options.start || (isFooter ? "80%" : "50%");
  const threshold = parseFloat(startPosition.replace("%", "")) / 100;

  const splitType = options.type || "words";

  // Clonar el elemento completo antes de modificarlo
  // const originalElement = element.cloneNode(true);

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

  let hasAnimated = false;

  // Create Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Only animate once when threshold is reached
        if (entry.isIntersecting && entry.intersectionRatio >= threshold && !hasAnimated) {
          hasAnimated = true;

          // Stop observing since animation will only happen once
          observer.unobserve(container);

          // Animate on intersection
          gsap.to(splitElements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power2.out",
            // onComplete: () => {
            //   setTimeout(() => {
            //     // Reemplazar el elemento completo con el clon original
            //     element.parentNode.replaceChild(originalElement, element);
            //     // Disconnect observer after animation
            //     observer.disconnect();
            //   }, options.delay || 1000);
            // },
          });
        }
      });
    },
    {
      threshold: threshold,
      rootMargin: "0px",
    }
  );

  // Start observing the container
  observer.observe(container);
}