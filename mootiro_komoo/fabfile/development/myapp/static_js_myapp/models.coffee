define (require) ->
  'use strict'

  Backbone = require 'backbone'
  _ = require 'underscore'

  app = require 'app'
  PermissionMixin = require('core/mixins').PermissionMixin


  class Mymodel extends Backbone.Model
    _.extend @prototype, PermissionMixin

    # Your REST api url (see Backbone documentation)
    urlRoot: '/api/myapp'

    # FIXME: model redirecting page is ugly!
    edit: ->
      app.goTo "myapp/#{@id}/edit"


  return {Mymodel: Mymodel}
