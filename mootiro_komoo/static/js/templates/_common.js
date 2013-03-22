(function() {
  var formTemplate, _base;

  formTemplate = "<form action=\"\" method=\"post\" id=\"<%= formId %>\" >\n    <div class=\"form-actions\">\n        <input class=\"btn button\" type=\"submit\" name=\"submit\" value=\"<%=submit_label%>\" />\n    </div>\n</form>";

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).templates == null) _base.templates = {};

  window.KomooNS.templates.formTemplate = formTemplate;

}).call(this);
