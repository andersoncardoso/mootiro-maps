define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reForm = require 'reForm'
  views = require './views'
  utils = require 'utils'


  class LoginApp extends Backbone.Router
    routes:
      'login(/)': 'login'
      'register(/)': 'register'
      'not-verified(/)': 'not_verified'
      'verified(/)': 'verified'

    initialize: () ->
      _.bindAll this
      @bindExternalEvents()

    initializeLogin: ->
      @loginView = new views.LoginView {}
      @loginView.form.on 'register-link:click', @registerLinkCB

      @loginBox = new utils.ModalBox
        title: i18n 'Login'
        content: @loginView.render().el
        modal_id: 'login-modal-box'

      # $("a.login-required").bind "click.loginrequired", (evt) =>
      #   if not KomooNS?.isAuthenticated
      #     evt.preventDefault()
      #     next = $(evt.target).attr "href"
      #     next = (document.location.pathname + next) if next?.charAt(0) is '#'
      #     @_loginRequired next
      #     return false

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
      Backbone.on 'auth::logout', @logout


    # ============ callbacks ======================
    registerLinkCB: ->
      @register()

    loginLinkCB: ->
      @login()

    registerFormOnSuccessCB: ->
      @not_verified()

    _loginRequired: (next)->
      if not KomooNS?.isAuthenticated
        if not @loginBox?
          @initializeLogin()
        @loginView.updateUrls(next) if next
        @login()

    # =========== routes ===========================
    login: ->
      @closeModals()
      if not KomooNS?.isAuthenticated
        if not @loginBox?
          @initializeLogin()
        @loginBox.open()

    logout: ->
      if not @logoutView
        @initializeLogout()
      @logoutView.logout()

    register: ->
      @closeModals()
      if not KomooNS?.isAuthenticated
        if not @registerBox?
          @initializeRegister()
        @registerBox.open()

    not_verified: ->
      @closeModals()
      if not @notVerifiedBox?
        @initializeVerification()
      @notVerifiedBox.open()

    verified: ->
      @closeModals()
      if not @verifiedBox?
        @initializeVerification()
      @verifiedBox.open()

    # ============= utils ==============================
    closeModals: ->
      modal?.close() for modal in [
        @loginBox, @registerBox, @verifiedBox, @notVerifiedBox]


  return {
      loginApp: new LoginApp {}
  }
