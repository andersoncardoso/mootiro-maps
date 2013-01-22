define (require) ->
  'use strict'

  pageManager = require 'core/page_manager'

  root =
    render: ->
      rootPage = new pageManager.Page()
      pageManager.open rootPage

  error =
    render: ->
      errorPage = new pageManager.Page()
      pageManager.open errorPage


  root: root
  error: error
