(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var Avatar, Backbone, mixins, _;
    _ = require('underscore');
    Backbone = require('backbone');
    mixins = require('core/mixins');
    Avatar = (function(_super) {

      __extends(Avatar, _super);

      function Avatar() {
        Avatar.__super__.constructor.apply(this, arguments);
      }

      _.extend(Avatar.prototype, mixins.EditOverlayMixin);

      Avatar.prototype.template = _.template(require('text!templates/widgets/_avatar.html'));

      Avatar.prototype.className = 'avatar';

      Avatar.prototype.initialize = function() {
        return this.render();
      };

      Avatar.prototype.render = function() {
        this.$el.html(this.template({
          model: this.model.toJSON()
        }));
        console.warn('render');
        this.setMode(this.mode);
        return this;
      };

      return Avatar;

    })(Backbone.View);
    return {
      Avatar: Avatar
    };
  });

}).call(this);
