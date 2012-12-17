define (require) ->
  $ = require 'jquery'
  Backbone = require 'backbone'

  pageManager = require 'page_manager'

  getUser = (id) ->
    if not id?
      console?.log 'User id not specified'
      return

    # Create the user instance
    User = require('user/models').User
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
      userViews = require 'user/views'

      # Get the user
      user = getUser id

      # Display Not Found page is the model got 404 http response
      user.on 'error', (model, error) ->
        if error.status is 404
          Backbone.trigger 'main::notFound', model

      window.user = user

      # User Profile don't have an action bar, so make it empty
      $('#action-bar').empty()

      # Use Page class and page manager to avoid memory leak and centralize some
      # common tasks
      profilePage = new pageManager.Page
        sidebar: new userViews.Sidebar
            model: user
        mainContent: new userViews.Profile
            model: user

      $.when(user.fetch()).done ->
        pageManager.open profilePage



  getUser: getUser
  profile: profile
