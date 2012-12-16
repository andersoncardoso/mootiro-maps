(function() {

  define(function(require) {
    var $, Backbone, Footer, Header, analytics, authRouter, facebook, footer, header, mainRouter, userRouter;
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
    mainRouter = require('main/router');
    authRouter = require('authentication/router');
    userRouter = require('user/router');
    $(function() {
      return Backbone.history.start({
        pushState: true,
        root: '/'
      });
    });
    analytics = require('analytics');
    analytics.init();
    facebook = require('facebook-jssdk');
    facebook.init(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.facebookAppId : void 0);
    Backbone.on('map::see-on-map', function(model) {
      return typeof console !== "undefined" && console !== null ? console.log('I should display this geojson on map:', model.get('geojson')) : void 0;
    });
    return {
      start: function(module, arg) {
        if (module != null) {
          return require([module], function(m) {
            return m != null ? typeof m.start === "function" ? m.start(arg) : void 0 : void 0;
          });
        }
      }
    };
  });

}).call(this);
