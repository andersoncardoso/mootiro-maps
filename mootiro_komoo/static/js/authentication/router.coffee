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
      @initializeLogout()
      @initializeRegister()
      @initializeVerification()

    initializeLogin: ->
      @loginView = new views.LoginView {}
      @loginView.form.on 'register-link:click', @registerLinkCB

      @loginBox = new new_utils.ModalBox
        title: i18n 'Login'
        content: @loginView.render().el
        modal_id: 'login-modal-box'
        onClose: =>
          @navigate '', {}

      $("a.login-required").bind "click.loginrequired", (evt) =>
        if not KomooNS?.isAuthenticated
          evt.preventDefault()
          next = $(evt.target).attr "href"
          next = (document.location.pathname + next) if next?.charAt(0) is '#'
          @loginView.updateUrls(next) if next
          @navigate 'login', {trigger: true}
          return false

    initializeLogout: ->
      @logoutView = new views.LogoutView {}
      @logoutView.bindLogoutButton()

    initializeRegister: ->
      @registerView = new views.RegisterView {}

      @registerView.form.on 'success', @registerFormOnSuccessCB
      @registerView.form.on 'login-link:click', @loginLinkCB

      @registerBox = new new_utils.ModalBox
        title: i18n 'Register'
        width: '450px'
        content: @registerView.render().el
        modal_id: 'register-modal-box'
        onClose: =>
          @navigate '', {}

    initializeVerification: ->
      @notVerifiedView = new views.VerificationView
        verified: no

      @verifiedView = new views.VerificationView
        verified: yes

      @verifiedView.loginForm.on 'register-link:click', @registerLinkCB

      @notVerifiedBox = new new_utils.ModalBox
        title: i18n 'Verification'
        content: @notVerifiedView.render().el
        modal_id: 'verification-modal-box'
        onClose: =>
          @navigate '', {}

      @verifiedBox = new new_utils.ModalBox
        title: i18n 'Verification'
        content: @verifiedView.render().el
        modal_id: 'verification-modal-box'
        onClose: =>
          @navigate '', {}

    # ============ callbacks ======================
    registerLinkCB: ->
      @navigate 'register', {trigger: true}

    loginLinkCB: ->
      @navigate 'login', {trigger: true}

    registerFormOnSuccessCB: ->
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
      @closeModals 'login'
      if not KomooNS?.isAuthenticated
        @loginBox.show()
      else
        @navigate '', {trigger: true}

    register: ->
      @closeModals 'register'
      if not KomooNS?.isAuthenticated
        @registerBox.show()
      else
        @navigate '', {trigger: true}

    not_verified: ->
      @closeModals 'not-verified'
      path = window.location.pathname
      @notVerifiedBox.show()

    verified: ->
      @closeModals 'verified'
      path = window.location.pathname
      @verifiedBox.show()

    # ============= utils ==============================
    closeModals: (navigation_target)->
      modal.hide() for modal in [
        @loginBox, @registerBox, @verifiedBox, @notVerifiedBox]
      @navigate navigation_target


  return {
    LoginApp: LoginApp
  }
