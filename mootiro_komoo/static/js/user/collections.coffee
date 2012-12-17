define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'
  require 'backbone.paginator'

  Update = require('update/models').Update

  PaginatedUpdates = Backbone.Paginator.requestPager.extend
    model: Update

    paginator_core:
      dataType: 'json'
      url: -> "/api/user/#{@options.user.id}/update?"

    paginator_ui:
      firstPage: 0
      currentPage: 0
      perPage: 5

    server_api:
      'limit': -> @perPage
      'page': -> @currentPage

    initialize: (models, @options) ->

    parse: (response) ->
      results = response.results
      @totalPages = Math.ceil response.count / @.perPage
      @totalRecords = parseInt response.count
      results


  PaginatedUpdates: PaginatedUpdates
