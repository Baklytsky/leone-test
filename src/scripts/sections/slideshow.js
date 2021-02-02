theme.Slideshow = (function() {

  function Slideshow(container) {
    this.$container = $(container);
    var config = $.parseJSON($(container).attr('data-slick-config'));
    var arrowsOn = $(container).attr('data-slick-arrows')
    
    if (arrowsOn) {
        config["prevArrow"] = '<button type="button" class="slick-prev"><span class="sr-only">Previous</span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" viewBox="0 0 12 20"><g><g><path fill="#fff" d="M11.51 1.87L9.73.1-.16 10l9.9 9.9 1.77-1.77L3.38 10z"/></g></g></svg></button>';
        config["nextArrow"] = '<button type="button" class="slick-next"><span class="sr-only">Next</span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" viewBox="0 0 12 20"><g><g><path fill="#fff" d="M.49 18.13l1.77 1.77 9.9-9.9L2.26.1.49 1.87 8.62 10 .49 18.13z"/></g></g></svg></button>';
    }

    if (config) {
      $(container).slick(config);
    }
  }

  return Slideshow;
})();
