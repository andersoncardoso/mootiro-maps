define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reveal = require 'lib/reveal/jquery.reveal'
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
      loadCss('/static/lib/reveal/reveal.css')
      @render()

    render: ->
      renderedContent = @template @tpl_args
      @$el.html renderedContent
      $('body').append @el
      console.log @content
      console.log @$el.find('.reveal-modal-content')
      @$el.find('.reveal-modal-content').append @content
      @modal = @$el.find "##{@tpl_args.modal_id}"
      this

    show: ->
      console.log 'showing'
      @modal.reveal
        animation: 'fadeAndPop'
        animationspeed: 300
        closeonbackgroundclick: true
        dismissmodalclass: 'close-reveal-modal'
      this
    hide: ->
      console.log 'hiding'
      this

  return {
    loadCss: loadCss
    ModalBox: ModalBox
  }
