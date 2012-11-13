(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, LoginForm, LoginView, SignupWidget, SocialButton, SocialButtonsList, login_tpl, models, new_utils, reForm, signup_tpl, social_btn_tpl, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    reForm = require('reForm');
    models = require('./models');
    new_utils = require('new_utils');
    login_tpl = require('text!templates/authentication/_login.html');
    social_btn_tpl = require('text!templates/authentication/_social_button.html');
    signup_tpl = require('text!templates/widgets/_signup.html');
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
        this.url = this.options.url;
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
          widget: SignupWidget,
          label: ' '
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
        var facebookButton, googleButton, loginModel;
        _.bindAll(this, 'render');
        googleButton = {
          provider: 'google',
          url: dutils.urls.resolve('login_google'),
          image_url: '/static/img/login-google.png',
          message: 'Log In with Google'
        };
        facebookButton = {
          provider: 'facebook',
          url: dutils.urls.resolve('login_facebook'),
          image_url: '/static/img/login-facebook.png',
          message: 'Log In with Facebook'
        };
        this.socialBtnsView = new SocialButtonsList({
          buttons: [googleButton, facebookButton]
        });
        loginModel = new models.LoginModel({});
        return this.formView = new LoginForm({
          formId: 'form_login',
          model: loginModel
        });
      };

      LoginView.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template({});
        $(this.el).html(renderedContent);
        this.$el.find('.social_buttons').append(this.socialBtnsView.render().el);
        this.$el.find('.login_form').append(this.formView.render().el);
        return this;
      };

      return LoginView;

    })(Backbone.View);
    return {
      LoginView: LoginView
    };
  });

}).call(this);
