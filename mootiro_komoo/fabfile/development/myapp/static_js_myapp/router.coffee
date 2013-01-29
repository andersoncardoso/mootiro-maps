define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'
  urls = require 'urls'

  pages = require './pages'
  models = require './models'


  class MyappRouter extends Backbone.Router
    routes:
      'myapp/:id(/)': 'view'

    initialize: ->
      _.bindAll this

    view: (id) ->
      model = models.getUser id
      app.goTo urls.resolve('myapp_root', id_: id), new pages.MyappPage(model: @model)

  return MyappRouter
