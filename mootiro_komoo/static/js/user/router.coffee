define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  app = require 'app'
  urls = require 'urls'

  pages = require './pages'
  models = require './models'


  class UserRouter extends Backbone.Router
    routes: {}
    @prototype.routes[urls.route 'user_view'] = 'detail'
    @prototype.routes[urls.route 'user_edit'] = 'edit'

    initialize: ->
      _.bindAll this

    goTo: (view, id, Page) ->
      user = models.getUser id
      user.fetch().done =>
        app.goTo urls.resolve(view, id_: user.id), new Page(model: user)

    detail: (id) ->
      @goTo 'user_view', id, pages.Profile

    edit: (id) ->
      @goTo 'user_edit', id, pages.Edit


  return UserRouter
