(function() {

  define(function(require) {
    'use strict';
    var Backbone, Update, Updates, _;
    _ = require('underscore');
    Backbone = require('backbone');
    Update = require('update/models').Update;
    Updates = Backbone.Collection.extend({
      model: Update,
      urlRoot: '/api/update'
    });
    return {
      Updates: Updates
    };
  });

}).call(this);
