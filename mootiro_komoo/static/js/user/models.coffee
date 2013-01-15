define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'
  PermissionMixin = require('main/mixins').PermissionMixin
  urls = require 'urls'

  class User extends Backbone.Model
    urlRoot: urls.resolve 'user_api'

    defaults:
      'about_me': ''
      'contact': [
        {type: 'phone', value: '12345678'}
        {type: 'skype', value: 'skypelogin'}
      ]  # FIXME: Remove this
      'geojson': {"type": "FeatureCollection", "features": [{"geometry": {"type": "Point", "coordinates": [-23.566743, -46.746802]}, "type": "Feature", "properties": {type: 'User'}}]}  # FIXME: Remove this

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

  return {
    User: User
  }
