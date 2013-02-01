define (require) ->
  'use strict'

  reForm = require 'reForm'
  MultiWidget = require('./multi').MultiWidget


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


  return {
    ContactWidget: ContactWidget
  }
