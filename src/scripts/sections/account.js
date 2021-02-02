theme.AccountInfo = (function () {

  function AccountInfo(container) {
    var $container = this.$container = $(container);
    var id = this.id = $container.attr('data-section-id');
    var formInput = $container.find('input');
    var btnSubmit = $container.find('button.btn');

    Accentuate(jQuery('#update-customer-info'), function(data) {
      if (data.status == 'ERROR') {
        $('#update-customer-info #email').addClass('error');
      } else if (data.status == 'OK') {
        location.reload();
      }
    });

    $(document.body).off('change', formInput);

    $(document.body).on('change keyup', formInput, function(event) {
      btnSubmit.attr('disabled', false);
    });
  }
  return AccountInfo;
})();
