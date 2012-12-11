var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, Header, header_tpl, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  header_tpl = require('text!templates/main/_header.html');
  Header = (function(_super) {

    __extends(Header, _super);

    function Header() {
      Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.template = _.template(header_tpl);

    Header.prototype.events = {};

    Header.prototype.initialize = function() {
      var UpperBar;
      this.vent = this.options.vent;
      delete this.options.el;
      UpperBar = require('main/upper_bar');
      this.upperBar = new UpperBar(this.options);
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

    return Header;

  })(Backbone.View);
  return Header;
});
