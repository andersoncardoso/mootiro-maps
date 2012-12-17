define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  List = Backbone.View.extend
    tagName: 'ul'
    className: 'list'

    initialize: ->
      _.bindAll this
      @listenTo @collection, 'add', @addOne
      @listenTo @collection, 'reset', @addAll
      @listenTo @collection, 'all', @render
      @itemViews = {}
      @ItemView = @options.ItemView
      @collection.pager()
      @render()

    render: ->

    addAll: ->
      @$el.empty()
      @collection.each @addOne
      this

    addOne: (item) ->
      itemView = new @ItemView model: item
      @$el.append itemView.render().$el
      this

  List
