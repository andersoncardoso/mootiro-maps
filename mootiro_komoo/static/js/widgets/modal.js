(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Backbone, ModalBox, utils, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    utils = require('utils');
    ModalBox = (function(_super) {

      __extends(ModalBox, _super);

      function ModalBox() {
        ModalBox.__super__.constructor.apply(this, arguments);
      }

      ModalBox.prototype.template = _.template(require('text!templates/widgets/_modal_box.html'));

      ModalBox.prototype.events = {
        'click .close': 'close',
        'click .modal-bg': 'close'
      };

      ModalBox.prototype.initialize = function() {
        var _ref;
        _.bindAll(this);
        this.tpl_args = _.extend({
          tile: '',
          modal_id: 'modal-box'
        }, this.options);
        this.content = (_ref = this.options.content) != null ? _ref : '';
        if (this.options.width) this.width = this.options.width;
        return this.render();
      };

      ModalBox.prototype.render = function() {
        this.$el.html(this.template(this.tpl_args));
        $('body').append(this.el);
        this.$('.content').append(this.content);
        this.modal = this.$("#" + this.tpl_args.modal_id);
        if (this.width != null) {
          this.modal.find('.dialog').css('width', this.width);
        }
        return this;
      };

      ModalBox.prototype.open = function() {
        this.modal.fadeIn();
        this.trigger('open', this);
        this.isOpen = true;
        return this;
      };

      ModalBox.prototype.close = function() {
        this.modal.fadeOut();
        if (this.isOpen) {
          this.isOpen = false;
          this.trigger('close', this);
        }
        return this;
      };

      return ModalBox;

    })(Backbone.View);
    return ModalBox;
  });

}).call(this);
