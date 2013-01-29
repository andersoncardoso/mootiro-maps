define (require) ->
  'use strict'

  pageManager = require 'core/page_manager'
  mainViews = require 'main/views'
  
  orgViews = require './views'
  orgModels = require './models'


  class Show extends pageManager.Page
    initialize: ->
      super
      @id = "organizations::view::#{@model.id}"  # unique Page id
      data = {'model': @model}
      @setViews
        actionBar: new mainViews.ActionBar data
        sidebar: new orgViews.ShowSidebar data
        mainContent: new orgViews.ShowMain data


  class New extends pageManager.Page
    initialize: ->
      super
      @id = "organizations::new"
      data = {'model': @model}
      @setViews
        mainContent: new orgViews.NewMain data


  return {
    Show: Show
    New: New
  }
