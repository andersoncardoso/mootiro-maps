trans = window.MootiroTranslations
window.i18n = (str) ->
  lang = KomooNS.lang
  if trans[str]?[lang] then trans[str][lang] else str


