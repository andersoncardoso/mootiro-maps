(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, List, Pagination, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Pagination = (function(_super) {

      __extends(Pagination, _super);

      function Pagination() {
        Pagination.__super__.constructor.apply(this, arguments);
      }

      Pagination.prototype.template = _.template(require('text!templates/widgets/_pagination.html'));

      Pagination.prototype.className = 'pagination';

      Pagination.prototype.events = {
        'click a.previous': 'previousPage',
        'click a.next': 'nextPage',
        'keypress .current-page': 'goTo'
      };

      Pagination.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(this.collection, 'reset', this.update);
        return this.render();
      };

      Pagination.prototype.render = function() {
        this.$el.html(this.template(this.collection));
        return this;
      };

      Pagination.prototype.update = function() {
        var current, total;
        current = this.collection.currentPage;
        total = this.collection.totalPages;
        this.$('.current-page').val(current + 1);
        this.$('.total-pages').text(total);
        this.$('.previous')[this.isFirstPage() ? 'addClass' : 'removeClass']('disabled');
        return this.$('.next')[this.isLastPage() ? 'addClass' : 'removeClass']('disabled');
      };

      Pagination.prototype.isFirstPage = function() {
        return this.collection.currentPage === this.collection.firstPage;
      };

      Pagination.prototype.isLastPage = function() {
        return this.collection.currentPage === this.collection.totalPages - 1;
      };

      Pagination.prototype.previousPage = function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        if (!this.isFirstPage()) this.collection.requestPreviousPage();
        return this;
      };

      Pagination.prototype.nextPage = function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        if (!this.isLastPage()) this.collection.requestNextPage();
        return this;
      };

      Pagination.prototype.goTo = function(e) {
        var page;
        if (e.keyCode !== 13) return;
        page = parseInt(this.$('.current-page').val(), 10);
        if (_.isNaN(page) || page <= 0 || page > this.collection.totalPages) {
          this.update();
          return;
        }
        return this.collection.goTo(page - 1);
      };

      return Pagination;

    })(Backbone.View);
    List = (function(_super) {

      __extends(List, _super);

      function List() {
        List.__super__.constructor.apply(this, arguments);
      }

      List.prototype.tagName = 'ul';

      List.prototype.className = 'list';

      List.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.addAll);
        this.listenTo(this.collection, 'all', this.render);
        this.listenTo(this.collection, 'request', this._loading);
        this.listenTo(this.collection, 'sync', this._loaded);
        this.ItemView = this.options.ItemView;
        this.subViews = [];
        this.collection.pager();
        return this.render();
      };

      List.prototype.render = function() {};

      List.prototype._loading = function() {
        return typeof console !== "undefined" && console !== null ? console.log('loading...') : void 0;
      };

      List.prototype._loaded = function() {
        return typeof console !== "undefined" && console !== null ? console.log('loaded') : void 0;
      };

      List.prototype.addAll = function() {
        this.$el.empty();
        this.collection.each(this.addOne);
        return this;
      };

      List.prototype.addOne = function(item) {
        var itemView;
        itemView = new this.ItemView({
          model: item
        });
        this.$el.append(itemView.render().$el);
        this.subViews.push(itemView);
        return this;
      };

      return List;

    })(Backbone.View);
    return {
      Pagination: Pagination,
      List: List
    };
  });

}).call(this);
