(function() {

  define(function(require) {
    var $, Backbone, Profile, Sidebar, Update, Updates, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Profile = Backbone.View.extend({
      initialize: function() {
        var profile_tpl;
        profile_tpl = require('text!templates/user/_profile.html');
        this.template = _.template(profile_tpl);
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        return this.updatesView = new Updates({
          collection: this.model.getUpdates()
        });
      },
      render: function() {
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        this.$el.append(this.updatesView.render().$el);
        return this;
      }
    });
    Sidebar = Backbone.View.extend({
      initialize: function() {
        var sidebar_tpl;
        sidebar_tpl = require('text!templates/user/_sidebar.html');
        this.template = _.template(sidebar_tpl);
        _.bindAll(this);
        return this.listenTo(this.model, 'change', this.render);
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
        var update_tpl;
        update_tpl = require('text!templates/user/_update_item.html');
        this.template = _.template(update_tpl);
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        return window.model = this.model;
      },
      render: function() {
        this.$el.removeClass().addClass([this.model.get('type').toLowerCase(), this.model.get('action').toLowerCase()]);
        this.$el.html(this.template({
          update: this.model.toJSON()
        }));
        return this;
      },
      seeOnMap: function(a) {
        Backbone.trigger('map::see-on-map', this.model);
        return false;
      }
    });
    Updates = Backbone.View.extend({
      initialize: function() {
        var List, updates_tpl;
        updates_tpl = require('text!templates/user/_updates_block.html');
        this.template = _.template(updates_tpl);
        _.bindAll(this);
        List = require('widgets/list');
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
