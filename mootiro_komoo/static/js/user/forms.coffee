define (require) ->
  'use strict'

  reForm = require 'reForm'
  mainForms = require 'main/forms'
  MultiWidget = mainForms.MultiWidget


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
        widget: reForm.commonWidgets.DropdownWidget
        args: {
          choices: [
            { title: '', value: '' }
            { title: i18n('Address'), value: 'address' }
            { title: i18n('Phone'), value: 'phone' }
            { title: i18n('Email'), value: 'email' }
            { title: i18n('Website'), value: 'website' }
            { title: i18n('Skype'), value: 'skype' }
            { title: i18n('Facebook'), value: 'facebook' }
            { title: i18n('Google Plus'), value: 'gplus' }
            { title: i18n('Twitter'), value: 'twitter' }
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

    wasChanged: ->
      not _.isEqual @get(), _.pick(@model.toJSON(), _.pluck(@fields, 'name'))


  return {
    UserInfoForm: UserInfoForm
  }
