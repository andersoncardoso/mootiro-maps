define (require) ->
  'use strict'

  $ = require 'jquery'
  Backbone = require 'backbone'

  pageManager = require 'page_manager'
  views = require './views'

  getUser = (id) ->
    if not id?
      console?.log 'User id not specified'
      return

    # Create the user instance
    User = require('./models').User
    user = new User()
    user.id = id

    # Display and hide the working feedback
    user.on 'request', (model) ->
      Backbone.trigger 'app::working', model
    user.on 'sync', (model, resp, options) ->
      Backbone.trigger 'app::done', model
    user.on 'error', (model, error) ->
      if error.status?
        Backbone.trigger 'app::done', model

    return user


  class Profile extends pageManager.Page
    constructor: (@userId, @mode='view') ->
      super
      @id = "user::profile::#{@userId}"

    setMode: (mode) ->
      if @mode is mode and mode is 'edit' then mode = null
      view.instance?.setMode?(mode) for view in @views
      @mode = mode

      if mode is null then Backbone.trigger 'user::profile', @userId

    render: ->
      # Deferred object to router know when the page is ready or if occurred
      # an error
      dfd = new $.Deferred()

      if pageManager.currentPage?.id is @id
        pageManager.currentPage.setMode @mode
        dfd.resolve()
        return dfd.promise()

      # Get the user
      user = getUser @userId
      window.user = user
      user.fetch().done =>
        # Use Page class and page manager to avoid memory leak and centralize some
        # common tasks
        data =
          model: user
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
    constructor: (userId, mode='edit') ->
      super userId, mode

  getUser: getUser
  Profile: Profile
  Edit: Edit
