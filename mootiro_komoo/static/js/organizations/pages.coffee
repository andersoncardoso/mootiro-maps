define (require) ->
  'use strict'

  $ = require 'jquery'
  Backbone = require 'backbone'

  pageManager = require 'core/page_manager'
  views = require './views'
  mainViews = require 'main/views'
  models = require './models'

  class OrganizationPage extends pageManager.Page
    initialize: ->
      super
      @id = "organization::edit::1"
      data = {model: new models.Organization()}
      @setViews ({
        actionBar: new mainViews.ActionBar data
        sidebar: new views.OrganizationSidebarView data
        mainContent: new views.OrganizationView data
      })

  return {
    OrganizationPage: OrganizationPage
  }
