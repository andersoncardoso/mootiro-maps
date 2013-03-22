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
        label: i18n('Contact'),
        container_class: 'contact',
        widget: window.KomooNS.widgets.ContactWidget
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
      return console.dir(data);
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
