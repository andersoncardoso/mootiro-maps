define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'
  urls = require 'urls'
  PermissionMixin = require('core/mixins').PermissionMixin
  mainModels = require 'main/models'

  Updates = require('./collections').PaginatedUpdates


  getUser = (user) ->
    # Create the user instance
    if not user?
      console?.log 'User id not specified'
      return
    user = new User id: user if _.isNumber(user) or _.isString(user)
    return if user instanceof User then user else null


  class User extends mainModels.CommonObject

    permissions:
      edit: (user) ->
        user instanceof User and (user.isSuperuser() or user.get('id') is @get('id'))

    urlRoot: urls.resolve 'user_api'
    navRoot: '/users'

    defaults:
      'about_me': ''
      'geojson': {"type": "FeatureCollection", "features": [{"geometry": {"type": "Point", "coordinates": [-23.566743, -46.746802]}, "type": "Feature", "properties": {type: 'User'}}]}  # FIXME: Remove this

    getUpdates: ->
      return @updates ? (@updates = new Updates([], user: this))

    view: ->
      app.goTo urls.resolve 'user_view', id_: @id

    edit: ->
      app.goTo urls.resolve 'user_edit', id_: @id

    isSuperuser: ->
      # TODO: implement
      false

  return {
    getUser: getUser
    User: User
  }
