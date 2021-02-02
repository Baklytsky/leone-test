/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productImage: '[data-product-image]',
    productImageId: '[data-product-image-id]',
    productSlideshow: '[data-product-slideshow]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    singleOptionSelector: '[data-single-option-selector]'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.changeOption();
    this.changeOptionColor();
    this.changeQuantity();
    this.recent();

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    if (this.$featuredImage.length > 0) {
      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }
    this.clickAddToCart();
  }

  Product.prototype = $.extend({}, Product.prototype, theme.Cart.prototype, {
    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).show();
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true).addClass('btn--alert');
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).hide();
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false).removeClass('btn--alert');
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
        $(selectors.priceWrapper, this.$container).show();
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true).addClass('btn--alert');
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
        $(selectors.priceWrapper, this.$container).hide();
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.show();
      } else {
        $comparePrice.html('');
        $compareEls.hide();
      }
    },

    changeOptionColor: function() {
      $(document).on('click', '.product-options-swatch__input' + selectors.singleOptionSelector, function () {
        var value = $(this).val();
        $(this).parents('.product-options-swatch').find('.product-options-swatch__info-text').text(value);
      });
    },

    changeOption: function() {
      $(document).on('click', '.product-options__button', function () {
        $(this).parent().toggleClass('active');
        $(this).next().slideToggle();
      });

      $(document).mouseup(function (e){
        var div = $('.product-options .product-options__list');
        var parentDiv = $('.product-options .product-options__button');
        if (!div.is(e.target)
          && div.has(e.target).length === 0
          && !parentDiv.is(e.target)
          && parentDiv.has(e.target).length === 0) {

          $('.product-options .product-options__inner').removeClass('active');
          $('.product-options .product-options__list').slideUp();
        }
      });

      $(document).on('click', '.product-options__item', function () {
        var value = $(this).attr('data-value');
        var $parent = $(this).parents('.product-options');
        var $input = $parent.find(selectors.singleOptionSelector);

        $parent.find('.product-options__inner').removeClass('active');
        $parent.find('.product-options__list').slideUp();
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');

        $input.val(value).trigger('change');
      });
    },

    changeQuantity: function() {
      var _self = this;

      $(document).on('click', '.product-quantity__button', function () {
        $(this).parent().toggleClass('active');
        $(this).next().slideToggle();
      });

      $(document).mouseup(function (e){
        var div = $('.product-quantity .product-quantity__list');
        var parentDiv = $('.product-quantity .product-quantity__button');
        if (!div.is(e.target)
          && div.has(e.target).length === 0
          && !parentDiv.is(e.target)
          && parentDiv.has(e.target).length === 0) {

          $('.product-quantity .product-quantity__inner').removeClass('active');
          $('.product-quantity .product-quantity__list').slideUp();
        }
      });

      $(document).on('click', '.product-quantity__item', function () {
        var value = $(this).attr('data-value');
        var $parent = $(this).parents('.product-quantity');
        var $input = $parent.find('.product-quantity__input');

        $parent.find('.product-quantity__inner').removeClass('active');
        $parent.find('.product-quantity__list').slideUp();
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');

        $input.val(value);
      });
    },
    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;

      if (!variant) {
        return;
      }

      if (variant.featured_image){
        var imageId = variant.featured_image.id;
        var slideIndex = $('[data-product-image-id="'+imageId+'"]', this.$container).parents('.slick-slide').attr('data-slick-index');

        $(selectors.productSlideshow, this.$container).slick('slickGoTo', slideIndex);
      }
    },

    recent: function() {
      Shopify.Products.showRecentlyViewed( {
        howManyToShow: 3,
        onComplete: function() {
          var recentProductsCount = $('#recently-viewed-products .product-item').length;
          if ( recentProductsCount ) {
            $('#RecentlyViewed').fadeIn(100);
          }
          $('.recent__content').slick({
            arrows: false,
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: 990,
                settings: {
                  slidesToShow: 2.2,
                }
              },
              {
                breakpoint: 768,
                settings: {
                  arrows: false,
                  variableWidth: false,
                  slidesToShow: 1.27,
                  centerPadding: "30px"
                }
              }
            ]
          })
        }
      } );

      if($('#RecentlyViewed').length) {
        Shopify.Products.recordRecentlyViewed();
      }
    },

    clickAddToCart: function () {
      var _self = this;

      $(document).on('click', '[data-add-to-cart]', function (evt){
        evt.preventDefault();
        var form = $(this).closest('form');
        var form_array = form.serializeArray();

        if (form.find('[type="file"]').length){
          return;
        }

        $(this).prop('disabled', true);

        var form_data = {};

        $.map(form_array, function(val) {
          form_data[val.name] = val.value;
        });

        _self.ajaxAddToCart(form_data);
      })
    },

    ajaxAddToCart: function (data) {
      var _self = this;
      var $container = $(this.container);
      var errorContainer = $container.find('.product-form-error');

      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        data: data
      }).done(function () {
        $('[data-open-cart-drawer]').show();
        _self.renderCart();
        $('[data-add-to-cart]').prop('disabled', false);
        if (errorContainer.length) {
          errorContainer.slideUp();
        }
      }).fail(function (error) {
        if (error.status === 422 && errorContainer.length) {
          errorContainer.text(error.responseJSON.description);
          errorContainer.slideDown();
        }
        console.log(error);
        $('[data-add-to-cart]').prop('disabled', false);
      })
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();
