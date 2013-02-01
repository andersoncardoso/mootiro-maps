define (require) ->
  'use strict'

  app = require 'app'
  reForm = require 'reForm'

  ContactWidget = require('widgets/reForm/contact').ContactWidget


  # Organization Form
  class OrganizationForm extends reForm.Form
    fields: [
      {
        name: 'name'
        widget: reForm.commonWidgets.TextWidget
        label: i18n 'Name'
      }
      {
        name: 'description'
        widget: reForm.commonWidgets.TextWidget
        label: i18n 'Description'
      }
      {
        name: 'contact',
        container_class: 'contact'
        widget: ContactWidget,
        label: i18n 'Contact'
      }
    ]


  return {
    OrganizationForm: OrganizationForm
  }
