(function() {
  var Need, _base;

  Need = Backbone.Model.extend({
    urlRoot: '/api/needs/'
  });

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).models == null) _base.models = {};

  window.KomooNS.models.Need = Need;

}).call(this);
