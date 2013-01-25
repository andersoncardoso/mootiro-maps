(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, Edit, Profile, pageManager, views;
    $ = require('jquery');
    Backbone = require('backbone');
    pageManager = require('core/page_manager');
    views = require('./views');
    Profile = (function(_super) {

      __extends(Profile, _super);

      function Profile() {
        Profile.__super__.constructor.apply(this, arguments);
      }

      Profile.prototype.initialize = function() {
        var data, _ref, _ref2;
        Profile.__super__.initialize.apply(this, arguments);
        this.mode = (_ref = this.options.mode) != null ? _ref : 'view';
        this.id = "user::profile::" + this.model.id;
        data = {
          model: this.model,
          mode: this.mode
        };
        if (((_ref2 = pageManager.currentPage) != null ? _ref2.id : void 0) !== this.id) {
          return this.setViews({
            actionBar: new views.ActionBar(data),
            sidebar: new views.Sidebar(data),
            mainContent: new views.Profile(data)
          });
        }
      };

      Profile.prototype.open = function() {
        var _ref;
        if (((_ref = pageManager.currentPage) != null ? _ref.id : void 0) === this.id) {
          pageManager.currentPage.setMode(this.mode);
          return;
        }
        return Profile.__super__.open.apply(this, arguments);
      };

      Profile.prototype.setMode = function(mode) {
        var view, _i, _len, _ref, _ref2;
        if (this.mode === mode) return;
        _ref = this._views;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if ((_ref2 = view.instance) != null) {
            if (typeof _ref2.setMode === "function") _ref2.setMode(mode);
          }
        }
        this.mode = mode;
        if (mode === null) return this.model.view();
      };

      return Profile;

    })(pageManager.Page);
    Edit = (function(_super) {

      __extends(Edit, _super);

      function Edit() {
        Edit.__super__.constructor.apply(this, arguments);
      }

      Edit.prototype.initialize = function() {
        this.options.mode = 'edit';
        return Edit.__super__.initialize.apply(this, arguments);
      };

      return Edit;

    })(Profile);
    return {
      Profile: Profile,
      Edit: Edit
    };
  });

}).call(this);
