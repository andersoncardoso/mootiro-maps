(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, User, UserRouter, pageManager, pages, _;
    _ = require('underscore');
    Backbone = require('backbone');
    pageManager = require('core/page_manager');
    pages = require('./pages');
    User = require('./models').User;
    UserRouter = (function(_super) {

      __extends(UserRouter, _super);

      function UserRouter() {
        UserRouter.__super__.constructor.apply(this, arguments);
      }

      UserRouter.prototype.routes = {
        'users(/)': 'user',
        'users/:id(/)': 'detail',
        'users/:id/edit(/)': 'edit'
      };

      UserRouter.prototype.initialize = function() {
        _.bindAll(this);
        return this.bindExternalEvents();
      };

      UserRouter.prototype.bindExternalEvents = function() {
        Backbone.on('open:detail', this.detail);
        return Backbone.on('open:edit', this.edit);
      };

      UserRouter.prototype.goTo = function(url, page) {
        var _this = this;
        return $.when(pageManager.canClose()).done(function() {
          _this.navigate(url);
          return $.when(page.render()).fail(function(e) {
            return Backbone.trigger('error', e.status, e.statusText);
          });
        });
      };

      UserRouter.prototype.user = function() {};

      UserRouter.prototype.getUser = function(user) {
        if (!(user != null)) {
          if (typeof console !== "undefined" && console !== null) {
            console.log('User id not specified');
          }
          return;
        }
        if (_.isNumber(user) || _.isString(user)) {
          user = new User({
            id: user
          });
        }
        if (user instanceof User) {
          return user;
        } else {
          return null;
        }
      };

      UserRouter.prototype.detail = function(model) {
        var user;
        user = this.getUser(model);
        return this.goTo("users/" + user.id, new pages.Profile({
          model: user
        }));
      };

      UserRouter.prototype.edit = function(model) {
        var user;
        user = this.getUser(model);
        return this.goTo("users/" + user.id + "/edit", new pages.Edit({
          model: user
        }));
      };

      return UserRouter;

    })(Backbone.Router);
    return UserRouter;
  });

}).call(this);
