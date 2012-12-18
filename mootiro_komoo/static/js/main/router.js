(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, MainRouter, pages, _;
    _ = require('underscore');
    Backbone = require('backbone');
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
        Backbone.on('main::root', this.root);
        return Backbone.on('main::error', this.error);
      };

      MainRouter.prototype.root = function() {
        pages.root.render();
        return this.navigate('');
      };

      MainRouter.prototype.error = function(code, msg) {
        pages.error.render();
        return alert("" + code + " " + msg + " <TODO: render the error page>");
      };

      return MainRouter;

    })(Backbone.Router);
    return new MainRouter();
  });

}).call(this);
