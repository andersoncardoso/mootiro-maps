define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'
  PermissionMixin = require('main/mixins').PermissionMixin
  urls = require 'urls'

  User = Backbone.Model.extend
    urlRoot: urls.resolve 'user_api'

    defaults:
      'about_me': ''

    permissions:
      edit: (user) ->
        user instanceof User and
          (user.isSuperuser() or user.get('id') is @get('id'))

    getUpdates: ->
      if @updates? then return @updates

      Updates = require('./collections').PaginatedUpdates
      @updates = new Updates([], user: this)
      window.collection = @updates
      return @updates

    goToProfile: ->
      Backbone.trigger 'user::profile', @id

    edit: ->
      Backbone.trigger 'user::edit', @id

    isSuperuser: ->
      # TODO: implement
      false


  _.extend User.prototype, PermissionMixin

  User: User
