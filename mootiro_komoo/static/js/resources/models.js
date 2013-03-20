(function() {
  var Resource;

  Resource = Backbone.Model.extend({
    urlRoot: '/api/resources/'
  });

  if (typeof KomooNS === "undefined" || KomooNS === null) KomooNS = {};

  if (KomooNS.models == null) KomooNS.models = {};

  KomooNS.models.Resource = Resource;

}).call(this);
