define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  storage = require 'storage'

  pageManager = require 'core/page_manager'


  class App
    _.extend @prototype, Backbone.Events
    constructor: ->
      @initialized = new $.Deferred()
      $.when(
        @interceptAjaxRequests()
        @handleModulesError()
        @initializeUser()
        @initializeRouters()
        @initializeAnalytics()
      ).done =>
        $.when(
          @drawLayout()
          @initializeMapEditor()
        ).done =>
          @trigger 'initialize'
          @initialized.resolve true

    goTo: (url, page) ->
      $.when(pageManager.canClose()).done =>
        if page?
          @routers[0].navigate url
          pageManager.open page
        else
          @routers[0].navigate url, trigger: true

    handleModulesError: ->
      requirejs.onError = (err) =>
        if err.requireType == 'timeout'
          # TODO: i18n me
          alert "Timeout: Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente."
         else
           throw err
          @trigger 'error', err
      true

    interceptAjaxRequests: ->
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
      $(document).ajaxSend (event, xhr, settings) ->
        if not safeMethod(settings.type) and sameOrigin(settings.url)
          xhr.setRequestHeader "X-CSRFToken", storage.cookie.get('csrftoken')

      # Verify if the session id changed
      lastSessionId = storage.cookie.get 'sessionid'
      $(document).ajaxSuccess (event, xhr, settings) =>
        sessionId = storage.cookie.get 'sessionid'
        if sameOrigin(settings.url) and lastSessionId isnt sessionId
          @trigger 'change:session', sessionId
        lastSessionId = sessionId

      # Display the "working..." feedback while network requests are made
      $(document).ajaxStart => @trigger 'working'
      $(document).ajaxStop => @trigger 'done'
      true

    initializeUser: ->
      dfd = new $.Deferred()
      # Create the logged in user model
      require ['user/models'], (userModels) =>
        User = userModels.User
        if KomooNS.isAuthenticated
          KomooNS.user = new User KomooNS.user_data
        else
          KomooNS.user = new User {}

        # Update the logged in user if session changed
        @on 'change:session', (sessionId) ->
          KomooNS.user.clear()
          KomooNS.user.set 'id', 'me'
          KomooNS.user.fetch success: (model) ->
            KomooNS.isAuthenticated = model.get('id') isnt null
            model.trigger 'change'
        dfd.resolve true
      dfd.promise()

    drawLayout: ->
      dfd = new $.Deferred()
      require ['main/views'], (mainViews) =>
        # Create the facebook DOM element
        $('body').prepend $ '<div id="fb-root" />'

        # Draw layout blocks

        # Feedback block
        feedback = new mainViews.Feedback
          el: '#feedback-container'

        # Header block
        header = new mainViews.Header
          el: '#header-container'
          model: KomooNS.user

        # Footer block
        footer = new mainViews.Footer
          el: '#footer-container'
        true
        dfd.resolve true
      dfd.promise()

    initializeRouters: ->
      dfd = new $.Deferred()
      @routers = []
      $ =>
        # Start backbone routers
        require [
            'main/router',
            'authentication/router',
            'user/router'
            'map/router'
            'organizations/router',
            # Add your router module here
        ], =>
          # Instantiate all routers
          for router in arguments
            @routers.push new router

          window.routers = @routers

          Backbone.history.start
            pushState: true,
            root: '/'
          dfd.resolve true
      dfd.promise()

    initializeAnalytics: ->
      dfd = new $.Deferred()
      $ -> require ['services/analytics'], (analytics) ->
          dfd.resolve analytics.initialize()
      dfd.promise()

    initializeMapEditor: ->
      dfd = new $.Deferred()
      require ['main/views'], (mainViews) =>
        $('#map-editor-container').hide()
        @mapEditor = new mainViews.MapEditor
          el: '#map-editor-container'
        @mapEditor.once 'initialize', => dfd.resolve true
      dfd.promise()

    showMainMap: ->
      $.when(@initialized).done =>
        $('#map-editor-container').show()
        @mapEditor.getMap().refresh()

    hideMainMap: ->
      $.when(@initialize).done =>
        $('#map-editor-container').hide()
        @mapEditor.getMap().refresh()


  return {
    App: App
  }
