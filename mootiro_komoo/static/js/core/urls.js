(function() {

  define(function(require) {
    var dutils, route, urls;
    dutils = require('dutils');
    urls = require('dutils_urls');
    route = function(name) {
      return dutils.conf.urls[name].replace(/^\/(.*)(\/)$/, '$1(/)').replace(/<([^>]*)>/g, ':$1').replace(/\.\*/g, '*path');
    };
    return {
      resolve: urls.resolve,
      route: route
    };
  });

}).call(this);
