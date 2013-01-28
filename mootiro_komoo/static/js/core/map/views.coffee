define (require) ->

    $ = require 'jquery'
    _ = require 'underscore'
    Backbone = require 'backbone'


    class SupportersView extends Backbone.View
        template: _.template require 'text!templates/map/_supporters.html'

        render: () ->
            @$el.html @template {}
            this


    class SearchBoxView extends Backbone.View
        template: _.template require 'text!templates/map/_searchbox.html'
        events:
            'click .search': 'onSearchBtnClick'
            'change .location-type': 'onTypeChange'

        render: () ->
            @$el.html @template {}
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


    return {
        SearchBoxView: SearchBoxView
        SupportersView: SupportersView
    }
