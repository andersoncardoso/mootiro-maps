(function() {

  define(function(require) {
    var $, Backbone, i18n;
    i18n = require('i18n');
    $ = require('jquery');
    Backbone = require('backbone');
    require(['main/header'], function(Header) {
      var header;
      return header = new Header({
        el: '#header-container'
      });
    });
    require(['main/footer'], function(Footer) {
      var footer;
      return footer = new Footer({
        el: '#footer-container'
      });
    });
    require(['main/router', 'authentication/router', 'user/router'], function() {
      return $(function() {
        return Backbone.history.start({
          pushState: true,
          root: '/'
        });
      });
    });
    $(function() {
      return require(['analytics'], function(analytics) {
        return analytics.init();
      });
    });
    require(['facebook-jssdk'], function(facebook) {
      return facebook.init(typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.facebookAppId : void 0);
    });
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
