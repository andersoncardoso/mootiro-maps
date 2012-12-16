(function() {

  define(function(require) {
    var Backbone, User, _;
    _ = require('underscore');
    Backbone = require('backbone');
    User = Backbone.Model.extend({
      urlRoot: '/api/user',
      getUpdates: function() {
        var Update, Updates, UserUpdates;
        window.model = this;
        Update = require('update/models').Update;
        Updates = require('update/collections').Updates;
        UserUpdates = Updates.extend({
          urlRoot: "/api/user/" + (this.get('id')) + "/updates"
        });
        return new Updates().add([
          {
            action: 'add',
            type: 'need',
            name: 'test 1',
            geojson: 'geojson1'
          }, {
            action: 'add',
            type: 'community',
            name: 'test 2',
            geojson: 'geojson2'
          }
        ]);
      }
    });
    return {
      User: User
    };
  });

}).call(this);
