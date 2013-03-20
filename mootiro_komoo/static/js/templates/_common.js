(function() {
  var formTemplate;

  formTemplate = "<form action=\"\" method=\"post\" id=\"<%= formId %>\" >\n    <div class=\"form-actions\">\n        <input class=\"btn button\" type=\"submit\" name=\"submit\" value=\"<%=submit_label%>\" />\n    </div>\n</form>";

  if (typeof KomooNS === "undefined" || KomooNS === null) KomooNS = {};

  if (KomooNS.templates == null) KomooNS.templates = {};

  KomooNS.templates.formTemplate = formTemplate;

}).call(this);
