define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  upperBar_tpl = require 'text!templates/main/_upper_bar.html'

  class UpperBar extends Backbone.View
    template: _.template upperBar_tpl

    events: {
      'click .login': 'login'
      'click .logout': 'logout'
    }

    initialize: (@options) ->
      _.bindAll this
      @vent = @options.vent
      @render()

    render: ->
      renderedContent = @template()
      @$el.html renderedContent
      this

    login: ->
      @vent.trigger 'auth:loginRequired', window.location.href

    logout: ->
      @vent.trigger 'auth:logout', window.location.href

  UpperBar
