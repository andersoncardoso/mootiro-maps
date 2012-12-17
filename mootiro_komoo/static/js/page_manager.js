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
        $('#actionbar').append((_ref = this.actionBar) != null ? _ref.render().$el : void 0);
        $('#sidebar').append((_ref2 = this.sidebar) != null ? _ref2.render().$el : void 0);
        $('#main-content').empty();
        return $('#main-content').append((_ref3 = this.mainContent) != null ? _ref3.render().$el : void 0);
      };

      Page.prototype.close = function() {
        return _([this.actionBar, this.sidebar, this.mainContent]).each(function(view) {
          if (view) {
            view.remove();
            view.unbind();
            return typeof view.onClose === "function" ? view.onClose() : void 0;
          }
        });
      };

      return Page;

    })();
    PageManager = (function() {

      function PageManager() {}

      PageManager.prototype.Page = Page;

      PageManager.prototype.currentPage = null;

      PageManager.prototype.open = function(page) {
        this.close(this.currentPage);
        this.currentPage = page;
        return this.currentPage.open();
      };

      PageManager.prototype.close = function(page) {
        if (!page) return;
        page.close();
        if (this.currentPage === page) return this.currentPage = null;
      };

      return PageManager;

    })();
    return new PageManager();
  });

}).call(this);
