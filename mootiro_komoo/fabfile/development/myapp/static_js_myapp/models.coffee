define (require) ->
  'use strict'

  Backbone = require 'backbone'

  class Myapp extends Backbone.Model
    urlRoot: urls.resolve 'myapp_api'

  return {
    Myapp: Myapp
  }
