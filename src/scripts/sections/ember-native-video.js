theme.EmbedNativeVideo = (function() {

  var players = [];
  var isYoutubeAPIReady = false;
  var defaultYoutubeOptions = {
    height: '720',
    width: '1280',
    playerVars: {
      cc_load_policy: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      autohide: 0,
      controls: 1,
      branding: 0,
      loop: 0,
      rel: 0,
      fs: 0,
      wmode: 'opaque'
    },
    events: {
      'onReady': onPlayerReady
    }
  };

  function EmbedNativeVideo(container) {
    var self = this;
    var $container = this.$container = $(container);
    var sectionId = this.sectionId = $container.attr('data-section-id');
    var $player = this.$player = $container.find('.video__iframe') || $container.find('video') ;

    if ($player.length) {
      this.playerID = $player.find('[data-youtube-wrapper]').attr('id');
      this.videoID = $player.data('video-id');
      this.videoType = $player.data('video-type');
      this.init($container);
    }

    $container.on('touchstart', '.video-wrapper', function(e) {
      var playerID = $(this).find('.video__iframe').attr('id');
      players[playerID].playVideo();
    });
  }

  function onPlayerReady(event) {
    var id = $(event.target.l).attr('id');
    var wrapperId = $(event.target.l).attr('data-section-this-id');
    var container = $('[data-section-id="'+ wrapperId +'"]');
    var $button = container.find('.video-play');
    var $image = container.find('.video-image');
    var enableSound = $( '#' + id ).data( 'enable-sound' );

    $(event.target.l).attr('tabindex', '-1');

    if ( enableSound ) {
      event.target.mute();
    } else {
      event.target.unMute();
    }

    $button.on('click', function () {
      event.target.playVideo();
      $image.fadeOut();
      $(this).hide();
    })
  }

  EmbedNativeVideo.prototype = $.extend({}, EmbedNativeVideo.prototype, {
    init: function($container) {
      var _self = this;

      if ( _self.videoType == 'youtube'){
        if ( isYoutubeAPIReady ) {
          this.loadYoutubePlayer();
        } else {
          // Load Youtube API if not loaded yet
          window.loadYoutubeAPI();
          $('body').on('youtubeAPIReady', this.loadYoutubePlayer.bind(this));
        }
      }
      else if ( _self.videoType == 'vimeo'){
        var iframe = $container.find('iframe');
        var player = new Vimeo.Player(iframe, {
          autoplay: true
        });
        var $button = $container.find('.video-play');
        var $image = $container.find('.video-image');
        var enableSound = iframe.attr( 'data-enable-sound' );

        player.ready().then(function() {
          if ( enableSound ) {
            player.setVolume(0);
          }

          $button.on('click', function () {
            player.play();
            $image.fadeOut();
            $(this).hide();
          })
        });

      } else {
        var $video = $container.find('video');
        var $button = $container.find('.video-play');
        var $image = $container.find('.video-image');

        $button.on('click', function() {
          $video.attr('controls', true);
          $image.fadeOut();
          $video.trigger('play');
          $(this).hide();
        });
      }
    },

    loadYoutubePlayer: function() {
      var currentYoutubeOptions = $.extend({}, defaultYoutubeOptions);
      currentYoutubeOptions.videoId = this.videoID;

      if (this.videoID.length){
        players[this.playerID] = new YT.Player( this.playerID , currentYoutubeOptions );
      }

      isYoutubeAPIReady = true;
    },

    onUnload: function(evt) {
      var playerID = 'youtube-' + this.$container.data('section-id');
      players[playerID].destroy();
    }
  });

  return EmbedNativeVideo;
})();
