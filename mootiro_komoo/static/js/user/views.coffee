define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'


  #### Profile Main View ####

  profile_tpl = require 'text!templates/user/_profile.html'
  Profile = Backbone.View.extend
    template: _.template profile_tpl

    events: {
    }

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @updatesView = new Updates
        collection: @model.getUpdates()
      @render()

    render: ->
      @$el.html @template
        user: @model.toJSON()
      @$el.append @updatesView.render().$el
      this


  #### Profile Sidebar ####
  sidebar_tpl = require 'text!templates/user/_sidebar.html'
  Sidebar = Backbone.View.extend
    template: _.template sidebar_tpl

    events: {
    }

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.html @template
        user: @model.toJSON()
      this


  #### Profile Blocks ####
  #
  update_tpl = require 'text!templates/user/_update_item.html'
  Update = Backbone.View.extend
    template: _.template update_tpl
    tagName: 'li'

    events: {
      'click .see-on-map': 'seeOnMap'
    }

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render

    render: ->
      @$el.removeClass().addClass [
          @model.get('type').toLowerCase(),
          @model.get('action').toLowerCase()
      ]
      @$el.html @template
        update: @model.toJSON()
      this

    seeOnMap: ->
      Backbone.trigger 'map::see-on-map', @model
      false


  updates_tpl = require 'text!templates/user/_updates_block.html'
  List = require 'widgets/list'
  Updates = Backbone.View.extend
    template: _.template updates_tpl

    events: {
    }

    initialize: ->
      _.bindAll this
      @listView = new List
        collection: @collection
        className: 'updates list'
        ItemView: Update

    render: ->
      @$el.html @template()
      @$el.find('.list-container').append @listView.render().$el
      this


  Profile: Profile
  Updates: Updates
  Sidebar: Sidebar
