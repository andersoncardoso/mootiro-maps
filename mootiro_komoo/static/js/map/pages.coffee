define (require) ->
  'use strict'

  $ = require 'jquery'
  Backbone = require 'backbone'

  app = require 'app'

  pageManager = require 'core/page_manager'

  class MapPage extends pageManager.Page
    initialize: ->
      super
      @id = 'mainMap'

    open: ->
      app.showMainMap()

    close: ->
      app.hideMainMap()

  MapPage: MapPage
