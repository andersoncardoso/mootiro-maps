(function() {

  $(function() {
    var form, model, _ref, _ref2;
    model = new KomooNS.models.Organization();
    form = new KomooNS.forms.FormCommonObject({
      formId: 'form_organization',
      model: model
    });
    if (((_ref = KomooNS.data) != null ? _ref.organization : void 0) != null) {
      form.model.set(KomooNS.data.organization);
    }
    $('#reForm-wrapper').html(form.render().el);
    if (((_ref2 = KomooNS.data) != null ? _ref2.organization : void 0) != null) {
      return form.instances.tags.set(KomooNS.data.organization.tags);
    }
  });

}).call(this);
