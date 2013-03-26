(function() {
  var MultiWidget, NamespacedTagsWidget, TagsWidget, namespaceTemplate, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  MultiWidget = KomooNS.widgets.MultiWidget;

  TagsWidget = KomooNS.widgets.TagsWidget;

  template = "<div class=\"nstags-container\"></div>\n<a class=\"nstags-add-namespace\" href=\"#\">+ <%=i18n('Add classifier type')%></a>";

  namespaceTemplate = "<div class=\"nstags-namespace-container\" nstags_counter=\"<%=counter%>\">\n  <div class=\"nstags-remove-namespace\" >\n    <a href=\"#\" title=\"<%= i18n('remove namespace')%>\" nstags_counter=\"<%=counter%>\">[-]</a>\n  </div>\n  <div class=\"nstags-namespace-widget\">\n    <input type='text' name='namespace' value='' />\n  </div>\n  <div class=\"nstags-tags-container\">\n    <input name=\"tags_<%=counter%>\" id=\"id_tags_<%=counter%>\" value=\"\"/>\n  </div>\n</div>";

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

    NamespacedTagsWidget.prototype.addNamespace = function(evt) {
      var renderedTemplate, tagsContainer;
      evt.preventDefault();
      renderedTemplate = this._namespaceTemplate({
        counter: this.namespaceCounter
      });
      this.$el.find('.nstags-container').append(renderedTemplate);
      tagsContainer = this.$el.find(".nstags-tags-container " + ("input[name=tags_" + this.namespaceCounter + "]"));
      tagsContainer.tagsInput({});
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
      return console.log('get ns tags vals');
    };

    NamespacedTagsWidget.prototype.set = function(obj) {
      return console.log('set obj', obj);
    };

    return NamespacedTagsWidget;

  })(ReForm.Widget);

  if (typeof KomooNS === "undefined" || KomooNS === null) KomooNS = {};

  if (KomooNS.widgets == null) KomooNS.widgets = {};

  KomooNS.widgets.NamespacedTagsWidget = NamespacedTagsWidget;

}).call(this);
