define (require) ->
  _ = require 'underscore'
  Backbone = require 'backbone'

  class UserRouter extends Backbone.Router
    routes:
      'user(/)': 'user'
      'user/:id(/)': 'profile'

    initialize: ->
      _.bindAll this
      @bindExternalEvents()

    bindExternalEvents: ->
      Backbone.on 'user::profile', @profile

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
      profile = require('user/pages').profile

      profile.render id
      @navigate "user/#{id}"

  return new UserRouter()
