define (require) ->
  'use strict'

  app = require 'app'
  form = require 'core/form'


  # Mymodel Form
  class MymodelForm extends form.BaseForm
    fields: [
      {
        name: 'name'
        label: i18n 'Name'
        widget: form.commonWidgets.TextWidget
      }

      # more fields of your model ...

    ]


  return {
    MymodelForm: MymodelForm
  }
