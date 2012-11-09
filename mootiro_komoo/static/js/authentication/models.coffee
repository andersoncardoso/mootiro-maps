define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  class LoginModel extends Backbone.Model
    urlRoot: '/user/login/'

  return {
    LoginModel: LoginModel
  }
