
Resource = Backbone.Model.extend
  urlRoot: '/api/resources/'


window.KomooNS ?= {}
window.KomooNS.models ?= {}
window.KomooNS.models.Resource = Resource

