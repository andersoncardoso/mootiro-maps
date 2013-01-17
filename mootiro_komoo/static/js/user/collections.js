(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Backbone, PaginatedUpdates, Update, urls, _;
    _ = require('underscore');
    Backbone = require('backbone');
    require('backbone.paginator');
    urls = require('urls');
    Update = require('update/models').Update;
    PaginatedUpdates = (function(_super) {

      __extends(PaginatedUpdates, _super);

      function PaginatedUpdates() {
        PaginatedUpdates.__super__.constructor.apply(this, arguments);
      }

      PaginatedUpdates.prototype.model = Update;

      PaginatedUpdates.prototype.paginator_core = {
        dataType: 'json',
        url: function() {
          return urls.resolve('user_update_api', {
            id_: this.options.user.id
          });
        }
      };

      PaginatedUpdates.prototype.paginator_ui = {
        firstPage: 0,
        currentPage: 0,
        perPage: 5
      };

      PaginatedUpdates.prototype.server_api = {
        'per_page': function() {
          return this.perPage;
        },
        'page': function() {
          return this.currentPage;
        }
      };

      PaginatedUpdates.prototype.initialize = function(models, options) {
        this.options = options;
      };

      PaginatedUpdates.prototype.parse = function(response) {
        var results;
        results = response.results;
        this.totalPages = Math.ceil(response.count / this.perPage);
        this.totalRecords = parseInt(response.count);
        return results;
      };

      return PaginatedUpdates;

    })(Backbone.Paginator.requestPager);
    return {
      PaginatedUpdates: PaginatedUpdates
    };
  });

}).call(this);
