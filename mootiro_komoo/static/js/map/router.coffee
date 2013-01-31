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
    @prototype.routes[urls.route 'map_coords'] = 'mainMap'


    initialize: ->
      _.bindAll this

    mainMap: (lat, lng, zoom) ->
      data =
        lat: lat
        lng: lng
        zoom: zoom
      url = if lat then urls.resolve('map_coords', data) else urls.resolve('map')
      app.goTo url, new pages.MapPage()


  return MapRouter
