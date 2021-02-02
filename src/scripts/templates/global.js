theme.ariaToggle = function() {
  $(document).on('click', '.ariaToggle', function(event){
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    $currentTarget.attr('aria-expanded', $currentTarget.attr('aria-expanded')=='false' ? 'true' : 'false');
    var toggleID = $currentTarget.attr('aria-controls');
    $( '#'+ toggleID ).toggleClass('expanded');
  });
};

theme.ariaToggleSlide = function() {
  $(document).on('click', '.ariaToggleSlide', function(event){
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    $currentTarget.attr('aria-expanded', $currentTarget.attr('aria-expanded')=='false' ? 'true' : 'false');
    var toggleID = $currentTarget.attr('aria-controls');
    $( '#'+ toggleID ).slideToggle();
  });
};

theme.ariaToggleSlideChangeButton = function() {
  $(document).on('click', '.ariaToggleSlideChangeButton', function(event){
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    $currentTarget.attr('aria-expanded', $currentTarget.attr('aria-expanded')=='false' ? 'true' : 'false');
    $currentTarget.find('span:first-child').text($currentTarget.find('span:first-child').text()=='read less' ? 'read more' : 'read less');
    var toggleID = $currentTarget.attr('aria-controls');
    $( '#'+ toggleID ).slideToggle();
  });
};

theme.ariaToggleOneSlide = function() {
  $(document).on('click', '.ariaToggleOneSlide', function(event){
    event.preventDefault();
    $(this).closest('div').siblings().find('button.ariaToggleOneSlide').attr('aria-expanded', 'false').next(':not(.global-sidebar)').slideUp();
    $(this).attr('aria-expanded', $(this).attr('aria-expanded')=='false' ? 'true' : 'false').next(':not(.global-sidebar)').slideToggle();
  });
};

theme.smoothScroll = function() {
  $('a[href*="#"]:not([href="#"])').click(function(event) {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {
      var height = parseInt($(this).attr('data-additional-height')) ? parseInt($(this).attr('data-additional-height')) : 0;
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        event.preventDefault();
        $('html,body').animate({
          scrollTop: target.offset().top - height
        }, 1000);
      }
    }
  });
};

theme.outlineNone = function() {
  var body = $('body');

  $(document).on('click', function () {
    if (!body.hasClass('outline-none')) {
      body.addClass('outline-none');
    }
  });

  $(document).on('keydown', function (e) {
    var keyCode = e.keyCode || e.which;

    if (body.hasClass('outline-none') && keyCode == 9) {
      body.removeClass('outline-none');
    }
  });
};

theme.GlobalCssVariables = function() {
  function setValues() {
    var headerHeight = $('.header').outerHeight();

    document.documentElement.style
      .setProperty('--header-height', headerHeight + 'px');
  }

  setValues();

  $( window ).on('orientationchange', function () {
    setValues();
  });
  $(window).on('resize', function () {
    setValues();
  });
};

theme.GlobalSidebar = function() {
  var $buttonModal = '.global-sidebar-button[aria-controls]';

  $(document).on('click', '.close', function () {
    var id = $(this).parents('.global-sidebar').attr('id');

    closeSidebar(id);
  });

  $(document).on('click', $buttonModal, function (e) {
    e.preventDefault();
    var thisId = $(this).attr('aria-controls');

    openSidebar(thisId);
  });

  $(document).mouseup(function (e){
    var div = $('.global-sidebar[aria-hidden="false"]');
    var divChild = div.find('.insert[aria-hidden="false"]');

    if (!div.is(e.target)
      && div.has(e.target).length === 0
      && !divChild.is(e.target)
      && divChild.has(e.target).length === 0) {
      closeSidebar();
    }
  });

  $( window ).on('orientationchange', function () {
    closeSidebar();
  });

  $(document).keyup(function(e) {
    if (e.keyCode === 27) {
      closeSidebar();
    }
  });


  $(window).on('resize', function () {
    $('.global-sidebar[aria-hidden="false"]').css('height', window.innerHeight);
  });

  function openSidebar(id) {
    var thisHeight;
    var thisModal = $('#' + id);
    var thisModalHeight = thisModal.outerHeight();
    var topBarHeight = $( '.announcement-bar' ).outerHeight();
    var headerHeight = thisModal.children('.global-sidebar__header').outerHeight();
    var $popoverContainer = $('.global-sidebar__wrapper');
    var scrolled = $( window ).scrollTop();
    var topBarHeightNoSticky = topBarHeight - scrolled;

    bodyScrollLock.clearAllBodyScrollLocks();
    bodyScrollLock.disableBodyScroll(thisModal.find('.global-sidebar__wrapper')[0]);

    if (topBarHeightNoSticky < 0) {
      topBarHeightNoSticky = 0;
    }

    if (!thisModal) {
      return;
    }

    $( window ).on('orientationchange', function () {
      thisModalHeight = thisModal.outerHeight();
      topBarHeight = $( '.announcement-bar' ).outerHeight();
      headerHeight = thisModal.children('.global-sidebar__header').outerHeight();

      if (topBarHeight) {
        thisHeight = thisModalHeight -  headerHeight - topBarHeight;
      } else thisHeight = thisModalHeight -  headerHeight;

      $popoverContainer.css('height', thisHeight );
    });

    $(window).on('resize', function () {
      thisModalHeight = thisModal.outerHeight();
      topBarHeight = $( '.announcement-bar' ).outerHeight();
      headerHeight = thisModal.children('.global-sidebar__header').outerHeight();

      if (topBarHeight) {
        thisHeight = thisModalHeight -  headerHeight - topBarHeight;
      } else thisHeight = thisModalHeight -  headerHeight;

      $popoverContainer.css('height', thisHeight );
    });

    if (topBarHeight) {
      if (thisModal.parents('.global-sidebar').length) {
        thisModal.css('top', 0);
      } else {
        thisModal.css('top', topBarHeightNoSticky);
      }
      thisHeight = thisModalHeight -  headerHeight - topBarHeight;
    } else thisHeight = thisModalHeight -  headerHeight;

    thisModal.attr('aria-hidden', 'false');
    $popoverContainer.css('height', thisHeight );
    thisModal.css('height', window.innerHeight);
    $('body').addClass('global_sidebar--open');
    $('html').addClass('global_sidebar--open');
    $('.header').addClass('global_sidebar--open');
  }

  function closeSidebar(id) {
    var thisModal;
    if (id) {
      thisModal = $('.global-sidebar[id="' + id + '"]');
    } else {
      thisModal = $('.global-sidebar[aria-hidden="false"]');
    }

    thisModal.attr('aria-hidden', 'true');
    thisModal.css('height', '');
    if (!thisModal.parents('.global-sidebar').length) {
      $('body').removeClass('global_sidebar--open');
      $('html').removeClass('global_sidebar--open');
      $('.header').removeClass('global_sidebar--open');
    } else if (id == undefined && thisModal.parents('.global-sidebar').length) {
      $('body').removeClass('global_sidebar--open');
      $('html').removeClass('global_sidebar--open');
      $('.header').removeClass('global_sidebar--open');
    }

    if ($('.global-sidebar[aria-hidden="false"]').length) {
      bodyScrollLock.clearAllBodyScrollLocks();
      bodyScrollLock.disableBodyScroll($('.global-sidebar[aria-hidden="false"]').find('.global-sidebar__wrapper')[0]);
    } else {
      bodyScrollLock.clearAllBodyScrollLocks();
    }
  }
};

