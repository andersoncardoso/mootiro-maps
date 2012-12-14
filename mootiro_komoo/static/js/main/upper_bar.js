var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, UpperBar, upperBar_tpl, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  upperBar_tpl = require('text!templates/main/_upper_bar.html');
  UpperBar = (function(_super) {

    __extends(UpperBar, _super);

    function UpperBar() {
      UpperBar.__super__.constructor.apply(this, arguments);
    }

    UpperBar.prototype.template = _.template(upperBar_tpl);

    UpperBar.prototype.events = {
      'click .login': 'login',
      'click .logout': 'logout'
    };

    UpperBar.prototype.initialize = function() {
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
      return Backbone.trigger('auth:loginRequired', window.location.href);
    };

    UpperBar.prototype.logout = function() {
      return Backbone.trigger('auth:logout', window.location.href);
    };

    return UpperBar;

  })(Backbone.View);
  return UpperBar;
});
