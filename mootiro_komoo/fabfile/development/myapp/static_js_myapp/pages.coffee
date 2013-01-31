define (require) ->
  'use strict'

  app = require 'app'

  pageManager = require 'core/page_manager'
  mainViews = require 'main/views'
  
  myappViews = require './views'
  myappModels = require './models'


  class Show extends pageManager.Page
    initialize: ->
      super
      @id = "myapp::show::#{@model.id}"  # unique Page id
      data = {'model': @model}
      @setViews
        actionBar: new mainViews.ActionBar data
        sidebar: new myappViews.ShowSidebar data
        mainContent: new myappViews.ShowMain data


  class New extends pageManager.Page
    initialize: ->
      super
      @id = "myapp::new"  # unique Page id
      data = {'model': @model}
      mainView = new myappViews.NewMain data
      @setViews
        mainContent: mainView

      # page flow events
      @listenTo mainView.form, 'success',
                () -> app.goTo("myapp/#{@model.id}")


  class Edit extends pageManager.Page
    initialize: ->
      super
      @id = "myapp::edit::#{@model.id}"
      data = {'model': @model}
      mainView = new myappViews.EditMain data
      @setViews
        actionBar: new mainViews.ActionBar data
        sidebar: new myappViews.EditSidebar data
        mainContent: mainView

      # page flow events
      @listenTo mainView.form, 'success',
                () -> app.goTo("myapp/#{@model.id}")


  return {
    Show: Show
    New: New
    Edit: Edit
  }
