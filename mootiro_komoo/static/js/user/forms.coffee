define (require) ->
  'use strict'

  reForm = require 'reForm'

  # Form for inline edition
  class UserInfoForm extends reForm.Form
    fields: [
      {
        name: 'name',
        container_class: 'name'
        widget: reForm.commonWidgets.TextWidget,
        label: i18n 'Name'
      }
      {
        name: 'about_me',
        container_class: 'about-me'
        widget: reForm.commonWidgets.TextAreaWidget,
        label: i18n 'About me'
      }
    ]

  return {
    UserInfoForm: UserInfoForm
  }
