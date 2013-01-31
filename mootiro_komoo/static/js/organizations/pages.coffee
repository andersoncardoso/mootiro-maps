define (require) ->
  'use strict'

  app = require 'app'

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
      mainView = new orgViews.NewMain data
      @setViews
        mainContent: mainView

      # page flow events
      @listenTo mainView.form, 'success',
                () -> app.goTo("organizations/#{@model.id}")


  class Edit extends pageManager.Page
    initialize: ->
      super
      @id = "organizations::edit::#{@model.id}"
      data = {'model': @model}
      mainView = new orgViews.EditMain data
      @setViews
        actionBar: new mainViews.ActionBar data
        sidebar: new orgViews.EditSidebar data
        mainContent: mainView

      # page flow events
      @listenTo mainView.form, 'success',
                () -> app.goTo("organizations/#{@model.id}")


  return {
    Show: Show
    New: New
    Edit: Edit
  }
