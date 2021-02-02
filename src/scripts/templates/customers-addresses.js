/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  // $('.address-new-toggle').on('click', function() {
  //   $newAddressForm.toggleClass('hide');
  // });
  //
  // $('.address-edit-toggle').on('click', function() {
  //   var formId = $(this).data('form-id');
  //   $('#EditAddress_' + formId).toggleClass('hide');
  // });
  //
  // $('.address-delete').on('click', function() {
  //   var $el = $(this);
  //   var formId = $el.data('form-id');
  //   var confirmMessage = $el.data('confirm-message');
  //   if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
  //     Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
  //   }
  // });


  $(document).on('click', '.address-delete', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      // Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});

      $.ajax({
        type: 'POST',
        method: 'delete',
        url: '/account/addresses/' + formId
      }).always(function () {
        location.reload();
      })
    }
  });

  $(document).on('submit', '#address_form_new', function (e) {
    e.preventDefault();
    var form = $(this).closest('form');
    var form_array = form.serialize();

    $.ajax({
      type: 'POST',
      url: '/account/addresses',
      data: form_array
    }).always(function () {
      location.reload();
    })
  })

  $(document).on('submit', '#AddressUpdateFormButton', function (e) {
    e.preventDefault();
    var $el = $(this);
    var formId = $el.data('form-id');
    var form = $(this).closest('form');
    var form_array = form.serialize();

    $.ajax({
      type: 'POST',
      url: '/account/addresses/' + formId,
      data: form_array
    }).always(function () {
      location.reload();
    })
  })
})();
