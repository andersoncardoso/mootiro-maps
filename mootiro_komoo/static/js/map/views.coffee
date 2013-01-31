define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'
  require 'map.jquery'

  mapElementCache = {}
  class Base extends Backbone.View
    initialize: ->
      window.d = this
      _.bindAll this
      @listenTo app, 'error', @onError

      @mapData ?=
        type: @type
        mapType: 'roadmap'
        zoom: @options.zoom ? 16
        geojson: @options.geojson ? @model?.get('geojson') ? {}
        width: @options.width ? '244px'
        height: @options.height ? '150px'

      if mapElementCache[@type]?
        @mapElement = mapElementCache[@type]
        @loaded = true
      else
        @mapElement = $('<div>')
        @loaded = false
      @mapElement.on 'initialized', =>
        @trigger 'initialize'
      @render()
      window.pm = this

    render: ->
      @mapElement.detach()
      @$el.html """<div class="loading">#{i18n('Loading...')}</div>"""

      @mapElement.one 'features_loaded', (e) =>
        @mapElement.fadeTo 0, 0
        @$el.empty().css(height: '100%').append @mapElement
        @refresh().fadeTo 100, 1
        mapElementCache[@type] = @mapElement
        @loaded = true

      if not @loaded
        @mapElement.komooMap @mapData

      else
        @mapElement.komooMap('geojson', @model.get('geojson'))
      this

    onError: (err) ->
      if not @loaded and err.message.indexOf 'goog!maps' > -1
        @$el.html """<div class="loading">#{i18n('Map unavailable!')}</div>"""

    onOpen: ->
      @refresh()

    remove: ->
      @mapElement.detach().unbind()
      @mapElement.komooMap('clear')
      @stopListening()
      super

    refresh: ->
      @mapElement.komooMap('refresh').komooMap('center')

    getMap: ->
      @mapElement.data('map')


  class Preview extends Base
    type: 'preview'
    initialize: ->
      @mapData =
        type: @type
        mapType: 'roadmap'
        zoom: @options.zoom ? 16
        geojson: @model.get('geojson')
        width: @options.width ? '244px'
        height: @options.height ? '150px'
      super


  class Editor extends Base
    type: 'main'
    initialize: ->
      @mapData =
        type: @type
        mapType: 'roadmap'
        zoom: @options.zoom ? 16
        geojson: @options.geojson ? @model?.get('geojson') ? {}
        width: @options.width ? '100%'
        height: @options.height ? '100%'
      super


  return {
      Preview: Preview
      Editor: Editor
  }
