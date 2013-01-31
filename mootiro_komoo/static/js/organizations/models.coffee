define (require) ->
  'use strict'

  app = require 'app'
  mainModels = require 'main/models'


  class Organization extends mainModels.CommonObject

    urlRoot: '/api/organizations'
    navRoot: '/organizations'


  return {Organization: Organization}
