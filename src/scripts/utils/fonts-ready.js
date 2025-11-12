/**
 * Wait for fonts to be ready before executing a callback
 * @param {Function} callback - Function to execute after fonts are ready
 */
export function waitForFonts(callback) {
  if (typeof callback !== 'function') {
    console.warn('waitForFonts: callback must be a function');
    return;
  }

  // Wait for fontsReady event
  window.addEventListener('fontsReady', callback);
  
  // Fallback: if fonts are already loaded when script runs
  document.fonts.ready.then(() => {
    // Small delay to ensure event was processed
    setTimeout(() => {
      if (!window.fontsReadyDispatched) {
        callback();
      }
    }, 100);
  });
}

