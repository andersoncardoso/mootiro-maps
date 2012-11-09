(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, LoginModel, _;
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
    return {
      LoginModel: LoginModel
    };
  });

}).call(this);
