define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'
  urls = require 'urls'
  mapViews = require 'map/views'


  class Feedback extends Backbone.View
    #
    # Display 'working...' message while ajax requests
    #
    tagName: 'span'
    className: 'feedback'
    delay: 100  # ms

    initialize: ->
      @$el.hide()
      @listenTo app, 'working', =>
        @open i18n 'Working...'
      @listenTo app, 'done', =>
        @close()
      @render()

    open: (msg) ->
      @$el.html msg
      @delayed ?= setTimeout (=> @$el.css 'display': 'inline'), @delay
      this

    close: ->
      clearTimeout @delayed
      @delayed = null
      @$el.fadeOut()
      this


  class UpperBar extends Backbone.View
    #
    # Render the user profile link, login/logout button and search bar.
    #
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
    #
    # Render the main menu links and the UpperBar
    #
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
      app.goTo ''  # Go to main page

    nav: (e) ->
      e?.preventDefault()
      url = $(e.target).attr 'href'
      app.goTo url


  class Footer extends Backbone.View
    #
    # Render the footer
    #
    template: _.template require 'text!templates/main/_footer.html'
    initialize: ->
      _.bindAll this
      @render()

    render: ->
      @$el.html @template()
      this


  class ActionBar extends Backbone.View
    #
    # Render the generic action bar
    #
    template: _.template require 'text!templates/main/_action_bar.html'
    tagName: 'ul'
    events:
      'click a': 'do'

    # Default actions
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
      #
      # This method is called when an action button is clicked
      #
      e.preventDefault()

      # Get the action from 'data-action' attribute
      action = if $(e.target).hasClass 'active' then 'show' else $(e.target).attr 'data-action'
      # This comes from main/models::CommonObject
      url = @model["#{action}Url"]?()
      app.goTo url

    setMode: (@mode) ->
      # Toggle buttons related to display modes (edit, history, discuss, etc)
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
      @subViews.push @mapEditor
      @listenTo @mapEditor, 'initialize', => @trigger 'initialize'
      # Resize the map when browser is resized
      $(window).resize @resizeElement
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
