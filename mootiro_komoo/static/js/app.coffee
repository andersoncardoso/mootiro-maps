define (require) ->
  # Loading i18n to be available globally
  i18n = require 'i18n'

  $ = require 'jquery'
  Backbone = require 'backbone'

  # Draw layout blocks
  require ['main/header'], (Header) ->
    header = new Header
      el: '#header-container'

  require ['main/footer'], (Footer) ->
    footer = new Footer
      el: '#footer-container'

  # Start backbone routers
  require ['main/router', 'authentication/router', 'user/router'], ->
    $ ->
      Backbone.history.start({pushState: true, root: '/'})

  # Init google analytics
  $ ->
    require ['analytics'], (analytics) ->  analytics.init()

  # Init facebook sdk
  require ['facebook-jssdk'], (facebook) ->
    facebook.init KomooNS?.facebookAppId

  #TODO: move to the correct module
  Backbone.on 'map::see-on-map', (model) ->
    console?.log 'I should display this geojson on map:', model.get('geojson')

  {
    start: (module, arg) ->
      if module?
        require [module], (m) ->
          m?.start?(arg)
  }
