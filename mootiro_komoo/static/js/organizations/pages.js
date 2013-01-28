(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, OrganizationPage, models, pageManager, views;
    $ = require('jquery');
    Backbone = require('backbone');
    pageManager = require('core/page_manager');
    views = require('./views');
    models = require('./models');
    OrganizationPage = (function(_super) {

      __extends(OrganizationPage, _super);

      function OrganizationPage() {
        OrganizationPage.__super__.constructor.apply(this, arguments);
      }

      OrganizationPage.prototype.initialize = function() {
        var data;
        OrganizationPage.__super__.initialize.apply(this, arguments);
        this.id = "organization::edit::1";
        data = {
          model: new models.Organization()
        };
        return this.setViews({
          mainContent: new views.OrganizationView(data)
        });
      };

      return OrganizationPage;

    })(pageManager.Page);
    return {
      OrganizationPage: OrganizationPage
    };
  });

}).call(this);
