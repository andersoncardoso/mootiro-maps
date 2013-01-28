define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'
  urls = require 'urls'

  pages = require './pages'
  models = require './models'


  class OrganizationRouter extends Backbone.Router
    routes:
      'organizations(/)': 'list'
      'organizations/new(/)': 'create'
      'organizations/:id(/)': 'view'

    initialize: ->
      _.bindAll this

    create: ->
      app.goTo('/organizations/new/', new pages.OrganizationPage())

  return OrganizationRouter
