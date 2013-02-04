define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  orgForms = require('./forms')

  # ===== Show Page Views =====================================================
  class ShowMain extends Backbone.View
    template: _.template require 'text!templates/organizations/_show_main.html'

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template obj: @model.toJSON()
      this


  class ShowSidebar extends Backbone.View
    template: _.template require 'text!templates/organizations/_show_sidebar.html'

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template obj: @model.toJSON()
      this

  # ===== New Page Views ======================================================
  class NewMain extends Backbone.View
    template: _.template require 'text!templates/organizations/_new_main.html'

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @subViews = []
      @form = new orgForms.OrganizationForm({model: @model})
      @subViews.push @form
      @render()

    render: ->
      view.$el.detach() for view in @subViews
      @$el.html @template {}
      @$('#form-container').append @form.$el
      this

  # ===== Edit Page Views =====================================================
  class EditMain extends Backbone.View
    template: _.template require 'text!templates/organizations/_edit_main.html'

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @subViews = []
      @form = new orgForms.OrganizationForm({model: @model})
      @subViews.push @form
      @render()

    render: ->
      view.$el.detach() for view in @subViews
      @$el.html @template data: @model.toJSON()
      @$('#form-container').append @form.$el
      this


  class EditSidebar extends Backbone.View
    template: _.template require 'text!templates/organizations/_edit_sidebar.html'

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template {}
      this

  return {
    ShowMain: ShowMain
    ShowSidebar: ShowSidebar
    NewMain: NewMain
    EditMain: EditMain
    EditSidebar: EditSidebar
  }
