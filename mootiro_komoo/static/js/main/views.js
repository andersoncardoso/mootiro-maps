(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, Feedback, Footer, Header, UpperBar, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Feedback = (function(_super) {

      __extends(Feedback, _super);

      function Feedback() {
        Feedback.__super__.constructor.apply(this, arguments);
      }

      Feedback.prototype.tagName = 'span';

      Feedback.prototype.className = 'feedback';

      Feedback.prototype.initialize = function() {
        this.$el.hide();
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

      UpperBar.prototype.events = {
        'click .login': 'login',
        'click .logout': 'logout',
        'click .user': 'profile'
      };

      UpperBar.prototype.initialize = function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/main/_upper_bar.html'));
        this.listenTo(this.model, 'change', this.render);
        window.current = this.model;
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
        Backbone.trigger('auth::loginRequired', window.location.href);
        return this;
      };

      UpperBar.prototype.logout = function(e) {
        if (e != null) e.preventDefault();
        Backbone.trigger('auth::logout', window.location.href);
        return this;
      };

      UpperBar.prototype.profile = function(e) {
        if (e != null) e.preventDefault();
        this.model.goToProfile();
        return this;
      };

      return UpperBar;

    })(Backbone.View);
    Header = (function(_super) {

      __extends(Header, _super);

      function Header() {
        Header.__super__.constructor.apply(this, arguments);
      }

      Header.prototype.events = {
        'click .logo a': 'root'
      };

      Header.prototype.initialize = function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/main/_header.html'));
        this.upperBar = new UpperBar({
          model: this.model
        });
        this.subViews = [this.upperBar];
        return this.render();
      };

      Header.prototype.render = function() {
        this.upperBar.$el.detach();
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        this.$('#upper-bar-container').append(this.upperBar.$el);
        return this;
      };

      Header.prototype.root = function(e) {
        if (e != null) e.preventDefault();
        return Backbone.trigger('main::root');
      };

      return Header;

    })(Backbone.View);
    Footer = (function(_super) {

      __extends(Footer, _super);

      function Footer() {
        Footer.__super__.constructor.apply(this, arguments);
      }

      Footer.prototype.initialize = function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/main/_footer.html'));
        return this.render();
      };

      Footer.prototype.render = function() {
        this.$el.html(this.template());
        return this;
      };

      return Footer;

    })(Backbone.View);
    return {
      Header: Header,
      Footer: Footer,
      UpperBar: UpperBar,
      Feedback: Feedback
    };
  });

}).call(this);
