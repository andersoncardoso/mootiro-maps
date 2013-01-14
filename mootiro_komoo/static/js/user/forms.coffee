define (require) ->
  'use strict'

  reForm = require 'reForm'
  mainForms = require 'main/forms'
  MultiWidget = mainForms.MultiWidget
  SelectWidget = mainForms.SelectWidget


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
        widget: SelectWidget
        args: {
          options: [
            { label: '', value: '' }
            { label: 'Address', value: 'address' }
            { label: 'Phone', value: 'phone' }
            { label: 'Email', value: 'email' }
            { label: 'Website', value: 'website' }
            { label: 'Skype', value: 'skype' }
            { label: 'Facebook', value: 'facebook' }
            { label: 'Google Plus', value: 'gplus' }
            { label: 'Twitter', value: 'twitter' }
          ]
        }
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
