
$ () ->
  model = new KomooNS.models.Resource()
  form = new KomooNS.forms.FormCommonObject
    formId: 'form_resource'
    model: model


  if KomooNS.data?.resource?
    form.model.set KomooNS.data.resource

  $('#reForm-wrapper').html form.render().el

  if KomooNS.data?.resource?
    form.instances.tags.set KomooNS.data.resource.tags

