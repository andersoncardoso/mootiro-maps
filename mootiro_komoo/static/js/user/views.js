(function() {

  define(function(require) {
    var $, Backbone, Profile, Sidebar, Update, Updates, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Profile = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_profile.html'));
        this.listenTo(this.model, 'change', this.render);
        this.updatesView = new Updates({
          collection: this.model.getUpdates()
        });
        return this.render();
      },
      render: function() {
        this.updatesView.$el.detach();
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        this.$el.find('#user-updates-container').append(this.updatesView.$el);
        return this;
      }
    });
    Sidebar = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_sidebar.html'));
        return this.render();
      },
      render: function() {
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        return this;
      }
    });
    Update = Backbone.View.extend({
      tagName: 'li',
      events: {
        'click .see-on-map': 'seeOnMap'
      },
      initialize: function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_update_item.html'));
        this.listenTo(this.model, 'change', this.render);
        window.model = this.model;
        return this.render();
      },
      render: function() {
        var _ref, _ref2;
        this.$el.removeClass().addClass([(_ref = this.model.get('type')) != null ? _ref.toLowerCase() : void 0, (_ref2 = this.model.get('action')) != null ? _ref2.toLowerCase() : void 0]);
        this.$el.html(this.template({
          update: this.model.toJSON()
        }));
        return this;
      },
      seeOnMap: function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        Backbone.trigger('map::see-on-map', this.model);
        return this;
      }
    });
    Updates = Backbone.View.extend({
      events: {
        'click a.previous': 'previousPage',
        'click a.next': 'nextPage'
      },
      initialize: function() {
        var List;
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_updates_block.html'));
        List = require('widgets/list');
        this.listView = new List({
          collection: this.collection,
          className: 'updates list',
          ItemView: Update
        });
        return this.render();
      },
      render: function() {
        this.listView.$el.detach();
        this.$el.html(this.template());
        this.$el.find('.list-container').prepend(this.listView.$el);
        return this;
      },
      previousPage: function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        console.log(this.collection.currentPage, this.collection.firstPage);
        if (this.collection.currentPage > this.collection.firstPage) {
          this.collection.requestPreviousPage();
        }
        return this;
      },
      nextPage: function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        if (this.collection.currentPage < this.collection.totalPages - 1) {
          this.collection.requestNextPage();
        }
        return this;
      }
    });
    return {
      Profile: Profile,
      Updates: Updates,
      Sidebar: Sidebar
    };
  });

}).call(this);
