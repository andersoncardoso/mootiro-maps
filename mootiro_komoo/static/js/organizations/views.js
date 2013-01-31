(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, EditMain, EditSidebar, NewMain, ShowMain, ShowSidebar, orgForms, _;
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
          obj: this.model.toJSON()
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
        this.$el.html(this.template({
          obj: this.model.toJSON()
        }));
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
        this.$el.html(this.template({}));
        this.form = new orgForms.OrganizationForm({
          model: this.model
        });
        this.form.render();
        this.$('#form-container').append(this.form.$el);
        return this;
      };

      return NewMain;

    })(Backbone.View);
    EditMain = (function(_super) {

      __extends(EditMain, _super);

      function EditMain() {
        EditMain.__super__.constructor.apply(this, arguments);
      }

      EditMain.prototype.template = _.template(require('text!templates/organizations/_edit_main.html'));

      EditMain.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        this.form = new orgForms.OrganizationForm({
          model: this.model
        });
        return this.render();
      };

      EditMain.prototype.render = function() {
        this.$el.html(this.template({
          data: this.model.toJSON()
        }));
        this.form.render();
        this.$('#form-container').append(this.form.$el);
        return this;
      };

      return EditMain;

    })(Backbone.View);
    EditSidebar = (function(_super) {

      __extends(EditSidebar, _super);

      function EditSidebar() {
        EditSidebar.__super__.constructor.apply(this, arguments);
      }

      EditSidebar.prototype.template = _.template(require('text!templates/organizations/_edit_sidebar.html'));

      EditSidebar.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      };

      EditSidebar.prototype.render = function() {
        this.$el.html(this.template({}));
        return this;
      };

      return EditSidebar;

    })(Backbone.View);
    return {
      ShowMain: ShowMain,
      ShowSidebar: ShowSidebar,
      NewMain: NewMain,
      EditMain: EditMain,
      EditSidebar: EditSidebar
    };
  });

}).call(this);
