(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, MainRouter, _;
    _ = require('underscore');
    Backbone = require('backbone');
    MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {};

      MainRouter.prototype.initialize = function() {
        _.bindAll(this);
        return this.bindExternalEvents();
      };

      MainRouter.prototype.bindExternalEvents = function() {
        Backbone.on('main::root', this.root);
        return Backbone.on('main::notfound', this.notfound);
      };

      MainRouter.prototype.root = function() {
        var root;
        root = require('main/pages/root');
        if (root.render()) return this.navigate("");
      };

      MainRouter.prototype.notfound = function() {
        return alert('404 Not Found');
      };

      return MainRouter;

    })(Backbone.Router);
    return new MainRouter();
  });

}).call(this);
