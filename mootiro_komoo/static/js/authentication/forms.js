(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var LoginForm, RegisterForm, SigninWidget, SignupWidget, reForm, signin_tpl, signup_tpl;
    reForm = require('reForm');
    signup_tpl = require('text!templates/widgets/_signup.html');
    signin_tpl = require('text!templates/widgets/_signin.html');
    SignupWidget = (function(_super) {

      __extends(SignupWidget, _super);

      function SignupWidget() {
        SignupWidget.__super__.constructor.apply(this, arguments);
      }

      SignupWidget.prototype.template = signup_tpl;

      return SignupWidget;

    })(reForm.Widget);
    SigninWidget = (function(_super) {

      __extends(SigninWidget, _super);

      function SigninWidget() {
        SigninWidget.__super__.constructor.apply(this, arguments);
      }

      SigninWidget.prototype.template = signin_tpl;

      return SigninWidget;

    })(reForm.Widget);
    LoginForm = (function(_super) {

      __extends(LoginForm, _super);

      function LoginForm() {
        LoginForm.__super__.constructor.apply(this, arguments);
      }

      LoginForm.prototype.fields = [
        {
          name: 'email',
          widget: reForm.commonWidgets.TextWidget,
          label: 'Email:'
        }, {
          name: 'password',
          widget: reForm.commonWidgets.PasswordWidget,
          label: 'Password:'
        }, {
          name: 'signup',
          widget: SignupWidget
        }
      ];

      return LoginForm;

    })(reForm.Form);
    RegisterForm = (function(_super) {

      __extends(RegisterForm, _super);

      function RegisterForm() {
        RegisterForm.__super__.constructor.apply(this, arguments);
      }

      RegisterForm.prototype.fields = [
        {
          name: 'name',
          widget: reForm.commonWidgets.TextWidget,
          label: 'Name'
        }, {
          name: 'email',
          widget: reForm.commonWidgets.TextWidget,
          label: 'Email'
        }, {
          name: 'password',
          widget: reForm.commonWidgets.PasswordWidget,
          label: 'Password',
          container_class: 'half-box-left'
        }, {
          name: 'password_confirm',
          widget: reForm.commonWidgets.PasswordWidget,
          label: 'Password Confirmation',
          container_class: 'half-box-right'
        }, {
          name: 'license',
          widget: reForm.commonWidgets.CheckboxWidget,
          args: {
            choices: [
              {
                value: 'agree',
                title: 'I\'ve read and accept the <a href="http://mootiro.org/terms">License Terms.</a>'
              }
            ]
          }
        }, {
          name: 'signin',
          widget: SigninWidget
        }
      ];

      return RegisterForm;

    })(reForm.Form);
    return {
      LoginForm: LoginForm,
      RegisterForm: RegisterForm
    };
  });

}).call(this);
