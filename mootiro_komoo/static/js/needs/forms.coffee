
$ () ->
  model = new KomooNS.models.Need()
  form = new KomooNS.forms.FormCommonObject
    formId: 'form_need'
    model: model


  if KomooNS.data?.need?
    form.model.set KomooNS.data.need

  $('#reForm-wrapper').html form.render().el

  if KomooNS.data?.need?
    form.instances.tags.set KomooNS.data.need.tags

