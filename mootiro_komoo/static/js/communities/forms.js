(function() {

  $(function() {
    var form, model, _ref, _ref2;
    model = new KomooNS.models.Community();
    form = new KomooNS.forms.FormCommonObject({
      formId: 'form_community',
      model: model
    });
    if (((_ref = KomooNS.data) != null ? _ref.community : void 0) != null) {
      form.model.set(KomooNS.data.community);
    }
    $('#reForm-wrapper').html(form.render().el);
    if (((_ref2 = KomooNS.data) != null ? _ref2.community : void 0) != null) {
      return form.instances.tags.set(KomooNS.data.community.tags);
    }
  });

}).call(this);
