/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Cart = (function() {

  function Cart(container) {
    this.$container = $(container);
    var removeSelector = '.cart-drawer-item__no-bundle [data-action="remove-item"]';
    var quantitySelector = '.cart-drawer-item__no-bundle [data-action="change-quantity"]';
    var openCartDrawerSelector = '[data-open-cart-drawer]';

    $(window).on('load', function() {
      setTimeout(function(){
        window.loaded = true;
      }, 0);
    });

    $(document).on('click', removeSelector, this.updateQuantity.bind(this));
    $(document).on('change', quantitySelector, this.updateQuantity.bind(this));
    $(document).on('click', openCartDrawerSelector, this.renderCart.bind(this));

    this.changeQuantity();
  }

  Cart.prototype = $.extend({}, Cart.prototype, {
    renderCart: function (event) {
      if (event) {
        event.preventDefault();
      }

      if (this.$container.attr('data-template') == 'cart') {
        location.reload();
        return false;
      }

      var _self = this;
      var url = '/cart?view=drawer';

      $('.cart-loader').show();
      _self.openSidebar();

      return $.ajax({
        type: 'GET',
        url: url
      }).done(function (content) {
        $('#cart-sidebar-content').html(content);
        _self.cartLoaderHide();
      }).fail(function (e) {
        console.error(e);
      });
    },

    cartLoaderHide: function () {
      $('.cart-loader').fadeOut('slow');
    },

    openSidebar: function () {
      var id = 'cart-sidebar';
      var thisHeight;
      var thisModal = $('#' + id);
      var thisModalHeight = thisModal.outerHeight();
      var topBarHeight = $( '.announcement-bar' ).outerHeight();
      var headerHeight = thisModal.children('.global-sidebar__header').outerHeight();
      var $popoverContainer = $('.global-sidebar__wrapper');
      var scrolled = $( window ).scrollTop();
      var topBarHeightNoSticky = topBarHeight - scrolled;

      if (topBarHeightNoSticky < 0) {
        topBarHeightNoSticky = 0;
      }

      if (!thisModal) {
        return;
      }

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
    },

    updateQuantity: function (event) {
      event.preventDefault();
      $('.cart-loader').show();
      var _self = this;
      var $element = $(event.target);
      var itemId = $element.attr('data-line-id');
      var quantity = null;


      if ($element.prop("tagName").toLowerCase() == 'input') {
        quantity = $element.val();
      } else {
        quantity = parseInt($element.attr('data-quantity'));
      }

      var data = {
        id: itemId,
        quantity: quantity
      }

      $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        dataType: 'json',
        data: data
      }).done(function (cart) {
        if (cart.item_count == 0) {
          _self.cartDrawerItemsEmpty();
          $('[data-open-cart-drawer]').hide();
        } else {
          $('[data-open-cart-drawer]').show();
          _self.renderCart();
        }
      }).fail(function (e) {
        console.error(e);
      });
    },

    cartDrawerItemsEmpty: function () {
      if (this.$container.attr('data-template') == 'cart') {
        location.reload();
        return false;
      }

      $('#cart-sidebar').find('button.close').trigger('click');
    },

    changeQuantity: function() {
      $(document).on('click', '.cart-drawer-item__quantity-btn', function () {
        $(this).parent().toggleClass('active');
        $(this).next().slideToggle();
      });

      $(document).mouseup(function (e){
        var div = $('.cart-drawer-item__quantity .cart-drawer-item__quantity-list');
        var parentDiv = $('.cart-drawer-item__quantity .cart-drawer-item__quantity-btn');
        if (!div.is(e.target)
          && div.has(e.target).length === 0
          && !parentDiv.is(e.target)
          && parentDiv.has(e.target).length === 0) {

          $('.cart-drawer-item__quantity .cart-drawer-item__quantity-inner').removeClass('active');
          $('.cart-drawer-item__quantity .cart-drawer-item__quantity-list').slideUp();
        }
      });

      $(document).on('click', '.cart-drawer-item__quantity-item', function () {
        var value = $(this).attr('data-value');
        var $parent = $(this).parents('.cart-drawer-item__quantity');
        var $input = $parent.find('.cart-drawer-item__quantity-input');

        $parent.find('.cart-drawer-item__quantity-inner').removeClass('active');
        $parent.find('.cart-drawer-item__quantity-list').slideUp();
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');

        $input.val(value).trigger('change');
      });
    },
  });

  return Cart;
})();
