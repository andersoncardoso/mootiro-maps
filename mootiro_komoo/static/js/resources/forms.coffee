
FormResource = ReForm.Form.extend
  template: window.KomooNS.templates.formTemplate
  fields: [
    {name: 'name', widget: ReForm.commonWidgets.TextWidget, label: 'Name:'}
    {name: 'description', widget: window.KomooNS.widgets.MarkItUpWidget, label: 'Description:'}
    # {name: 'tags', widget: NamespacedTagsWidget, label: 'Tags'}
    {name: 'geometry', widget: ReForm.commonWidgets.HiddenWidget, label: ''}
  ]
  events:
    'success': 'onSuccess'

  onSuccess: (data) ->
    console.dir data


$ () ->
  form = new FormResource
    formId: 'form_resource'
    model: new window.KomooNS.models.Resource()

  $('#reForm-wrapper').html form.render().el

