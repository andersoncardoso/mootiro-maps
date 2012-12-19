define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'


  #### Profile Main View ####

  Profile = Backbone.View.extend
    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_profile.html'
      @listenTo @model, 'change', @render

      @updatesView = new Updates
        collection: @model.getUpdates()
      @subViews = [@updatesView]

      @render()

    render: ->
      @updatesView.$el.detach()  # Dont lost the updates element
      @$el.html @template
        user: @model.toJSON()
      @$('#user-updates-container').append @updatesView.$el
      this


  #### Profile Sidebar ####

  Sidebar = Backbone.View.extend
    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_sidebar.html'
      @render()

    render: ->
      @$el.html @template
        user: @model.toJSON()
      this


  #### Profile Blocks ####

  Update = Backbone.View.extend
    tagName: 'li'

    events:
      'click .see-on-map': 'seeOnMap'

    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_update_item.html'
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.removeClass().addClass [
          @model.get('type')?.toLowerCase(),
          @model.get('action')?.toLowerCase()
      ]
      @$el.html @template
        update: @model.toJSON()
      this

    seeOnMap: (e) ->
      e?.preventDefault?()
      Backbone.trigger 'map::see-on-map', @model
      this


  Updates = Backbone.View.extend
    events:
      'click a.previous': 'previousPage'
      'click a.next': 'nextPage'
      'keypress .current-page': 'goTo'

    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_updates_block.html'
      List = require 'widgets/list'
      @listView = new List
        collection: @collection
        className: 'updates list'
        ItemView: Update
      @subViews = [@listView]
      @listenTo @collection, 'reset', @update
      @render()

    render: ->
      @listView.$el.detach()  # Dont lost the updates element
      @$el.html @template(@collection)
      @$('.list-container').prepend @listView.$el
      this

    update: ->
      @$('.current-page').val @collection.currentPage + 1
      @$('.total-pages').text @collection.totalPages

      if @collection.currentPage is 0
        @$('.previous').addClass 'disabled'
      else
        @$('.previous').removeClass 'disabled'

      if @collection.currentPage is @collection.totalPages - 1
        @$('.next').addClass 'disabled'
      else
        @$('.next').removeClass 'disabled'


    previousPage: (e) ->
      e?.preventDefault?()
      if @collection.currentPage > @collection.firstPage
        @collection.requestPreviousPage()
      this

    nextPage: (e) ->
      e?.preventDefault?()
      if @collection.currentPage < @collection.totalPages - 1
        @collection.requestNextPage()
      this

    goTo: (e) ->
      if e.keyCode isnt 13 then return

      page = parseInt @$('.current-page').val(), 10
      if _.isNaN(page) or page <= 0 or page > @collection.totalPages
        @update()
        return

      @collection.goTo (page - 1)


  Profile: Profile
  Updates: Updates
  Sidebar: Sidebar
