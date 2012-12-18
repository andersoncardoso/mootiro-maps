define (require) ->
  # Loading i18n to be available globally
  i18n = require 'i18n'

  $ = require 'jquery'
  Backbone = require 'backbone'

  # Create the facebook element
  $('body').prepend $ '<div id="fb-root" />'

  # Draw layout blocks
  require ['main/views'], (mainViews) ->
    feedbackView = new mainViews.Feedback()
    $('#feedback-container').append feedbackView.$el

    modelsWorking = 0
    Backbone.on 'app::working', (model) ->
      modelsWorking++
      feedbackView.display 'Working...'
    Backbone.on 'app::done', (model) ->
      if --modelsWorking is 0
        feedbackView.close()

    Backbone.trigger 'app::working'

    User = require('user/models').User

    header = new mainViews.Header
      el: '#header-container'
      model: new User KomooNS.user

    footer = new mainViews.Footer
      el: '#footer-container'

  $ ->
    # Start backbone routers
    require ['main/router', 'authentication/router', 'user/router'], ->
      Backbone.history.start({pushState: true, root: '/'})
      Backbone.trigger 'app::done'

    # Init google analytics
    require ['analytics'], (analytics) ->
      analytics.init()


  #TODO: move to the correct module
  Backbone.on 'map::see-on-map', (model) ->
    console?.log 'I should display this geojson on map:', model.get('geojson')
