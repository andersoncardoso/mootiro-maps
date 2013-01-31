(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Edit, New, Show, app, mainViews, orgModels, orgViews, pageManager;
    app = require('app');
    pageManager = require('core/page_manager');
    mainViews = require('main/views');
    orgViews = require('./views');
    orgModels = require('./models');
    Show = (function(_super) {

      __extends(Show, _super);

      function Show() {
        Show.__super__.constructor.apply(this, arguments);
      }

      Show.prototype.initialize = function() {
        var data;
        Show.__super__.initialize.apply(this, arguments);
        this.id = "organizations::view::" + this.model.id;
        data = {
          'model': this.model
        };
        return this.setViews({
          actionBar: new mainViews.ActionBar(data),
          sidebar: new orgViews.ShowSidebar(data),
          mainContent: new orgViews.ShowMain(data)
        });
      };

      return Show;

    })(pageManager.Page);
    New = (function(_super) {

      __extends(New, _super);

      function New() {
        New.__super__.constructor.apply(this, arguments);
      }

      New.prototype.initialize = function() {
        var data, mainView;
        New.__super__.initialize.apply(this, arguments);
        this.id = "organizations::new";
        data = {
          'model': this.model
        };
        mainView = new orgViews.NewMain(data);
        this.setViews({
          mainContent: mainView
        });
        return this.listenTo(mainView.form, 'success', function() {
          return app.goTo("organizations/" + this.model.id);
        });
      };

      return New;

    })(pageManager.Page);
    Edit = (function(_super) {

      __extends(Edit, _super);

      function Edit() {
        Edit.__super__.constructor.apply(this, arguments);
      }

      Edit.prototype.initialize = function() {
        var data, mainView;
        Edit.__super__.initialize.apply(this, arguments);
        this.id = "organizations::edit::" + this.model.id;
        data = {
          'model': this.model
        };
        mainView = new orgViews.EditMain(data);
        this.setViews({
          actionBar: new mainViews.ActionBar(data),
          sidebar: new orgViews.EditSidebar(data),
          mainContent: mainView
        });
        return this.listenTo(mainView.form, 'success', function() {
          return app.goTo("organizations/" + this.model.id);
        });
      };

      return Edit;

    })(pageManager.Page);
    return {
      Show: Show,
      New: New,
      Edit: Edit
    };
  });

}).call(this);
