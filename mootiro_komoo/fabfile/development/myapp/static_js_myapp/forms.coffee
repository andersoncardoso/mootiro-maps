define (require) ->
  'use strict'

  app = require 'app'
  reForm = require 'reForm'


  # Mymodel Form
  class MymodelForm extends reForm.Form
    fields: [
      {
        name: 'name'
        widget: reForm.commonWidgets.TextWidget
        label: i18n 'Name'
      }

      # more fields of your model ...

    ]


  return {
    MymodelForm: MymodelForm
  }
