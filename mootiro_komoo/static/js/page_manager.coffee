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
      $('#actionbar').append @actionBar?.$el
      $('#sidebar').append @sidebar?.$el
      $('#main-content').empty()
      $('#main-content').append @mainContent?.$el

    close: ->
      # Remove DOM and unbind some events to avoid memory leak
      clear = (view) ->
        if not view then return

        # Clear all sub views
        # You should add all sub views to subView array
        _.each view.subViews, clear
        # Call views custom method
        view.onClose?()
        # Clear all DOM events
        view.unbind()
        # Remove DOM and clear model/collection events
        view.remove()
        # Remove detached DOM elements
        delete view.$el
        delete view.el

      _([@actionBar, @sidebar, @mainContent]).each clear


  class PageManager
    Page: Page
    currentPage: null

    open: (page) ->
      if not page or page is @currentPage then return

      @close @currentPage
      @currentPage = page
      @currentPage.open()

    close: (page=@currentPage) ->
      if not page then return

      page.close()
      if @currentPage is page
        @currentPage = null

  return new PageManager()
