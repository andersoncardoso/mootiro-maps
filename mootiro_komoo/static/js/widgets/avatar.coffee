define (require) ->
  'use strict'

  _ = require 'underscore'
  Backbone = require 'backbone'

  mixins = require 'core/mixins'


  class Avatar extends Backbone.View
    _.extend @prototype, mixins.EditOverlayMixin
    template: _.template require 'text!templates/widgets/_avatar.html'
    className: 'avatar'

    initialize: ->
      @render()

    render: ->
      @$el.html @template model: @model.toJSON()
      console.warn 'render'
      @setMode(@mode)
      this

  return {
    Avatar: Avatar
  }
