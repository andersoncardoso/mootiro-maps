define (require) ->
  'use strict'

  $ = require 'jquery'
  Backbone = require 'backbone'

  pageManager = require 'core/page_manager'
  views = require './views'

  class Profile extends pageManager.Page
    constructor: (@model, @mode='view') ->
      super
      @id = "user::profile::#{@model.id}"

    setMode: (mode) ->
      if @mode is mode and mode is 'edit' then mode = null
      view.instance?.setMode?(mode) for view in @views
      @mode = mode

      if mode is null then @model.goToProfile()

    render: ->
      # Deferred object to router know when the page is ready or if occurred
      # an error
      dfd = new $.Deferred()

      if pageManager.currentPage?.id is @id
        pageManager.currentPage.setMode @mode
        dfd.resolve()
        return dfd.promise()

      # Get the user
      window.user = @model
      @model.fetch().done =>
        # Use Page class and page manager to avoid memory leak and centralize some
        # common tasks
        data =
          model: @model
          mode: @mode

        @setViews
          actionBar: new views.ActionBar data
          sidebar: new views.Sidebar data
          mainContent: new views.Profile data

        pageManager.open this

        dfd.resolve()
      .fail (jqXHR) ->
        dfd.reject jqXHR

      dfd.promise()


  class Edit extends Profile
    constructor: (model, mode='edit') ->
      super model, mode

  Profile: Profile
  Edit: Edit
