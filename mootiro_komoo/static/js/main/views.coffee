define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'


  class Feedback extends Backbone.View
    tagName: 'span'
    className: 'feedback'

    initialize: ->
      @$el.hide()

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
      upperBar_tpl = require 'text!templates/main/_upper_bar.html'
      @template = _.template upperBar_tpl
      _.bindAll this
      @render()

    render: ->
      renderedContent = @template()
      @$el.html renderedContent
      this

    login: ->
      Backbone.trigger 'auth::loginRequired', window.location.href
      return false

    logout: ->
      Backbone.trigger 'auth::logout', window.location.href
      return false

    profile: ->
      Backbone.trigger 'user::profile', KomooNS.user.id
      return false


  class Header extends Backbone.View
    events:
      'click .logo a': 'root'

    initialize: ->
      header_tpl = require 'text!templates/main/_header.html'
      @template = _.template header_tpl
      @upperBar = new UpperBar()
      _.bindAll this
      @render()

    render: ->
      renderedContent = @template()
      @$el.html renderedContent
      @$el.find('#upper-bar-container').append @upperBar.$el
      this

    root: ->
      Backbone.trigger 'main::root'
      return false


  class Footer extends Backbone.View
    events: {
    }

    initialize: ->
      footer_tpl = require 'text!templates/main/_footer.html'
      @template = _.template footer_tpl
      _.bindAll this
      @render()

    render: ->
      renderedContent = @template()
      @$el.html renderedContent
      this

  Header: Header
  Footer: Footer
  UpperBar: UpperBar
  Feedback: Feedback
