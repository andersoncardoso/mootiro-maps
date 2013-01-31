(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Organization, app, mainModels;
    app = require('app');
    mainModels = require('main/models');
    Organization = (function(_super) {

      __extends(Organization, _super);

      function Organization() {
        Organization.__super__.constructor.apply(this, arguments);
      }

      Organization.prototype.urlRoot = '/api/organizations';

      Organization.prototype.navRoot = '/organizations';

      return Organization;

    })(mainModels.CommonObject);
    return {
      Organization: Organization
    };
  });

}).call(this);
