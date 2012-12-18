define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'
  urls = require 'urls'

  User = Backbone.Model.extend
    urlRoot: urls.resolve 'user_api'

    getUpdates: ->
      if @updates? then return @updates

      Updates = require('./collections').PaginatedUpdates
      @updates = new Updates([], user: this)
      window.collection = @updates
      return @updates

    goToProfile: ->
      Backbone.trigger 'user::profile', @id


  User: User
