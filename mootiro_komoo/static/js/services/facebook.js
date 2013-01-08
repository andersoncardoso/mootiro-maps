(function() {
  var appId;

  appId = KomooNS.facebookAppId;

  define(['require', "//connect.facebook.net/en_US/all.js#xfbml=1&appId=" + appId], function(require) {
    return FB;
  });

}).call(this);
