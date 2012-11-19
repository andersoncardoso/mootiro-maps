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

      # login
      @loginView = new views.LoginView()
      @loginBox = new new_utils.ModalBox
        title: 'Login',
        content: @loginView.render().el,
        modal_id: 'login-modal-box'
        onClose: (evt) =>
          @navigate '', {trigger: true}

      $("a.login-required").bind "click.loginrequired",  (evt) =>
        if not KomooNS?.isAuthenticated
          evt.stopPropagation()
          evt.stopImmediatePropagation()
          evt.preventDefault()
          # url = $(this).attr "href"
          # if (url.charAt(0) == "#")
          #     url = document.location.pathname + url
          @navigate 'login', {trigger: true}
          return false

      # register
      # @registerView = new views.NewUserView()
      @registerBox = new new_utils.ModalBox
        title: 'Register'
        # content: @registerView.render().el
        content: $('<div>Register modal box</div>')
        modal_id: 'register-modal-box'
        onClose: (evt) =>
          @navigate '', {trigger: true}

      @loginView.$el.find('.auth-register').bind 'click', (evt) =>
        evt.stopPropagation()
        evt.stopImmediatePropagation()
        evt.preventDefault()
        @loginBox.hide()
        @navigate 'register', {trigger: true}
        return false

    routes:
      '': 'root'
      'login': 'login'
      'register': 'register'

    root: ->
      path = window.location.pathname
      if (path is '/user/login/' or path is '/user/login') \
         and not KomooNS?.isAuthenticated
        # $('#main-content').append @loginView.render().el
        @navigate 'login', {trigger: true}

    login: ->
      if not KomooNS?.isAuthenticated
        @loginBox.show()
      else
        @navigate '', {trigger: true}

    register: ->
      if not KomooNS?.isAuthenticated
        @registerBox.show()
      else
        @navigate '', {trigger: true}


  return {
    LoginApp: LoginApp
  }
