(function() {

  $(function() {
    var form, model, _ref, _ref2;
    model = new KomooNS.models.Need();
    form = new KomooNS.forms.FormCommonObject({
      formId: 'form_need',
      model: model
    });
    if (((_ref = KomooNS.data) != null ? _ref.need : void 0) != null) {
      form.model.set(KomooNS.data.need);
    }
    $('#reForm-wrapper').html(form.render().el);
    if (((_ref2 = KomooNS.data) != null ? _ref2.need : void 0) != null) {
      return form.instances.tags.set(KomooNS.data.need.tags);
    }
  });

}).call(this);
