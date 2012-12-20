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

        if view.subViews
          # Clear all sub views
          _.each view.subViews, clear
          # Clear reForm forms
          if view.fields
            for field in view.fields.slice(0).reverse()
              clear field.instance
          # Remove subviews references
          view.subViews.length = 0
        # Call views custom method
        view.onClose?()
        # Clear all DOM events
        view.unbind()
        # Remove DOM and clear model/collection events
        view.remove()
        # Remove references to detached DOM elements
        delete view.$el
        delete view.el
        # Remove references to model and collection
        delete view.model
        delete view.collection

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
