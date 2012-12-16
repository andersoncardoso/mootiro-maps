define (require) ->
  _ = require 'underscore'
  Backbone = require 'backbone'
  Update = require('update/models').Update

  Updates = Backbone.Collection.extend
    model: Update
    urlRoot: '/api/update'


  Updates: Updates
