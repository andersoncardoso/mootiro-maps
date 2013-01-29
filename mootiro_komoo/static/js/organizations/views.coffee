define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  ReForm = require 'reForm'

  app = require 'app'

  forms = require('./forms')


  class OrganizationView extends Backbone.View
    template: _.template require 'text!templates/organizations/_main.html'
    
    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template {}
      this


  class OrganizationSidebarView extends Backbone.View
    template: _.template require 'text!templates/organizations/_sidebar.html'
    
    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template {}
      this

  return {
    OrganizationView: OrganizationView
    OrganizationSidebarView: OrganizationSidebarView
  }
