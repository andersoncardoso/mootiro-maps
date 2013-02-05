define (require) ->
  'use strict'

  form = require 'core/form'


  # Form for inline edition
  class UserInfoForm extends form.BaseForm
    fields: [
      {
        name: 'name',
        label: i18n 'Name'
        container_class: 'name'
        widget: form.commonWidgets.TextWidget,
      }
      {
        name: 'contact',
        label: i18n 'Contact'
        container_class: 'contact'
        widget: form.widgets.ContactWidget,
      }
      {
        name: 'about_me',
        label: i18n 'About me'
        container_class: 'about-me'
        widget: form.commonWidgets.TextAreaWidget,
      }
    ]


  return {
    UserInfoForm: UserInfoForm
  }
