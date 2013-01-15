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


    class Preview extends Backbone.View
        initialize: ->
            require ['map.jquery'], =>
                @map = @$el.komooMap
                    type: 'preview'
                    width: @options.width ? '244px'
                    height: @options.height ? '175px'
                    geojson: @model.get 'geojson'
                @render()

        render: ->


    return {
        internal: {
            SearchBoxView: SearchBoxView
        }
        Preview: Preview
    }
