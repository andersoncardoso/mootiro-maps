(function() {

  $(function() {
    var form, model, _ref, _ref2;
    model = new KomooNS.models.Resource();
    form = new KomooNS.forms.FormCommonObject({
      formId: 'form_resource',
      model: model
    });
    if (((_ref = KomooNS.data) != null ? _ref.resource : void 0) != null) {
      form.model.set(KomooNS.data.resource);
    }
    $('#reForm-wrapper').html(form.render().el);
    if (((_ref2 = KomooNS.data) != null ? _ref2.resource : void 0) != null) {
      return form.instances.tags.set(KomooNS.data.resource.tags);
    }
  });

}).call(this);
