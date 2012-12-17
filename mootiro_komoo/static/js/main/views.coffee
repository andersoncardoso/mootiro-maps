define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'


  class Feedback extends Backbone.View
    tagName: 'span'
    className: 'feedback'

    initialize: ->
      @$el.hide()
      @render()

    display: (msg) ->
      @$el.html msg
      @delayed ?= setTimeout (=> @$el.css 'display': 'inline'), 100

    close: ->
      clearTimeout @delayed
      @delayed = null
      @$el.fadeOut()


  class UpperBar extends Backbone.View
    events:
      'click .login': 'login'
      'click .logout': 'logout'
      'click .user': 'profile'

    initialize: () ->
      _.bindAll this
      @template = _.template require 'text!templates/main/_upper_bar.html'
      @listenTo @model, 'change', @render
      window.current = @model
      @render()

    render: ->
      @$el.html @template user: @model.toJSON()
      this

    login: (e) ->
      e?.preventDefault()
      Backbone.trigger 'auth::loginRequired', window.location.href
      this

    logout: (e) ->
      e?.preventDefault()
      Backbone.trigger 'auth::logout', window.location.href
      this

    profile: (e) ->
      e?.preventDefault()
      Backbone.trigger 'user::profile', @model.id
      this


  class Header extends Backbone.View
    events:
      'click .logo a': 'root'

    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/main/_header.html'
      @upperBar = new UpperBar
        model: @model
      @render()

    render: ->
      @upperBar.$el.detach()
      @$el.html @template user: @model.toJSON()
      @$el.find('#upper-bar-container').append @upperBar.$el
      this

    root: (e) ->
      e?.preventDefault()
      Backbone.trigger 'main::root'


  class Footer extends Backbone.View
    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/main/_footer.html'
      @render()

    render: ->
      @$el.html @template()
      this

  Header: Header
  Footer: Footer
  UpperBar: UpperBar
  Feedback: Feedback
