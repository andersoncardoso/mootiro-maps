(function() {
  var Organization, _base;

  Organization = Backbone.Model.extend({
    urlRoot: '/api/organizations/'
  });

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).models == null) _base.models = {};

  window.KomooNS.models.Organization = Organization;

}).call(this);
