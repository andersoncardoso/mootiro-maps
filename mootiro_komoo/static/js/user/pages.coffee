define (require) ->
  'use strict'

  $ = require 'jquery'
  Backbone = require 'backbone'

  pageManager = require 'core/page_manager'
  views = require './views'

  class Profile extends pageManager.Page
    initialize: ->
      super
      @mode = @options.mode ? 'view'
      @id = "user::profile::#{@model.id}"
      data =
        model: @model
        mode: @mode

      if pageManager.currentPage?.id isnt @id
        @setViews
          actionBar: new views.ActionBar data
          sidebar: new views.Sidebar data
          mainContent: new views.Profile data

    open: ->
      if pageManager.currentPage?.id is @id
        pageManager.currentPage.setMode @mode
        return
      super

    setMode: (mode) ->
      if @mode is mode then return
      view.instance?.setMode?(mode) for view in @_views
      @mode = mode

      if mode is null then @model.view()


  class Edit extends Profile
    initialize: ->
      @options.mode = 'edit'
      super

  Profile: Profile
  Edit: Edit
