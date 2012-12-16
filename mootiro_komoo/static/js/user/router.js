(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, UserRouter, _;
    _ = require('underscore');
    Backbone = require('backbone');
    UserRouter = (function(_super) {

      __extends(UserRouter, _super);

      function UserRouter() {
        UserRouter.__super__.constructor.apply(this, arguments);
      }

      UserRouter.prototype.routes = {
        'user': 'list',
        'user/:id': 'profile'
      };

      UserRouter.prototype.initialize = function() {
        _.bindAll(this);
        return this.bindExternalEvents();
      };

      UserRouter.prototype.bindExternalEvents = function() {
        return Backbone.on('user::profile', this.profile);
      };

      UserRouter.prototype.profile = function(id) {
        var profile;
        profile = require('user/pages/profile');
        if (profile.render(id)) return this.navigate("user/" + id);
      };

      return UserRouter;

    })(Backbone.Router);
    return new UserRouter();
  });

}).call(this);
