define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  class MainRouter extends Backbone.Router
    routes:
      '': 'root'

    initialize: ->
      _.bindAll this
      @bindExternalEvents()

    bindExternalEvents: ->
      Backbone.on 'main::root', @root
      Backbone.on 'main::notFound', @notFound

    root: ->
      root = require('main/pages').root
      root.render()
      @navigate ""

    notFound: ->
      notFound = require('main/pages').notFound
      notFound.render()
      alert '404 Not Found <TODO: render the 404 page>'

  return new MainRouter()
