
CommonObject = Backbone.Model.extend
  urlRoot: '/api/objects/'

FormCommonObject = ReForm.Form.extend
  template: window.KomooNS.templates.formTemplate
  fields: [
    {
      name: 'type'
      widget: ReForm.commonWidgets.DropdownWidget
      label: i18n 'Object Type'
      args:
        choices: [
          {value: 'community', title: i18n 'Community'}
          {value: 'organization', title: i18n 'Organization'}
          {value: 'need', title: i18n 'Need'}
          {value: 'resource', title: i18n 'Resource'}
          {value: 'proposal', title: i18n 'Proposal'}
          {value: 'investment', title: i18n 'Investment'}
        ]
    }
    {
      name: 'name'
      widget: ReForm.commonWidgets.TextWidget
      label: i18n 'Name'
    }
    {
      name: 'description'
      widget: window.KomooNS.widgets.MarkItUpWidget
      label: 'Description'
    }
    {
      name: 'contact'
      widget: window.KomooNS.widgets.ContactWidget
      container_class: 'contact'
      label: i18n 'Contact'
    }
    {
      name: 'tags'
      label: i18n 'Classifiers'
      container_class: 'tags'
      widget: window.KomooNS.widgets.NamespacedTagsWidget
    }
    {
      name: 'geometry'
      widget: ReForm.commonWidgets.HiddenWidget
      label: ''
    }
  ]

window.KomooNS ?= {}
window.KomooNS.forms ?= {}
window.KomooNS.forms.FormCommonObject = FormCommonObject

$ () ->
  model = new CommonObject()
  model.set({type: KomooNS.data.type}) if KomooNS.data?.type?

  form = new FormCommonObject
    formId: 'form_object'
    model: model


  form.model.set(KomooNS.data.object) if KomooNS.data?.object?

  $('#reForm-wrapper').html form.render().el
  form.instances.tags.set(KomooNS.data.object.tags) if KomooNS.data?.object?
