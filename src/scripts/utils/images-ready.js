/**
 * Wait for critical images to load before executing a callback
 * Images marked with data-critical="true" will be waited for
 * @param {Function} callback - Function to execute after critical images are ready
 * @param {Object} options - Configuration options
 * @param {string} [options.selector='img[data-critical="true"]'] - Selector for critical images
 * @param {number} [options.timeout=10000] - Maximum wait time in ms
 */
export function waitForCriticalImages(callback, options = {}) {
  if (typeof callback !== 'function') {
    console.warn('waitForCriticalImages: callback must be a function');
    return;
  }

  const config = {
    selector: 'img[data-critical="true"]',
    timeout: 10000,
    ...options
  };

  const criticalImages = document.querySelectorAll(config.selector);
  
  if (criticalImages.length === 0) {
    // No critical images, execute callback immediately
    callback();
    return;
  }

  let loadedCount = 0;
  const totalImages = criticalImages.length;
  const startTime = Date.now();

  // Check if image is already loaded
  const checkImageLoaded = (img) => {
    return img.complete && img.naturalHeight !== 0;
  };

  // Handle image load
  const handleImageLoad = (img) => {
    if (checkImageLoaded(img)) {
      loadedCount++;
      if (loadedCount === totalImages) {
        callback();
      }
    } else {
      img.addEventListener('load', () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          callback();
        }
      }, { once: true });

      img.addEventListener('error', () => {
        console.warn('Critical image failed to load:', img.src);
        loadedCount++;
        if (loadedCount === totalImages) {
          callback();
        }
      }, { once: true });
    }
  };

  // Process all critical images
  criticalImages.forEach((img) => {
    if (checkImageLoaded(img)) {
      loadedCount++;
    } else {
      // Force load if not already loading
      if (!img.src && img.dataset.src) {
        img.src = img.dataset.src;
      }
      
      img.addEventListener('load', () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          callback();
        }
      }, { once: true });

      img.addEventListener('error', () => {
        console.warn('Critical image failed to load:', img.src);
        loadedCount++;
        if (loadedCount === totalImages) {
          callback();
        }
      }, { once: true });
    }
  });

  // Check if all images are already loaded
  if (loadedCount === totalImages) {
    callback();
    return;
  }

  // Timeout fallback
  setTimeout(() => {
    if (loadedCount < totalImages) {
      console.warn(`Timeout: Only ${loadedCount}/${totalImages} critical images loaded`);
      callback();
    }
  }, config.timeout);
}

/**
 * Wait for both fonts and critical images to be ready
 * @param {Function} callback - Function to execute after both are ready
 */
export function waitForAssets(callback) {
  if (typeof callback !== 'function') {
    console.warn('waitForAssets: callback must be a function');
    return;
  }

  let fontsReady = false;
  let imagesReady = false;

  const checkBothReady = () => {
    if (fontsReady && imagesReady) {
      callback();
    }
  };

  // Wait for fonts
  const handleFontsReady = () => {
    fontsReady = true;
    checkBothReady();
  };

  window.addEventListener('fontsReady', handleFontsReady, { once: true });

  // Fallback for fonts
  document.fonts.ready.then(() => {
    setTimeout(() => {
      if (!window.fontsReadyDispatched) {
        fontsReady = true;
        checkBothReady();
      }
    }, 100);
  });

  // Wait for critical images
  waitForCriticalImages(() => {
    imagesReady = true;
    checkBothReady();
  });
}

