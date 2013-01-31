define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'

  myappPages = require './pages'
  myappModels = require './models'


  class MyappRouter extends Backbone.Router
    routes:
      'myapp/new(/)': 'new'
      'myapp/:id(/)': 'show'
      'myapp/:id/edit(/)': 'edit'

    initialize: ->
      _.bindAll this

    show: (id) ->
      model = new myappModels.Mymodel {'id': id}
      model.fetch()
      app.goTo("/myapp/#{id}", new myappPages.Show 'model': model)

    new: ->
      model = new myappModels.Mymodel {}  # no id, new object
      app.goTo("/myapp/new", new myappPages.New 'model': model)

    edit: (id) ->
      model = new myappModels.Mymodel {'id': id}
      model.fetch()
      app.goTo("/myapp/#{id}/edit", new myappPages.Edit 'model': model)


  return MyappRouter
