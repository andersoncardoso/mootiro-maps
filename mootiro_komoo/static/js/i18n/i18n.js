(function() {
  var trans;

  trans = window.MootiroTranslations;

  window.i18n = function(str) {
    var lang, _ref;
    lang = KomooNS.lang;
    if ((_ref = trans[str]) != null ? _ref[lang] : void 0) {
      return trans[str][lang];
    } else {
      return str;
    }
  };

}).call(this);
