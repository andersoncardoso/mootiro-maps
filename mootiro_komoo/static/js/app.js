
define(['common'], function() {
  require(['analytics', 'facebook-jssdk'], function(analytics, facebook) {
    analytics.init();
    return facebook.init(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.facebookAppId : void 0);
  });
  require(['moderation/moderation', 'lib/shortcut', 'utils'], function() {});
  require(['jquery', 'backbone', 'authentication/router'], function($, Backbone, auth_router) {
    return $(function() {
      var loginApp;
      loginApp = new auth_router.LoginApp({});
      return Backbone.history.start();
    });
  });
  return {
    start: function(module) {
      if (module != null) return require([module]);
    }
  };
});
