(function() {

  define(function(require) {
    'use strict';
    var Backbone, PermissionMixin, User, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    PermissionMixin = require('main/mixins').PermissionMixin;
    urls = require('urls');
    User = Backbone.Model.extend({
      urlRoot: urls.resolve('user_api'),
      defaults: {
        'about_me': ''
      },
      permissions: {
        edit: function(user) {
          return user instanceof User && (user.isSuperuser() || user.get('id') === this.get('id'));
        }
      },
      getUpdates: function() {
        var Updates;
        if (this.updates != null) return this.updates;
        Updates = require('./collections').PaginatedUpdates;
        this.updates = new Updates([], {
          user: this
        });
        window.collection = this.updates;
        return this.updates;
      },
      goToProfile: function() {
        return Backbone.trigger('user::profile', this.id);
      },
      edit: function() {
        return Backbone.trigger('user::edit', this.id);
      },
      isSuperuser: function() {
        return false;
      }
    });
    _.extend(User.prototype, PermissionMixin);
    return {
      User: User
    };
  });

}).call(this);
