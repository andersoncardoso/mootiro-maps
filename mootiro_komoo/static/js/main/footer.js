var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, Footer, footer_tpl, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  footer_tpl = require('text!templates/main/_footer.html');
  Footer = (function(_super) {

    __extends(Footer, _super);

    function Footer() {
      Footer.__super__.constructor.apply(this, arguments);
    }

    Footer.prototype.template = _.template(footer_tpl);

    Footer.prototype.events = {};

    Footer.prototype.initialize = function() {
      this.vent = this.options.vent;
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
  return Footer;
});
