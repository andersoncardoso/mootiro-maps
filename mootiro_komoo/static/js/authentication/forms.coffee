define (require) ->

  reForm = require 'reForm'

  # underscore templates
  signup_tpl = require 'text!templates/widgets/_signup.html'
  signin_tpl = require 'text!templates/widgets/_signin.html'


  #
  # Simple widget for the Sign Up link
  # Used with reForm
  class SignupWidget extends reForm.Widget
    template: signup_tpl

  #
  # Simple widget for the Sign In link
  # Used with reForm
  class SigninWidget extends reForm.Widget
    template: signin_tpl

  #
  # Form for Login, used internally on the LoginView
  class LoginForm extends reForm.Form
    fields: [
      {
        name: 'email',
        widget: reForm.commonWidgets.TextWidget,
        label: 'Email:'
      }
      {
        name: 'password',
        widget: reForm.commonWidgets.PasswordWidget,
        label:'Password:'
      }
      {
        name: 'signup',
        widget: SignupWidget,
      }
    ]

  #
  # Register Form
  class RegisterForm extends reForm.Form
    fields: [
      {
        name: 'name'
        widget: reForm.commonWidgets.TextWidget
        label: 'Name'
      }
      {
        name: 'email'
        widget: reForm.commonWidgets.TextWidget
        label: 'Email'
      }
      {
        name: 'password'
        widget: reForm.commonWidgets.PasswordWidget
        label: 'Password'
        container_class: 'half-box-left'
      }
      {
        name: 'password_confirm'
        widget: reForm.commonWidgets.PasswordWidget
        label: 'Password Confirmation'
        container_class: 'half-box-right'
      }
      {
        name: 'license'
        widget: reForm.commonWidgets.CheckboxWidget
        args:
          choices: [
            {value: 'agree', title: 'I\'ve read and accept the <a href="http://mootiro.org/terms">License Terms.</a>' }
          ]
      }
      {
        name: 'signin'
        widget: SigninWidget
      }
    ]

  return {
    LoginForm: LoginForm
    RegisterForm: RegisterForm
  }


