(function() {

  define(function(require) {
    var $, Backbone, i18n;
    i18n = require('i18n');
    $ = require('jquery');
    Backbone = require('backbone');
    require(['main/views'], function(mainViews) {
      var feedbackView, footer, header, modelsWorking;
      feedbackView = new mainViews.Feedback();
      $('#feedback-container').append(feedbackView.render().$el);
      modelsWorking = 0;
      Backbone.on('app::working', function(model) {
        modelsWorking++;
        console.log('a', modelsWorking);
        return feedbackView.display('Working...');
      });
      Backbone.on('app::done', function(model) {
        console.log('b');
        if (--modelsWorking === 0) return feedbackView.close();
      });
      Backbone.trigger('app::working');
      header = new mainViews.Header({
        el: '#header-container'
      });
      return footer = new mainViews.Footer({
        el: '#footer-container'
      });
    });
    require(['main/router', 'authentication/router', 'user/router'], function() {
      return $(function() {
        Backbone.history.start({
          pushState: true,
          root: '/'
        });
        return Backbone.trigger('app::done');
      });
    });
    require(['analytics'], function(analytics) {
      return analytics.init();
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
