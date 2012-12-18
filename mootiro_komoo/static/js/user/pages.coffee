define (require) ->
  'use strict'

  $ = require 'jquery'
  Backbone = require 'backbone'

  pageManager = require 'page_manager'

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
      if error.status? then  Backbone.trigger 'app::done', model

    return user


  profile =
    render: (id) ->
      views = require './views'

      # Deferred object to router know when the page is ready or if occurred
      # an error
      dfd = new $.Deferred()

      # Get the user
      user = getUser id
      user.fetch().done ->
        # User Profile don't have an action bar, so make it empty
        $('#action-bar').empty()

        # Use Page class and page manager to avoid memory leak and centralize some
        # common tasks
        profilePage = new pageManager.Page
          sidebar: new views.Sidebar
              model: user
          mainContent: new views.Profile
              model: user

        pageManager.open profilePage

        dfd.resolve()
      .fail (jqXHR) ->
        dfd.reject jqXHR

      dfd.promise()


  getUser: getUser
  profile: profile
