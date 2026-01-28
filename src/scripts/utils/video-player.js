/**
 * Video Player Controller - handles all video playback logic
 */
export function createVideoPlayer() {
  const videoIframe = document.getElementById("work-video");
  const playPauseBtn = document.getElementById("work-video-play-pause");
  const progressBar = document.getElementById("work-video-progress");
  const timeDisplay = document.getElementById("work-video-time");
  const progressTrack = document.querySelector('.vimeo-player__progress-track');
  const modalTarget = document.querySelector(".modal");
  
  let vimeoPlayer = null;
  let progressInterval = null;
  let videoDuration = 0;

  // Convert Vimeo URL to embed format
  function getVimeoEmbedUrl(url) {
    const videoId = url?.match(/\/(\d+)/)?.[1];
    // autoplay=1, muted=0 (audio enabled), controls=0 (no Vimeo controls)
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=0&muted=0&controls=0&byline=0&portrait=0&dnt=1` : '';
  }

  // Format time in MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Clear progress interval helper
  function clearProgressInterval() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  // Update progress bar and time
  function updateProgress() {
    if (!vimeoPlayer) return;
    
    Promise.all([
      vimeoPlayer.getCurrentTime(),
      videoDuration || vimeoPlayer.getDuration()
    ]).then(([current, duration]) => {
      if (!videoDuration) videoDuration = duration;
      const percent = (current / duration) * 100;
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (timeDisplay) timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    }).catch(() => {});
  }

  // Initialize Vimeo player
  let initAttempts = 0;
  const MAX_INIT_ATTEMPTS = 10;
  let isInitializing = false;
  
  function init() {
    // Prevent multiple simultaneous initializations
    if (isInitializing || vimeoPlayer) return;
    
    initAttempts++;
    isInitializing = true;
    
    if (typeof Vimeo === 'undefined' || !videoIframe) {
      isInitializing = false;
      if (initAttempts < MAX_INIT_ATTEMPTS) {
        setTimeout(init, 100);
      }
      return;
    }
    
    // Check if iframe has valid Vimeo src
    if (!videoIframe.src || !videoIframe.src.includes('player.vimeo.com')) {
      isInitializing = false;
      if (initAttempts < MAX_INIT_ATTEMPTS) {
        setTimeout(init, 100);
      }
      return;
    }
    
    try {
      // Create new player instance
      vimeoPlayer = new Vimeo.Player(videoIframe);
      videoDuration = 0;
      initAttempts = 0; // Reset on success
      
      // Set up event listeners
      vimeoPlayer.on('play', () => {
        modalTarget?.classList.add('vimeo-player--playing');
        if (playPauseBtn) playPauseBtn.textContent = 'Pause';
        clearProgressInterval();
        progressInterval = setInterval(updateProgress, 100);
      });
      
      vimeoPlayer.on('pause', () => {
        modalTarget?.classList.remove('vimeo-player--playing');
        if (playPauseBtn) playPauseBtn.textContent = 'Play';
        clearProgressInterval();
        updateProgress();
      });
      
      vimeoPlayer.on('ended', () => {
        // Return to first frame and pause to hide Vimeo endscreen suggestions
        vimeoPlayer.setCurrentTime(0).then(() => {
          vimeoPlayer.pause().catch(() => {});
        });
        modalTarget?.classList.remove('vimeo-player--playing');
        if (playPauseBtn) playPauseBtn.textContent = 'Play';
        clearProgressInterval();
        updateProgress();
      });
      
      vimeoPlayer.ready().then(() => {
        isInitializing = false;
        
        // Initial progress update
        updateProgress();
        
        // Ensure video is unmuted and volume is set to 1, then play
        vimeoPlayer.setVolume(1).then(() => {
          // Try to unmute if method exists
          if (typeof vimeoPlayer.setMuted === 'function') {
            return vimeoPlayer.setMuted(false);
          }
          return Promise.resolve();
        }).then(() => {
          return vimeoPlayer.play();
        }).then(() => {
          // The 'play' event should handle UI updates, but ensure it's set
          modalTarget?.classList.add('vimeo-player--playing');
          if (playPauseBtn) playPauseBtn.textContent = 'Pause';
          clearProgressInterval();
          progressInterval = setInterval(updateProgress, 100);
        }).catch((error) => {
          // If autoplay fails (e.g., browser restrictions), button stays as "Play"
          console.warn('Autoplay failed:', error);
          isInitializing = false;
        });
      }).catch((error) => {
        console.warn('Vimeo Player ready error:', error);
        isInitializing = false;
        vimeoPlayer = null;
        // Retry initialization if ready fails
        if (initAttempts < MAX_INIT_ATTEMPTS) {
          setTimeout(init, 500);
        }
      });
    } catch (error) {
      console.warn('Vimeo Player initialization error:', error);
      vimeoPlayer = null;
      isInitializing = false;
      // Retry after a delay with exponential backoff
      if (initAttempts < MAX_INIT_ATTEMPTS) {
        const delay = Math.min(500 * initAttempts, 2000);
        setTimeout(init, delay);
      }
    }
  }

  // Stop video playback
  function stop() {
    if (vimeoPlayer) {
      try {
        vimeoPlayer.off('play');
        vimeoPlayer.off('pause');
        vimeoPlayer.off('ended');
        vimeoPlayer.pause().catch(() => {});
      } catch (e) {
        // Player might already be destroyed
      }
      vimeoPlayer = null;
    }
    clearProgressInterval();
    videoDuration = 0;
    isInitializing = false;
    initAttempts = 0;
    if (videoIframe) {
      videoIframe.src = '';
      videoIframe.onload = null;
    }
    modalTarget?.classList.remove('vimeo-player--playing');
    if (playPauseBtn) playPauseBtn.textContent = 'Play';
    if (progressBar) progressBar.style.width = '0%';
    if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
  }

  // Play/Pause toggle
  function togglePlayPause() {
    if (!vimeoPlayer) return;
    vimeoPlayer.getPaused().then(paused => paused ? vimeoPlayer.play() : vimeoPlayer.pause());
  }

  // Seek video on progress bar click
  function seekVideo(event) {
    if (!vimeoPlayer) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    
    if (videoDuration) {
      vimeoPlayer.setCurrentTime(videoDuration * percent);
    } else {
      vimeoPlayer.getDuration().then(duration => {
        videoDuration = duration;
        vimeoPlayer.setCurrentTime(duration * percent);
      });
    }
  }

  // Load video from URL
  function loadVideo(videoUrl) {
    const embedUrl = getVimeoEmbedUrl(videoUrl);
    if (!embedUrl || !videoIframe) return false;
    
    // Clean up existing player properly
    if (vimeoPlayer) {
      try {
        vimeoPlayer.off('play');
        vimeoPlayer.off('pause');
        vimeoPlayer.off('ended');
        vimeoPlayer.pause().catch(() => {});
      } catch (e) {
        // Player might already be destroyed
      }
      vimeoPlayer = null;
    }
    clearProgressInterval();
    videoDuration = 0;
    initAttempts = 0; // Reset init attempts counter
    isInitializing = false; // Reset initialization flag
    
    // Reset UI state
    modalTarget?.classList.remove('vimeo-player--playing');
    if (playPauseBtn) playPauseBtn.textContent = 'Play';
    if (progressBar) progressBar.style.width = '0%';
    if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
    
    // Wait for iframe to load, then initialize player
    let loadHandlerCalled = false;
    const handleLoad = () => {
      // Only initialize once per load
      if (loadHandlerCalled) return;
      if (!videoIframe.src.includes('player.vimeo.com')) return;
      
      loadHandlerCalled = true;
      // Try to initialize immediately after iframe loads
      // The init() function will handle retries if Vimeo isn't ready yet
      init();
    };
    
    // Set up load handler before changing src
    videoIframe.onload = handleLoad;
    
    // Always clear and reload iframe to ensure fresh initialization
    videoIframe.src = '';
    
    // Wait a moment before setting new src to ensure iframe is cleared
    setTimeout(() => {
      loadHandlerCalled = false; // Reset flag for new load
      videoIframe.src = embedUrl;
      
      // Fallback: if onload doesn't fire (e.g., cached content), try to initialize
      setTimeout(() => {
        if (!vimeoPlayer && videoIframe.src === embedUrl && !isInitializing) {
          init();
        }
      }, 500);
      
      // Additional fallback attempt
      setTimeout(() => {
        if (!vimeoPlayer && videoIframe.src === embedUrl && !isInitializing) {
          init();
        }
      }, 1000);
    }, 100);
    
    return true;
  }

  // Setup event listeners
  if (progressTrack) {
    progressTrack.addEventListener('click', seekVideo);
  }
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }

  return {
    loadVideo,
    stop,
    init
  };
}
