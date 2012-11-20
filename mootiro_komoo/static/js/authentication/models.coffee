define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  class LoginModel extends Backbone.Model
    urlRoot: '/user/login/'

  class User extends Backbone.Model
    urlRoot: '/user/'

  return {
    LoginModel: LoginModel
    User: User
  }
