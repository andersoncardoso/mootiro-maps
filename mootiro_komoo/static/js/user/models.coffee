define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  User = Backbone.Model.extend
    urlRoot: '/api/user'

    getUpdates: ->
      window.model = this
      Update = require('update/models').Update

      Updates = require('./collections').PaginatedUpdates
      collection = new Updates([{}], user: this)
      window.collection = collection
      return collection


  User: User
