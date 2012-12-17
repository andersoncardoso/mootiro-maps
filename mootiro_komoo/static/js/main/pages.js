(function() {

  define(function(require) {
    'use strict';
    var notFound, pageManager, root;
    pageManager = require('page_manager');
    root = {
      render: function() {
        var rootPage;
        rootPage = new pageManager.Page();
        return pageManager.open(rootPage);
      }
    };
    notFound = {
      render: function() {
        var notFoundPage;
        notFoundPage = new pageManager.Page();
        return pageManager.open(notFoundPage);
      }
    };
    return {
      root: root,
      notFound: notFound
    };
  });

}).call(this);
