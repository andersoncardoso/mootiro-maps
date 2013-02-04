define (require) ->
  'use strict'

  Backbone = require 'backbone'
  _ = require 'underscore'

  app = require 'app'
  mixins = require 'core/mixins'


  class CommonObject extends Backbone.Model
    _.extend @prototype, mixins.PermissionMixin

    # Subclass responsability
    # navRoot = 'undefined'

    showUrl: ->
      "#{@navRoot}/#{@id}"

    editUrl: ->
      "#{@navRoot}/#{@id}/edit"

    newUrl: ->
      "#{@navRoot}/new"


  return {CommonObject: CommonObject}
