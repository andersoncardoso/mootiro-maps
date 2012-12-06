define ['common'], () ->
  require ['analytics', 'facebook-jssdk'], (analytics, facebook) ->
    analytics.init()
    facebook.init KomooNS?.facebookAppId

  require ['moderation/moderation', 'lib/shortcut', 'utils'], () ->
    # loads scripts not refactored yet

  require ['jquery', 'backbone', 'authentication/router'], ($, Backbone, auth_router) ->
    $ ->
        loginApp = new  auth_router.LoginApp {}
        Backbone.history.start()
  {
    start: (module) ->
      if module?
        require [module]
  }
