(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, LoginApp, new_utils, reForm, views, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    reForm = require('reForm');
    views = require('./views');
    new_utils = require('new_utils');
    LoginApp = (function(_super) {

      __extends(LoginApp, _super);

      function LoginApp() {
        LoginApp.__super__.constructor.apply(this, arguments);
      }

      LoginApp.prototype.initialize = function() {
        var _ref,
          _this = this;
        _.bindAll(this, 'root', 'login');
        this.selectors = (_ref = this.options) != null ? _ref.loginRequired : void 0;
        this.loginView = new views.LoginView();
        this.modalBox = new new_utils.ModalBox({
          title: 'Login',
          content: this.loginView.render().el,
          modal_id: 'login-modal-box',
          onClose: function(evt) {
            return _this.navigate('', {
              trigger: true
            });
          }
        });
        return $("a.login-required").bind("click.loginrequired", function(ev) {
          if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            ev.preventDefault();
            _this.navigate('login', {
              trigger: true
            });
            return false;
          }
        });
      };

      LoginApp.prototype.routes = {
        '': 'root',
        'login': 'login'
      };

      LoginApp.prototype.root = function() {
        var path;
        path = window.location.pathname;
        if ((path === '/user/login/' || path === '/user/login') && !(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
          return this.navigate('login', {
            trigger: true
          });
        }
      };

      LoginApp.prototype.login = function() {
        if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
          return this.modalBox.show();
        } else {
          return this.navigate('', {
            trigger: true
          });
        }
      };

      return LoginApp;

    })(Backbone.Router);
    return {
      LoginApp: LoginApp
    };
  });

}).call(this);
