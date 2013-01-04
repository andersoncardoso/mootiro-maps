define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'


  class Feedback extends Backbone.View
    tagName: 'span'
    className: 'feedback'

    initialize: ->
      @$el.hide()
      @render()

    display: (msg) ->
      @$el.html msg
      @delayed ?= setTimeout (=> @$el.css 'display': 'inline'), 100
      this

    close: ->
      clearTimeout @delayed
      @delayed = null
      @$el.fadeOut()
      this


  class UpperBar extends Backbone.View
    events:
      'click .login': 'login'
      'click .logout': 'logout'
      'click .user': 'profile'

    initialize: () ->
      _.bindAll this
      @template = _.template require 'text!templates/main/_upper_bar.html'
      @listenTo @model, 'change', @render
      window.current = @model
      @render()

    render: ->
      @$el.html @template user: @model.toJSON()
      this

    login: (e) ->
      e?.preventDefault()
      Backbone.trigger 'auth::loginRequired', window.location.href
      this

    logout: (e) ->
      e?.preventDefault()
      Backbone.trigger 'auth::logout', window.location.href
      this

    profile: (e) ->
      e?.preventDefault()
      @model.goToProfile()
      this


  class Header extends Backbone.View
    events:
      'click .logo a': 'root'

    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/main/_header.html'
      @upperBar = new UpperBar
        model: @model
      @subViews = [@upperBar]
      @render()

    render: ->
      @upperBar.$el.detach()
      @$el.html @template user: @model.toJSON()
      @$('#upper-bar-container').append @upperBar.$el
      this

    root: (e) ->
      e?.preventDefault()
      Backbone.trigger 'main::root'


  class Footer extends Backbone.View
    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/main/_footer.html'
      @render()

    render: ->
      @$el.html @template()
      this


  class ActionBar extends Backbone.View
    tagName: 'ul'

    events:
      'click a': 'do'

    actions: [
      { action: 'edit',    label: i18n 'Edit' }
      { action: 'rate',    label: i18n 'Rate' }
      { action: 'discuss', label: i18n 'Discuss' }
      { action: 'history', label: i18n 'History' }
      { action: 'report',  label: i18n 'Report' }
      { action: 'delete',  label: i18n 'Delete' }
    ]

    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/main/_action_bar.html'
      @mode = @options.mode
      @render()

    render: ->
      @$el.html @template
        actions: @actions
        model: @model.toJSON()
        hasPermission: _.bind(@model.hasPermission, @model)
      @setMode @mode
      this

    do: (e) ->
      e.preventDefault()
      action = $(e.target).attr 'data-action'
      if _.isFunction @model[action]
        @model[action]()

    setMode: (@mode) ->
      @$('.active').removeClass 'active'
      @$("a[data-action=#{mode}]").addClass 'active'


  Header: Header
  Footer: Footer
  UpperBar: UpperBar
  ActionBar: ActionBar
  Feedback: Feedback
