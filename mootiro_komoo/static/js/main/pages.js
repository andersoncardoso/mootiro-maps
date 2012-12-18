(function() {

  define(function(require) {
    'use strict';
    var error, pageManager, root;
    pageManager = require('page_manager');
    root = {
      render: function() {
        var rootPage;
        rootPage = new pageManager.Page();
        return pageManager.open(rootPage);
      }
    };
    error = {
      render: function() {
        var errorPage;
        errorPage = new pageManager.Page();
        return pageManager.open(errorPage);
      }
    };
    return {
      root: root,
      error: error
    };
  });

}).call(this);
