define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  class LoginModel extends Backbone.Model
    urlRoot: '/api/user/login/'

  class User extends Backbone.Model
    urlRoot: '/api/user/'

  return {
    LoginModel: LoginModel
    User: User
  }
