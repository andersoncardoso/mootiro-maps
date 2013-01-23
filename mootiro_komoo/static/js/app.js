(function() {

  define(function(require) {
    var App, app, common, i18n;
    common = require('common');
    i18n = require('i18n');
    App = require('core/app').App;
    app = new App;
    return app;
  });

}).call(this);
