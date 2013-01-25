define (require) ->
  common = require 'common'
  i18n = require 'i18n'
  App = require('core/app').App

  app = new App

  return app
