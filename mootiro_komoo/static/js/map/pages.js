(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, MapPage, app, pageManager;
    $ = require('jquery');
    Backbone = require('backbone');
    app = require('app');
    pageManager = require('core/page_manager');
    MapPage = (function(_super) {

      __extends(MapPage, _super);

      function MapPage() {
        MapPage.__super__.constructor.apply(this, arguments);
      }

      MapPage.prototype.initialize = function() {
        MapPage.__super__.initialize.apply(this, arguments);
        return this.id = 'mainMap';
      };

      MapPage.prototype.open = function() {
        return app.showMainMap();
      };

      MapPage.prototype.close = function() {
        return app.hideMainMap();
      };

      return MapPage;

    })(pageManager.Page);
    return {
      MapPage: MapPage
    };
  });

}).call(this);
