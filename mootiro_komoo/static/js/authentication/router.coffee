define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reForm = require 'reForm'
  views = require './views'
  new_utils = require 'new_utils'


  class LoginApp extends Backbone.Router
    initialize: ->
      _.bindAll this, 'root', 'login'
      @selectors = @options?.loginRequired
      @loginView = new views.LoginView()
      @modalBox = new new_utils.ModalBox
        title: 'Login',
        content: @loginView.render().el,
        modal_id: 'login-modal-box'
        onClose: (evt) =>
          @navigate '', {trigger: true}

      # if @selectors?
      #   ??
      # else
      $("a.login-required").bind "click.loginrequired",  (ev) =>
        if not KomooNS?.isAuthenticated
          ev.stopPropagation()
          ev.stopImmediatePropagation()
          ev.preventDefault()
          # url = $(this).attr "href"
          # if (url.charAt(0) == "#")
          #     url = document.location.pathname + url
          @navigate 'login', {trigger: true}
          return false

    routes:
      '': 'root'
      'login': 'login'

    root: ->
      path = window.location.pathname
      if (path is '/user/login/' or path is '/user/login') \
         and not KomooNS?.isAuthenticated
        # $('#main-content').append @loginView.render().el
        @navigate 'login', {trigger: true}

    login: ->
      if not KomooNS?.isAuthenticated
        @modalBox.show()
      else
        @navigate '', {trigger: true}


  return {
    LoginApp: LoginApp
  }
