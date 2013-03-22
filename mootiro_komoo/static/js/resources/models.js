(function() {
  var Resource, _base;

  Resource = Backbone.Model.extend({
    urlRoot: '/api/resources/'
  });

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).models == null) _base.models = {};

  window.KomooNS.models.Resource = Resource;

}).call(this);
