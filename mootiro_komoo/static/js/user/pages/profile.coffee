define (require) ->
  $ = require 'jquery'

  userModels = require('user/models')
  userViews = require 'user/views'
  User = userModels.User

  render = (id) ->

    if not id?
      console?.log 'User id not specified'
      return

    if id? and KomooNS.data?.user?.id is id
      dfd = user = new User KomooNS.data.user
    else if id isnt 'me'
      user = new User()
      user.id = id
      dfd = user.fetch()
    else if KomooNS.user?.id
      user = new User KomooNS.user
      dfd = user.fetch()


    window.user = user

    $.when(dfd).done ->
      $('#action-bar').empty()

      profileView = new userViews.Profile
        model: user
        el: '#main-content'

      sidebarView = new userViews.Sidebar
        model: user
        el: '#sidebar'
    .fail ->
      Backbone = require 'backbone'
      Backbone.trigger 'main::notfound'



    true

  start = () ->
    return

  start: start
  render: render
