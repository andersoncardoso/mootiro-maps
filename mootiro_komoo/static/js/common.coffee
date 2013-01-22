define (require) ->

  jQuery = require 'jquery'
  Backbone = require 'backbone'
  storage = require 'storage'


  handleModulesError = ->
    requirejs.onError = (err) ->
      if err.requireType == 'timeout'
        # TODO: i18n me
        alert "Timeout: Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente."
       else
         throw err

        Backbone.trigger 'error', err
    true

  interceptAjaxRequests = ->
    sameOrigin = (url) ->
      # url could be relative or scheme relative or absolute
      host = document.location.host  # host + port
      protocol = document.location.protocol
      sr_origin = '//' + host
      origin = protocol + sr_origin
      # Allow absolute or scheme relative URLs to same origin
      return (url is origin or url.slice(0, origin.length + 1) is origin + '/') or
        (url is sr_origin or url.slice(0, sr_origin.length + 1) is sr_origin + '/') or
        # or any other URL that isn't scheme relative or absolute
        # i.e relative.
        (not /^(\/\/|http:|https:).*/.test(url))

    safeMethod = (method) ->
      /^(GET|HEAD|OPTIONS|TRACE)$/.test(method)

    # Add csrf token to ajax requests
    jQuery(document).ajaxSend (event, xhr, settings) ->
      if not safeMethod(settings.type) and sameOrigin(settings.url)
        xhr.setRequestHeader "X-CSRFToken", storage.cookie.get('csrftoken')

    lastSessionId = storage.cookie.get 'sessionid'
    jQuery(document).ajaxSuccess (event, xhr, settings) ->
      sessionId = storage.cookie.get 'sessionid'
      if sameOrigin(settings.url) and lastSessionId isnt sessionId
        Backbone.trigger 'change:session', sessionId
      lastSessionId = sessionId

    jQuery(document).ajaxStart -> Backbone.trigger 'working'
    jQuery(document).ajaxStop -> Backbone.trigger 'done'

    true

  drawLayout = ->
    dfd = new $.Deferred()
    # Create the facebook DOM element
    $('body').prepend $ '<div id="fb-root" />'

    # Draw layout blocks
    require ['main/views'], (mainViews) ->
      feedbackView = new mainViews.Feedback()
      $('#feedback-container').append feedbackView.$el

      modelsWorking = 0
      Backbone.on 'working', ->
        modelsWorking++
        feedbackView.display 'Working...'
      Backbone.on 'done', ->
        if --modelsWorking is 0
          feedbackView.close()

      Backbone.trigger 'working'

      # Create the logged in user model
      # TODO: improve me
      User = require('user/models').User
      if KomooNS.isAuthenticated
        KomooNS.user = new User KomooNS.user_data
      else
        KomooNS.user = new User {}

      Backbone.on 'change:session', (sessionId) ->
        KomooNS.user.clear()
        KomooNS.user.set 'id', 'me'
        KomooNS.user.fetch(success: (model) ->
          KomooNS.isAuthenticated = model.get('id') isnt null
          model.trigger 'change'
        )

      header = new mainViews.Header
        el: '#header-container'
        model: KomooNS.user

      footer = new mainViews.Footer
        el: '#footer-container'
      dfd.resolve true

    dfd.promise()

  initializeRouters = ->
    dfd = new $.Deferred()
    $ ->
      # Start backbone routers
      require [
          'main/router',
          'authentication/router',
          'user/router'
          # Add your router module here
      ], ->
        Backbone.history.start({pushState: true, root: '/'})
        Backbone.trigger 'done'
        dfd.resolve true
    dfd.promise()


  initializeAnalytics = ->
    dfd = new $.Deferred()
    $ -> require ['services/analytics'], (analytics) ->
        analytics.init()
        dfd.resolve true
    dfd.promise()


  initializeApp = ->
    # Loading i18n to be available globally
    i18n = require 'i18n'

    $.when(
      handleModulesError()
      interceptAjaxRequests()
      drawLayout()
      initializeRouters()
      initializeAnalytics()
    ).done ->
      Backbone.trigger 'initialize'


  return {
      initializeApp: initializeApp
  }
