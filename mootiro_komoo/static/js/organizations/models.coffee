define (require) ->
  'use strict'

  Backbone = require 'backbone'
  _ = require 'underscore'

  app = require 'app'
  PermissionMixin = require('core/mixins').PermissionMixin


  class Organization extends Backbone.Model
    _.extend @prototype, PermissionMixin

    urlRoot: '/api/organizations'

    edit: ->
      app.goTo "organizations/#{@id}/edit"

  return {Organization: Organization}
