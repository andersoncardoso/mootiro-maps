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
      @listenTo @collection, 'request', @_loading
      @listenTo @collection, 'sync', @_loaded
      @itemViews = {}
      window.collection = @collection
      @ItemView = @options.ItemView
      @subViews = []
      @collection.pager()
      @render()

    render: ->

    _loading: -> console?.log 'loading...'
    _loaded: -> console?.log 'loaded'

    addAll: ->
      @$el.empty()
      @collection.each @addOne
      this

    addOne: (item) ->
      itemView = new @ItemView model: item
      @$el.append itemView.render().$el
      @subViews.push itemView
      this

  List
