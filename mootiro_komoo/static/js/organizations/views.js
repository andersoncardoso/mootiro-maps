(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, NewMain, ShowMain, ShowSidebar, orgForms, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    orgForms = require('./forms');
    ShowMain = (function(_super) {

      __extends(ShowMain, _super);

      function ShowMain() {
        ShowMain.__super__.constructor.apply(this, arguments);
      }

      ShowMain.prototype.template = _.template(require('text!templates/organizations/_show_main.html'));

      ShowMain.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      };

      ShowMain.prototype.render = function() {
        this.$el.html(this.template({
          data: this.model.toJSON()
        }));
        return this;
      };

      return ShowMain;

    })(Backbone.View);
    ShowSidebar = (function(_super) {

      __extends(ShowSidebar, _super);

      function ShowSidebar() {
        ShowSidebar.__super__.constructor.apply(this, arguments);
      }

      ShowSidebar.prototype.template = _.template(require('text!templates/organizations/_show_sidebar.html'));

      ShowSidebar.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      };

      ShowSidebar.prototype.render = function() {
        this.$el.html(this.template({}));
        return this;
      };

      return ShowSidebar;

    })(Backbone.View);
    NewMain = (function(_super) {

      __extends(NewMain, _super);

      function NewMain() {
        NewMain.__super__.constructor.apply(this, arguments);
      }

      NewMain.prototype.template = _.template(require('text!templates/organizations/_new_main.html'));

      NewMain.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      };

      NewMain.prototype.render = function() {
        this.$el.html(this.template({
          data: this.model.toJSON()
        }));
        return this;
      };

      return NewMain;

    })(Backbone.View);
    return {
      ShowMain: ShowMain,
      ShowSidebar: ShowSidebar,
      NewMain: NewMain
    };
  });

}).call(this);
