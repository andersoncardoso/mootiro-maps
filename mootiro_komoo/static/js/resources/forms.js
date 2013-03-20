(function() {
  var FormResource;

  FormResource = ReForm.Form.extend({
    template: KomooNS.templates.formTemplate,
    fields: [
      {
        name: 'name',
        widget: ReForm.commonWidgets.TextWidget,
        label: 'Name:'
      }, {
        name: 'description',
        widget: ReForm.commonWidgets.TextAreaWidget,
        label: 'Description:'
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
      model: new KomooNS.models.Resource()
    });
    return $('#reForm-wrapper').html(form.render().el);
  });

}).call(this);
