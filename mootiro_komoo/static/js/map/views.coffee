define (require) ->

    $ = require 'jquery'
    _ = require 'underscore'
    Backbone = require 'backbone'

    class SearchBoxView extends Backbone.View
        events:
            'click .search': 'onSearchBtnClick'
            'change .location-type': 'onTypeChange'

        initialize: () ->
            @template = _.template require 'text!templates/map/_searchbox.html'

        render: () ->
            renderedContent = @template()
            @$el.html renderedContent
            this

        onTypeChange: () ->
            type = @$('.location-type').val()
            if type == 'address'
                @$('.latLng-container').hide()
                @$('.address-container').show()
            else
                @$('.address-container').hide()
                @$('.latLng-container').show()

        onSearchBtnClick: () ->
            type = @$('.location-type').val()
            position = if type == 'address'
                @$('.address').val()
            else
                [
                    parseFloat(@$('.lat').val().replace(',', '.')),
                    parseFloat(@$('.lng').val().replace(',', '.'))
                ]

            @search type, position
            false

        search: (type='address', position) ->
            @trigger 'search',
                type: type
                position: position
            this

    mapElementCache = null

    require 'map.jquery'
    class Preview extends Backbone.View
        initialize: ->
            _.bindAll this
            @listenTo Backbone, 'module::error', @onError

            if mapElementCache
                @map = mapElementCache
                @loaded = true
            else
                @map = $('<div>')
                @loaded = false
            @render()
            window.pm = this

        onError: (err) ->
            if not @loaded and err.message.indexOf 'goog!maps' > -1
                @$el.html """<div class="loading">#{i18n('Map unavailable!')}</div>"""

        onOpen: ->
            @refresh()

        remove: ->
            @map.detach().unbind()
            @map.komooMap('clear')
            @stopListening()
            super

        refresh: ->
            @map.komooMap('refresh').komooMap('center')

        render: ->

            @map.detach()
            @$el.html """<div class="loading">#{i18n('Loading...')}</div>"""

            @map.one 'features_loaded', (e) =>
                @map.fadeTo 0, 0
                @$el.empty().css(height: '100%').append @map
                @refresh().fadeTo 100, 1
                mapElementCache = @map
                @loaded = true

            if not @loaded
                @map.komooMap
                    type: 'preview'
                    mapType: 'roadmap'
                    zoom: 16
                    geojson: @model.get('geojson')
                    width: @options.width ? '244px'
                    height: @options.height ? '150px'

            else
                @map.komooMap('geojson', @model.get('geojson'))
            this


    return {
        internal: {
            SearchBoxView: SearchBoxView
        }
        Preview: Preview
    }
