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


    require 'map.jquery'
    class Preview extends Backbone.View
        initialize: ->
            _.bindAll this
            @map = $('<div>')
            @render()

            Backbone.on 'module::error', (err) =>
                if @loading and err.message.indexOf 'goog!maps' > -1
                    @$el.html """<div class="loading">#{i18n('Map unavailable!')}</div>"""



        render: ->
            @loading = true
            @map.detach()
            @$el.html """<div class="loading">#{i18n('Loading...')}</div>"""
            @map.komooMap
                type: 'preview'
                mapType: 'roadmap'
                zoom: 16
                geojson: @model.get('geojson')
                width: @options.width ? '100%'
                height: @options.height ? '100%'

            @map.on 'loaded', =>
                @map.fadeTo 0, 0
                @$el.empty().css(height: '100%').append @map
                @map.komooMap('refresh').komooMap('center').fadeTo 100, 1
                @loading = false
            this


    return {
        internal: {
            SearchBoxView: SearchBoxView
        }
        Preview: Preview
    }
