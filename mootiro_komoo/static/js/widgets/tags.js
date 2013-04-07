(function() {
  var NamespacedTagsWidget, namespaceTemplate, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.KW_NAMESPACE = 'keywords';

  template = "<div class=\"nstags-container\"></div>\n<a class=\"nstags-add-namespace\">+ <%=i18n('Add classifier type')%></a>";

  namespaceTemplate = "<div class=\"nstags-namespace-container field-container\" for=\"tags_<%=counter%>\" nstags_counter=\"<%=counter%>\">\n  <div class=\"nstags-remove-namespace btn\" title=\"<%= i18n('remove namespace')%>\" nstags_counter=\"<%=counter%>\">\n    <i class=\"icon-trash\"></i>\n  </div>\n  <div class=\"nstags-namespace-widget\">\n    <% if (namespace !== KW_NAMESPACE) { %>\n    <label><%= i18n('Define the classifier type')%>:</label>\n    <input class=\"nstags-namespace-input\" placeholder=\"<%= i18n('Classifier Type')%>\" type='text' id=\"id_namespace_<%=counter%>\" name='namespace_<%=counter%>' value='<%=namespace%>' />\n    <% } else { %>\n    <div class=\"nstags-commonnamespace-placeholder\"><%= i18n('Keywords')%>:</div>\n    <input class=\"nstags-namespace-input\" type='text' id=\"id_namespace_<%=counter%>\" name='namespace_<%=counter%>' value='<%=namespace%>' style=\"display: none;\"/>\n    <% } %>\n\n  </div>\n  <div class=\"nstags-tags-container\">\n    <label><%= i18n(\"Define a set of classifiers for this type\")%>:</label>\n    <input class=\"nstags-tags-input\" name=\"tags_<%=counter%>\" id=\"id_tags_<%=counter%>\" value=\"<%=tags%>\"/>\n  </div>\n  <div class=\"widget-container\"></div>\n</div>";

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

    NamespacedTagsWidget.prototype.behavior = function() {
      var _this = this;
      return setTimeout(function() {
        var obj;
        if (_.isEmpty(_this.get())) {
          obj = {};
          obj[KW_NAMESPACE] = [];
          return _this.set(obj);
        }
      }, 500);
    };

    NamespacedTagsWidget.prototype.addNamespace = function(evt, namespace, tags) {
      var nmField, renderedTemplate, tagsField;
      if (namespace == null) namespace = "";
      if (tags == null) tags = [];
      if (evt != null) {
        if (typeof evt.preventDefault === "function") evt.preventDefault();
      }
      tags = tags.join(',');
      renderedTemplate = this._namespaceTemplate({
        counter: this.namespaceCounter,
        namespace: namespace,
        tags: tags
      });
      this.$el.find('.nstags-container').append(renderedTemplate);
      nmField = this.$el.find(".nstags-namespace-widget " + ("input[name=namespace_" + this.namespaceCounter + "]"));
      if (namespace === KW_NAMESPACE) {
        nmField.attr('disabled', 'disabled');
      } else {
        nmField.autocomplete({
          source: '/tags/search_namespace',
          minLength: 1
        });
      }
      tagsField = this.$el.find(".nstags-tags-container " + ("input[name=tags_" + this.namespaceCounter + "]"));
      tagsField.tagsInput({
        defaultText: i18n("classifier"),
        height: 'auto',
        width: '100%',
        autocomplete_url: function(req, resp) {
          var val;
          val = nmField.val();
          return $.get("/tags/search_tags?namespace=" + val + "&term=" + req.term, function(data) {
            data = JSON.parse(data);
            return resp(data);
          });
        }
      });
      this.namespaceCounter++;
      return false;
    };

    NamespacedTagsWidget.prototype.removeNamespace = function(evt) {
      var $el, ns_counter;
      evt.preventDefault();
      $el = $(evt.target);
      ns_counter = $(evt.target).attr('nstags_counter');
      if (!ns_counter) ns_counter = $(evt.target).parent().attr('nstags_counter');
      $el = this.$el.find(".nstags-namespace-container[nstags_counter=" + ns_counter + "]");
      $el.unbind();
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
      var keys, nm, _i, _len;
      this.$el.find('.nstags-namespace-container').remove();
      keys = _.sortBy(_.keys(obj), function(el) {
        return el;
      });
      if (_.contains(keys, KW_NAMESPACE)) {
        keys = _.without(keys, KW_NAMESPACE);
        keys.splice(0, 0, KW_NAMESPACE);
      }
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        nm = keys[_i];
        this.addNamespace({}, nm, obj[nm]);
      }
      return this;
    };

    NamespacedTagsWidget.prototype.validate = function(obj) {
      var valid,
        _this = this;
      valid = true;
      this.$el.find('.nstags-namespace-container').each(function(idx, obj) {
        var $nm, $obj, $tags;
        $obj = $(obj);
        if (valid) {
          $nm = $obj.find('.nstags-namespace-input');
          if (!$nm.val()) {
            _this.errorTargetName = $obj.attr('for');
            _this.error = i18n('Classifier Type can\'t be empty');
            valid = false;
          }
        }
        if (valid) {
          $tags = $obj.find('.nstags-tags-input');
          if ($nm.val() !== KW_NAMESPACE && !$tags.val()) {
            _this.errorTargetName = $obj.attr('for');
            _this.error = i18n('A Classifier Type can\'t have an empty Tags list');
            return valid = false;
          }
        }
      });
      return valid;
    };

    return NamespacedTagsWidget;

  })(ReForm.Widget);

  if (typeof KomooNS === "undefined" || KomooNS === null) KomooNS = {};

  if (KomooNS.widgets == null) KomooNS.widgets = {};

  KomooNS.widgets.NamespacedTagsWidget = NamespacedTagsWidget;

}).call(this);
