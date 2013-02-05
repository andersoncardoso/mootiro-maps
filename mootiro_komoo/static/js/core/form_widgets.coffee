define (require) ->
  'use strict'

  _ = require 'underscore'
  reForm = require 'reForm'

  collectionTemplate = """
  <div class="collection-container <%=container_class%>">
    <a href="#" class="remove" title="<%=i18n('Remove')%>">[-]</a>
  </div>
"""
  fieldTemplate = """
<div class="field-container <%=container_class%>">
  <label><%=label%></label>
  <div class="widget-container"></div>
</div>
"""
  multiTemplate = """
<div class="fields-container"></div>
<a class="add-row"><%=i18n('+ Add another one')%></a>
"""


  class MultiWidget extends reForm.Widget
    fields: []

    collectionTemplate: collectionTemplate
    fieldTemplate: fieldTemplate
    template: multiTemplate

    events:
      'click .add-row': 'onAddClick'
      'click .remove': 'onRemoveClick'

    initialize: ->
      @options.type = 'json'
      @rows = 0
      @renderedFields = []
      super
      console?.log @, @$el

    set: (value) ->
      @clear()
      @addRow row for row in value if _.isArray value

    get: ->
      value = []
      for field in @renderedFields
        isEmpty = true
        row = {}
        for key, widget of field.data 'instances'
          row[key] = widget.get()
          isEmpty = false if row[key]
        value.push(row) if not isEmpty
      if not _.isEmpty value then value else null

    clear: ->
      for field in @renderedFields
        instance.unbind().remove() for key, instance of field.data 'instances'
        field.remove()
      @rows = 0
      @renderedFields.length = 0
      this

    remove: ->
      @clear()
      super

    onAddClick: (e) ->
      e.preventDefault()
      @addRow()

    onRemoveClick: (e) ->
      e.preventDefault()
      el = $(e.target)
      el.parent().remove()

    addRow: (content) ->
      # field Template
      _collectionTemplate = _.template @collectionTemplate
      _fieldTemplate = _.template @fieldTemplate

      # add rendered widget to field template
      args =
        name: @rows
        input_id: "id_#{@rows}"  # TODO: get parent id
        container_class: 'row'
      # create a div to avoid detached elements
      renderedCollection = $('<div>').
        html(_collectionTemplate args).children().detach()

      instances = {}
      for field in @fields.slice(0).reverse()
        # build args object
        args =
          name: "#{@name}_#{field.name}_#{@rows}"
          label: field.label or ''
          value: field.value or ''
          container_class: field.container_class or ''
        args = _.extend(args, field.args or {})

        #instantiate widget and add reference to fields array
        widget = new field.widget(args)
        instances[field.name] = widget

        field = $('<div>').html(_fieldTemplate args).children().detach()
        field.find('.widget-container').append widget.render().el
        renderedCollection.prepend(field).data 'instances', instances

      # prepend renderedCollection on form
      @$('.fields-container').append renderedCollection

      # set row value
      instances[key]?.set value for key, value of content

      # save the field element reference
      @renderedFields.push renderedCollection
      @rows++
      this


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
    MultiWidget: MultiWidget
    ContactWidget: ContactWidget
  }

