(function() {
  var NamespacedTagsWidget, TagsWidget, namespaceTemplate, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TagsWidget = KomooNS.widgets.TagsWidget;

  template = "<div class=\"nstags-container\"></div>\n<a class=\"nstags-add-namespace\">+ <%=i18n('Add classifier type')%></a>";

  namespaceTemplate = "<div class=\"nstags-namespace-container\" nstags_counter=\"<%=counter%>\">\n  <div class=\"nstags-remove-namespace\" >\n    <a href=\"#\" title=\"<%= i18n('remove namespace')%>\" nstags_counter=\"<%=counter%>\">[-]</a>\n  </div>\n  <div class=\"nstags-namespace-widget\">\n    <input type='text' id=\"id_namespace_<%=counter%>\" name='namespace_<%=counter%>' value='<%=namespace%>' />\n  </div>\n  <div class=\"nstags-tags-container\">\n    <input name=\"tags_<%=counter%>\" id=\"id_tags_<%=counter%>\" value=\"<%=tags%>\"/>\n  </div>\n</div>";

  NamespacedTagsWidget = (function(_super) {

    __extends(NamespacedTagsWidget, _super);

    function NamespacedTagsWidget() {
      NamespacedTagsWidget.__super__.constructor.apply(this, arguments);
    }

    NamespacedTagsWidget.prototype.template = template;

    NamespacedTagsWidget.prototype.namespaceTemplate = namespaceTemplate;

    NamespacedTagsWidget.prototype.events = {
      'click .nstags-add-namespace': 'addNamespace',
      'click .nstags-remove-namespace': 'removeNamespace'
    };

    NamespacedTagsWidget.prototype.initialize = function() {
      NamespacedTagsWidget.__super__.initialize.apply(this, arguments);
      this.namespaceCounter = 0;
      return this._namespaceTemplate = _.template(this.namespaceTemplate);
    };

    NamespacedTagsWidget.prototype.addNamespace = function(evt, namespace, tags) {
      var renderedTemplate, tagsContainer;
      if (namespace == null) namespace = "";
      if (tags == null) tags = "";
      if (evt != null) {
        if (typeof evt.preventDefault === "function") evt.preventDefault();
      }
      renderedTemplate = this._namespaceTemplate({
        counter: this.namespaceCounter,
        namespace: namespace,
        tags: tags
      });
      this.$el.find('.nstags-container').append(renderedTemplate);
      tagsContainer = this.$el.find(".nstags-tags-container " + ("input[name=tags_" + this.namespaceCounter + "]"));
      tagsContainer.tagsInput({
        defaultText: i18n("Add"),
        height: 'auto',
        width: '100%'
      });
      this.namespaceCounter++;
      return false;
    };

    NamespacedTagsWidget.prototype.removeNamespace = function(evt) {
      var $el, ns_counter;
      evt.preventDefault();
      ns_counter = $(evt.target).attr('nstags_counter');
      $el = this.$el.find(".nstags-namespace-container[nstags_counter=" + ns_counter + "]");
      $el.remove();
      return false;
    };

    NamespacedTagsWidget.prototype.get = function() {
      var ns_list, nstags;
      nstags = {};
      ns_list = this.$el.find('.nstags-namespace-container');
      ns_list.each(function(idx, el) {
        var $el, counter, ns, tags;
        $el = $(el);
        counter = $el.attr('nstags_counter');
        ns = $el.find("#id_namespace_" + counter).val();
        tags = $el.find("#id_tags_" + counter).val();
        if (ns.length && tags.length) return nstags[ns] = tags.split(',');
      });
      return nstags;
    };

    NamespacedTagsWidget.prototype.set = function(obj) {
      var nm, tags;
      $('.nstags-namespace-container').remove();
      for (nm in obj) {
        tags = obj[nm];
        this.addNamespace({}, nm, tags);
      }
      return this;
    };

    return NamespacedTagsWidget;

  })(ReForm.Widget);

  if (typeof KomooNS === "undefined" || KomooNS === null) KomooNS = {};

  if (KomooNS.widgets == null) KomooNS.widgets = {};

  KomooNS.widgets.NamespacedTagsWidget = NamespacedTagsWidget;

}).call(this);
