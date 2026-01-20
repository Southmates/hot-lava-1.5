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
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=0&muted=0&controls=0` : '';
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
    if (typeof Vimeo === 'undefined' || !videoIframe) {
      setTimeout(init, 100);
      return;
    }
    
    try {
      vimeoPlayer = new Vimeo.Player(videoIframe);
      videoDuration = 0;
      
      vimeoPlayer.on('play', () => {
        modalTarget?.classList.add('vimeo-player--playing');
        if (playPauseBtn) playPauseBtn.textContent = 'PAUSE';
        clearProgressInterval();
        progressInterval = setInterval(updateProgress, 100);
      });
      
      vimeoPlayer.on('pause', () => {
        modalTarget?.classList.remove('vimeo-player--playing');
        if (playPauseBtn) playPauseBtn.textContent = 'PLAY';
        clearProgressInterval();
        updateProgress();
      });
      
      vimeoPlayer.on('ended', () => {
        modalTarget?.classList.remove('vimeo-player--playing');
        if (playPauseBtn) playPauseBtn.textContent = 'PLAY';
        clearProgressInterval();
      });
      
      vimeoPlayer.ready().then(() => {
        vimeoPlayer.setVolume(1).then(() => {
          vimeoPlayer.play().catch(() => {});
        });
      });
      
      setTimeout(updateProgress, 500);
    } catch (error) {
      console.warn('Vimeo Player initialization error:', error);
    }
  }

  // Stop video playback
  function stop() {
    if (vimeoPlayer) {
      vimeoPlayer.pause().catch(() => {});
      vimeoPlayer = null;
    }
    clearProgressInterval();
    videoDuration = 0;
    if (videoIframe) videoIframe.src = '';
    modalTarget?.classList.remove('vimeo-player--playing');
    if (playPauseBtn) playPauseBtn.textContent = 'PLAY';
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
    
    videoIframe.src = embedUrl;
    videoIframe.onload = () => setTimeout(init, 500);
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
