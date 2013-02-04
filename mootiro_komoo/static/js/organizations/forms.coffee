define (require) ->
  'use strict'

  form = require 'core/form'


  # Organization Form
  class OrganizationForm extends form.BaseForm
    fields: [
      {
        name: 'name'
        label: i18n 'Name'
        widget: form.commonWidgets.TextWidget
      }
      {
        name: 'description'
        label: i18n 'Description'
        widget: form.commonWidgets.TextWidget
      }
      {
        name: 'contact',
        label: i18n 'Contact'
        container_class: 'contact'
        widget: form.widgets.ContactWidget
      }
    ]


  return {
    OrganizationForm: OrganizationForm
  }
