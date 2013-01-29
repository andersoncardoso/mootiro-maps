define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'

  orgPages = require './pages'
  orgModels = require './models'


  class OrganizationsRouter extends Backbone.Router
    routes:
      'organizations/new(/)': 'new'
      'organizations/:id(/)': 'show'
      'organizations/:id/edit(/)': 'show'

    initialize: ->
      _.bindAll this

    show: (id) ->
      model = new orgModels.Organization {'id': id}
      model.fetch()
      app.goTo("/organizations/#{id}", new orgPages.Show 'model': model)

    new: ->
      model = new orgModels.Organization {}  # no id, new object
      app.goTo("/organizations/new", new orgPages.New 'model': model)

    edit: ->
      # TODO: implement

    discuss: ->
      # TODO: implement


  return OrganizationsRouter
