(function() {

  define(function(require) {
    'use strict';
    var Backbone, PaginatedUpdates, Update, _;
    _ = require('underscore');
    Backbone = require('backbone');
    require('backbone.paginator');
    Update = require('update/models').Update;
    PaginatedUpdates = Backbone.Paginator.requestPager.extend({
      model: Update,
      paginator_core: {
        dataType: 'json',
        url: function() {
          return "/api/user/" + this.options.user.id + "/update?";
        }
      },
      paginator_ui: {
        firstPage: 0,
        currentPage: 0,
        perPage: 5
      },
      server_api: {
        'limit': function() {
          return this.perPage;
        },
        'page': function() {
          return this.currentPage;
        }
      },
      initialize: function(models, options) {
        this.options = options;
      },
      parse: function(response) {
        var results;
        results = response.results;
        this.totalPages = Math.ceil(response.count / this.perPage);
        this.totalRecords = parseInt(response.count);
        return results;
      }
    });
    return {
      PaginatedUpdates: PaginatedUpdates
    };
  });

}).call(this);
