define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  ReForm = require 'reForm'

  ActionBar = require('main/views').ActionBar
  UserInfoForm = require('./forms').UserInfoForm


  #### Profile Main View ####

  class UserInfo extends Backbone.View
    template: _.template require 'text!templates/user/_user_info.html'
    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template user: @model.toJSON()


  class Profile extends Backbone.View
    template: _.template require 'text!templates/user/_profile.html'
    initialize: ->
      _.bindAll this

      @subViews = []

      # Create the views for each mode
      ## View mode
      @userInfoViews =
        view: new UserInfo
          model: @model

      ## Edit mode
      if @model.hasPermission 'edit'
        @userInfoViews['edit'] = new UserInfoForm
          model: @model
          formId: 'user-info'
          submit_label: i18n 'Save'
        @listenTo @userInfoViews['edit'], 'success', @onSuccess
        @listenTo @userInfoViews['edit'], 'cancel', @onCancel

      for mode, view of @userInfoViews
        @subViews.push view

      # User updates
      @updatesView = new Updates
        collection: @model.getUpdates()
      @subViews.push @updatesView

      @setMode(@options.mode ? 'view')

    render: ->
      view.$el.detach() for view in @subViews

      @$el.html @template
        user: @model.toJSON()
        mode: @mode

      @$('#user-info-container').append @userInfoViews[@mode]?.$el
      @$('#user-updates-container').append @updatesView.$el
      this

    canClose: ->
      not @userInfoViews[@mode]?.wasChanged?()

    setMode: (@mode) ->
      if @mode and not @model.hasPermission(@mode) or not @userInfoViews[@mode]?
        console?.log "Mode '#{@mode}' not allowed, changing to 'view'."
        @model.view()
        return

      @userInfoViews[@mode].render()
      @render()

    onSuccess: () ->
      Backbone.trigger 'change', @model
      @model.view()

    onCancel: () ->
      @model.view()


  #### Profile Sidebar ####

  mapViews = require 'map/views'

  class Sidebar extends Backbone.View
    template: _.template require 'text!templates/user/_sidebar.html'
    initialize: ->
      _.bindAll this
      @subViews = []
      @subViews.push new mapViews.Preview
        model: @model
        parentSelector: '.map.box'
      @render()

    render: ->
      view.$el.detach() for view in @subViews
      @$el.html @template user: @model.toJSON()
      @$(view.options.parentSelector).append view.$el for view in @subViews
      this


  #### Profile Blocks ####

  class Update extends Backbone.View
    template: _.template require 'text!templates/user/_update_item.html'
    tagName: 'li'
    events:
      'click .see-on-map': 'seeOnMap'

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.removeClass().addClass [
          @model.get('type')?.toLowerCase(),
          @model.get('action')?.toLowerCase()
      ]
      @$el.html @template update: @model.toJSON()
      this

    seeOnMap: (e) ->
      e?.preventDefault?()
      this


  class Updates extends Backbone.View
    template: _.template require 'text!templates/user/_updates_block.html'

    initialize: ->
      _.bindAll this
      listWidgets = require 'widgets/list'
      @subViews = []
      @subViews.push new listWidgets.List
        collection: @collection
        className: 'updates list'
        parentSelector: '.list-container'
        ItemView: Update
      @subViews.push new listWidgets.Pagination
        collection: @collection
        parentSelector: '.list-container'
      @render()

    render: ->
      view.$el.detach() for view in @subViews
      @$el.html @template(@collection)
      @$(view.options.parentSelector).prepend view.$el for view in @subViews.reverse()
      this


  Profile: Profile
  Updates: Updates
  ActionBar: ActionBar
  Sidebar: Sidebar
