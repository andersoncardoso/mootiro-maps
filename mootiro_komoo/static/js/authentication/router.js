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
        var _this = this;
        _.bindAll(this, 'root', 'login');
        this.loginView = new views.LoginView();
        this.loginBox = new new_utils.ModalBox({
          title: 'Login',
          content: this.loginView.render().el,
          modal_id: 'login-modal-box',
          onClose: function(evt) {
            return _this.navigate('', {
              trigger: true
            });
          }
        });
        $("a.login-required").bind("click.loginrequired", function(evt) {
          var next;
          if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            evt.preventDefault();
            next = $(evt.target).attr("href");
            if (next.charAt(0) === "#") next = document.location.pathname + next;
            _this.loginView.updateUrls(next);
            _this.navigate('login', {
              trigger: true
            });
            return false;
          }
        });
        this.registerView = new views.RegisterView();
        this.registerBox = new new_utils.ModalBox({
          title: 'Register',
          width: '450px',
          content: this.registerView.render().el,
          modal_id: 'register-modal-box',
          onClose: function(evt) {
            return _this.navigate('', {
              trigger: true
            });
          }
        });
        return this.loginView.$el.find('.auth-register').bind('click', function(evt) {
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          evt.preventDefault();
          _this.loginBox.hide();
          _this.navigate('register', {
            trigger: true
          });
          return false;
        });
      };

      LoginApp.prototype.routes = {
        '': 'root',
        'login': 'login',
        'register': 'register'
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
        if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
          return this.loginBox.show();
        } else {
          return this.navigate('', {
            trigger: true
          });
        }
      };

      LoginApp.prototype.register = function() {
        if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
          return this.registerBox.show();
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
