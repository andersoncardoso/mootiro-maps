var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, LoginApp, new_utils, not_verif_tpl, reForm, verif_tpl, views, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  reForm = require('reForm');
  views = require('./views');
  new_utils = require('new_utils');
  not_verif_tpl = require('text!templates/authentication/_not_verified.html');
  verif_tpl = require('text!templates/authentication/_verified.html');
  LoginApp = (function(_super) {

    __extends(LoginApp, _super);

    function LoginApp() {
      LoginApp.__super__.constructor.apply(this, arguments);
    }

    LoginApp.prototype.routes = {
      '': 'root',
      'login': 'login',
      'register': 'register',
      'not-verified': 'not_verified',
      'verified': 'verified'
    };

    LoginApp.prototype.initialize = function() {
      _.bindAll(this);
      this.initializeLogin();
      this.initializeLogout();
      this.initializeRegister();
      return this.initializeVerification();
    };

    LoginApp.prototype._onClose = function() {
      return this.navigate('', {});
    };

    LoginApp.prototype.initializeLogin = function() {
      var _this = this;
      this.loginView = new views.LoginView({});
      this.loginView.form.on('register-link:click', this.registerLinkCB);
      this.loginBox = new new_utils.ModalBox({
        title: i18n('Login'),
        content: this.loginView.render().el,
        modal_id: 'login-modal-box'
      });
      this.loginBox.on('close', this._onClose);
      return $("a.login-required").bind("click.loginrequired", function(evt) {
        var next;
        if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
          evt.preventDefault();
          next = $(evt.target).attr("href");
          if ((next != null ? next.charAt(0) : void 0) === '#') {
            next = document.location.pathname + next;
          }
          if (next) _this.loginView.updateUrls(next);
          _this.navigate('login', {
            trigger: true
          });
          return false;
        }
      });
    };

    LoginApp.prototype.initializeLogout = function() {
      this.logoutView = new views.LogoutView({});
      return this.logoutView.bindLogoutButton();
    };

    LoginApp.prototype.initializeRegister = function() {
      this.registerView = new views.RegisterView({});
      this.registerView.form.on('success', this.registerFormOnSuccessCB);
      this.registerView.form.on('login-link:click', this.loginLinkCB);
      this.registerBox = new new_utils.ModalBox({
        title: i18n('Register'),
        width: '450px',
        content: this.registerView.render().el,
        modal_id: 'register-modal-box'
      });
      return this.registerBox.on('close', this._onClose);
    };

    LoginApp.prototype.initializeVerification = function() {
      this.notVerifiedView = new views.VerificationView({
        verified: false
      });
      this.verifiedView = new views.VerificationView({
        verified: true
      });
      this.verifiedView.loginForm.on('register-link:click', this.registerLinkCB);
      this.notVerifiedBox = new new_utils.ModalBox({
        title: i18n('Verification'),
        content: this.notVerifiedView.render().el,
        modal_id: 'verification-modal-box'
      });
      this.notVerifiedBox.on('close', this._onClose);
      this.verifiedBox = new new_utils.ModalBox({
        title: i18n('Verification'),
        content: this.verifiedView.render().el,
        modal_id: 'verification-modal-box'
      });
      return this.verifiedBox.on('close', this._onClose);
    };

    LoginApp.prototype.registerLinkCB = function() {
      return this.navigate('register', {
        trigger: true
      });
    };

    LoginApp.prototype.loginLinkCB = function() {
      return this.navigate('login', {
        trigger: true
      });
    };

    LoginApp.prototype.registerFormOnSuccessCB = function() {
      return this.navigate('not-verified', {
        trigger: true
      });
    };

    LoginApp.prototype.root = function() {
      var next, path, queryString, url;
      path = window.location.pathname;
      if ((path === '/user/' || path === '/user') && !(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
        url = window.location;
        if (url.search && url.search.indexOf('next') > -1) {
          queryString = {};
          url.search.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function($0, $1, $2, $3) {
            return queryString[$1] = $3;
          });
          next = queryString['next'];
          this.loginView.updateUrls(next);
        }
        return this.navigate('login', {
          trigger: true
        });
      }
    };

    LoginApp.prototype.login = function() {
      this.closeModals('login');
      if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
        return this.loginBox.open();
      } else {
        return this.navigate('', {
          trigger: true
        });
      }
    };

    LoginApp.prototype.register = function() {
      this.closeModals('register');
      if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
        return this.registerBox.open();
      } else {
        return this.navigate('', {
          trigger: true
        });
      }
    };

    LoginApp.prototype.not_verified = function() {
      var path;
      this.closeModals('not-verified');
      path = window.location.pathname;
      return this.notVerifiedBox.open();
    };

    LoginApp.prototype.verified = function() {
      var path;
      this.closeModals('verified');
      path = window.location.pathname;
      return this.verifiedBox.open();
    };

    LoginApp.prototype.closeModals = function(navigation_target) {
      var modal, _i, _len, _ref;
      _ref = [this.loginBox, this.registerBox, this.verifiedBox, this.notVerifiedBox];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        modal = _ref[_i];
        modal.close();
      }
      return this.navigate(navigation_target);
    };

    return LoginApp;

  })(Backbone.Router);
  return {
    LoginApp: LoginApp
  };
});
