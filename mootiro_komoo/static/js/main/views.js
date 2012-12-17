(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
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
        return this.$el.hide();
      };

      Feedback.prototype.display = function(msg) {
        var _ref,
          _this = this;
        this.$el.html(msg);
        return (_ref = this.delayed) != null ? _ref : this.delayed = setTimeout((function() {
          return _this.$el.css({
            'display': 'inline'
          });
        }), 100);
      };

      Feedback.prototype.close = function() {
        clearTimeout(this.delayed);
        this.delayed = null;
        return this.$el.fadeOut();
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
        var upperBar_tpl;
        upperBar_tpl = require('text!templates/main/_upper_bar.html');
        this.template = _.template(upperBar_tpl);
        _.bindAll(this);
        return this.render();
      };

      UpperBar.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template();
        this.$el.html(renderedContent);
        return this;
      };

      UpperBar.prototype.login = function() {
        Backbone.trigger('auth::loginRequired', window.location.href);
        return false;
      };

      UpperBar.prototype.logout = function() {
        Backbone.trigger('auth::logout', window.location.href);
        return false;
      };

      UpperBar.prototype.profile = function() {
        Backbone.trigger('user::profile', KomooNS.user.id);
        return false;
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
        var header_tpl;
        header_tpl = require('text!templates/main/_header.html');
        this.template = _.template(header_tpl);
        this.upperBar = new UpperBar();
        _.bindAll(this);
        return this.render();
      };

      Header.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template();
        this.$el.html(renderedContent);
        this.$el.find('#upper-bar-container').append(this.upperBar.$el);
        return this;
      };

      Header.prototype.root = function() {
        Backbone.trigger('main::root');
        return false;
      };

      return Header;

    })(Backbone.View);
    Footer = (function(_super) {

      __extends(Footer, _super);

      function Footer() {
        Footer.__super__.constructor.apply(this, arguments);
      }

      Footer.prototype.events = {};

      Footer.prototype.initialize = function() {
        var footer_tpl;
        footer_tpl = require('text!templates/main/_footer.html');
        this.template = _.template(footer_tpl);
        _.bindAll(this);
        return this.render();
      };

      Footer.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template();
        this.$el.html(renderedContent);
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
