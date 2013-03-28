
template = """
<div class="nstags-container"></div>
<a class="nstags-add-namespace">+ <%=i18n('Add classifier type')%></a>
"""

namespaceTemplate = """
<div class="nstags-namespace-container field-container" for="tags_<%=counter%>" nstags_counter="<%=counter%>">
  <div class="nstags-remove-namespace btn" title="<%= i18n('remove namespace')%>" nstags_counter="<%=counter%>">
    <i class="icon-trash"></i>
  </div>
  <div class="nstags-namespace-widget">
    <label><%= i18n('Define the classifier type')%>:</label>
    <input class="nstags-namespace-input" placeholder="<%= i18n('Classifier Type')%>" type='text' id="id_namespace_<%=counter%>" name='namespace_<%=counter%>' value='<%=namespace%>' />
  </div>
  <div class="nstags-tags-container">
    <label><%= i18n("Define the keywords for this classifier type")%>:</label>
    <input class="nstags-tags-input" name="tags_<%=counter%>" id="id_tags_<%=counter%>" value="<%=tags%>"/>
  </div>
  <div class="widget-container"></div>
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

  addNamespace: (evt, namespace="", tags=[]) ->
    evt?.preventDefault?()
    tags = tags.join(',')
    renderedTemplate = @_namespaceTemplate
      counter: @namespaceCounter
      namespace: namespace
      tags: tags

    @$el.find('.nstags-container').append renderedTemplate

    nmField = @$el.find(".nstags-namespace-widget " +
                        "input[name=namespace_#{@namespaceCounter}]")
    nmField.autocomplete
      source: '/tags/search_namespace'
      minLength: 1

    tagsField = @$el.find(".nstags-tags-container " +
                          "input[name=tags_#{@namespaceCounter}]")
    tagsField.tagsInput
      defaultText: i18n "keyword"
      height: 'auto'
      width: '100%'
      autocomplete_url: (req, resp) ->
        val = nmField.val()
        $.get "/tags/search_tags?namespace=#{val}&term=#{req.term}", (data)->
          data = JSON.parse data
          resp data

    @namespaceCounter++
    false

  removeNamespace: (evt) ->
    evt.preventDefault()
    $el = $(evt.target)
    ns_counter = $(evt.target).attr('nstags_counter')
    if not ns_counter
      ns_counter = $(evt.target).parent().attr('nstags_counter')
    $el = @$el.find ".nstags-namespace-container[nstags_counter=#{ns_counter}]"
    $el.unbind()
    $el.remove()
    false

  get: ->
    nstags = {}
    ns_list = @$el.find('.nstags-namespace-container')
    ns_list.each (idx, el)->
      $el = $(el)
      counter = $el.attr 'nstags_counter'
      ns = $el.find("#id_namespace_#{counter}").val()
      tags = $el.find("#id_tags_#{counter}").val()
      if ns.length and tags.length
        nstags[ns] = tags.split(',')
    nstags


  set: (obj) ->
    @$el.find('.nstags-namespace-container').remove()
    @addNamespace({}, nm, tags) for nm, tags of obj
    this

  validate: (obj) ->
    valid = true
    @$el.find('.nstags-namespace-container').each (idx, obj) =>
      $obj = $(obj)
      if valid
        $nm = $obj.find '.nstags-namespace-input'
        if not $nm.val()
          @errorTargetName = $obj.attr('for')
          @error = i18n 'Classifier Type can\'t be empty'
          valid = false
      if valid
        $tags = $obj.find '.nstags-tags-input'
        if not $tags.val()
          @errorTargetName = $obj.attr('for')
          @error = i18n 'A Classifier Type can\'t have an empty Tags list'
          valid = false
    return valid



KomooNS ?= {}
KomooNS.widgets ?= {}
KomooNS.widgets.NamespacedTagsWidget = NamespacedTagsWidget
