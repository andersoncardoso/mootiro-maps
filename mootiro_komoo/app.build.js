({
    findNestedDependencies: true,

    appDir: '',
    baseUrl: '.build',
    dir: '.build/min',

    paths: {
        'jquery': '../static/lib/jquery-1.7.1.min',
        'underscore': '../static/lib/underscore-min',
        'backbone': '../static/lib/backbone-min',
        'reForm': '../static/lib/reForm',
        'async': '../static/lib/requirejs/async',
        'goog': '../static/lib/requirejs/goog',
        'propertyParser': '../static/lib/requirejs/propertyParser',
        'text': '../static/lib/requirejs/text',
        'templates': '../static/templates',
        'infobox': 'empty:',
        'markerclusterer': 'empty:',
        'dutils': 'empty:',
        'urls': 'empty:'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'reForm': {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'reForm'
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
                'facebook-jssdk',
                'map/controls',
                'map/maptypes',
                'map/providers',
                'map/maps',
                'map.jquery',
                'project/box',
                'project/model',
                'community/model'
            ],
            exclude: [
            ]
        }
    ],

    excludeShallow: [
    ]
})
