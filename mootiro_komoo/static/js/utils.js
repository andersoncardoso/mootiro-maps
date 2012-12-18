(function() {

  define(function(require) {
    var $, Backbone, Tabs, loadCss, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
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
      Tabs: Tabs
    };
  });

}).call(this);
