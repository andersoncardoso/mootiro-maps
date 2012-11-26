(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, LoginView, RegisterView, SocialButton, SocialButtonsList, forms, login_tpl, models, register_tpl, social_btn_tpl, _;
    _ = require('underscore');
    Backbone = require('backbone');
    models = require('./models');
    forms = require('./forms');
    login_tpl = require('text!templates/authentication/_login.html');
    register_tpl = require('text!templates/authentication/_register.html');
    social_btn_tpl = require('text!templates/authentication/_social_button.html');
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
        this.$el.html('');
        _.each(buttons, function(btn) {
          var btnView;
          btnView = new SocialButton(btn);
          return _this.$el.append(btnView.render().el);
        });
        return this;
      };

      return SocialButtonsList;

    })(Backbone.View);
    LoginView = (function(_super) {

      __extends(LoginView, _super);

      function LoginView() {
        LoginView.__super__.constructor.apply(this, arguments);
      }

      LoginView.prototype.id = 'login_box';

      LoginView.prototype.tagName = 'section';

      LoginView.prototype.template = _.template(login_tpl);

      LoginView.prototype.initialize = function() {
        var next, _ref, _ref2;
        _.bindAll(this, 'render', 'buildButtons', 'updateUrls');
        next = ((_ref = this.options) != null ? _ref.next : void 0) || '';
        this.buildButtons(next);
        this.loginModel = new models.LoginModel({});
        this.formView = new forms.LoginForm({
          formId: 'form_login',
          model: this.loginModel
        });
        if ((_ref2 = this.options) != null ? _ref2.authRegisterCB : void 0) {
          return this.authRegisterCB = this.options.authRegisterCB;
        }
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
        this.registerForm = new forms.RegisterForm({
          formId: 'form_register',
          submit_label: 'Register',
          model: userModel
        });
        if (this.options.authLoginCB) {
          return this.authLoginCB = this.options.authLoginCB;
        }
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
