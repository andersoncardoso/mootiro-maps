(function() {

  define(function(require) {
    'use strict';
    var $, Page, PageManager, _;
    $ = require('jquery');
    _ = require('underscore');
    Page = (function() {

      function Page(views) {
        if (views == null) views = {};
        this.views = [
          {
            name: 'actionBar',
            parentSelector: '#action-bar'
          }, {
            name: 'sidebar',
            parentSelector: '#sidebar'
          }, {
            name: 'mainContent',
            parentSelector: '#main-content'
          }
        ];
        this.setViews(views);
      }

      Page.prototype.setViews = function(views) {
        var view, _i, _len, _ref, _results;
        _ref = this.views;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if (view.instance != null) this._removeView(view.instance);
          _results.push(view.instance = views[view.name]);
        }
        return _results;
      };

      Page.prototype.open = function() {
        var onOpen, view, _i, _len, _ref, _ref2, _results;
        onOpen = function(view) {
          var v, _i, _len, _ref;
          if (!view) return;
          if (view.subViews) {
            _ref = view.subViews;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              v = _ref[_i];
              onOpen(v);
            }
          }
          return typeof view.onOpen === "function" ? view.onOpen() : void 0;
        };
        _ref = this.views;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          $(view.parentSelector).append((_ref2 = view.instance) != null ? _ref2.$el : void 0);
          _results.push(onOpen(view.instance));
        }
        return _results;
      };

      Page.prototype.canClose = function() {
        var canClose, view, _i, _len, _ref, _ref2, _ref3;
        canClose = true;
        _ref = this.views;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          canClose = (_ref2 = canClose && ((_ref3 = view.instance) != null ? typeof _ref3.canClose === "function" ? _ref3.canClose() : void 0 : void 0)) != null ? _ref2 : true;
        }
        return canClose;
      };

      Page.prototype._removeView = function(view) {
        var v, _i, _j, _len, _len2, _ref, _ref2;
        if (!view) return;
        if (view.subViews) {
          if (view.subViews) {
            _ref = view.subViews;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              v = _ref[_i];
              this._removeView(v);
            }
          }
          view.subViews = void 0;
          if (view.instances) {
            _ref2 = view.instances;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              v = _ref2[_j];
              this._removeView(v);
            }
          }
          view.instances = void 0;
        }
        if (typeof view.onClose === "function") view.onClose();
        view.unbind();
        view.remove();
        view.$el = void 0;
        view.el = void 0;
        view.model = void 0;
        return view.collection = void 0;
      };

      Page.prototype.close = function() {
        var view, _i, _len, _ref, _results;
        _ref = this.views;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          _results.push(this._removeView(view.instance));
        }
        return _results;
      };

      return Page;

    })();
    PageManager = (function() {

      function PageManager() {}

      PageManager.prototype.Page = Page;

      PageManager.prototype.currentPage = null;

      PageManager.prototype.canClose = function() {
        var dfd, _ref, _ref2;
        dfd = new $.Deferred();
        if ((_ref = (_ref2 = this.currentPage) != null ? typeof _ref2.canClose === "function" ? _ref2.canClose() : void 0 : void 0) != null ? _ref : true) {
          dfd.resolve();
        } else {
          if (window.confirm("You haven't saved your changes yet. Do you want to leave without finishing?")) {
            dfd.resolve();
          } else {
            dfd.reject();
          }
        }
        return dfd.promise();
      };

      PageManager.prototype.open = function(page) {
        if (!page || page === this.currentPage) return;
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
