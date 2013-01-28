define (require) ->
  'use strict'

  Backbone = require 'backbone'

  class Organization extends Backbone.Model
    urlRoot: '/api/organizations'

  return {
    Organization: Organization
  }
