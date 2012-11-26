define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reForm = require 'reForm'
  views = require './views'
  new_utils = require 'new_utils'


  class LoginApp extends Backbone.Router
    initialize: ->
      _.bindAll this, 'root', 'login', 'authRegisterCB', 'authLoginCB'

      # login
      @loginView = new views.LoginView
        authRegisterCB: @authRegisterCB

      @loginBox = new new_utils.ModalBox
        title: 'Login',
        content: @loginView.render().el,
        modal_id: 'login-modal-box'
        onClose: (evt) =>
          @navigate '', {trigger: true}

      $("a.login-required").bind "click.loginrequired", (evt) =>
        if not KomooNS?.isAuthenticated
          evt.stopPropagation()
          evt.stopImmediatePropagation()
          evt.preventDefault()
          next = $(evt.target).attr "href"
          if next?.charAt(0) is "#"
              next = document.location.pathname + next
          if next
            @loginView.updateUrls next
          @navigate 'login', {trigger: true}
          return false

      # register
      @registerView = new views.RegisterView
        authLoginCB: @authLoginCB

      @registerBox = new new_utils.ModalBox
        title: 'Register'
        width: '450px'
        content: @registerView.render().el
        modal_id: 'register-modal-box'
        onClose: (evt) =>
          @navigate '', {trigger: true}

    authRegisterCB: ->
      @loginBox.hide()
      @navigate 'register', {trigger: true}

    authLoginCB: ->
      @registerBox.hide()
      @navigate 'login', {trigger: true}

    routes:
      '': 'root'
      'login': 'login'
      'register': 'register'

    root: ->
      path = window.location.pathname
      if (path is '/user/' or path is '/user') \
         and not KomooNS?.isAuthenticated

        url = window.location
        if url.search and url.search.indexOf('next') > -1
          # get search parameters into a object
          queryString = {}
          url.search.replace new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            ($0, $1, $2, $3) -> queryString[$1] = $3
          next = queryString['next']
          @loginView.updateUrls next
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
