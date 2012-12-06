define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reveal = require 'reveal'
  modal_box = require 'text!templates/widgets/_modal_box.html'

  loadCss = (url) ->
    if not $("link[href=\"#{url}\"]").length
      console?.log?('Loading css: ', url)
      link = document.createElement("link")
      link.type = "text/css"
      link.rel = "stylesheet"
      link.href = url
      document.getElementsByTagName("head")[0].appendChild(link)


  class ModalBox extends Backbone.View
    template: _.template modal_box
    initialize: ->
      _.bindAll this
      @tpl_args = _.extend {tile: '', modal_id: 'modal-box'}, @options
      @content = @options.content or ''
      if @options.width
        @width = @options.width
      loadCss('/static/lib/reveal/reveal.css')
      if @options.onClose
        @onClose = @options.onClose
      if @options.onOpen
        @onOpen = @options.onOpen
      @render()

    render: ->
      renderedContent = @template @tpl_args
      @$el.html renderedContent
      @$el.find('.reveal-modal').css 'visibility', 'hidden'
      # $('body').append @el
      $('#main-content').append @el
      @$el.find('.reveal-modal-content').append @content
      @modal = @$el.find "##{@tpl_args.modal_id}"
      if @width?
        @modal.css('width', @width)
      this

    bindEvents: ->
      if @onOpen?
        @modal.bind 'reveal:open', @onOpen
      if @onClose?
        @modal.bind 'reveal:close', @onClose

    unbindEvents: ->
      if @onOpen?
        @modal.unbind 'reveal:open', @onOpen
      if @onClose?
        @modal.unbind 'reveal:close', @onClose

    show: ->
      @modal.reveal
        animation: 'fade'
        animationspeed: 200
        closeonbackgroundclick: true
        dismissmodalclass: 'close-reveal-modal'
      @bindEvents()
      this
    hide: ->
      @modal.trigger 'reveal:close'
      @unbindEvents()
      this

  return {
    loadCss: loadCss
    ModalBox: ModalBox
  }
