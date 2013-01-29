(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, OrganizationsRouter, app, orgModels, orgPages, _;
    _ = require('underscore');
    Backbone = require('backbone');
    app = require('app');
    orgPages = require('./pages');
    orgModels = require('./models');
    OrganizationsRouter = (function(_super) {

      __extends(OrganizationsRouter, _super);

      function OrganizationsRouter() {
        OrganizationsRouter.__super__.constructor.apply(this, arguments);
      }

      OrganizationsRouter.prototype.routes = {
        'organizations/new(/)': 'new',
        'organizations/:id(/)': 'show'
      };

      OrganizationsRouter.prototype.initialize = function() {
        return _.bindAll(this);
      };

      OrganizationsRouter.prototype.show = function(id) {
        var model;
        model = new orgModels.Organization({
          'id': id
        });
        model.fetch();
        return app.goTo("/organizations/" + id, new orgPages.Show({
          'model': model
        }));
      };

      OrganizationsRouter.prototype["new"] = function() {
        var model;
        model = new orgModels.Organization({});
        return app.goTo("/organizations/new", new orgPages.New({
          'model': model
        }));
      };

      return OrganizationsRouter;

    })(Backbone.Router);
    return OrganizationsRouter;
  });

}).call(this);
