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
  authRouter = require 'authentication/router'
  $ ->
    loginApp = new authRouter.LoginApp {}
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
