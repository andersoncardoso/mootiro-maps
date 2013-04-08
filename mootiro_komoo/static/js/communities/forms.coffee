$ () ->
  model = new KomooNS.models.Community()
  form = new KomooNS.forms.FormCommonObject
    formId: 'form_community'
    model: model


  if KomooNS.data?.community?
    form.model.set KomooNS.data.community

  $('#reForm-wrapper').html form.render().el

  if KomooNS.data?.community?
    form.instances.tags.set KomooNS.data.community.tags

