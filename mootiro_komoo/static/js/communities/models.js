(function() {
  var Community, _base;

  Community = Backbone.Model.extend({
    urlRoot: '/api/communities/'
  });

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).models == null) _base.models = {};

  window.KomooNS.models.Community = Community;

}).call(this);
