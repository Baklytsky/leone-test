window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js
// =require templates/global.js

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js

/*================ Sections ================*/
// =require sections/cart.js
// =require sections/product.js
// =require sections/slideshow.js
// =require sections/ember-native-video.js
// =require sections/account.js

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('cart', theme.Cart);
  sections.register('product', theme.Product);
  sections.register('slideshow', theme.Slideshow);
  sections.register('ember-native-video', theme.EmbedNativeVideo);
  sections.register('customer-info', theme.AccountInfo);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});

$(document).on('blur', 'input, textarea', function  () {
  var isApple = ['iPhone', 'iPad', 'iPod', 'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',].includes(navigator.platform);

  if ($('html').hasClass('global_sidebar--open') && isApple) {
    setTimeout(function () {
      $('html,body').animate({
        scrollTop: 0
      }, 0);
    }, 0);
  }
})

if ($('.preloader').length) {
  $(window).on('load', function() {
    $('.preloader').fadeOut('slow');
  });
}