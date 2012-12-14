(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, ModalBox, Tabs, loadCss, modal_box, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
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
        var renderedContent;
        renderedContent = this.template(this.tpl_args);
        this.$el.html(renderedContent);
        $('body').append(this.el);
        this.$el.find('.content').append(this.content);
        this.modal = this.$el.find("#" + this.tpl_args.modal_id);
        if (this.width != null) {
          this.modal.find('.dialog').css('width', this.width);
        }
        return this;
      };

      ModalBox.prototype.open = function() {
        this.modal.fadeIn();
        this.trigger('open');
        return this;
      };

      ModalBox.prototype.close = function() {
        this.modal.fadeOut();
        this.trigger('close');
        return this;
      };

      return ModalBox;

    })(Backbone.View);
    Tabs = function(tabs, contents, onChange, selectedClass) {
      var instance;
      this.tabs = tabs;
      this.contents = contents;
      this.selectedClass = selectedClass || 'selected';
      this.onChange = onChange || function(instance) {
        return {};
      };
      $(contents).hide();
      instance = this;
      $(tabs).click(function() {
        instance.to(this);
        return false;
      });
      this.length = $(tabs).length;
      this.to($(tabs)[0]);
      return this.initialized = true;
    };
    Tabs.prototype.to = function(tab) {
      var tab_content;
      $(this.tabs).removeClass(this.selectedClass);
      $(this.contents).removeClass(this.selectedClass).hide();
      tab_content = $(tab).attr("href") || $(tab).children().attr("href");
      $("*[href=" + tab_content + "]").parent().addClass(this.selectedClass);
      $(tab_content).addClass(this.selectedClass).show();
      this.current = tab;
      if (this.onChange && this.initialized) return this.onChange(this);
    };
    Tabs.prototype.getCurrentTabIndex = function() {
      return $(this.tabs).index(this.current);
    };
    return {
      loadCss: loadCss,
      ModalBox: ModalBox,
      Tabs: Tabs
    };
  });

}).call(this);
