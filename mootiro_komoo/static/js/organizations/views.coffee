define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  ReForm = require 'reForm'

  app = require 'app'

  forms = require('./forms')


  class OrganizationView extends Backbone.View
    template: _.template 'LALALALALA'
    
    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template {}
      this

  return {
    OrganizationView: OrganizationView
  }
