(function() {

  define(function(require) {
    'use strict';
    var Backbone, PaginatedUpdates, Update, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    require('backbone.paginator');
    urls = require('urls');
    Update = require('update/models').Update;
    PaginatedUpdates = Backbone.Paginator.requestPager.extend({
      model: Update,
      paginator_core: {
        dataType: 'json',
        url: function() {
          return urls.resolve('user_update_api', {
            id_: this.options.user.id
          });
        }
      },
      paginator_ui: {
        firstPage: 0,
        currentPage: 0,
        perPage: 5
      },
      server_api: {
        'per_page': function() {
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
      },
      sync: function() {
        var _this = this;
        this.trigger('request');
        return Backbone.Paginator.requestPager.prototype.sync.apply(this, arguments).done(function() {
          return _this.trigger('sync');
        });
      }
    });
    return {
      PaginatedUpdates: PaginatedUpdates
    };
  });

}).call(this);
