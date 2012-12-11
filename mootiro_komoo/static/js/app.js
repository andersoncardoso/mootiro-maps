
define(function(require) {
  var $, Backbone, Footer, Header, analytics, authRouter, facebook, footer, header, vent;
  require('common');
  $ = require('jquery');
  Backbone = require('backbone');
  vent = require('event_aggregator');
  Header = require('main/header');
  header = new Header({
    el: '#header-container',
    vent: vent
  });
  Footer = require('main/footer');
  footer = new Footer({
    el: '#footer-container',
    vent: vent
  });
  authRouter = require('authentication/router');
  $(function() {
    var loginApp;
    loginApp = new authRouter.LoginApp({
      vent: vent
    });
    return Backbone.history.start();
  });
  analytics = require('analytics');
  analytics.init();
  facebook = require('facebook-jssdk');
  facebook.init(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.facebookAppId : void 0);
  return {
    start: function(module) {
      if (module != null) return require([module]);
    }
  };
});
