define (require) ->

    $ = require 'jquery'

    (($) ->
        methods =
            init: (options) ->
                @each ->
                    $this = $(this)
                    $this.addClass 'komoo-map-googlemap'  # Reverts bootstraps css rules
                    opts = $.extend {element: $this.get(0)}, $.fn.komooMap.defaults, options
                    if opts.width? then $this.width opts.width
                    if opts.height? then $this.height opts.height
                    if opts?.type is 'preview' and not opts?.geojson?.features?[0]?.geometry and not opts?.force
                        $this.html $('<div>').addClass('placeholder').text('Informação geométrica não disponível')
                        # FIXME
                        $this.parent().parent().find('.see-on-map').hide()
                        return
                    require ['core/map/maps'], (maps) =>
                        map = maps.makeMap opts
                        map.subscribe 'features_loaded', (features) =>
                            $this.trigger 'features_loaded', features
                        $this.data 'map', map
                        if opts.mapType? then map.googleMap.setMapTypeId opts.mapType


            edit: (feature) ->
                $(this).data('map')?.editFeature feature
                $(this)

            geojson: (geojson) ->
                if not geojson?
                    $(this).data('map')?.getGeoJson()
                else
                    $(this).data('map')?.loadGeoJson geojson

            goTo: (opts) ->
                $(this).data('map')?.panTo opts.position ? opts.address, opts.displayMarker
                $(this)

            highlight: (opts) ->
                $(this).data('map')?.highlightFeature opts.type, opts.id
                $(this)

            resize: ->
                $(window).resize()
                $(this)

            refresh: ->
                $(this).data('map')?.refresh()
                $(this)

            fit: ->
                $(this).data('map')?.fitBounds()
                $(this)

            center: ->
                map = $(this).data('map')
                map?.googleMap.setCenter(map?.features.getCenter())
                $(this)

            remove: ->
                $(this).data('map')?.remove()
                $(this).empty()
                $(this).html ''
                $(this).remove()
                $(this)

            clear: ->
                $(this).data('map')?.clear()
                $(this)


        $.fn.komooMap = (method) ->
            if methods[method]
                methods[method].apply this, Array.prototype.slice.call(arguments, 1)
            else if typeof method is 'object' or not method
                methods.init.apply this, arguments
            else
                $.error "Method #{method} does not exist on jQuery.komooMap"

        $.fn.komooMap.defaults =
            type: 'editor'
    )($)
