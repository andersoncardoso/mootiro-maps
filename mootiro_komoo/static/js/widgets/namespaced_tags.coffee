MultiWidget = KomooNS.widgets.MultiWidget
TagsWidget = KomooNS.widgets.TagsWidget

template = """
<div class="nstags-container"></div>
<a class="nstags-add-namespace" href="#">+ <%=i18n('Add classifier type')%></a>
"""

namespaceTemplate = """
<div class="nstags-namespace-container" nstags_counter="<%=counter%>">
  <div class="nstags-remove-namespace" >
    <a href="#" title="<%= i18n('remove namespace')%>" nstags_counter="<%=counter%>">[-]</a>
  </div>
  <div class="nstags-namespace-widget">
    <input type='text' name='namespace' value='' />
  </div>
  <div class="nstags-tags-container">
    <input name="tags_<%=counter%>" id="id_tags_<%=counter%>" value=""/>
  </div>
</div>
"""

class NamespacedTagsWidget extends ReForm.Widget
  template: template
  namespaceTemplate: namespaceTemplate

  events:
    'click .nstags-add-namespace': 'addNamespace'
    'click .nstags-remove-namespace': 'removeNamespace'

  initialize: ->
    super
    @namespaceCounter = 0
    @_namespaceTemplate = _.template @namespaceTemplate

  addNamespace: (evt) ->
    evt.preventDefault()
    renderedTemplate = @_namespaceTemplate
      counter: @namespaceCounter

    @$el.find('.nstags-container').append renderedTemplate
    tagsContainer = @$el.find(".nstags-tags-container " +
                              "input[name=tags_#{@namespaceCounter}]")
    tagsContainer.tagsInput {}
    @namespaceCounter++
    false

  removeNamespace: (evt) ->
    evt.preventDefault()
    ns_counter = $(evt.target).attr('nstags_counter')
    $el = @$el.find ".nstags-namespace-container[nstags_counter=#{ns_counter}]"
    $el.remove()
    # TODO unbind stuff
    false

  get: ->
    # TODO implement-me
    console.log 'get ns tags vals'

  set: (obj) ->
    # TODO implement-me
    console.log 'set obj', obj



KomooNS ?= {}
KomooNS.widgets ?= {}
KomooNS.widgets.NamespacedTagsWidget = NamespacedTagsWidget