theme.videoPopup = function () {
  var $videoPopup = $('.video-popup');
  var $videoPopupInner = $('.video-popup__inner');
  var $videoPopupWrapper = $videoPopup.find('.video-popup__video');
  var $$videoPopupClose = $videoPopup.find('.icon-close');
  var videoPopupActiveClass = 'open';

  $(document).mouseup(function(e) {
    if (!$videoPopupInner.is(e.target) && $videoPopupInner.has(e.target).length === 0) {
     closeModal();
    }
  });

  $$videoPopupClose.on('click', function () {
    closeModal();
  });

  $('a[href*="youtube"], a[href*="youtu"], a[href*="vimeo"], a[href*="mp4"]').on('click', function (evt) {
    evt.preventDefault();
    var url = evt.currentTarget.href;
    var src;
    var videoId;
    var allow;
    var autoplay = '?autoplay=1';

    if (url.indexOf('youtube') !== -1 || url.indexOf('youtu') !== -1) {
      if (url.indexOf('v=') !== -1) {
        videoId = url.split('v=');
        src = 'https://www.youtube.com/embed/' + videoId[1] + autoplay;
        allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; autoplay;';
      } else {
        videoId = url.split('youtu.be/');
        src = 'https://www.youtube.com/embed/' + videoId[1] + autoplay;
        allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; autoplay;';
      }

      appendIframe(src, allow);

    } else if (url.indexOf('vimeo') !== -1) {

      videoId = url.split('vimeo.com')
      src = 'https://player.vimeo.com/video' + videoId[1] + autoplay;
      allow = 'fullscreen; autoplay;';

      appendIframe(src, allow);
    } else if (url.indexOf('mp4') !== -1) {
      appendVideo(url, 'video/mp4');
    }
  });

  function openModal() {
    $videoPopup.fadeIn().addClass(videoPopupActiveClass);
  }

  function appendIframe(src, allow) {
    var iframe = '<iframe width="100%" height="auto" src="'+ src +'" frameborder="0" allow="'+ allow +'" allowfullscreen></iframe>'

    $videoPopupWrapper.html(iframe);

    openModal();
  }

  function appendVideo(src, type) {
    var video = '<video playsinline autoplay controls>' +
      '<source src="'+ src +'" type="'+ type +'">' +
      'Your browser does not support the video tag.' +
      '</video>'

    $videoPopupWrapper.html(video);

    openModal();
  }

  function closeModal() {
    $videoPopup.fadeOut().removeClass(videoPopupActiveClass);
    $videoPopupWrapper.html('');
  }
};

theme.init = function () {
  theme.videoPopup();
  theme.ariaToggle();
  theme.ariaToggleSlide();
  theme.ariaToggleSlideChangeButton();
  theme.ariaToggleOneSlide();
  theme.smoothScroll();
  theme.outlineNone();
  theme.GlobalCssVariables();
  theme.GlobalSidebar();
};

$(theme.init);