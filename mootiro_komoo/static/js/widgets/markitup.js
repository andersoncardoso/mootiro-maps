(function() {
  var $, MarkItUpWidget, _base;

  $ = jQuery;

  MarkItUpWidget = ReForm.Widget.extend({
    template: "<textarea class=\"markItUpEditor\" name=\"<%=name%>\" id=\"id_<%=name%>\" value=\"<%=value%>\">",
    behavior: function() {
      var _this = this;
      return $(document).ready(function() {
        _this.$el.find("#id_" + _this.name).markItUp(mySettings);
        return _this.$el.find('a[title="Preview"]').trigger('mouseup');
      });
    },
    getInputElement: function() {
      return this.$('textarea');
    }
  });

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).widgets == null) _base.widgets = {};

  window.KomooNS.widgets.MarkItUpWidget = MarkItUpWidget;

}).call(this);
