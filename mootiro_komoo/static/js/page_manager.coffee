define (require) ->
  'use strict'

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
      $('#action-bar').append @actionBar?.$el
      $('#sidebar').append @sidebar?.$el
      $('#main-content').append @mainContent?.$el

      onOpen = (view) ->
        if not view then return
        if view.subViews
          _.each view.subViews, onOpen
        view.onOpen?()

      _([@actionBar, @sidebar, @mainContent]).each onOpen


    canClose: ->
      @actionBar?.canClose?() ? true and
      @sidebar?.conClose?() ? true and
      @mainContent?.canClose?() ? true

    close: ->
      # Remove DOM and unbind some events to avoid memory leak
      clear = (view) ->
        if not view then return

        if view.subViews
          # Clear all sub views
          _.each view.subViews, clear
          delete view.subViews
          # Clear reForm forms
          _.each view.instances, clear
          delete view.instances
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

    canClose: ->
      dfd = new $.Deferred()
      if @currentPage?.canClose?() ? true
        # Can close without problems
        dfd.resolve()
      else
        # Ask for confirmation to leave the page
        # FIXME: Customize the confirm dialog
        if window.confirm "You haven't saved your changes yet. Do you want to leave without finishing?"
          dfd.resolve()
        else
          dfd.reject()
      dfd.promise()

    open: (page) ->
      if not page or page is @currentPage then return

      @close @currentPage
      @currentPage = page
      @currentPage.open()

    close: (page) ->
      if not page then return

      page.close()
      if @currentPage is page
        @currentPage = null

  return new PageManager()
