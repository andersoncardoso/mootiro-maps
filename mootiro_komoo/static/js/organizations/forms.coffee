define (require) ->
  'use strict'

  app = require 'app'
  reForm = require 'reForm'


  # Organization Form
  class OrganizationForm extends reForm.Form
    fields: [
      {
        name: 'name'
        widget: reForm.commonWidgets.TextWidget
        label: i18n 'Name'
      }
    ]


  return {
    OrganizationForm: OrganizationForm
  }
