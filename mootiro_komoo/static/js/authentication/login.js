(function() {

  require(['jquery', 'backbone', 'authentication/router'], function($, Backbone, router) {
    return $(function() {
      var loginApp;
      loginApp = new router.LoginApp({});
      return Backbone.history.start();
    });
  });

}).call(this);
