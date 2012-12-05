define ['common'], () ->
  require ['analytics', 'facebook-jssdk'], (analytics, facebook) ->
    analytics.init()
    facebook.init KomooNS?.facebookAppId

  require ['moderation/moderation', 'lib/shortcut', 'utils'], () ->
    # loads scripts not refactored yet

  {}
