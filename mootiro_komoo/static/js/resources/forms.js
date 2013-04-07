(function() {
  var FormResource;

  FormResource = ReForm.Form.extend({
    template: window.KomooNS.templates.formTemplate,
    fields: [
      {
        name: 'name',
        widget: ReForm.commonWidgets.TextWidget,
        label: i18n('Name')
      }, {
        name: 'description',
        widget: window.KomooNS.widgets.MarkItUpWidget,
        label: 'Description'
      }, {
        name: 'contact',
        widget: window.KomooNS.widgets.ContactWidget,
        container_class: 'contact',
        label: i18n('Contact')
      }, {
        name: 'tags',
        label: i18n('Classifiers'),
        container_class: 'tags',
        widget: window.KomooNS.widgets.NamespacedTagsWidget
      }, {
        name: 'geometry',
        widget: ReForm.commonWidgets.HiddenWidget,
        label: ''
      }
    ]
  });

  $(function() {
    var form, model, _ref, _ref2;
    model = new window.KomooNS.models.Resource();
    form = new FormResource({
      formId: 'form_resource',
      model: model
    });
    if (((_ref = KomooNS.data) != null ? _ref.resource : void 0) != null) {
      form.model.set(KomooNS.data.resource);
    }
    $('#reForm-wrapper').html(form.render().el);
    if (((_ref2 = KomooNS.data) != null ? _ref2.resource : void 0) != null) {
      form.instances.tags.set(KomooNS.data.resource.tags);
    }
    return window.form = form;
  });

}).call(this);
