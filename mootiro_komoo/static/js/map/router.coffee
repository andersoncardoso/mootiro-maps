define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'
  urls = require 'urls'

  pages = require './pages'


  class MapRouter extends Backbone.Router
    routes: {}
    @prototype.routes[urls.route 'map'] = 'mainMap'

    initialize: ->
      _.bindAll this

    mainMap: ->
      app.goTo urls.resolve('map'), new pages.MapPage()


  return MapRouter
