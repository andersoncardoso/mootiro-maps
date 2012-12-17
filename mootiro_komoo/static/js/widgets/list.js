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
        this.listenTo(this.collection, 'add', this.add);
        this.itemViews = {};
        return this.ItemView = this.options.ItemView;
      },
      render: function() {
        var _this = this;
        this.$el.empty();
        this.collection.each(function(model) {
          return _this.add(model);
        });
        return this;
      },
      add: function(item) {
        var itemView;
        itemView = new this.ItemView({
          model: item
        });
        this.$el.append(itemView.render().$el);
        this.itemViews[item.cid] = itemView;
        return this;
      }
    });
    return List;
  });

}).call(this);
