(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, ActionBar, Backbone, Profile, ReForm, Sidebar, Update, Updates, UserInfo, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    ReForm = require('reForm');
    ActionBar = require('main/views').ActionBar;
    UserInfo = (function(_super) {

      __extends(UserInfo, _super);

      function UserInfo() {
        UserInfo.__super__.constructor.apply(this, arguments);
      }

      UserInfo.prototype.initialize = function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_user_info.html'));
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      };

      UserInfo.prototype.render = function() {
        return this.$el.html(this.template({
          user: this.model.toJSON()
        }));
      };

      return UserInfo;

    })(Backbone.View);
    Profile = (function(_super) {

      __extends(Profile, _super);

      function Profile() {
        Profile.__super__.constructor.apply(this, arguments);
      }

      Profile.prototype.initialize = function() {
        window.model = this.model;
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_profile.html'));
        this.userInfoView = new UserInfo({
          model: this.model
        });
        this.updatesView = new Updates({
          collection: this.model.getUpdates()
        });
        this.subViews = [this.userInfoView, this.updatesView];
        return this.render();
      };

      Profile.prototype.render = function() {
        this.userInfoView.$el.detach();
        this.updatesView.$el.detach();
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        this.$('#user-info-container').append(this.userInfoView.$el);
        this.$('#user-updates-container').append(this.updatesView.$el);
        return this;
      };

      return Profile;

    })(Backbone.View);
    Sidebar = (function(_super) {

      __extends(Sidebar, _super);

      function Sidebar() {
        Sidebar.__super__.constructor.apply(this, arguments);
      }

      Sidebar.prototype.initialize = function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_sidebar.html'));
        return this.render();
      };

      Sidebar.prototype.render = function() {
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        return this;
      };

      return Sidebar;

    })(Backbone.View);
    Update = (function(_super) {

      __extends(Update, _super);

      function Update() {
        Update.__super__.constructor.apply(this, arguments);
      }

      Update.prototype.tagName = 'li';

      Update.prototype.events = {
        'click .see-on-map': 'seeOnMap'
      };

      Update.prototype.initialize = function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_update_item.html'));
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      };

      Update.prototype.render = function() {
        var _ref, _ref2;
        this.$el.removeClass().addClass([(_ref = this.model.get('type')) != null ? _ref.toLowerCase() : void 0, (_ref2 = this.model.get('action')) != null ? _ref2.toLowerCase() : void 0]);
        this.$el.html(this.template({
          update: this.model.toJSON()
        }));
        return this;
      };

      Update.prototype.seeOnMap = function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        Backbone.trigger('map::see-on-map', this.model);
        return this;
      };

      return Update;

    })(Backbone.View);
    Updates = (function(_super) {

      __extends(Updates, _super);

      function Updates() {
        Updates.__super__.constructor.apply(this, arguments);
      }

      Updates.prototype.events = {
        'click a.previous': 'previousPage',
        'click a.next': 'nextPage',
        'keypress .current-page': 'goTo'
      };

      Updates.prototype.initialize = function() {
        var List;
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_updates_block.html'));
        List = require('widgets/list');
        this.listView = new List({
          collection: this.collection,
          className: 'updates list',
          ItemView: Update
        });
        this.subViews = [this.listView];
        this.listenTo(this.collection, 'reset', this.update);
        return this.render();
      };

      Updates.prototype.render = function() {
        this.listView.$el.detach();
        this.$el.html(this.template(this.collection));
        this.$('.list-container').prepend(this.listView.$el);
        return this;
      };

      Updates.prototype.update = function() {
        this.$('.current-page').val(this.collection.currentPage + 1);
        this.$('.total-pages').text(this.collection.totalPages);
        if (this.collection.currentPage === 0) {
          this.$('.previous').addClass('disabled');
        } else {
          this.$('.previous').removeClass('disabled');
        }
        if (this.collection.currentPage === this.collection.totalPages - 1) {
          return this.$('.next').addClass('disabled');
        } else {
          return this.$('.next').removeClass('disabled');
        }
      };

      Updates.prototype.previousPage = function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        if (this.collection.currentPage > this.collection.firstPage) {
          this.collection.requestPreviousPage();
        }
        return this;
      };

      Updates.prototype.nextPage = function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        if (this.collection.currentPage < this.collection.totalPages - 1) {
          this.collection.requestNextPage();
        }
        return this;
      };

      Updates.prototype.goTo = function(e) {
        var page;
        if (e.keyCode !== 13) return;
        page = parseInt(this.$('.current-page').val(), 10);
        if (_.isNaN(page) || page <= 0 || page > this.collection.totalPages) {
          this.update();
          return;
        }
        return this.collection.goTo(page - 1);
      };

      return Updates;

    })(Backbone.View);
    return {
      Profile: Profile,
      Updates: Updates,
      ActionBar: ActionBar,
      Sidebar: Sidebar
    };
  });

}).call(this);
