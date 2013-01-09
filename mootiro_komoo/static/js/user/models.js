(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, PermissionMixin, User, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    PermissionMixin = require('main/mixins').PermissionMixin;
    urls = require('urls');
    User = (function(_super) {

      __extends(User, _super);

      function User() {
        User.__super__.constructor.apply(this, arguments);
      }

      User.prototype.urlRoot = urls.resolve('user_api');

      User.prototype.defaults = {
        'about_me': ''
      };

      User.prototype.permissions = {
        edit: function(user) {
          return user instanceof User && (user.isSuperuser() || user.get('id') === this.get('id'));
        }
      };

      User.prototype.getUpdates = function() {
        var Updates;
        if (this.updates != null) return this.updates;
        Updates = require('./collections').PaginatedUpdates;
        this.updates = new Updates([], {
          user: this
        });
        window.collection = this.updates;
        return this.updates;
      };

      User.prototype.goToProfile = function() {
        return Backbone.trigger('user::profile', this.id);
      };

      User.prototype.edit = function() {
        return Backbone.trigger('user::edit', this.id);
      };

      User.prototype.isSuperuser = function() {
        return false;
      };

      return User;

    })(Backbone.Model);
    _.extend(User.prototype, PermissionMixin);
    return {
      User: User
    };
  });

}).call(this);
