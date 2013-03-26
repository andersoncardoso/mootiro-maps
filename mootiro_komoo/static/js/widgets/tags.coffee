
$ = jQuery

class TagsWidget extends ReForm.Widget
  template: """
    <input name="<%=name%>" id="id_<%=name%>" value="<%=value%>">
    """
  behavior: ()->
    $(document).ready =>
      @$el.find("#id_#{@name}").tagsInput
        defaultText: i18n "Add"
        height: 'auto'
        width: '100%'

KomooNS ?= {}
KomooNS.widgets ?= {}
KomooNS.widgets.TagsWidget = TagsWidget
