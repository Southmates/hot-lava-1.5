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
  function init() {
    if (!videoIframe || typeof Vimeo === 'undefined') {
      return;
    }
    
    if (!videoIframe.src || !videoIframe.src.includes('player.vimeo.com')) {
      return;
    }
    
    try {
      // Clean up existing player if any
      if (vimeoPlayer) {
        try {
          vimeoPlayer.off('play');
          vimeoPlayer.off('pause');
          vimeoPlayer.off('ended');
        } catch (e) {
          // Ignore errors
        }
      }
      
      // Create new player instance
      vimeoPlayer = new Vimeo.Player(videoIframe);
      videoDuration = 0;
      
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
        vimeoPlayer.setCurrentTime(0).then(() => {
          vimeoPlayer.pause().catch(() => {});
        });
        modalTarget?.classList.remove('vimeo-player--playing');
        if (playPauseBtn) playPauseBtn.textContent = 'Play';
        clearProgressInterval();
        updateProgress();
      });
      
      // When player is ready, set volume and play
      vimeoPlayer.ready().then(() => {
        updateProgress();
        
        // Set volume to 1 (unmuted) and play
        vimeoPlayer.setVolume(1).then(() => {
          return vimeoPlayer.play();
        }).then(() => {
          // UI updates handled by 'play' event
        }).catch((error) => {
          console.warn('Autoplay failed:', error);
        });
      }).catch((error) => {
        console.warn('Vimeo Player ready error:', error);
      });
    } catch (error) {
      console.warn('Vimeo Player initialization error:', error);
      vimeoPlayer = null;
    }
  }

  // Stop video playback and reset everything
  function stop() {
    if (vimeoPlayer) {
      try {
        vimeoPlayer.off('play');
        vimeoPlayer.off('pause');
        vimeoPlayer.off('ended');
        vimeoPlayer.pause().catch(() => {});
      } catch (e) {
        // Ignore errors
      }
      vimeoPlayer = null;
    }
    
    clearProgressInterval();
    videoDuration = 0;
    
    if (videoIframe) {
      // Remove onload handler first to prevent postMessage errors
      videoIframe.onload = null;
      // Clear src after a small delay to allow any pending messages to complete
      setTimeout(() => {
        if (videoIframe) {
          videoIframe.src = '';
        }
      }, 50);
    }
    
    // Reset UI state
    modalTarget?.classList.remove('vimeo-player--playing');
    if (playPauseBtn) playPauseBtn.textContent = 'Play';
    if (progressBar) progressBar.style.width = '0%';
    if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
  }

  // Play/Pause toggle
  function togglePlayPause() {
    if (!vimeoPlayer) return;
    vimeoPlayer.getPaused().then(paused => {
      if (paused) {
        vimeoPlayer.setVolume(1).then(() => {
          return vimeoPlayer.play();
        });
      } else {
        vimeoPlayer.pause();
      }
    });
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
    
    // Clean up existing player
    if (vimeoPlayer) {
      try {
        vimeoPlayer.off('play');
        vimeoPlayer.off('pause');
        vimeoPlayer.off('ended');
        vimeoPlayer.pause().catch(() => {});
      } catch (e) {
        // Ignore errors
      }
      vimeoPlayer = null;
    }
    
    clearProgressInterval();
    videoDuration = 0;
    
    // Reset UI state
    modalTarget?.classList.remove('vimeo-player--playing');
    if (playPauseBtn) playPauseBtn.textContent = 'Play';
    if (progressBar) progressBar.style.width = '0%';
    if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
    
    // Remove old onload handler
    videoIframe.onload = null;
    
    // Clear iframe src first
    videoIframe.src = '';
    
    // Wait a moment before setting new src to ensure iframe is cleared
    setTimeout(() => {
      // Set up load handler
      const handleLoad = () => {
        // Wait a bit for Vimeo API to be ready
        setTimeout(() => {
          init();
        }, 100);
      };
      
      videoIframe.onload = handleLoad;
      
      // Set iframe src - this will trigger load
      videoIframe.src = embedUrl;
      
      // Fallback initialization if onload doesn't fire
      setTimeout(() => {
        if (!vimeoPlayer && videoIframe.src === embedUrl) {
          init();
        }
      }, 500);
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
