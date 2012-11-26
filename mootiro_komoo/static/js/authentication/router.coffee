define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reForm = require 'reForm'
  views = require './views'
  new_utils = require 'new_utils'

  not_verif_tpl = require 'text!templates/authentication/_not_verified.html'
  verif_tpl = require 'text!templates/authentication/_verified.html'

  class LoginApp extends Backbone.Router
    routes:
      '': 'root'
      'login': 'login'
      'register': 'register'
      'not-verified': 'not_verified'
      'verified': 'verified'

    initialize: ->
      _.bindAll this
      @initializeLogin()
      @initializeRegister()
      @initializeConfirmation()

    initializeLogin: ->
      @loginView = new views.LoginView {}
      @loginView.form.on 'register-link:click', @registerLinkCB

      @loginBox = new new_utils.ModalBox
        title: 'Login',
        content: @loginView.render().el,
        modal_id: 'login-modal-box'
        onClose: (evt) =>
          @navigate '', {trigger: true}

      $("a.login-required").bind "click.loginrequired", (evt) =>
        if not KomooNS?.isAuthenticated
          evt.preventDefault()
          next = $(evt.target).attr "href"
          next = (document.location.pathname + next) if next?.charAt(0) is '#'
          @loginView.updateUrls(next) if next
          @navigate 'login', {trigger: true}
          return false

    initializeRegister: ->
      @registerView = new views.RegisterView {}

      @registerView.form.on 'success', @registerFormOnSuccessCB
      @registerView.form.on 'login-link:click', @loginLinkCB

      @registerBox = new new_utils.ModalBox
        title: 'Register'
        width: '450px'
        content: @registerView.render().el
        modal_id: 'register-modal-box'
        onClose: (evt) =>
          @navigate '', {trigger: true}

    initializeConfirmation: ->
      @notVerifiedView = new views.ConfirmationView
        verified: false

      @verifiedView = new views.ConfirmationView
        verified: true

      @notVerifiedBox = new new_utils.ModalBox
        title: 'Confirmation',
        content: @notVerifiedView.render().el,
        modal_id: 'confirmation-modal-box'

      @verifiedBox = new new_utils.ModalBox
        title: 'Confirmation',
        content: @verifiedView.render().el,
        modal_id: 'confirmation-modal-box'

    # ============ callbacks ======================
    registerLinkCB: ->
      @loginBox.hide()
      @navigate 'register', {trigger: true}

    loginLinkCB: ->
      @registerBox.hide()
      @navigate 'login', {trigger: true}

    registerFormOnSuccessCB: ->
      @registerBox.hide()
      @navigate 'not-verified', {trigger: true}

    # =========== routes ===========================
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

    not_verified: ->
      path = window.location.pathname
      @notVerifiedBox.show()

    verified: ->
      path = window.location.pathname
      @verifiedBox.show()


  return {
    LoginApp: LoginApp
  }
