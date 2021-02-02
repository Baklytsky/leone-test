isYoutubeAPILoaded = false;

function loadYoutubeAPI() {
  if (isYoutubeAPILoaded) {
    return;
  } else {
    // Load Youtube API script
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

function onYouTubeIframeAPIReady() {
  isYoutubeAPILoaded = true;
  $('body').trigger('youtubeAPIReady');
}