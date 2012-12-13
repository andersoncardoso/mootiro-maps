define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  footer_tpl = require 'text!templates/main/_footer.html'


  class Footer extends Backbone.View
    template: _.template footer_tpl

    events: {
    }

    initialize: ->
      @vent = @options.vent
      _.bindAll this
      @render()

    render: ->
      renderedContent = @template()
      @$el.html renderedContent
      this

  Footer
