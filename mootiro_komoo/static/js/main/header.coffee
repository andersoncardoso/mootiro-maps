define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  header_tpl = require 'text!templates/main/_header.html'


  class Header extends Backbone.View
    template: _.template header_tpl

    events: {
    }

    initialize: ->
      # delete @options.el  # ?? why this
      UpperBar = require 'main/upper_bar'
      @upperBar = new UpperBar()
      _.bindAll this
      @render()

    render: ->
      renderedContent = @template()
      @$el.html renderedContent
      @$el.find('#upper-bar-container').append @upperBar.$el
      this

  Header
