(function() {

  define(function(require) {
    var $, Backbone, List, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    List = Backbone.View.extend({
      tagName: 'ul',
      className: 'list',
      initialize: function() {
        _.bindAll(this);
        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.addAll);
        this.listenTo(this.collection, 'all', this.render);
        this.listenTo(this.collection, 'request', this._loading);
        this.listenTo(this.collection, 'sync', this._loaded);
        this.itemViews = {};
        window.collection = this.collection;
        this.ItemView = this.options.ItemView;
        this.subViews = [];
        this.collection.pager();
        return this.render();
      },
      render: function() {},
      _loading: function() {
        return typeof console !== "undefined" && console !== null ? console.log('loading...') : void 0;
      },
      _loaded: function() {
        return typeof console !== "undefined" && console !== null ? console.log('loaded') : void 0;
      },
      addAll: function() {
        this.$el.empty();
        this.collection.each(this.addOne);
        return this;
      },
      addOne: function(item) {
        var itemView;
        itemView = new this.ItemView({
          model: item
        });
        this.$el.append(itemView.render().$el);
        this.subViews.push(itemView);
        return this;
      }
    });
    return List;
  });

}).call(this);
