(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, OrganizationView, ReForm, app, forms, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    ReForm = require('reForm');
    app = require('app');
    forms = require('./forms');
    OrganizationView = (function(_super) {

      __extends(OrganizationView, _super);

      function OrganizationView() {
        OrganizationView.__super__.constructor.apply(this, arguments);
      }

      OrganizationView.prototype.template = _.template('LALALALALA');

      OrganizationView.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      };

      OrganizationView.prototype.render = function() {
        this.$el.html(this.template({}));
        return this;
      };

      return OrganizationView;

    })(Backbone.View);
    return {
      OrganizationView: OrganizationView
    };
  });

}).call(this);
