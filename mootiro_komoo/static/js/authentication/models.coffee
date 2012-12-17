define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  class LoginModel extends Backbone.Model
    urlRoot: '/api/user/login/'

  class LogoutModel extends Backbone.Model
    urlRoot: '/api/user/logout/'
    initialize: ->
      _.bindAll this
    doLogout: (next) ->
      @set {next: next}
      Backbone.sync 'read', this,
        data:
          next: next
        success: (resp) =>
          if resp.redirect
            if window.location.pathname is resp.redirect
              window.location.reload()
            else
              window.location = resp.redirect

  class User extends Backbone.Model
    urlRoot: '/api/user/'

  return {
    LoginModel: LoginModel
    LogoutModel: LogoutModel
    User: User
  }
