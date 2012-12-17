define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'


  #### Profile Main View ####

  Profile = Backbone.View.extend
    initialize: ->
      profile_tpl = require 'text!templates/user/_profile.html'
      @template = _.template profile_tpl
      _.bindAll this
      @listenTo @model, 'change', @render
      @updatesView = new Updates
        collection: @model.getUpdates()

    render: ->
      @$el.html @template
        user: @model.toJSON()
      @$el.append @updatesView.render().$el
      this


  #### Profile Sidebar ####

  Sidebar = Backbone.View.extend
    initialize: ->
      sidebar_tpl = require 'text!templates/user/_sidebar.html'
      @template = _.template sidebar_tpl
      _.bindAll this
      @listenTo @model, 'change', @render

    render: ->
      @$el.html @template
        user: @model.toJSON()
      this


  #### Profile Blocks ####

  Update = Backbone.View.extend
    tagName: 'li'

    events:
      'click .see-on-map': 'seeOnMap'

    initialize: ->
      update_tpl = require 'text!templates/user/_update_item.html'
      @template = _.template update_tpl
      _.bindAll this
      @listenTo @model, 'change', @render
      window.model = @model

    render: ->
      @$el.removeClass().addClass [
          @model.get('type').toLowerCase(),
          @model.get('action').toLowerCase()
      ]
      @$el.html @template
        update: @model.toJSON()
      this

    seeOnMap: (a) ->
      Backbone.trigger 'map::see-on-map', @model
      false


  Updates = Backbone.View.extend
    initialize: ->
      updates_tpl = require 'text!templates/user/_updates_block.html'
      @template = _.template updates_tpl
      _.bindAll this
      List = require 'widgets/list'
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
