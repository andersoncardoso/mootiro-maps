(function() {

  define(function(require) {
    'use strict';
    var Backbone, User, _;
    _ = require('underscore');
    Backbone = require('backbone');
    User = Backbone.Model.extend({
      urlRoot: '/api/user',
      getUpdates: function() {
        var Update, Updates, collection;
        window.model = this;
        Update = require('update/models').Update;
        Updates = require('./collections').PaginatedUpdates;
        collection = new Updates([{}], {
          user: this
        });
        window.collection = collection;
        return collection;
      }
    });
    return {
      User: User
    };
  });

}).call(this);
