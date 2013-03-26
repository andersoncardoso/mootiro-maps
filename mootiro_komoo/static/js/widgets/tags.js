(function() {
  var $, TagsWidget,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  TagsWidget = (function(_super) {

    __extends(TagsWidget, _super);

    function TagsWidget() {
      TagsWidget.__super__.constructor.apply(this, arguments);
    }

    TagsWidget.prototype.template = "<input name=\"<%=name%>\" id=\"id_<%=name%>\" value=\"<%=value%>\">";

    TagsWidget.prototype.behavior = function() {
      var _this = this;
      return $(document).ready(function() {
        return _this.$el.find("#id_" + _this.name).tagsInput({
          defaultText: i18n("Add"),
          height: 'auto',
          width: '100%'
        });
      });
    };

    return TagsWidget;

  })(ReForm.Widget);

  if (typeof KomooNS === "undefined" || KomooNS === null) KomooNS = {};

  if (KomooNS.widgets == null) KomooNS.widgets = {};

  KomooNS.widgets.TagsWidget = TagsWidget;

}).call(this);
