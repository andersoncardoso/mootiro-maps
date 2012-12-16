define (require) ->
  _ = require 'underscore'
  Backbone = require 'backbone'

  class UserRouter extends Backbone.Router
    routes:
      'user': 'list'
      'user/:id': 'profile'

    initialize: ->
      _.bindAll this
      @bindExternalEvents()

    bindExternalEvents: ->
      Backbone.on 'user::profile', @profile

    profile: (id) ->
      profile = require 'user/pages/profile'
      if profile.render id
        @navigate "user/#{id}"

  return new UserRouter()
