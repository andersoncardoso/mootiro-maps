(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, UserRouter, app, models, pages, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    app = require('app');
    urls = require('urls');
    pages = require('./pages');
    models = require('./models');
    UserRouter = (function(_super) {

      __extends(UserRouter, _super);

      function UserRouter() {
        UserRouter.__super__.constructor.apply(this, arguments);
      }

      UserRouter.prototype.routes = {};

      UserRouter.prototype.routes[urls.route('user_view')] = 'detail';

      UserRouter.prototype.routes[urls.route('user_edit')] = 'edit';

      UserRouter.prototype.initialize = function() {
        return _.bindAll(this);
      };

      UserRouter.prototype.goTo = function(view, id, Page) {
        var user,
          _this = this;
        user = models.getUser(id);
        return user.fetch().done(function() {
          return app.goTo(urls.resolve(view, {
            id_: user.id
          }), new Page({
            model: user
          }));
        });
      };

      UserRouter.prototype.detail = function(id) {
        return this.goTo('user_view', id, pages.Profile);
      };

      UserRouter.prototype.edit = function(id) {
        return this.goTo('user_edit', id, pages.Edit);
      };

      return UserRouter;

    })(Backbone.Router);
    return UserRouter;
  });

}).call(this);
