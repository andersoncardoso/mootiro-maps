(function() {
  var FormResource;

  FormResource = ReForm.Form.extend({
    template: window.KomooNS.templates.formTemplate,
    fields: [
      {
        name: 'name',
        widget: ReForm.commonWidgets.TextWidget,
        label: 'Name:'
      }, {
        name: 'description',
        widget: window.KomooNS.widgets.MarkItUpWidget,
        label: 'Description:'
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
