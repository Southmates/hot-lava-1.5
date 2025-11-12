/**
 * Recalculate Lenis height when dynamic content (Shopify) loads
 * @param {Object} lenis - Lenis instance
 */
export function handleDynamicContentResize(lenis) {
  const shopSection = document.querySelector("#shop");
  if (!shopSection) return;

  // Watch for Shopify iframes to load using MutationObserver
  const observer = new MutationObserver(() => {
    const shopifyIframes = shopSection.querySelectorAll("iframe");
    if (shopifyIframes.length > 0) {
      // Wait for iframes to render and calculate their height
      setTimeout(() => {
        lenis.resize();
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 500);
    }
  });

  // Observe the shop section for changes
  observer.observe(shopSection, {
    childList: true,
    subtree: true,
  });

  // Also listen for Shopify initialization if available
  if (window.ShopifyBuy && window.ShopifyBuy.UI) {
    window.ShopifyBuy.UI.onReady().then(() => {
      setTimeout(() => {
        lenis.resize();
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 1000);
    });
  }

  // Resize on window load as fallback
  window.addEventListener("load", () => {
    setTimeout(() => {
      lenis.resize();
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }, 1500);
  });
}

