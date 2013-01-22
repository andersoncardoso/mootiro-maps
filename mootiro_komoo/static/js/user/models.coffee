define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'
  PermissionMixin = require('core/mixins').PermissionMixin
  Updates = require('./collections').PaginatedUpdates
  urls = require 'urls'


  class User extends Backbone.Model
    _.extend @prototype, PermissionMixin

    permissions:
      edit: (user) ->
        user instanceof User and (user.isSuperuser() or user.get('id') is @get('id'))

    urlRoot: urls.resolve 'user_api'

    defaults:
      'about_me': ''
      'geojson': {"type": "FeatureCollection", "features": [{"geometry": {"type": "Point", "coordinates": [-23.566743, -46.746802]}, "type": "Feature", "properties": {type: 'User'}}]}  # FIXME: Remove this

    getUpdates: ->
      return @updates ? (@updates = new Updates([], user: this))

    goToProfile: ->
      Backbone.trigger 'open:detail', this if @id?

    edit: ->
      Backbone.trigger 'open:edit', this if @id?

    isSuperuser: ->
      # TODO: implement
      false

  return {
    User: User
  }
