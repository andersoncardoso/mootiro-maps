define (require) ->

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'

  loadCss = (url) ->
    if not $("link[href=\"#{url}\"]").length
      console?.log?('Loading css: ', url)
      link = document.createElement("link")
      link.type = "text/css"
      link.rel = "stylesheet"
      link.href = url
      document.getElementsByTagName("head")[0].appendChild(link)


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


  loadCss: loadCss
  Tabs: Tabs
