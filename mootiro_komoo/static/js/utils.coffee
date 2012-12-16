define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  modal_box = require 'text!templates/widgets/_modal_box.html'

  loadCss = (url) ->
    if not $("link[href=\"#{url}\"]").length
      console?.log?('Loading css: ', url)
      link = document.createElement("link")
      link.type = "text/css"
      link.rel = "stylesheet"
      link.href = url
      document.getElementsByTagName("head")[0].appendChild(link)


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
    template: _.template modal_box

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
      renderedContent = @template @tpl_args
      @$el.html renderedContent

      $('body').append @el
      @$el.find('.content').append @content

      @modal = @$el.find "##{@tpl_args.modal_id}"

      if @width?
        @modal.find('.dialog').css('width', @width)
      this

    open: ->
      @modal.fadeIn()
      @trigger 'open'
      @isOpen = on
      this

    close: () ->
      @modal.fadeOut()
      if @isOpen
        @isOpen = off
        @trigger 'close'
      this


  ##
  #  Easy to use, jQuery based, and elegant solution for tabs :)
  ##
  Tabs = (tabs, contents, onChange, selectedClass) ->
    @tabs = tabs
    @contents = contents
    @selectedClass = selectedClass or 'selected'
    @onChange = onChange or (instance) -> {}
    $(contents).hide()
    instance = this
    $(tabs).click () ->
        instance.to this
        return false;  # in order not to follow the link

    # first shown tab is the first matched element in DOM tree
    @length = $(tabs).length
    @to $(tabs)[0]
    @initialized = true

  Tabs.prototype.to = (tab) -> # Most important method, switches to a tab.
    $(@tabs).removeClass @selectedClass
    $(@contents).removeClass(@selectedClass).hide()

    tab_content = $(tab).attr("href") or $(tab).children().attr("href")
    $("*[href=" + tab_content + "]").parent().addClass @selectedClass
    $(tab_content).addClass(@selectedClass).show()

    @current = tab
    if @onChange and @initialized
        @onChange this

  Tabs.prototype.getCurrentTabIndex = () ->
    return $(@tabs).index @current


  return {
    loadCss: loadCss
    ModalBox: ModalBox
    Tabs: Tabs
  }
