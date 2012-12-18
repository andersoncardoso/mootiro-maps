({
    findNestedDependencies: true,

    appDir: '',
    baseUrl: '.build',
    dir: '.build/min',

    paths: {
        'jquery': '../static/lib/jquery-1.7.1.min',
        'underscore': '../static/lib/underscore-min',
        'backbone': '../static/lib/backbone-min',
        'backbone.paginator': '../static/lib/backbone.paginator.min',
        'reForm': '../static/lib/reForm',
        'async': '../static/lib/requirejs/async',
        'goog': '../static/lib/requirejs/goog',
        'propertyParser': '../static/lib/requirejs/propertyParser',
        'text': '../static/lib/requirejs/text',
        'templates': '../static/templates',
        'infobox': 'empty:',
        'markerclusterer': 'empty:',
        'dutils': '../static/lib/django-js-utils/dutils',
        'urls': '../static/lib/django-js-utils/dutils.conf.urls'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.paginator': {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        'reForm': {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'reForm'
        },
        'dutils': {
            exports: 'dutils'
        },
        'urls': {
            deps: ['dutils'],
            exports: 'dutils.urls'
        }
    },
    modules: [
        // Common dependencies used by the entire project
        {
            name: 'common',
            include: [
                'i18n',
                'app',
                'googlemaps',
                'analytics',
                'facebook',
                'map/controls',
                'map/maptypes',
                'map/providers',
                'map/maps',
                'map.jquery',
            ],
            exclude: [
            ]
        }
    ],

    excludeShallow: [
    ]
})
