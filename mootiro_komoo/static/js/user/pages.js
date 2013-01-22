(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, Edit, Profile, pageManager, views;
    $ = require('jquery');
    Backbone = require('backbone');
    pageManager = require('page_manager');
    views = require('./views');
    Profile = (function(_super) {

      __extends(Profile, _super);

      function Profile(model, mode) {
        this.model = model;
        this.mode = mode != null ? mode : 'view';
        Profile.__super__.constructor.apply(this, arguments);
        this.id = "user::profile::" + this.model.id;
      }

      Profile.prototype.setMode = function(mode) {
        var view, _i, _len, _ref, _ref2;
        if (this.mode === mode && mode === 'edit') mode = null;
        _ref = this.views;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if ((_ref2 = view.instance) != null) {
            if (typeof _ref2.setMode === "function") _ref2.setMode(mode);
          }
        }
        this.mode = mode;
        if (mode === null) return this.model.goToProfile();
      };

      Profile.prototype.render = function() {
        var dfd, _ref,
          _this = this;
        dfd = new $.Deferred();
        if (((_ref = pageManager.currentPage) != null ? _ref.id : void 0) === this.id) {
          pageManager.currentPage.setMode(this.mode);
          dfd.resolve();
          return dfd.promise();
        }
        window.user = this.model;
        this.model.fetch().done(function() {
          var data;
          data = {
            model: _this.model,
            mode: _this.mode
          };
          _this.setViews({
            actionBar: new views.ActionBar(data),
            sidebar: new views.Sidebar(data),
            mainContent: new views.Profile(data)
          });
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

      function Edit(model, mode) {
        if (mode == null) mode = 'edit';
        Edit.__super__.constructor.call(this, model, mode);
      }

      return Edit;

    })(Profile);
    return {
      Profile: Profile,
      Edit: Edit
    };
  });

}).call(this);
