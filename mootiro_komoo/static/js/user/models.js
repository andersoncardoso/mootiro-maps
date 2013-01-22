(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, PermissionMixin, Updates, User, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    PermissionMixin = require('core/mixins').PermissionMixin;
    Updates = require('./collections').PaginatedUpdates;
    urls = require('urls');
    User = (function(_super) {

      __extends(User, _super);

      function User() {
        User.__super__.constructor.apply(this, arguments);
      }

      _.extend(User.prototype, PermissionMixin);

      User.prototype.permissions = {
        edit: function(user) {
          return user instanceof User && (user.isSuperuser() || user.get('id') === this.get('id'));
        }
      };

      User.prototype.urlRoot = urls.resolve('user_api');

      User.prototype.defaults = {
        'about_me': '',
        'geojson': {
          "type": "FeatureCollection",
          "features": [
            {
              "geometry": {
                "type": "Point",
                "coordinates": [-23.566743, -46.746802]
              },
              "type": "Feature",
              "properties": {
                type: 'User'
              }
            }
          ]
        }
      };

      User.prototype.getUpdates = function() {
        var _ref;
        return (_ref = this.updates) != null ? _ref : (this.updates = new Updates([], {
          user: this
        }));
      };

      User.prototype.view = function() {
        if (this.id != null) return Backbone.trigger('open:detail', this);
      };

      User.prototype.edit = function() {
        if (this.id != null) return Backbone.trigger('open:edit', this);
      };

      User.prototype.isSuperuser = function() {
        return false;
      };

      return User;

    })(Backbone.Model);
    return {
      User: User
    };
  });

}).call(this);
