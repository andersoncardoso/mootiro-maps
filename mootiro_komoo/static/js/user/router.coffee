define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  pageManager = require 'core/page_manager'

  pages = require './pages'
  User = require('./models').User


  class UserRouter extends Backbone.Router
    routes:
      'users(/)': 'user'
      'users/:id(/)': 'detail'
      'users/:id/edit(/)': 'edit'

    initialize: ->
      _.bindAll this
      @bindExternalEvents()

    bindExternalEvents: ->
      Backbone.on 'open:detail', @detail
      Backbone.on 'open:edit', @edit

    goTo: (url, page) ->
      $.when(pageManager.canClose()).done =>
        @navigate url
        $.when(page.render()).fail (e) ->
          Backbone.trigger 'error', e.status, e.statusText

    user: ->

    getUser: (user) ->
      # Create the user instance
      if not user?
        console?.log 'User id not specified'
        return
      user = new User id: user if _.isNumber(user) or _.isString(user)
      return if user instanceof User then user else null

    detail: (model) ->
      user = @getUser model
      @goTo "users/#{user.id}", new pages.Profile(model: user)

    edit: (model) ->
      user = @getUser model
      @goTo "users/#{user.id}/edit", new pages.Edit(model: user)


  new UserRouter()
