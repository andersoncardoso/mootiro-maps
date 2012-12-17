define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'

  class Page
    actionBar: null
    sidebar: null
    mainContent: null

    constructor: (views={}) ->
      @actionBar = views.actionBar
      @sidebar = views.sidebar
      @mainContent = views.mainContent

    open: ->
      $('#actionbar').append @actionBar?.render().$el
      $('#sidebar').append @sidebar?.render().$el
      $('#main-content').empty()
      $('#main-content').append @mainContent?.render().$el

    close: ->
      # Remove DOM and unbind some events to avoid memory leak
      _([@actionBar, @sidebar, @mainContent]).each (view) ->
        if view
          view.remove()
          view.unbind()
          view.onClose?()


  class PageManager
    Page: Page
    currentPage: null

    open: (page) ->
      @close @currentPage
      @currentPage = page
      @currentPage.open()

    close: (page) ->
      if not page then return

      page.close()
      if @currentPage is page
        @currentPage = null

  return new PageManager()
