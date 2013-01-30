define (require) ->
  'use strict'

  app = require 'app'
  reForm = require 'reForm'

  #
  # Organization Form
  class OrganizationForm extends reForm.Form
    fields: [
      {
        name: 'name'
        widget: reForm.commonWidgets.TextWidget
        label: i18n 'Name'
      }
    ]

    initialize: ->
      super
      @bind 'success', @onSuccess

    onSuccess: (data) ->
      console.log "OrganizationForm::onSuccess"
      console.log data
      app.trigger 'change', @model
      @model.show()

  return {
    OrganizationForm: OrganizationForm
  }
