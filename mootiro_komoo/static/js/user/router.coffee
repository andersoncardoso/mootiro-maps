define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  pages = require('./pages')

  pageManager = require 'page_manager'


  class UserRouter extends Backbone.Router
    routes:
      'users(/)': 'user'
      'users/:id(/)': 'profile'
      'users/:id/edit(/)': 'edit'

    initialize: ->
      _.bindAll this
      @bindExternalEvents()

    bindExternalEvents: ->
      Backbone.on 'user::profile', @profile
      Backbone.on 'user::edit', @edit

    goTo: (url, page) ->
      $.when(pageManager.canClose()).done =>
        @navigate url
        $.when(page.render()).fail (e) ->
          Backbone.trigger 'main::error', e.status, e.statusText

    user: ->
      if not KomooNS?.isAuthenticated
        url = window.location
        if url.search and url.search.indexOf('next') > -1
          # get search parameters into a object
          queryString = {}
          url.search.replace new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            ($0, $1, $2, $3) -> queryString[$1] = $3
          next = queryString['next']
        Backbone.trigger 'auth::loginRequired', next

    profile: (id) ->
      @goTo "users/#{id}", new pages.Profile(id)

    edit: (id) ->
      @goTo "users/#{id}/edit", new pages.Edit(id)


  new UserRouter()
