(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, CommonObject, PermissionMixin, app, _;
    Backbone = require('backbone');
    _ = require('underscore');
    app = require('app');
    PermissionMixin = require('core/mixins').PermissionMixin;
    CommonObject = (function(_super) {

      __extends(CommonObject, _super);

      function CommonObject() {
        CommonObject.__super__.constructor.apply(this, arguments);
      }

      _.extend(CommonObject.prototype, PermissionMixin);

      CommonObject.prototype.showUrl = function() {
        return "" + this.navRoot + "/" + this.id;
      };

      CommonObject.prototype.editUrl = function() {
        return "" + this.navRoot + "/" + this.id + "/edit";
      };

      CommonObject.prototype.newUrl = function() {
        return "" + this.navRoot + "/new";
      };

      return CommonObject;

    })(Backbone.Model);
    return {
      CommonObject: CommonObject
    };
  });

}).call(this);
