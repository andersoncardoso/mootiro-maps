define (require) ->
  'use strict'

  _ = require 'underscore'
  reForm = require 'reForm'

  class MultiWidget extends reForm.Widget
    fields: []
    collectionTemplate: """
<div class="collection-container <%=container_class%>"></div>
"""
    fieldTemplate: """
<div class="field-container <%=container_class%>">
  <label><%=label%></label>
  <div class="widget-container"></div>
</div>
"""

    events:
      'click .add-row': 'onAddClick'

    template: '<div class="fields-container"></div><a class="add-row">+ Add another one</a>'

    initialize: ->
      @options.type = 'json'
      @rows = 0
      @renderedFields = []
      super

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
      value

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
        html(_collectionTemplate args).children().detach();

      instances = {}
      for field in @fields
        # build args object
        args =
          name: field.name
          input_id: "id_#{field.name}_#{@rows}"  # TODO: get parent id
          label: field.label or ''
          value: field.value or ''
          container_class: field.container_class or ''
        args = _.extend(args, field.args or {})

        #instantiate widget and add reference to fields array
        widget = new field.widget(args)
        instances[field.name] = widget

        field = $('<div>').html(_fieldTemplate args).children().detach();
        field.find('.widget-container').append widget.render().el
        renderedCollection.append(field).data 'instances', instances

      # prepend renderedCollection on form
      @$('.fields-container').append renderedCollection

      # set row value
      instances[key]?.set value for key, value of content

      # save the field element reference
      @renderedFields.push renderedCollection
      @rows++
      this


  return {
    MultiWidget: MultiWidget
  }
