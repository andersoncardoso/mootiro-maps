(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, ActionBar, Backbone, Feedback, Footer, Header, MapEditor, UpperBar, app, mapViews, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    app = require('app');
    mapViews = require('map/views');
    Feedback = (function(_super) {

      __extends(Feedback, _super);

      function Feedback() {
        Feedback.__super__.constructor.apply(this, arguments);
      }

      Feedback.prototype.tagName = 'span';

      Feedback.prototype.className = 'feedback';

      Feedback.prototype.initialize = function() {
        var _this = this;
        _.bindAll(this);
        this.$el.hide();
        this.listenTo(app, 'working', function() {});
        this.listenTo(app, 'done', function() {
          return _this.close();
        });
        return this.render();
      };

      Feedback.prototype.display = function(msg) {
        var _this = this;
        this.$el.html(msg);
        if (this.delayed == null) {
          this.delayed = setTimeout((function() {
            return _this.$el.css({
              'display': 'inline'
            });
          }), 100);
        }
        return this;
      };

      Feedback.prototype.close = function() {
        clearTimeout(this.delayed);
        this.delayed = null;
        this.$el.fadeOut();
        return this;
      };

      return Feedback;

    })(Backbone.View);
    UpperBar = (function(_super) {

      __extends(UpperBar, _super);

      function UpperBar() {
        UpperBar.__super__.constructor.apply(this, arguments);
      }

      UpperBar.prototype.template = _.template(require('text!templates/main/_upper_bar.html'));

      UpperBar.prototype.events = {
        'click .login': 'login',
        'click .logout': 'logout',
        'click .user': 'profile'
      };

      UpperBar.prototype.initialize = function() {
        var _this = this;
        _.bindAll(this);
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(app, 'change', function(model) {
          if (_this.model.id === model.id && _this.model.constructor === model.constructor) {
            return _this.model.fetch();
          }
        });
        return this.render();
      };

      UpperBar.prototype.render = function() {
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        return this;
      };

      UpperBar.prototype.login = function(e) {
        if (e != null) e.preventDefault();
        app.trigger('login', window.location.href);
        return this;
      };

      UpperBar.prototype.logout = function(e) {
        if (e != null) e.preventDefault();
        app.trigger('logout', window.location.href);
        return this;
      };

      UpperBar.prototype.profile = function(e) {
        var newModel;
        if (e != null) e.preventDefault();
        newModel = new this.model.constructor(this.model.toJSON());
        newModel.view();
        return this;
      };

      return UpperBar;

    })(Backbone.View);
    Header = (function(_super) {

      __extends(Header, _super);

      function Header() {
        Header.__super__.constructor.apply(this, arguments);
      }

      Header.prototype.template = _.template(require('text!templates/main/_header.html'));

      Header.prototype.events = {
        'click .logo a': 'root'
      };

      Header.prototype.initialize = function() {
        _.bindAll(this);
        this.subViews = [];
        this.subViews.push(new UpperBar({
          model: this.model,
          parentSelector: '#upper-bar-container'
        }));
        return this.render();
      };

      Header.prototype.render = function() {
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

      Header.prototype.root = function(e) {
        if (e != null) e.preventDefault();
        return app.trigger('open:root');
      };

      return Header;

    })(Backbone.View);
    Footer = (function(_super) {

      __extends(Footer, _super);

      function Footer() {
        Footer.__super__.constructor.apply(this, arguments);
      }

      Footer.prototype.template = _.template(require('text!templates/main/_footer.html'));

      Footer.prototype.initialize = function() {
        _.bindAll(this);
        return this.render();
      };

      Footer.prototype.render = function() {
        this.$el.html(this.template());
        return this;
      };

      return Footer;

    })(Backbone.View);
    ActionBar = (function(_super) {

      __extends(ActionBar, _super);

      function ActionBar() {
        ActionBar.__super__.constructor.apply(this, arguments);
      }

      ActionBar.prototype.template = _.template(require('text!templates/main/_action_bar.html'));

      ActionBar.prototype.tagName = 'ul';

      ActionBar.prototype.events = {
        'click a': 'do'
      };

      ActionBar.prototype.actions = [
        {
          action: 'edit',
          label: i18n('Edit')
        }, {
          action: 'rate',
          label: i18n('Rate')
        }, {
          action: 'discuss',
          label: i18n('Discuss')
        }, {
          action: 'history',
          label: i18n('History')
        }, {
          action: 'report',
          label: i18n('Report')
        }, {
          action: 'delete',
          label: i18n('Delete')
        }
      ];

      ActionBar.prototype.initialize = function() {
        _.bindAll(this);
        this.mode = this.options.mode;
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(app, 'login logout change:session', this.render);
        return this.render();
      };

      ActionBar.prototype.render = function() {
        this.$el.html(this.template({
          actions: this.actions,
          model: this.model.toJSON(),
          hasPermission: _.bind(this.model.hasPermission, this.model)
        }));
        this.setMode(this.mode);
        return this;
      };

      ActionBar.prototype["do"] = function(e) {
        var action;
        e.preventDefault();
        action = $(e.target).hasClass('active') ? 'view' : $(e.target).attr('data-action');
        if (_.isFunction(this.model[action])) return this.model[action]();
      };

      ActionBar.prototype.setMode = function(mode) {
        this.mode = mode;
        this.$('.active').removeClass('active');
        return this.$("a[data-action=" + mode + "]").addClass('active');
      };

      return ActionBar;

    })(Backbone.View);
    MapEditor = (function(_super) {

      __extends(MapEditor, _super);

      function MapEditor() {
        MapEditor.__super__.constructor.apply(this, arguments);
      }

      MapEditor.prototype.template = _.template(require('text!templates/main/_map_editor.html'));

      MapEditor.prototype.className = 'map-editor';

      MapEditor.prototype.initialize = function() {
        _.bindAll(this);
        this.subViews = [];
        this.mapEditor = new mapViews.Editor({
          parentSelector: '#map-container'
        });
        this.subViews.push(this.mapEditor);
        return this.render();
      };

      MapEditor.prototype.render = function() {
        var view, _i, _j, _len, _len2, _ref, _ref2;
        _ref = this.subViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          view.$el.detach();
        }
        this.$el.html(this.template({}));
        _ref2 = this.subViews;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          view = _ref2[_j];
          this.$(view.options.parentSelector).append(view.$el);
        }
        return this;
      };

      MapEditor.prototype.getMap = function() {
        return this.mapEditor.getMap();
      };

      return MapEditor;

    })(Backbone.View);
    return {
      Header: Header,
      Footer: Footer,
      UpperBar: UpperBar,
      ActionBar: ActionBar,
      Feedback: Feedback,
      MapEditor: MapEditor
    };
  });

}).call(this);
