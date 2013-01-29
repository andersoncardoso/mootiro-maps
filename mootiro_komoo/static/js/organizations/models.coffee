define (require) ->
  'use strict'

  Backbone = require 'backbone'
  _ = require 'underscore'
  
  PermissionMixin = require('core/mixins').PermissionMixin

  class Organization extends Backbone.Model
    _.extend @prototype, PermissionMixin

    urlRoot: '/api/organizations'

  return {
    Organization: Organization
  }
