
define(function(require) {
  var $, Backbone, Footer, Header, analytics, authRouter, facebook, footer, header;
  require('common');
  $ = require('jquery');
  Backbone = require('backbone');
  Header = require('main/header');
  header = new Header({
    el: '#header-container'
  });
  Footer = require('main/footer');
  footer = new Footer({
    el: '#footer-container'
  });
  authRouter = require('authentication/router');
  $(function() {
    var loginApp;
    loginApp = new authRouter.LoginApp({});
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
