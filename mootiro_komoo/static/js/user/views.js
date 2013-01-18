(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, ActionBar, Backbone, Profile, ReForm, Sidebar, Update, Updates, UserInfo, UserInfoForm, mapViews, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    ReForm = require('reForm');
    ActionBar = require('main/views').ActionBar;
    UserInfoForm = require('./forms').UserInfoForm;
    UserInfo = (function(_super) {

      __extends(UserInfo, _super);

      function UserInfo() {
        UserInfo.__super__.constructor.apply(this, arguments);
      }

      UserInfo.prototype.template = _.template(require('text!templates/user/_user_info.html'));

      UserInfo.prototype.initialize = function() {
        _.bindAll(this);
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

      Profile.prototype.template = _.template(require('text!templates/user/_profile.html'));

      Profile.prototype.initialize = function() {
        var mode, view, _ref, _ref2;
        _.bindAll(this);
        this.subViews = [];
        this.userInfoViews = {
          view: new UserInfo({
            model: this.model
          })
        };
        if (this.model.hasPermission('edit')) {
          this.userInfoViews['edit'] = new UserInfoForm({
            model: this.model,
            formId: 'user-info',
            submit_label: i18n('Save')
          });
          this.listenTo(this.userInfoViews['edit'], 'success', this.onSuccess);
        }
        _ref = this.userInfoViews;
        for (mode in _ref) {
          view = _ref[mode];
          this.subViews.push(view);
        }
        this.updatesView = new Updates({
          collection: this.model.getUpdates()
        });
        this.subViews.push(this.updatesView);
        return this.setMode((_ref2 = this.options.mode) != null ? _ref2 : 'view');
      };

      Profile.prototype.render = function() {
        var view, _i, _len, _ref, _ref2;
        _ref = this.subViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          view.$el.detach();
        }
        this.$el.html(this.template({
          user: this.model.toJSON(),
          mode: this.mode
        }));
        this.$('#user-info-container').append((_ref2 = this.userInfoViews[this.mode]) != null ? _ref2.$el : void 0);
        this.$('#user-updates-container').append(this.updatesView.$el);
        return this;
      };

      Profile.prototype.canClose = function() {
        var _ref;
        return !((_ref = this.userInfoViews[this.mode]) != null ? typeof _ref.wasChanged === "function" ? _ref.wasChanged() : void 0 : void 0);
      };

      Profile.prototype.setMode = function(mode) {
        this.mode = mode;
        if (!this.model.hasPermission(this.mode) || !(this.userInfoViews[this.mode] != null)) {
          if (typeof console !== "undefined" && console !== null) {
            console.log("Mode '" + this.mode + "' not allowed, changing to 'view'.");
          }
          Backbone.trigger('user::profile', this.model.id);
          return;
        }
        this.userInfoViews[this.mode].render();
        return this.render();
      };

      Profile.prototype.onSuccess = function() {
        return Backbone.trigger('user::profile user::edited', this.model.id);
      };

      return Profile;

    })(Backbone.View);
    mapViews = require('map/views');
    Sidebar = (function(_super) {

      __extends(Sidebar, _super);

      function Sidebar() {
        Sidebar.__super__.constructor.apply(this, arguments);
      }

      Sidebar.prototype.template = _.template(require('text!templates/user/_sidebar.html'));

      Sidebar.prototype.initialize = function() {
        _.bindAll(this);
        this.subViews = [];
        this.subViews.push(new mapViews.Preview({
          model: this.model,
          parentSelector: '.map.box'
        }));
        return this.render();
      };

      Sidebar.prototype.render = function() {
        var view, _i, _j, _len, _len2, _ref, _ref2;
        _ref = this.subViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          view.$el.detach();
        }
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        _ref2 = this.subViews;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          view = _ref2[_j];
          this.$(view.options.parentSelector).append(view.$el);
        }
        return this;
      };

      return Sidebar;

    })(Backbone.View);
    Update = (function(_super) {

      __extends(Update, _super);

      function Update() {
        Update.__super__.constructor.apply(this, arguments);
      }

      Update.prototype.template = _.template(require('text!templates/user/_update_item.html'));

      Update.prototype.tagName = 'li';

      Update.prototype.events = {
        'click .see-on-map': 'seeOnMap'
      };

      Update.prototype.initialize = function() {
        _.bindAll(this);
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

      Updates.prototype.template = _.template(require('text!templates/user/_updates_block.html'));

      Updates.prototype.initialize = function() {
        var listWidgets;
        _.bindAll(this);
        listWidgets = require('widgets/list');
        this.subViews = [];
        this.subViews.push(new listWidgets.List({
          collection: this.collection,
          className: 'updates list',
          parentSelector: '.list-container',
          ItemView: Update
        }));
        this.subViews.push(new listWidgets.Pagination({
          collection: this.collection,
          parentSelector: '.list-container'
        }));
        return this.render();
      };

      Updates.prototype.render = function() {
        var view, _i, _j, _len, _len2, _ref, _ref2;
        _ref = this.subViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          view.$el.detach();
        }
        this.$el.html(this.template(this.collection));
        _ref2 = this.subViews.reverse();
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          view = _ref2[_j];
          this.$(view.options.parentSelector).prepend(view.$el);
        }
        return this;
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
