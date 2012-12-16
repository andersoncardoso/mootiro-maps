define (require) ->
  require 'common'
  $ = require 'jquery'
  Backbone = require 'backbone'

  # Draw layout blocks
  Header = require 'main/header'
  header = new Header
    el: '#header-container'

  Footer = require 'main/footer'
  footer = new Footer
    el: '#footer-container'

  # Start backbone routers
  mainRouter = require 'main/router'
  authRouter = require 'authentication/router'
  userRouter = require 'user/router'
  $ ->
    Backbone.history.start({pushState: true, root: '/'})

  # Init google analytics
  analytics = require 'analytics'
  analytics.init()

  # Init facebook sdk
  facebook = require 'facebook-jssdk'
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
