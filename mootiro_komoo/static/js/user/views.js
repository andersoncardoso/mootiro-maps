(function() {

  define(function(require) {
    var $, Backbone, List, Profile, Sidebar, Update, Updates, profile_tpl, sidebar_tpl, update_tpl, updates_tpl, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    profile_tpl = require('text!templates/user/_profile.html');
    Profile = Backbone.View.extend({
      template: _.template(profile_tpl),
      events: {},
      initialize: function() {
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        this.updatesView = new Updates({
          collection: this.model.getUpdates()
        });
        return this.render();
      },
      render: function() {
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        this.$el.append(this.updatesView.render().$el);
        return this;
      }
    });
    sidebar_tpl = require('text!templates/user/_sidebar.html');
    Sidebar = Backbone.View.extend({
      template: _.template(sidebar_tpl),
      events: {},
      initialize: function() {
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      },
      render: function() {
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        return this;
      }
    });
    update_tpl = require('text!templates/user/_update_item.html');
    Update = Backbone.View.extend({
      template: _.template(update_tpl),
      tagName: 'li',
      events: {
        'click .see-on-map': 'seeOnMap'
      },
      initialize: function() {
        _.bindAll(this);
        return this.listenTo(this.model, 'change', this.render);
      },
      render: function() {
        this.$el.removeClass().addClass([this.model.get('type').toLowerCase(), this.model.get('action').toLowerCase()]);
        this.$el.html(this.template({
          update: this.model.toJSON()
        }));
        return this;
      },
      seeOnMap: function() {
        Backbone.trigger('map::see-on-map', this.model);
        return false;
      }
    });
    updates_tpl = require('text!templates/user/_updates_block.html');
    List = require('widgets/list');
    Updates = Backbone.View.extend({
      template: _.template(updates_tpl),
      events: {},
      initialize: function() {
        _.bindAll(this);
        return this.listView = new List({
          collection: this.collection,
          className: 'updates list',
          ItemView: Update
        });
      },
      render: function() {
        this.$el.html(this.template());
        this.$el.find('.list-container').append(this.listView.render().$el);
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
