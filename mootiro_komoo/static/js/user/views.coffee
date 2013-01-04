define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  ReForm = require 'reForm'

  ActionBar = require('main/views').ActionBar


  #### Profile Main View ####

  class UserInfo extends Backbone.View
    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_user_info.html'
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template user: @model.toJSON()


  class Profile extends Backbone.View
    initialize: ->
      window.model = @model
      _.bindAll this
      @template = _.template require 'text!templates/user/_profile.html'

      @userInfoView = new UserInfo
        model: @model

      @updatesView = new Updates
        collection: @model.getUpdates()

      @subViews = [
        @userInfoView
        @updatesView
      ]

      @render()

    render: ->
      @userInfoView.$el.detach()  # Dont lost the updates element
      @updatesView.$el.detach()  # Dont lost the updates element
      @$el.html @template
        user: @model.toJSON()
      @$('#user-info-container').append @userInfoView.$el
      @$('#user-updates-container').append @updatesView.$el
      this


  #### Profile Sidebar ####

  class Sidebar extends Backbone.View
    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_sidebar.html'
      @render()

    render: ->
      @$el.html @template
        user: @model.toJSON()
      this


  #### Profile Blocks ####

  class Update extends Backbone.View
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


  class Updates extends Backbone.View
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
  ActionBar: ActionBar
  Sidebar: Sidebar
