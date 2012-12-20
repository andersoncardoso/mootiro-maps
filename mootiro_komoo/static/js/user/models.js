(function() {

  define(function(require) {
    'use strict';
    var Backbone, User, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    urls = require('urls');
    User = Backbone.Model.extend({
      urlRoot: urls.resolve('user_api'),
      defaults: {
        'about_me': ''
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
      }
    });
    return {
      User: User
    };
  });

}).call(this);
