require [
    'jquery',
    'backbone',
    'authentication/router'
  ], ($, Backbone, router) ->

    $ ->
      loginApp = new  router.LoginApp {}

      Backbone.history.start()




