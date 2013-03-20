
FormResource = ReForm.Form.extend
  template: KomooNS.templates.formTemplate
  fields: [
    {name: 'name', widget: ReForm.commonWidgets.TextWidget, label: 'Name:'}
    {name: 'description', widget: ReForm.commonWidgets.TextAreaWidget, label: 'Description:'}
    # {name: 'tags', widget: NamespacedTagsWidget, label: 'Tags'}
  ]
  events:
    'success': 'onSuccess'

  onSuccess: (data) ->
    console.dir data


$ () ->
  form = new FormResource
    formId: 'form_resource'
    model: new KomooNS.models.Resource()

  $('#reForm-wrapper').html form.render().el

