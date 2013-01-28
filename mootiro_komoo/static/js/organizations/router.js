(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, OrganizationRouter, app, models, pages, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    app = require('app');
    urls = require('urls');
    pages = require('./pages');
    models = require('./models');
    OrganizationRouter = (function(_super) {

      __extends(OrganizationRouter, _super);

      function OrganizationRouter() {
        OrganizationRouter.__super__.constructor.apply(this, arguments);
      }

      OrganizationRouter.prototype.routes = {
        'organizations(/)': 'list',
        'organizations/new(/)': 'create',
        'organizations/:id(/)': 'view'
      };

      OrganizationRouter.prototype.initialize = function() {
        return _.bindAll(this);
      };

      OrganizationRouter.prototype.create = function() {
        return app.goTo('/organizations/new/', new pages.OrganizationPage());
      };

      return OrganizationRouter;

    })(Backbone.Router);
    return OrganizationRouter;
  });

}).call(this);
