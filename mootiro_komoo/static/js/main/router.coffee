define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  pages = require('./pages')


  class MainRouter extends Backbone.Router
    routes:
      '': 'root'

    initialize: ->
      _.bindAll this
      @bindExternalEvents()

    bindExternalEvents: ->
      Backbone.on 'main::root', @root
      Backbone.on 'main::error', @error

    root: ->
      pages.root.render()
      @navigate ''

    error: (code, msg) ->
      pages.error.render()
      alert "#{code} #{msg} <TODO: render the error page>"


  return new MainRouter()
