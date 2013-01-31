define (require) ->
  'use strict'

  Backbone = require 'backbone'
  _ = require 'underscore'

  app = require 'app'
  PermissionMixin = require('core/mixins').PermissionMixin


  class CommonObject extends Backbone.Model
    _.extend @prototype, PermissionMixin

    # Subclass responsability
    # navRoot = 'undefined'

    showUrl: ->
      "#{@navRoot}/#{@id}"

    editUrl: ->
      "#{@navRoot}/#{@id}/edit"

    newUrl: ->
      "#{@navRoot}/new"


  return {CommonObject: CommonObject}
