(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, LoginForm, LoginView, RegisterForm, RegisterView, SigninWidget, SignupWidget, SocialButton, SocialButtonsList, login_tpl, models, new_utils, reForm, register_tpl, signin_tpl, signup_tpl, social_btn_tpl, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    reForm = require('reForm');
    models = require('./models');
    new_utils = require('new_utils');
    login_tpl = require('text!templates/authentication/_login.html');
    register_tpl = require('text!templates/authentication/_register.html');
    social_btn_tpl = require('text!templates/authentication/_social_button.html');
    signup_tpl = require('text!templates/widgets/_signup.html');
    signin_tpl = require('text!templates/widgets/_signin.html');
    SocialButton = (function(_super) {

      __extends(SocialButton, _super);

      function SocialButton() {
        SocialButton.__super__.constructor.apply(this, arguments);
      }

      SocialButton.prototype.tagName = 'li';

      SocialButton.prototype.template = _.template(social_btn_tpl);

      SocialButton.prototype.initialize = function() {
        _.bindAll(this, 'render');
        this.className = this.options.provider;
        this.url = "" + this.options.url + "?next=" + (this.options.next || '');
        this.image_url = this.options.image_url;
        this.msg = this.options.message;
        return this.provider = this.options.provider;
      };

      SocialButton.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template({
          provider: this.provider,
          url: this.url,
          image_url: this.image_url,
          msg: this.msg
        });
        this.$el.html(renderedContent);
        this.$el.addClass(this.className);
        return this;
      };

      return SocialButton;

    })(Backbone.View);
    SocialButtonsList = (function(_super) {

      __extends(SocialButtonsList, _super);

      function SocialButtonsList() {
        SocialButtonsList.__super__.constructor.apply(this, arguments);
      }

      SocialButtonsList.prototype.tagName = 'ul';

      SocialButtonsList.prototype.id = 'external_providers';

      SocialButtonsList.prototype.initialize = function() {
        _.bindAll(this, 'render');
        return this.buttons = this.options.buttons;
      };

      SocialButtonsList.prototype.render = function() {
        var buttons,
          _this = this;
        buttons = this.buttons;
        $(this.el).html('');
        _.each(buttons, function(btn) {
          var btnView;
          btnView = new SocialButton(btn);
          return $(_this.el).append(btnView.render().el);
        });
        return this;
      };

      return SocialButtonsList;

    })(Backbone.View);
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
    LoginView = (function(_super) {

      __extends(LoginView, _super);

      function LoginView() {
        LoginView.__super__.constructor.apply(this, arguments);
      }

      LoginView.prototype.id = 'login_box';

      LoginView.prototype.tagName = 'section';

      LoginView.prototype.template = _.template(login_tpl);

      LoginView.prototype.initialize = function() {
        var next, _ref;
        _.bindAll(this, 'render', 'buildButtons', 'updateUrls');
        next = ((_ref = this.options) != null ? _ref.next : void 0) || '';
        this.buildButtons(next);
        this.loginModel = new models.LoginModel({});
        this.formView = new LoginForm({
          formId: 'form_login',
          model: this.loginModel
        });
        return this.authRegisterCB = this.options.authRegisterCB;
      };

      LoginView.prototype.render = function() {
        var renderedContent,
          _this = this;
        renderedContent = this.template({});
        this.$el.html(renderedContent);
        this.$el.find('.social_buttons').append(this.socialBtnsView.render().el);
        this.$el.find('.login_form').append(this.formView.render().el);
        this.$el.find('.auth-register').bind('click', function(evt) {
          evt.preventDefault();
          if (typeof _this.authRegisterCB === "function") _this.authRegisterCB();
          return false;
        });
        return this;
      };

      LoginView.prototype.buildButtons = function(next) {
        var facebookButton, googleButton;
        if (next == null) next = '';
        googleButton = {
          provider: 'google',
          url: dutils.urls.resolve('login_google'),
          next: next,
          image_url: '/static/img/login-google.png',
          message: 'Log In with Google'
        };
        facebookButton = {
          provider: 'facebook',
          url: dutils.urls.resolve('login_facebook'),
          next: next,
          image_url: '/static/img/login-facebook.png',
          message: 'Log In with Facebook'
        };
        return this.socialBtnsView = new SocialButtonsList({
          buttons: [googleButton, facebookButton]
        });
      };

      LoginView.prototype.updateUrls = function(next) {
        if (next == null) next = '';
        this.loginModel.set({
          next: next
        });
        this.buildButtons(next);
        this.render();
        return this;
      };

      return LoginView;

    })(Backbone.View);
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
    RegisterView = (function(_super) {

      __extends(RegisterView, _super);

      function RegisterView() {
        RegisterView.__super__.constructor.apply(this, arguments);
      }

      RegisterView.prototype.template = _.template(register_tpl);

      RegisterView.prototype.className = 'register';

      RegisterView.prototype.tagName = 'section';

      RegisterView.prototype.initialize = function() {
        var userModel;
        _.bindAll(this);
        userModel = new models.User({});
        this.registerForm = new RegisterForm({
          formId: 'form_register',
          submit_label: 'Register',
          model: userModel
        });
        return this.authLoginCB = this.options.authLoginCB;
      };

      RegisterView.prototype.render = function() {
        var renderedContent,
          _this = this;
        renderedContent = this.template({});
        this.$el.html(renderedContent);
        this.$el.find('.form-wrapper').append(this.registerForm.render().el);
        this.$el.find('.auth-login').bind('click', function(evt) {
          evt.preventDefault();
          if (typeof _this.authLoginCB === "function") _this.authLoginCB();
          return false;
        });
        return this;
      };

      return RegisterView;

    })(Backbone.View);
    return {
      LoginView: LoginView,
      RegisterView: RegisterView
    };
  });

}).call(this);
