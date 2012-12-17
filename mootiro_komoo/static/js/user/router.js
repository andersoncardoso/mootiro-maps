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
        'user(/)': 'user',
        'user/:id(/)': 'profile'
      };

      UserRouter.prototype.initialize = function() {
        _.bindAll(this);
        return this.bindExternalEvents();
      };

      UserRouter.prototype.bindExternalEvents = function() {
        return Backbone.on('user::profile', this.profile);
      };

      UserRouter.prototype.user = function() {
        var next, queryString, url;
        if (!(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.isAuthenticated : void 0)) {
          url = window.location;
          if (url.search && url.search.indexOf('next') > -1) {
            queryString = {};
            url.search.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function($0, $1, $2, $3) {
              return queryString[$1] = $3;
            });
            next = queryString['next'];
          }
          return Backbone.trigger('auth::loginRequired', next);
        }
      };

      UserRouter.prototype.profile = function(id) {
        var profile;
        profile = require('user/pages').profile;
        profile.render(id);
        return this.navigate("user/" + id);
      };

      return UserRouter;

    })(Backbone.Router);
    return new UserRouter();
  });

}).call(this);
