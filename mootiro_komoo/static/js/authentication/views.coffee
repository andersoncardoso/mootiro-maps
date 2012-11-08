define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reForm = require 'reForm'
  login_tpl = require 'text!templates/authentication/_login.html'
  social_btn_tpl = require 'text!templates/authentication/_social_button.html'
  form_footer_tpl = require 'text!templates/authentication/_login_form_footer_widget.html'

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

  class LoginModel extends Backbone.Model
    urlRoot: '/login/'
    initialize: ->
      super

  class LoginFormFooterWidget extends reForm.Widget
    template: form_footer_tpl

  class LoginForm extends reForm.Form
    fields: [
      {name: 'email', widget: reForm.commonWidgets.TextWidget, label: 'Email:'}
      {name: 'password', widget: reForm.commonWidgets.PasswordWidget, label:'Password:'}
      {name: 'footer', widget: LoginFormFooterWidget, label: ' '}
    ]

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

      loginModel = new LoginModel {}

      @formView = new LoginForm
        formId: 'form_login'
        model: loginModel

    render: ->
      renderedContent = @template {}
      $(@el).html renderedContent
      @$el.find('.social_buttons').append @socialBtnsView.render().el
      @$el.find('.login_form').append @formView.render().el
      this

  return {
    LoginView: LoginView
  }






