(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, MainRouter, app, pageManager, pages, _;
    _ = require('underscore');
    Backbone = require('backbone');
    app = require('app');
    pageManager = require('core/page_manager');
    pages = require('./pages');
    MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        '': 'root'
      };

      MainRouter.prototype.initialize = function() {
        _.bindAll(this);
        return this.bindExternalEvents();
      };

      MainRouter.prototype.bindExternalEvents = function() {
        app.on('open:root', this.root);
        return app.on('open:error', this.error);
      };

      MainRouter.prototype.goTo = function(url, page) {
        var _this = this;
        return $.when(pageManager.canClose()).done(function() {
          _this.navigate(url);
          return $.when(page.render()).fail(function(e) {
            return app.trigger('open:error', e.status, e.statusText);
          });
        });
      };

      MainRouter.prototype.root = function() {
        return this.goTo('', pages.root);
      };

      MainRouter.prototype.error = function(code, msg) {
        pages.error.render();
        return alert("" + code + " " + msg + " <TODO: render the error page>");
      };

      return MainRouter;

    })(Backbone.Router);
    return MainRouter;
  });

}).call(this);
