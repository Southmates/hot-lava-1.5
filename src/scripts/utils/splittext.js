import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

/**
 * Initialize SplitText animation for an element using Intersection Observer
 * @param {Element} element - The element to animate
 * @param {Object} [options] - Configuration options
 * @param {string} [options.type='words'] - Split type: 'words', 'lines', or 'character'
 * @param {string|HTMLElement} [options.trigger] - Intersection Observer trigger element (default: parent .container)
 * @param {string} [options.start] - Start position: '50%' or '80%' (default: "50%")
 * @param {number} [options.delay=1000] - Delay before destroying SplitText in ms
 * @param {number} [options.stagger=0.05] - Delay between each element animation (lower = more overlap)
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

  let splitType = options.type || "words";
  
  // Map user-friendly type names to SplitText types
  const typeMap = {
    "character": "chars",
    "char": "chars",
    "chars": "chars",
    "words": "words",
    "word": "words",
    "lines": "lines",
    "line": "lines",
  };
  
  const splitTextType = typeMap[splitType] || "words";

  // Clonar el elemento completo antes de modificarlo
  // const originalElement = element.cloneNode(true);

  // Split text by type
  const splitConfig = {
    type: splitTextType,
  };

  // Add class configuration based on type
  if (splitTextType === "words") {
    splitConfig.wordsClass = "word";
  } else if (splitTextType === "lines") {
    splitConfig.linesClass = "line";
  } else if (splitTextType === "chars") {
    splitConfig.charsClass = "char";
  }

  const split = new SplitText(element, splitConfig);

  // Get the split elements based on type
  const splitElements = 
    splitTextType === "words" ? split.words : 
    splitTextType === "lines" ? split.lines : 
    splitTextType === "chars" ? split.chars : 
    split.words;

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
            stagger: options.stagger !== undefined ? options.stagger : 0.05,
            ease: "power2.out",
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