(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, UserRouter, pageManager, pages, _;
    _ = require('underscore');
    Backbone = require('backbone');
    pages = require('./pages');
    pageManager = require('page_manager');
    UserRouter = (function(_super) {

      __extends(UserRouter, _super);

      function UserRouter() {
        UserRouter.__super__.constructor.apply(this, arguments);
      }

      UserRouter.prototype.routes = {
        'users(/)': 'user',
        'users/:id(/)': 'profile',
        'users/:id/edit(/)': 'edit'
      };

      UserRouter.prototype.initialize = function() {
        _.bindAll(this);
        return this.bindExternalEvents();
      };

      UserRouter.prototype.bindExternalEvents = function() {
        Backbone.on('user::profile', this.profile);
        return Backbone.on('user::edit', this.edit);
      };

      UserRouter.prototype.goTo = function(url, page) {
        var _this = this;
        return $.when(pageManager.canClose()).done(function() {
          _this.navigate(url);
          return $.when(page.render()).fail(function(e) {
            return Backbone.trigger('main::error', e.status, e.statusText);
          });
        });
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
        return this.goTo("users/" + id, new pages.Profile(id));
      };

      UserRouter.prototype.edit = function(id) {
        return this.goTo("users/" + id + "/edit", new pages.Edit(id));
      };

      return UserRouter;

    })(Backbone.Router);
    return new UserRouter();
  });

}).call(this);
