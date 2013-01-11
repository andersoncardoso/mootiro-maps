define (require) ->
  'use strict'

  reForm = require 'reForm'
  MultiWidget = require('main/forms').MultiWidget


  class ContactWidget extends MultiWidget
    fieldTemplate: """
<div class="subfield-container <%=container_class%>">
  <div class="widget-container"></div>
</div>
"""
    fields: [
      {
        name: 'type'
        container_class: 'type'
        widget: reForm.commonWidgets.TextWidget
      }
      {
        name: 'value'
        container_class: 'value'
        widget: reForm.commonWidgets.TextWidget
      }
    ]



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

  return {
    UserInfoForm: UserInfoForm
  }
