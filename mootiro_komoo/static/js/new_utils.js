(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, ModalBox, loadCss, modal_box, reveal, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    reveal = require('reveal');
    modal_box = require('text!templates/widgets/_modal_box.html');
    loadCss = function(url) {
      var link;
      if (!$("link[href=\"" + url + "\"]").length) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.log === "function") console.log('Loading css: ', url);
        }
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        return document.getElementsByTagName("head")[0].appendChild(link);
      }
    };
    ModalBox = (function(_super) {

      __extends(ModalBox, _super);

      function ModalBox() {
        ModalBox.__super__.constructor.apply(this, arguments);
      }

      ModalBox.prototype.template = _.template(modal_box);

      ModalBox.prototype.initialize = function() {
        _.bindAll(this);
        this.tpl_args = _.extend({
          tile: '',
          modal_id: 'modal-box'
        }, this.options);
        this.content = this.options.content || '';
        loadCss('/static/lib/reveal/reveal.css');
        return this.render();
      };

      ModalBox.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template(this.tpl_args);
        this.$el.html(renderedContent);
        $('body').append(this.el);
        console.log(this.content);
        console.log(this.$el.find('.reveal-modal-content'));
        this.$el.find('.reveal-modal-content').append(this.content);
        this.modal = this.$el.find("#" + this.tpl_args.modal_id);
        return this;
      };

      ModalBox.prototype.show = function() {
        console.log('showing');
        this.modal.reveal({
          animation: 'fadeAndPop',
          animationspeed: 300,
          closeonbackgroundclick: true,
          dismissmodalclass: 'close-reveal-modal'
        });
        return this;
      };

      ModalBox.prototype.hide = function() {
        console.log('hiding');
        return this;
      };

      return ModalBox;

    })(Backbone.View);
    return {
      loadCss: loadCss,
      ModalBox: ModalBox
    };
  });

}).call(this);
