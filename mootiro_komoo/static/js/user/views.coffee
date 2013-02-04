define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  ReForm = require 'reForm'

  app = require 'app'

  ActionBar = require('main/views').ActionBar
  UserInfoForm = require('./forms').UserInfoForm

  Avatar = require('widgets/avatar').Avatar

  #### Profile Main View ####

  class UserInfo extends Backbone.View
    template: _.template require 'text!templates/user/_user_info.html'
    initialize: ->
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template user: @model.toJSON()


  class Profile extends Backbone.View
    template: _.template require 'text!templates/user/_profile.html'
    initialize: ->
      @subViews = []

      # Create the views for each mode
      ## View mode
      @userInfoViews =
        view: new UserInfo
          model: @model

      ## Edit mode
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

      @setMode()

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

    setMode: (@mode=(@options.mode ? 'show')) ->
      if @mode and not @model.hasPermission(@mode) or not @userInfoViews[@mode]?
        console?.log "Mode '#{@mode}' not allowed, changing to 'view'."
        @model.view()
        return

      # Render the sub view related to current mode (edit form is rendered here)
      @userInfoViews[@mode].render()
      @render()

    onSuccess: () ->
      app.trigger 'change', @model
      @model.view()

    onCancel: () ->
      @model.view()


  #### Profile Sidebar ####

  mapViews = require 'map/views'

  class Sidebar extends Backbone.View
    template: _.template require 'text!templates/user/_sidebar.html'
    initialize: ->
      @subViews = []

      @subViews.push new Avatar
        model: @model
        mode: @options.mode
        parentSelector: '.avatar.box'

      @subViews.push new mapViews.Preview
        model: @model
        mode: @options.mode
        parentSelector: '.map.box'

      @render()
      @setMode()

    render: ->
      view.$el.detach() for view in @subViews
      @$el.html @template model: @model.toJSON()
      @$(view.options.parentSelector).append view.$el for view in @subViews
      this

    setMode: (@mode) ->
      view.setMode?(@mode) for view in @subViews


  #### Profile Blocks ####

  class Update extends Backbone.View
    template: _.template require 'text!templates/user/_update_item.html'
    tagName: 'li'
    events:
      'click .see-on-map': 'seeOnMap'

    initialize: ->
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
