define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  reveal = require 'lib/reveal/jquery.reveal'
  modal_box = require 'text!templates/widgets/_modal_box.html'

  loadCss = (url) ->
    if not $("link[href=\"#{url}\"]").length
      console.log 'Loading css: ', url
      link = document.createElement("link")
      link.type = "text/css"
      link.rel = "stylesheet"
      link.href = url
      document.getElementsByTagName("head")[0].appendChild(link)


  class ModalBox extends Backbone.View
    template: _.template modal_box
    initialize: ->
      _.bindAll this
      @tpl_args = _.extend {tile: '', conten: '', id: 'modal-box'}, @options
      loadCss('/static/lib/reveal/reveal.css')
      @render()

    render: ->
      renderedContent = @template @tpl_args
      @$el.html renderedContent
      $('body').append @el
      @modal = @$el.find "##{@tpl_args.id}"
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
