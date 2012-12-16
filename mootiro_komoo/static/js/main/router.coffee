define (require) ->
  _ = require 'underscore'
  Backbone = require 'backbone'

  class MainRouter extends Backbone.Router
    routes: {}

    initialize: ->
      _.bindAll this
      @bindExternalEvents()

    bindExternalEvents: ->
      Backbone.on 'main::root', @root
      Backbone.on 'main::notfound', @notfound

    root: ->
      root = require 'main/pages/root'
      if root.render()
        @navigate ""

    notfound: ->
      #TODO
      alert '404 Not Found'

  return new MainRouter()
