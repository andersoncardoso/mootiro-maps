define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  class Page extends Backbone.View
    className: 'page'
    template: _.template require 'text!templates/main/_page.html'

    initialize: ->
      @_views = [
        {name: 'actionBar',   parentSelector: '#action-bar'}
        {name: 'sidebar',     parentSelector: '#sidebar'}
        {name: 'mainContent', parentSelector: '#main-content'}
      ]
      @setViews @options.views if @options.views?

    render: ->
      @$el.html @template {}

    setViews: (views) ->
      for view in @_views
        if view.instance?
          @_removeView view.instance
        view.instance = views[view.name]

    open: ->
      @render()

      onOpen = (view) ->
        if not view then return
        onOpen v for v in view.subViews if view.subViews
        view.onOpen?()

      for view in @_views
        console.log view.instance
        @$(view.parentSelector).append view.instance?.$el
        onOpen view.instance

    canClose: ->
      canClose = true
      (canClose = canClose and view.instance?.canClose?() ? true) for view in @_views
      canClose

    _removeView: (view) ->
      if not view then return

      if view.subViews
        # Clear all sub views
        @_removeView v for v in view.subViews if view.subViews
        view.subViews = undefined
        # Clear reForm forms
        @_removeView v for v in view.instances if view.instances
        view.instances = undefined
      # Call views custom method
      view.onClose?()
      # Clear all DOM events
      view.unbind()
      # Remove DOM and clear model/collection events
      view.remove()
      # Remove references to detached DOM elements
      view.$el.detach()
      view.$el = undefined
      view.el = undefined
      # Remove references to model and collection
      view.model = undefined
      view.collection = undefined

    close: ->
      # Remove DOM and unbind some events to avoid memory leak
      for view in @_views
        @_removeView view.instance
        #view.instance = null
      @remove()
      @$el = undefined


  class PageManager
    Page: Page
    currentPage: null

    canClose: ->
      dfd = new $.Deferred()
      return true if @currentPage is null or @currentPage?.toClose
      @currentPage.toClose = false
      if @currentPage.canClose?() ? true
        # Can close without problems
        dfd.resolve()
      else
        # Ask for confirmation to leave the page
        # FIXME: Customize the confirm dialog
        if window.confirm "You haven't saved your changes yet. Do you want to leave without finishing?"
          @currentPage.toClose = true
          dfd.resolve()
        else
          dfd.reject()
      dfd.promise()

    open: (page) ->
      if not page or page is @currentPage then return

      if page.id is @currentPage?.id
        page.open()
      else
        @close @currentPage
        $('#content').append page.$el
        page.open()
        @currentPage = page

    close: (page) ->
      if not page then return

      page.close()
      $('#content').html('')
      if @currentPage is page
        @currentPage = null

  return new PageManager()
