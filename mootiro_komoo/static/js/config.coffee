# -*- no-wrap -*-
baseUrl = KomooNS?.require_baseUrl ? '/static/js'

config =
    baseUrl: baseUrl
    waitSeconds: 30
    paths:
        'lib': '../lib'
        'text': '../lib/requirejs/text'
        'templates': '../templates'
        'ad-gallery': '../ad_gallery/jquery.ad-gallery.min'
        'jquery': '../lib/jquery-1.7.1.min'
        'underscore': '../lib/underscore-min'
        'backbone': '../lib/backbone-min'
        'reForm': '../lib/reForm'
        'async': '../lib/requirejs/async'
        'goog': '../lib/requirejs/goog'
        'propertyParser': '../lib/requirejs/propertyParser'
        'infobox': 'vendor/infobox_packed'
        'markerclusterer': 'vendor/markerclusterer_packed'
        'sinon': '../lib/sinon-1.5.0'
    shim:
        'ad-gallery':
            deps: ['jquery']
        'utils':
            deps: ['jquery']
        'underscore':
            exports: '_'
        'backbone':
            deps: ['underscore', 'jquery']
            exports: 'Backbone'
        'reForm':
            deps: ['jquery', 'underscore', 'backbone']
            exports: 'reForm'
        'infobox':
            deps: ['googlemaps']
            exports: 'InfoBox'
        'markerclusterer':
            deps: ['googlemaps']
            exports: 'MarkerClusterer'
        'sinon':
            exports: 'sinon'
    deps: [
        'i18n'
    ]

requirejs?.config config
require ?= config
