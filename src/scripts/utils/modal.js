/**
 * Modal Controller - handles modal open/close logic
 */
export function createModal(lenis) {
  const modalTarget = document.querySelector(".modal");
  const modalSliders = document.querySelectorAll(".work__slider");
  const closeModalBtn = document.querySelector(".js-close");
  const videoTitle = document.getElementById("work-video-title");
  
  let videoPlayer = null;

  function open(videoUrl, workName, targetSlide) {
    if (!modalTarget) return;

    // Set title
    if (videoTitle && workName) {
      videoTitle.textContent = workName;
    }

    // Load video if URL provided
    if (videoUrl && videoPlayer) {
      if (!videoPlayer.loadVideo(videoUrl)) return;
    }

    // Show target slider
    if (targetSlide) {
      const targetClient = document.querySelector(`[data-client="${CSS.escape(targetSlide)}"]`);
      if (targetClient) targetClient.hidden = false;
    }

    modalTarget.classList.add("is-active");
    if (lenis) lenis.stop();
  }

  function close() {
    if (!modalTarget) return;

    if (videoPlayer) videoPlayer.stop();
    
    modalTarget.classList.remove("is-active");
    modalSliders.forEach(slider => slider.hidden = true);
    if (lenis) lenis.start();
  }

  // Setup close handlers
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", close);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalTarget?.classList.contains("is-active")) {
      close();
    }
  });

  // Set video player reference
  function setVideoPlayer(player) {
    videoPlayer = player;
  }

  return {
    open,
    close,
    setVideoPlayer
  };
}
