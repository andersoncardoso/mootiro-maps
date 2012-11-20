(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, LoginModel, User, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    LoginModel = (function(_super) {

      __extends(LoginModel, _super);

      function LoginModel() {
        LoginModel.__super__.constructor.apply(this, arguments);
      }

      LoginModel.prototype.urlRoot = '/user/login/';

      return LoginModel;

    })(Backbone.Model);
    User = (function(_super) {

      __extends(User, _super);

      function User() {
        User.__super__.constructor.apply(this, arguments);
      }

      User.prototype.urlRoot = '/user/';

      return User;

    })(Backbone.Model);
    return {
      LoginModel: LoginModel,
      User: User
    };
  });

}).call(this);
