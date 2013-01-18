(function() {

  define(function(require) {
    var $, Backbone, i18n;
    i18n = require('i18n');
    $ = require('jquery');
    Backbone = require('backbone');
    $('body').prepend($('<div id="fb-root" />'));
    require(['main/views'], function(mainViews) {
      var User, feedbackView, footer, header, modelsWorking;
      feedbackView = new mainViews.Feedback();
      $('#feedback-container').append(feedbackView.$el);
      modelsWorking = 0;
      Backbone.on('app::working', function(model) {
        modelsWorking++;
        return feedbackView.display('Working...');
      });
      Backbone.on('app::done', function(model) {
        if (--modelsWorking === 0) return feedbackView.close();
      });
      Backbone.trigger('app::working');
      User = require('user/models').User;
      if (KomooNS.isAuthenticated) {
        KomooNS.user = new User(KomooNS.user_data);
      } else {
        KomooNS.user = new User({});
      }
      Backbone.on('session::change', function() {
        return typeof console !== "undefined" && console !== null ? console.log('SESSION ID DONT MATCH') : void 0;
      });
      header = new mainViews.Header({
        el: '#header-container',
        model: KomooNS.user
      });
      return footer = new mainViews.Footer({
        el: '#footer-container'
      });
    });
    $(function() {
      require(['main/router', 'authentication/router', 'user/router'], function() {
        Backbone.history.start({
          pushState: true,
          root: '/'
        });
        return Backbone.trigger('app::done');
      });
      return require(['services/analytics'], function(analytics) {
        return analytics.init();
      });
    });
    return Backbone.on('map::see-on-map', function(model) {
      return typeof console !== "undefined" && console !== null ? console.log('I should display this geojson on map:', model.get('geojson')) : void 0;
    });
  });

}).call(this);
