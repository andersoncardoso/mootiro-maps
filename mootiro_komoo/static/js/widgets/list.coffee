define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  List = Backbone.View.extend
    tagName: 'ul'
    className: 'list'

    initialize: ->
      _.bindAll this
      @listenTo @collection, 'add', @add
      @itemViews = {}
      @ItemView = @options.ItemView

    render: ->
      @collection.each (model) =>
        if not @itemViews[model.cid]
          @add model
      this

    add: (item) ->
      itemView = new @ItemView
          model: item
      @$el.append itemView.render().$el
      @itemViews[item.cid] = itemView
      this

  List
