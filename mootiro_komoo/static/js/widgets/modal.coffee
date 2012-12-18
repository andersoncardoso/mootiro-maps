define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  utils = require 'utils'


  ##
  #  ModalBox view
  #  uses our own modal solution
  #  usage:
  #    some_modal = new ModalBox
  #      content: myView.render().el
  #      title: i18n('Some title')
  #      modal_id: 'id-for-this-modal-box'
  #
  #   some_modal.on 'open', my_open_callback
  #   some_modal.on 'close', my_close_callback
  #
  #   some_modal.open()  ## Opens modal Box
  #   some_modal.close()  ## Closes modal Box
  ##
  class ModalBox extends Backbone.View
    template: _.template require 'text!templates/widgets/_modal_box.html'

    events: {
      'click .close': 'close'
      'click .modal-bg': 'close'
    }

    initialize: ->
      _.bindAll this
      @tpl_args = _.extend {tile: '', modal_id: 'modal-box'}, @options
      @content = @options.content ? ''
      if @options.width
        @width = @options.width
      @render()

    render: ->
      @$el.html @template @tpl_args

      $('body').append @el
      @$('.content').append @content

      @modal = @$ "##{@tpl_args.modal_id}"

      if @width?
        @modal.find('.dialog').css('width', @width)
      this

    open: ->
      @modal.fadeIn()
      @trigger 'open', this
      @isOpen = on
      this

    close: ->
      @modal.fadeOut()
      if @isOpen
        @isOpen = off
        @trigger 'close', this
      this


  ModalBox
