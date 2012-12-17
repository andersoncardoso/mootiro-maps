define (require) ->

  pageManager = require 'page_manager'

  root =
    render: ->
      rootPage = new pageManager.Page()
      pageManager.open rootPage

  notFound =
    render: ->
      notFoundPage = new pageManager.Page()
      pageManager.open notFoundPage


  root: root
  notFound: notFound
