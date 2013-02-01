define (require) ->
  'use strict'

  reForm = require 'reForm'
  ContactWidget = require('widgets/reForm/contact').ContactWidget


  # Form for inline edition
  class UserInfoForm extends reForm.Form
    template: require 'text!templates/forms/_inline_form.html'
    fields: [
      {
        name: 'name',
        container_class: 'name'
        widget: reForm.commonWidgets.TextWidget,
        label: i18n 'Name'
      }
      {
        name: 'contact',
        container_class: 'contact'
        widget: ContactWidget,
        label: i18n 'Contact'
      }
      {
        name: 'about_me',
        container_class: 'about-me'
        widget: reForm.commonWidgets.TextAreaWidget,
        label: i18n 'About me'
      }
    ]

    events:
      'click .cancel': 'onCancelClick'

    onCancelClick: (e) ->
      e?.preventDefault()
      @set @model.toJSON()
      @trigger 'cancel'

    wasChanged: ->
      not _.isEqual @get(), _.pick(@model.toJSON(), _.pluck(@fields, 'name'))


  return {
    UserInfoForm: UserInfoForm
  }
