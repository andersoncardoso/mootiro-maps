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

    initialize: () ->
      _.bindAll this
      @render()

    render: ->
      renderedContent = @template()
      @$el.html renderedContent
      this

    login: ->
      Backbone.trigger 'auth:loginRequired', window.location.href

    logout: ->
      Backbone.trigger 'auth:logout', window.location.href

  UpperBar
