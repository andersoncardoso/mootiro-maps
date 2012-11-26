define (require) ->

  # $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  models = require './models'
  forms = require './forms'

  # underscore templates
  login_tpl = require 'text!templates/authentication/_login.html'
  register_tpl = require 'text!templates/authentication/_register.html'
  social_btn_tpl = require 'text!templates/authentication/_social_button.html'


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
    id: 'external_providers'

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
    id: 'login_box'
    tagName: 'section'
    template: _.template login_tpl

    initialize: ->
      _.bindAll this, 'render', 'buildButtons', 'updateUrls'

      next = @options?.next or ''
      @buildButtons(next)

      @loginModel = new models.LoginModel {}

      @formView = new forms.LoginForm
        formId: 'form_login'
        model: @loginModel

      if @options?.authRegisterCB
        @authRegisterCB = @options.authRegisterCB

    render: ->
      renderedContent = @template {}
      @$el.html renderedContent
      @$el.find('.social_buttons').append @socialBtnsView.render().el
      @$el.find('.login_form').append @formView.render().el

      @$el.find('.auth-register').bind 'click', (evt) =>
        evt.preventDefault()
        @authRegisterCB?()
        return false
      this

    buildButtons: (next='') ->
      googleButton =
        provider: 'google',
        url: dutils.urls.resolve 'login_google'
        next: next
        image_url: '/static/img/login-google.png'
        message: 'Log In with Google'

      facebookButton =
        provider: 'facebook',
        url: dutils.urls.resolve 'login_facebook'
        next: next
        image_url: '/static/img/login-facebook.png'
        message: 'Log In with Facebook'

      @socialBtnsView = new SocialButtonsList
        buttons: [googleButton, facebookButton]

    updateUrls: (next='') ->
      @loginModel.set {next: next}
      @buildButtons(next)
      @render()
      this

  #
  # RegisterView to be used with the LoginBox
  #
  class RegisterView extends Backbone.View
    template: _.template register_tpl
    className: 'register'
    tagName: 'section'

    initialize: ->
      _.bindAll this
      userModel = new models.User {}
      @registerForm = new forms.RegisterForm
        formId: 'form_register'
        submit_label: 'Register'
        model: userModel

      if @options.authLoginCB
        @authLoginCB = @options.authLoginCB


    render: ->
      renderedContent = @template {}
      @$el.html renderedContent
      @$el.find('.form-wrapper').append @registerForm.render().el

      @$el.find('.auth-login').bind 'click', (evt) =>
        evt.preventDefault()
        @authLoginCB?()
        return false
      this


  return {
    LoginView: LoginView
    RegisterView: RegisterView
  }






