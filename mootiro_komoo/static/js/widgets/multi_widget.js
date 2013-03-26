(function() {
  var MultiWidget, collectionTemplate, fieldTemplate, multiTemplate, _base,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  collectionTemplate = "<div class=\"collection-container <%=container_class%>\">\n  <a href=\"#\" class=\"remove\" title=\"<%=i18n('Remove')%>\">[-]</a>\n</div>";

  fieldTemplate = "<div class=\"field-container <%=container_class%>\">\n  <label><%=label%></label>\n  <div class=\"widget-container\"></div>\n</div>";

  multiTemplate = "<div class=\"fields-container\"></div>\n<a class=\"add-row\"><%=i18n('+ Add another one')%></a>";

  MultiWidget = (function(_super) {

    __extends(MultiWidget, _super);

    function MultiWidget() {
      MultiWidget.__super__.constructor.apply(this, arguments);
    }

    MultiWidget.prototype.fields = [];

    MultiWidget.prototype.collectionTemplate = collectionTemplate;

    MultiWidget.prototype.fieldTemplate = fieldTemplate;

    MultiWidget.prototype.template = multiTemplate;

    MultiWidget.prototype.events = {
      'click .add-row': 'onAddClick',
      'click .remove': 'onRemoveClick'
    };

    MultiWidget.prototype.initialize = function() {
      this.options.type = 'json';
      this.rows = 0;
      this.renderedFields = [];
      return MultiWidget.__super__.initialize.apply(this, arguments);
    };

    MultiWidget.prototype.set = function(value) {
      var row, _i, _len, _results;
      this.clear();
      if (_.isArray(value)) {
        _results = [];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          row = value[_i];
          _results.push(this.addRow(row));
        }
        return _results;
      }
    };

    MultiWidget.prototype.get = function() {
      var field, isEmpty, key, row, value, widget, _i, _len, _ref, _ref2;
      value = [];
      _ref = this.renderedFields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        isEmpty = true;
        row = {};
        _ref2 = field.data('instances');
        for (key in _ref2) {
          widget = _ref2[key];
          row[key] = widget.get();
          if (row[key]) isEmpty = false;
        }
        if (!isEmpty) value.push(row);
      }
      if (!_.isEmpty(value)) {
        return value;
      } else {
        return null;
      }
    };

    MultiWidget.prototype.clear = function() {
      var field, instance, key, _i, _len, _ref, _ref2;
      _ref = this.renderedFields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        _ref2 = field.data('instances');
        for (key in _ref2) {
          instance = _ref2[key];
          instance.unbind().remove();
        }
        field.remove();
      }
      this.rows = 0;
      this.renderedFields.length = 0;
      return this;
    };

    MultiWidget.prototype.remove = function() {
      this.clear();
      return MultiWidget.__super__.remove.apply(this, arguments);
    };

    MultiWidget.prototype.onAddClick = function(e) {
      e.preventDefault();
      return this.addRow();
    };

    MultiWidget.prototype.onRemoveClick = function(e) {
      var el;
      e.preventDefault();
      el = $(e.target);
      return el.parent().remove();
    };

    MultiWidget.prototype.addRow = function(content) {
      var args, field, instances, key, renderedCollection, value, widget, _collectionTemplate, _fieldTemplate, _i, _len, _ref, _ref2;
      _collectionTemplate = _.template(this.collectionTemplate);
      _fieldTemplate = _.template(this.fieldTemplate);
      args = {
        name: this.rows,
        input_id: "id_" + this.rows,
        container_class: 'row'
      };
      renderedCollection = $('<div>').html(_collectionTemplate(args)).children().detach();
      instances = {};
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        args = {
          name: "" + this.name + "_" + field.name + "_" + this.rows,
          label: field.label || '',
          value: field.value || '',
          container_class: field.container_class || ''
        };
        args = _.extend(args, field.args || {});
        widget = new field.widget(args);
        instances[field.name] = widget;
        field = $('<div>').html(_fieldTemplate(args)).children().detach();
        field.find('.widget-container').append(widget.render().el);
        renderedCollection.append(field).data('instances', instances);
      }
      this.$('.fields-container').append(renderedCollection);
      for (key in content) {
        value = content[key];
        if ((_ref2 = instances[key]) != null) _ref2.set(value);
      }
      this.renderedFields.push(renderedCollection);
      this.rows++;
      return this;
    };

    return MultiWidget;

  })(ReForm.Widget);

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).widgets == null) _base.widgets = {};

  window.KomooNS.widgets.MultiWidget = MultiWidget;

}).call(this);
