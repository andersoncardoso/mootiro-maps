define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'


  class Pagination extends Backbone.View
    template: _.template require 'text!templates/widgets/_pagination.html'
    className: 'pagination'
    events:
      'click a.previous': 'previousPage'
      'click a.next': 'nextPage'
      'keypress .current-page': 'goTo'

    initialize: ->
      _.bindAll this
      @listenTo @collection, 'reset', @update
      @render()

    render: ->
      @$el.html @template(@collection)
      this

    update: ->
      current = @collection.currentPage
      total = @collection.totalPages
      @$('.current-page').val current + 1
      @$('.total-pages').text total
      @$('.previous')[if @isFirstPage() then 'addClass' else 'removeClass'] 'disabled'
      @$('.next')[if @isLastPage() then 'addClass' else 'removeClass'] 'disabled'

    isFirstPage: ->
        @collection.currentPage is @collection.firstPage

    isLastPage: ->
        @collection.currentPage is @collection.totalPages - 1

    previousPage: (e) ->
      e?.preventDefault?()
      @collection.requestPreviousPage() if not @isFirstPage()
      this

    nextPage: (e) ->
      e?.preventDefault?()
      @collection.requestNextPage() if not @isLastPage()
      this

    goTo: (e) ->
      if e.keyCode isnt 13 then return

      page = parseInt @$('.current-page').val(), 10
      if _.isNaN(page) or page <= 0 or page > @collection.totalPages
        @update()
        return

      @collection.goTo (page - 1)


  class List extends Backbone.View
    tagName: 'ul'
    className: 'list'

    initialize: ->
      _.bindAll this
      @listenTo @collection, 'add', @addOne
      @listenTo @collection, 'reset', @addAll
      @listenTo @collection, 'all', @render
      @listenTo @collection, 'request', @_loading
      @listenTo @collection, 'sync', @_loaded
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


  return {
    Pagination: Pagination
    List: List
  }
