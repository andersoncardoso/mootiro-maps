(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, Edit, Profile, getUser, pageManager, views;
    $ = require('jquery');
    Backbone = require('backbone');
    pageManager = require('page_manager');
    views = require('./views');
    getUser = function(id) {
      var User, user;
      if (!(id != null)) {
        if (typeof console !== "undefined" && console !== null) {
          console.log('User id not specified');
        }
        return;
      }
      User = require('./models').User;
      user = new User();
      user.id = id;
      user.on('request', function(model) {
        return Backbone.trigger('app::working', model);
      });
      user.on('sync', function(model, resp, options) {
        return Backbone.trigger('app::done', model);
      });
      user.on('error', function(model, error) {
        if (error.status != null) return Backbone.trigger('app::done', model);
      });
      return user;
    };
    Profile = (function(_super) {

      __extends(Profile, _super);

      function Profile(userId, mode) {
        this.userId = userId;
        this.mode = mode != null ? mode : 'view';
        this.id = "user::profile::" + this.userId;
      }

      Profile.prototype.setMode = function(mode) {
        if (this.mode === mode) {
          if (mode === 'edit') Backbone.trigger('user::profile', this.userId);
          return;
        }
        this.actionBar.setMode(mode);
        return this.mode = mode;
      };

      Profile.prototype.render = function() {
        var dfd, user, _ref,
          _this = this;
        dfd = new $.Deferred();
        console.log('--->', this.id);
        if (((_ref = pageManager.currentPage) != null ? _ref.id : void 0) === this.id) {
          pageManager.currentPage.setMode(this.mode);
          dfd.resolve();
          return dfd.promise();
        }
        user = getUser(this.userId);
        window.user = user;
        user.fetch().done(function() {
          var data;
          data = {
            model: user,
            mode: _this.mode
          };
          _this.actionBar = new views.ActionBar(data);
          _this.sidebar = new views.Sidebar(data);
          _this.mainContent = new views.Profile(data);
          pageManager.open(_this);
          return dfd.resolve();
        }).fail(function(jqXHR) {
          return dfd.reject(jqXHR);
        });
        return dfd.promise();
      };

      return Profile;

    })(pageManager.Page);
    Edit = (function(_super) {

      __extends(Edit, _super);

      function Edit(userId, mode) {
        if (mode == null) mode = 'edit';
        Edit.__super__.constructor.call(this, userId, mode);
      }

      return Edit;

    })(Profile);
    return {
      getUser: getUser,
      Profile: Profile,
      Edit: Edit
    };
  });

}).call(this);
