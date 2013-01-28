(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, MapRouter, app, pages, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    app = require('app');
    urls = require('urls');
    pages = require('./pages');
    MapRouter = (function(_super) {

      __extends(MapRouter, _super);

      function MapRouter() {
        MapRouter.__super__.constructor.apply(this, arguments);
      }

      MapRouter.prototype.routes = {};

      MapRouter.prototype.routes[urls.route('map')] = 'mainMap';

      MapRouter.prototype.initialize = function() {
        return _.bindAll(this);
      };

      MapRouter.prototype.mainMap = function() {
        return app.goTo(urls.resolve('map'), new pages.MapPage());
      };

      return MapRouter;

    })(Backbone.Router);
    return MapRouter;
  });

}).call(this);
