define (require) ->
  'use strict'

  $ = require 'jquery'
  Backbone = require 'backbone'

  pageManager = require 'core/page_manager'
  mainViews = require 'main/views'

  views = require './views'
  models = require './models'

  class MyappPage extends pageManager.Page
    initialize: ->
      super
      @id = "myapp::action::id"
      data =
        model: new models.Myapp()
      @setViews ({
        actionBar: new mainViews.ActionBar data
        sidebar: new views.MyappView data
        mainContent: new views.MyappView data
      })

  return {
    MyappPage: MyappPage
  }
