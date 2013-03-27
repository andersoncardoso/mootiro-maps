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
    ],
    events: {
      'success': 'onSuccess'
    },
    onSuccess: function(data) {
      return typeof console !== "undefined" && console !== null ? console.dir(data) : void 0;
    }
  });

  $(function() {
    var form;
    form = new FormResource({
      formId: 'form_resource',
      model: new window.KomooNS.models.Resource()
    });
    return $('#reForm-wrapper').html(form.render().el);
  });

}).call(this);
