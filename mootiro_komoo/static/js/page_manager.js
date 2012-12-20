(function() {

  define(function(require) {
    var $, Page, PageManager, _;
    $ = require('jquery');
    _ = require('underscore');
    Page = (function() {

      Page.prototype.actionBar = null;

      Page.prototype.sidebar = null;

      Page.prototype.mainContent = null;

      function Page(views) {
        if (views == null) views = {};
        this.actionBar = views.actionBar;
        this.sidebar = views.sidebar;
        this.mainContent = views.mainContent;
      }

      Page.prototype.open = function() {
        var _ref, _ref2, _ref3;
        $('#actionbar').append((_ref = this.actionBar) != null ? _ref.$el : void 0);
        $('#sidebar').append((_ref2 = this.sidebar) != null ? _ref2.$el : void 0);
        $('#main-content').empty();
        return $('#main-content').append((_ref3 = this.mainContent) != null ? _ref3.$el : void 0);
      };

      Page.prototype.close = function() {
        var clear;
        clear = function(view) {
          var field, _i, _len, _ref;
          if (!view) return;
          if (view.subViews) {
            _.each(view.subViews, clear);
            if (view.fields) {
              _ref = view.fields.slice(0).reverse();
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                field = _ref[_i];
                clear(field.instance);
              }
            }
            view.subViews.length = 0;
          }
          if (typeof view.onClose === "function") view.onClose();
          view.unbind();
          view.remove();
          delete view.$el;
          delete view.el;
          delete view.model;
          return delete view.collection;
        };
        return _([this.actionBar, this.sidebar, this.mainContent]).each(clear);
      };

      return Page;

    })();
    PageManager = (function() {

      function PageManager() {}

      PageManager.prototype.Page = Page;

      PageManager.prototype.currentPage = null;

      PageManager.prototype.open = function(page) {
        if (!page || page === this.currentPage) return;
        this.close(this.currentPage);
        this.currentPage = page;
        return this.currentPage.open();
      };

      PageManager.prototype.close = function(page) {
        if (page == null) page = this.currentPage;
        if (!page) return;
        page.close();
        if (this.currentPage === page) return this.currentPage = null;
      };

      return PageManager;

    })();
    return new PageManager();
  });

}).call(this);
