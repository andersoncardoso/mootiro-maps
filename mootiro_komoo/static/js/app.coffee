define (require) ->
  require 'common'
  $ = require 'jquery'
  Backbone = require 'backbone'

  # Event aggregator
  vent = require 'event_aggregator'

  # Draw layout blocks
  Header = require 'main/header'
  header = new Header
    el: '#header-container'
    vent: vent

  Footer = require 'main/footer'
  footer = new Footer
    el: '#footer-container'
    vent: vent

  # Start backbone routers
  authRouter = require 'authentication/router'
  $ ->
    loginApp = new authRouter.LoginApp
      vent: vent
    Backbone.history.start()

  # Init google analytics
  analytics = require 'analytics'
  analytics.init()

  # Init facebook sdk
  facebook = require 'facebook-jssdk'
  facebook.init KomooNS?.facebookAppId

  {
    start: (module) ->
      if module?
        require [module]
  }
