(function() {

  define(function(require) {
    var Backbone, Update, _;
    _ = require('underscore');
    Backbone = require('backbone');
    Update = Backbone.Model.extend();
    return {
      Update: Update
    };
  });

}).call(this);
