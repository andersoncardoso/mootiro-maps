$ = jQuery

MarkItUpWidget = ReForm.Widget.extend
  template: """
    <textarea class="markItUpEditor" name="<%=name%>" id="id_<%=name%>" value="<%=value%>">
    """
  behavior: ()->
    $(document).ready =>
      @$el.find("#id_#{@name}").markItUp(mySettings)
      @$el.find('a[title="Preview"]').trigger 'mouseup'

  getInputElement: () ->
    @$('textarea')


window.KomooNS ?= {}
window.KomooNS.widgets ?= {}
window.KomooNS.widgets.MarkItUpWidget = MarkItUpWidget
