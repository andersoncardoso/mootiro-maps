(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, LoginView, LogoutView, RegisterView, SocialButton, SocialButtonsList, VerificationView, forms, login_tpl, models, not_verif_tpl, register_tpl, social_btn_tpl, verif_tpl, _;
    _ = require('underscore');
    Backbone = require('backbone');
    models = require('./models');
    forms = require('./forms');
    login_tpl = require('text!templates/authentication/_login.html');
    register_tpl = require('text!templates/authentication/_register.html');
    social_btn_tpl = require('text!templates/authentication/_social_button.html');
    not_verif_tpl = require('text!templates/authentication/_not_verified.html');
    verif_tpl = require('text!templates/authentication/_verified.html');
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
        var next, _ref;
        _.bindAll(this, 'render', 'buildButtons', 'updateUrls');
        next = ((_ref = this.options) != null ? _ref.next : void 0) || '';
        this.buildButtons(next);
        this.model = new models.LoginModel({});
        return this.form = new forms.LoginForm({
          formId: 'form_login',
          model: this.model
        });
      };

      LoginView.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template({});
        this.$el.html(renderedContent);
        this.$el.find('.social_buttons').append(this.socialBtnsView.render().el);
        this.$el.find('.login_form').append(this.form.render().el);
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
          message: i18n('Log In with Google')
        };
        facebookButton = {
          provider: 'facebook',
          url: dutils.urls.resolve('login_facebook'),
          next: next,
          image_url: '/static/img/login-facebook.png',
          message: i18n('Log In with Facebook')
        };
        return this.socialBtnsView = new SocialButtonsList({
          buttons: [googleButton, facebookButton]
        });
      };

      LoginView.prototype.updateUrls = function(next) {
        if (next == null) next = '';
        this.model.set({
          next: next
        });
        this.buildButtons(next);
        this.render();
        return this;
      };

      return LoginView;

    })(Backbone.View);
    LogoutView = (function(_super) {

      __extends(LogoutView, _super);

      function LogoutView() {
        LogoutView.__super__.constructor.apply(this, arguments);
      }

      LogoutView.prototype.initialize = function() {
        _.bindAll(this);
        return this.model = new models.LogoutModel({});
      };

      LogoutView.prototype.bindLogoutButton = function() {
        var _this = this;
        return $('.logout-btn').click(function(evt) {
          var next;
          evt.preventDefault();
          next = $(evt.target).attr("href");
          if ((next != null ? next.charAt(0) : void 0) === '#') {
            next = document.location.pathname + next;
          }
          _this.model.doLogout(next);
          return false;
        });
      };

      return LogoutView;

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
        var user;
        _.bindAll(this);
        user = new models.User({});
        return this.form = new forms.RegisterForm({
          formId: 'form_register',
          submit_label: i18n('Register'),
          model: user
        });
      };

      RegisterView.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template({});
        this.$el.html(renderedContent);
        this.$el.find('.form-wrapper').append(this.form.render().el);
        return this;
      };

      return RegisterView;

    })(Backbone.View);
    VerificationView = (function(_super) {

      __extends(VerificationView, _super);

      function VerificationView() {
        VerificationView.__super__.constructor.apply(this, arguments);
      }

      VerificationView.prototype.initialize = function() {
        _.bindAll(this);
        this.verified = this.options.verified;
        if (this.verified) {
          this.template = _.template(verif_tpl);
          this.loginModel = new models.LoginModel();
          return this.loginForm = new forms.LoginForm({
            model: this.loginModel
          });
        } else {
          return this.template = _.template(not_verif_tpl);
        }
      };

      VerificationView.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template({});
        this.$el.html(renderedContent);
        if (this.verified) {
          this.$el.find('.login-form-box').append(this.loginForm.render().el);
        }
        return this;
      };

      return VerificationView;

    })(Backbone.View);
    return {
      LoginView: LoginView,
      LogoutView: LogoutView,
      RegisterView: RegisterView,
      VerificationView: VerificationView
    };
  });

}).call(this);
