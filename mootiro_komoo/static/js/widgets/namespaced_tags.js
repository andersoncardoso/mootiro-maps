(function() {
  var MultiWidget, NamespacedTagsWidget, TagsWidget,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  MultiWidget = KomooNS.widgets.MultiWidget;

  TagsWidget = KomooNS.widgets.TagsWidget;

  NamespacedTagsWidget = (function(_super) {

    __extends(NamespacedTagsWidget, _super);

    function NamespacedTagsWidget() {
      NamespacedTagsWidget.__super__.constructor.apply(this, arguments);
    }

    return NamespacedTagsWidget;

  })(TagsWidget);

  if (typeof KomooNS === "undefined" || KomooNS === null) KomooNS = {};

  if (KomooNS.widgets == null) KomooNS.widgets = {};

  KomooNS.widgets.NamespacedTagsWidget = NamespacedTagsWidget;

}).call(this);
