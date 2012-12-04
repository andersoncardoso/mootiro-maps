define ['common'], () ->
  require ['analytics', 'facebook-jssdk'], (analytics, facebook) ->
    analytics.init()
    facebook.init KomooNS?.facebookAppId

  require ['moderation/moderation', 'lib/shortcut', 'komoo_search', 'utils', 'no-ie'], () ->
    # loads scripts not refactored yet

  {}
