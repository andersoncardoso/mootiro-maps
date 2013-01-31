define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'
  urls = require 'urls'
  mapViews = require 'map/views'


  class Feedback extends Backbone.View
    tagName: 'span'
    className: 'feedback'

    initialize: ->
      _.bindAll this
      @$el.hide()

      @listenTo app, 'working', =>
        #@display 'Working...'
      @listenTo app, 'done', =>
        @close()
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
    template: _.template require 'text!templates/main/_upper_bar.html'
    events:
      'click .login': 'login'
      'click .logout': 'logout'
      'click .user': 'profile'

    initialize: ->
      _.bindAll this
      @listenTo @model, 'change', @render
      @listenTo app, 'change', (model) =>
        # Update the upper bar when logged user is edited
        @model.fetch() if @model.id is model.id and @model.constructor is model.constructor
      @render()

    render: ->
      @$el.html @template user: @model.toJSON()
      this

    login: (e) ->
      e?.preventDefault()
      app.trigger 'login', window.location.href
      this

    logout: (e) ->
      e?.preventDefault()
      app.trigger 'logout', window.location.href
      this

    profile: (e) ->
      e?.preventDefault()
      newModel = new @model.constructor(@model.toJSON())
      newModel.view()
      this


  class Header extends Backbone.View
    template: _.template require 'text!templates/main/_header.html'
    events:
      'click .logo a': 'root'
      'click nav a': 'nav'

    urls:
      '.map': urls.resolve 'map'

    initialize: ->
      _.bindAll this
      @subViews = []
      @subViews.push new UpperBar
        model: @model
        parentSelector: '#upper-bar-container'
      @render()

    setUrls: ->
      @$("#{item} a").attr href: @urls[item] for item of @urls

    render: ->
      view.$el.detach() for view in @subViews
      @$el.html @template user: @model.toJSON()
      @setUrls()
      @$(view.options.parentSelector).append view.$el for view in @subViews
      this

    root: (e) ->
      e?.preventDefault()
      app.trigger 'open:root'

    nav: (e) ->
      e?.preventDefault()
      url = $(e.target).attr 'href'
      app.goTo url


  class Footer extends Backbone.View
    template: _.template require 'text!templates/main/_footer.html'
    initialize: ->
      _.bindAll this
      @render()

    render: ->
      @$el.html @template()
      this


  class ActionBar extends Backbone.View
    template: _.template require 'text!templates/main/_action_bar.html'
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
      @mode = @options.mode
      @listenTo @model, 'change', @render
      @listenTo app, 'login logout change:session', @render
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
      action = if $(e.target).hasClass 'active' then 'view' else $(e.target).attr 'data-action'
      @model[action]() if _.isFunction @model[action]

    setMode: (@mode) ->
      @$('.active').removeClass 'active'
      @$("a[data-action=#{mode}]").addClass 'active'


  class MapEditor extends Backbone.View
    template: _.template require 'text!templates/main/_map_editor.html'
    className: 'map-editor'

    initialize: ->
      _.bindAll this
      @subViews = []
      @mapEditor = new mapViews.Editor
        parentSelector: '#map-container'
      @listenTo @mapEditor, 'initialize', => @trigger 'initialize'
      $(window).resize @resizeElement
      @subViews.push @mapEditor
      @render()

    resizeElement: ->
      header = $ '#header-container'
      top = header.offset().top + header.height()
      bottom = $(document).height()
      height = bottom - top
      @$('#map-editor').css height: height

    render: ->
      view.$el.detach() for view in @subViews
      @$el.html @template {}
      @$(view.options.parentSelector).append view.$el for view in @subViews
      @resizeElement()
      this

    getMap: ->
      @mapEditor.getMap()


  Header: Header
  Footer: Footer
  UpperBar: UpperBar
  ActionBar: ActionBar
  Feedback: Feedback
  MapEditor: MapEditor