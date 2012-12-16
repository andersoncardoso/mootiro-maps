define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reForm = require 'reForm'
  views = require './views'
  utils = require 'utils'

  not_verif_tpl = require 'text!templates/authentication/_not_verified.html'
  verif_tpl = require 'text!templates/authentication/_verified.html'

  class LoginApp extends Backbone.Router
    routes:
      '': 'root'
      'login': 'login'
      'register': 'register'
      'not-verified': 'not_verified'
      'verified': 'verified'

    initialize: () ->
      _.bindAll this
      @initializeLogin()
      @initializeLogout()
      @initializeRegister()
      @initializeVerification()
      @bindExternalEvents()

    initializeLogin: ->
      @loginView = new views.LoginView {}
      @loginView.form.on 'register-link:click', @registerLinkCB

      @loginBox = new utils.ModalBox
        title: i18n 'Login'
        content: @loginView.render().el
        modal_id: 'login-modal-box'

      $("a.login-required").bind "click.loginrequired", (evt) =>
        if not KomooNS?.isAuthenticated
          evt.preventDefault()
          next = $(evt.target).attr "href"
          next = (document.location.pathname + next) if next?.charAt(0) is '#'
          @_loginRequired next
          return false

    initializeLogout: ->
      @logoutView = new views.LogoutView {}
      #@logoutView.bindLogoutButton()

    initializeRegister: ->
      @registerView = new views.RegisterView {}

      @registerView.form.on 'success', @registerFormOnSuccessCB
      @registerView.form.on 'login-link:click', @loginLinkCB

      @registerBox = new utils.ModalBox
        title: i18n 'Register'
        width: '450px'
        content: @registerView.render().el
        modal_id: 'register-modal-box'

    initializeVerification: ->
      @notVerifiedView = new views.VerificationView
        verified: no

      @verifiedView = new views.VerificationView
        verified: yes

      @verifiedView.loginForm.on 'register-link:click', @registerLinkCB

      @notVerifiedBox = new utils.ModalBox
        title: i18n 'Verification'
        content: @notVerifiedView.render().el
        modal_id: 'verification-modal-box'

      @verifiedBox = new utils.ModalBox
        title: i18n 'Verification'
        content: @verifiedView.render().el
        modal_id: 'verification-modal-box'

    bindExternalEvents: ->
      Backbone.on 'auth::loginRequired', @_loginRequired
      Backbone.on 'auth::logout', @logoutView.logout


    # ============ callbacks ======================
    registerLinkCB: ->
      @register()

    loginLinkCB: ->
      @login()

    registerFormOnSuccessCB: ->
      @not_verified()

    _loginRequired: (next)->
      if not KomooNS?.isAuthenticated
        @loginView.updateUrls(next) if next
        @login()

    # =========== routes ===========================
    root: ->
      @closeModals()
      Backbone.trigger 'main::root'
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
        @login()

    login: ->
      @closeModals()
      if not KomooNS?.isAuthenticated
        @loginBox.open()

    register: ->
      @closeModals()
      if not KomooNS?.isAuthenticated
        @registerBox.open()

    not_verified: ->
      @closeModals()
      path = window.location.pathname
      @notVerifiedBox.open()

    verified: ->
      @closeModals()
      path = window.location.pathname
      @verifiedBox.open()

    # ============= utils ==============================
    closeModals: ->
      modal.close() for modal in [
        @loginBox, @registerBox, @verifiedBox, @notVerifiedBox]


  return {
      loginApp: new LoginApp {}
  }
