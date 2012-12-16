define (require) ->

  # $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  models = require './models'
  forms = require './forms'
  dutils = require 'urls'

  # underscore templates
  login_tpl = require 'text!templates/authentication/_login.html'
  register_tpl = require 'text!templates/authentication/_register.html'
  social_btn_tpl = require 'text!templates/authentication/_social_button.html'
  not_verif_tpl = require 'text!templates/authentication/_not_verified.html'
  verif_tpl = require 'text!templates/authentication/_verified.html'


  #
  # View for Social Login Buttons (like Google or Facebook)
  # usage:
  #   socialBtn = new SocialButton
  #       provider: 'provider-name'
  #       url: 'provider/login/url/'
  #       image_url: 'url/for/the/button/image'
  #       msg: 'message on the button, consider i18n'
  #
  class SocialButton extends Backbone.View
    tagName: 'li'
    template: _.template social_btn_tpl

    initialize: ->
      _.bindAll this, 'render'
      @className = @options.provider
      @url = "#{@options.url}?next=#{@options.next or ''}"
      @image_url = @options.image_url
      @msg = @options.message
      @provider = @options.provider


    render: ->
      renderedContent = @template {
        provider: @provider
        url: @url
        image_url: @image_url
        msg: @msg
      }
      @$el.html renderedContent
      @$el.addClass @className
      this


  #
  # Receives a list of objects to be passed to SocialButton constructor and
  # render these on a nice list.
  # usage:
  #     btnsList = new SocialButtonsList
  #         buttons: [
  #           {provider: ..., url: ..., image_url: ..., msg: ...}
  #           {provider: ..., url: ..., image_url: ..., msg: ...}
  #         ]
  class SocialButtonsList extends Backbone.View
    tagName: 'ul'
    className: 'external_providers'

    initialize: ->
      _.bindAll this, 'render'
      @buttons = @options.buttons

    render: ->
      buttons = @buttons
      @$el.html ''

      _.each buttons, (btn) =>
        btnView = new SocialButton btn
        @$el.append btnView.render().el
      this


  #
  # Public login view, it encapsulates the LoginForm and SocialButtonsList
  # Its intended to be rendered in a ModalBox, but works normally outside it.
  #
  class LoginView extends Backbone.View
    className: 'login_box'
    tagName: 'section'
    template: _.template login_tpl

    initialize: ->
      _.bindAll this #, 'render', 'buildButtons', 'updateUrls'

      next = @options?.next or ''
      @buildButtons(next)

      @model = new models.LoginModel({})

      @form = new forms.LoginForm
        formId: 'form_login'
        model: @model

    render: ->
      renderedContent = @template {}
      @$el.html renderedContent
      @$el.find('.social_buttons').append @socialBtnsView.render().el
      @$el.find('.login_form').append @form.render().el
      this

    buildButtons: (next='') ->
      googleButton =
        provider: 'google',
        url: dutils.urls.resolve 'login_google'
        next: next
        image_url: '/static/img/login-google.png'
        message: i18n 'Log In with Google'

      facebookButton =
        provider: 'facebook',
        url: dutils.urls.resolve 'login_facebook'
        next: next
        image_url: '/static/img/login-facebook.png'
        message: i18n 'Log In with Facebook'

      @socialBtnsView = new SocialButtonsList
        buttons: [googleButton, facebookButton]

    updateUrls: (next='') ->
      @model.set {next: next}
      @buildButtons(next)
      @render()
      this


  #
  # Logout View to bind the .logout-btn on upper-bar.html
  class LogoutView extends Backbone.View
    initialize: (@options) ->
      _.bindAll this
      @model = new models.LogoutModel {}

    logout: (next) ->
      @model.doLogout next

    bindLogoutButton: ->
      $('.logout').click (evt) =>
        evt.preventDefault()
        next = $(evt.target).attr "href"
        next = (document.location.pathname + next) if next?.charAt(0) is '#'
        @logout next
        return false

  #
  # RegisterView to be used with the LoginBox
  #
  class RegisterView extends Backbone.View
    template: _.template register_tpl
    className: 'register'
    tagName: 'section'

    initialize: ->
      _.bindAll this
      user = new models.User {}

      @form = new forms.RegisterForm
        formId: 'form_register'
        submit_label: i18n 'Register'
        model: user

    render: ->
      renderedContent = @template {}
      @$el.html renderedContent
      @$el.find('.form-wrapper').append @form.render().el
      this

  #
  # Verification view for user email confirmation
  # can receive a `verified` boolean that determines which template
  # it renders.
  # usage:
  #     verifiedView = new VerificationView({verified: true})
  #     notVerifiedView = new VerificationView({verified: false})
  #
  class VerificationView extends Backbone.View
    initialize: ->
      _.bindAll this
      @verified = @options.verified
      if @verified
        @template = _.template verif_tpl
        @loginModel = new models.LoginModel({})
        @loginForm = new forms.LoginForm
          model: @loginModel
      else
        @template = _.template not_verif_tpl

    render: ->
      renderedContent = @template {}
      @$el.html renderedContent
      if @verified
        @$el.find('.login-form-box').append @loginForm.render().el
      this



  return {
    LoginView: LoginView
    LogoutView: LogoutView
    RegisterView: RegisterView
    VerificationView: VerificationView
  }






