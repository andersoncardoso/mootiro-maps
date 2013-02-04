define (require) ->
  'use strict'

  reForm = require 'reForm'

  commonWidgets = reForm.commonWidgets
  widgets = require './form_widgets'


  class BaseForm extends reForm.Form
    #
    # Base form with cancel button and a default method to verify
    # if the content was changed.
    #
    template: require 'text!templates/forms/_inline_form.html'
    events:
      'click .cancel': 'onCancelClick'

    initialize: ->
      super
      @render()

    onCancelClick: (e) ->
      e?.preventDefault()
      @set @model.toJSON()
      @trigger 'cancel'

    wasChanged: ->
      not _.isEqual @get(), _.pick(@model.toJSON(), _.pluck(@fields, 'name'))



  return {
    commonWidgets: commonWidgets
    widgets: widgets
    BaseForm: BaseForm
  }
