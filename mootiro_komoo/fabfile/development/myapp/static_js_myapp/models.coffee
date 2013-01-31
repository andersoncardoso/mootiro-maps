define (require) ->
  'use strict'

  app = require 'app'
  mainModels = require 'main/models'


  class Mymodel extends mainModels.CommonObject

    # Your REST api url (see Backbone documentation)
    urlRoot: '/api/myapp'
    navRoot: '/myapp'

    # FIXME: model redirecting page is ugly!
    edit: ->
      app.goTo "myapp/#{@id}/edit"


  return {Mymodel: Mymodel}
