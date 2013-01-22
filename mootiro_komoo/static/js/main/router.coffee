define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  pageManager = require 'core/page_manager'
  pages = require('./pages')


  class MainRouter extends Backbone.Router
    routes:
      '': 'root'

    initialize: ->
      _.bindAll this
      @bindExternalEvents()

    bindExternalEvents: ->
      Backbone.on 'open:root', @root
      Backbone.on 'open:error', @error

    goTo: (url, page) ->
      $.when(pageManager.canClose()).done =>
        @navigate url
        $.when(page.render()).fail (e) ->
          Backbone.trigger 'open:error', e.status, e.statusText

    root: ->
      @goTo '', pages.root

    error: (code, msg) ->
      pages.error.render()
      alert "#{code} #{msg} <TODO: render the error page>"


  return new MainRouter()
