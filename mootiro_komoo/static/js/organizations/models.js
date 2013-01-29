(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, Organization, PermissionMixin, app, _;
    Backbone = require('backbone');
    _ = require('underscore');
    app = require('app');
    PermissionMixin = require('core/mixins').PermissionMixin;
    Organization = (function(_super) {

      __extends(Organization, _super);

      function Organization() {
        Organization.__super__.constructor.apply(this, arguments);
      }

      _.extend(Organization.prototype, PermissionMixin);

      Organization.prototype.urlRoot = '/api/organizations';

      Organization.prototype.edit = function() {
        return app.goTo("organizations/" + this.id + "/edit");
      };

      return Organization;

    })(Backbone.Model);
    return {
      Organization: Organization
    };
  });

}).call(this);
