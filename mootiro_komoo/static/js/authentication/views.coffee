define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reForm = require 'reForm'
  models = require './models'
  new_utils = require 'new_utils'

  # underscore templates
  login_tpl = require 'text!templates/authentication/_login.html'
  register_tpl = require 'text!templates/authentication/_register.html'
  social_btn_tpl = require 'text!templates/authentication/_social_button.html'
  signup_tpl = require 'text!templates/widgets/_signup.html'


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
      @url = @options.url
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
      $(@el).html ''

      _.each buttons, (btn) =>
        btnView = new SocialButton btn
        $(@el).append btnView.render().el
      this


  #
  # Simple widget for the Sign Up link
  # Used with reForm
  class SignupWidget extends reForm.Widget
    template: signup_tpl


  #
  # Form for Login, used internally on the LoginView
  class LoginForm extends reForm.Form
    fields: [
      {name: 'email', widget: reForm.commonWidgets.TextWidget, label: 'Email:'}
      {name: 'password', widget: reForm.commonWidgets.PasswordWidget, label:'Password:'}
      {name: 'signup', widget: SignupWidget, label: ' '}
    ]


  #
  # Public login view, it encapsulates the LoginForm and SocialButtonsList
  # Its intended to be rendered in a ModalBox, but works normally outside it.
  #
  class LoginView extends Backbone.View
    id: 'login_box'
    tagName: 'section'
    template: _.template login_tpl

    initialize: ->
      _.bindAll this, 'render'

      googleButton =
        provider: 'google',
        url: dutils.urls.resolve 'login_google'
        image_url: '/static/img/login-google.png'
        message: 'Log In with Google'

      facebookButton =
        provider: 'facebook',
        url: dutils.urls.resolve 'login_facebook'
        image_url: '/static/img/login-facebook.png'
        message: 'Log In with Facebook'

      @socialBtnsView = new SocialButtonsList
        buttons: [googleButton, facebookButton]

      loginModel = new models.LoginModel {}

      @formView = new LoginForm
        formId: 'form_login'
        model: loginModel

    render: ->
      renderedContent = @template {}
      @$el.html renderedContent
      @$el.find('.social_buttons').append @socialBtnsView.render().el
      @$el.find('.login_form').append @formView.render().el
      this

  #
  # Register Form
  class RegisterForm extends reForm.Form
    fields: [
      {
        name: 'name',
        widget: reForm.commonWidgets.TextWidget,
        label: 'Name'
      }
      {
        name: 'email',
        widget: reForm.commonWidgets.TextWidget,
        label: 'Email'
      }
      {
        name: 'password',
        widget: reForm.commonWidgets.PasswordWidget,
        label: 'Password'
      }
      {
        name: 'password_confirm',
        widget: reForm.commonWidgets.PasswordWidget,
        label: 'Password Confirmation'
      }
    ]


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
      @registerForm = new RegisterForm
        formId: 'form_register'
        model: userModel


    render: ->
      renderedContent = @template {}
      @$el.html renderedContent
      @$el.find('.form-wrapper').append @registerForm.render().el
      this


  return {
    LoginView: LoginView
    RegisterView: RegisterView
  }






