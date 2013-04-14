
$ () ->
  model = new KomooNS.models.Organization()
  form = new KomooNS.forms.FormCommonObject
    formId: 'form_organization'
    model: model


  if KomooNS.data?.organization?
    form.model.set KomooNS.data.organization

  $('#reForm-wrapper').html form.render().el

  if KomooNS.data?.organization?
    form.instances.tags.set KomooNS.data.organization.tags

