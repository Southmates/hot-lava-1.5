/**
 * Recalculate Lenis height when dynamic content (Shopify) loads
 * @param {Object} lenis - Lenis instance
 */
export function handleDynamicContentResize(lenis) {
  const shopSection = document.querySelector("#shop");
  if (!shopSection) return;

  let resizeTimeout;
  let lastHeight = 0;

  // Function to recalculate height
  const recalculate = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const currentHeight = shopSection.offsetHeight;
      
      // Only resize if height actually changed
      if (currentHeight !== lastHeight) {
        lastHeight = currentHeight;
        lenis.resize();
        
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }
    }, 300);
  };

  // Watch for Shopify iframes and content to load using MutationObserver
  const observer = new MutationObserver(() => {
    const shopifyIframes = shopSection.querySelectorAll("iframe");
    const shopifyContent = shopSection.querySelectorAll("[data-shopify], .shopify-buy-frame");
    
    if (shopifyIframes.length > 0 || shopifyContent.length > 0) {
      recalculate();
    }
  });

  // Observe the shop section for changes
  observer.observe(shopSection, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // Watch for iframe load events
  const checkIframes = () => {
    const iframes = shopSection.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (!iframe.dataset.loaded) {
        iframe.dataset.loaded = "true";
        iframe.addEventListener("load", () => {
          recalculate();
        });
        // Also check if already loaded
        if (iframe.complete) {
          recalculate();
        }
      }
    });
  };

  // Check for iframes periodically until found
  const iframeCheckInterval = setInterval(() => {
    checkIframes();
    const iframes = shopSection.querySelectorAll("iframe");
    if (iframes.length > 0) {
      clearInterval(iframeCheckInterval);
    }
  }, 500);

  // Stop checking after 10 seconds
  setTimeout(() => {
    clearInterval(iframeCheckInterval);
  }, 10000);

  // Listen for Shopify initialization
  const initShopifyListener = () => {
    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      window.ShopifyBuy.UI.onReady().then(() => {
        setTimeout(() => {
          recalculate();
        }, 1000);
      });
    } else {
      // Retry if Shopify not ready yet
      setTimeout(initShopifyListener, 500);
    }
  };
  
  initShopifyListener();

  // Resize on window load as fallback
  window.addEventListener("load", () => {
    setTimeout(() => {
      recalculate();
    }, 1500);
  });

  // Also resize when images load (in case shop section has images)
  const images = shopSection.querySelectorAll("img");
  images.forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", recalculate);
    }
  });
}

