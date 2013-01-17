define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'
  require 'backbone.paginator'
  urls = require 'urls'

  Update = require('update/models').Update

  class PaginatedUpdates extends Backbone.Paginator.requestPager
    model: Update

    paginator_core:
      dataType: 'json'
      url: -> urls.resolve 'user_update_api', id_: @options.user.id

    paginator_ui:
      firstPage: 0
      currentPage: 0
      perPage: 5

    server_api:
      'per_page': -> @perPage
      'page': -> @currentPage

    initialize: (models, @options) ->

    parse: (response) ->
      results = response.results
      @totalPages = Math.ceil response.count / @perPage
      @totalRecords = parseInt response.count
      results


  PaginatedUpdates: PaginatedUpdates
