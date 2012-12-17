(function() {

  define(function(require) {
    'use strict';
    var Backbone, Update, _;
    _ = require('underscore');
    Backbone = require('backbone');
    Update = Backbone.Model.extend();
    return {
      Update: Update
    };
  });

}).call(this);
