function videoMuting() {
  // assume only one video is playing at a time
  var videoPlaying = null;

  const onPlay = function () {
  if (videoPlaying && videoPlaying != this) {
    videoPlaying.pause();
  }
  videoPlaying = this;
  };

  // init event handler
  const videos = document.querySelectorAll(".video video");
  for (let i = 0; i < videos.length; i++) {
    videos[i].addEventListener("play", onPlay);
  }

  let closebtn = document.querySelector(".js-close");
    closebtn.addEventListener("click", function (e) { 
    document.querySelectorAll("video").forEach((v) => {
        v.pause();
    });
  });
}

export default videoMuting 