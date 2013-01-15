define (require) ->

  App = require 'app'
  jQuery = require 'jquery'
  Backbone = require 'backbone'

  requirejs.onError = (err) ->
    if err.requireType == 'timeout'
      # TODO: i18n me
      alert "Timeout: Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente."
     else
       throw err

      Backbone.trigger 'module::error', err


  ##
  #  Utilitary functions for working with session and local storage
  #  usage:
  #      storage.session.set('my_key', my_obj)
  #      storage.session.get('my_key')
  #
  #      storage.local.set('otherkey', otherobj)
  #      sotrage.local.remove('otherkey')
  ##
  window.storage = {
    session:
      set: (key, obj) ->
        window.sessionStorage.setItem key, JSON.stringify(obj)
      get: (key) ->
        JSON.parse window.sessionStorage.getItem(key)
      remove: (key) ->
        window.sessionStorage.removeItem key

    local:
      set: (key, obj) ->
        window.localStorage.setItem key, JSON.stringify(obj)
      get: (key) ->
        JSON.parse window.localStorage.getItem(key)
      remove: (key) ->
        window.localStorage.removeItem key
  }

  # function for getting xsrf cookies
  window.getCookie = (name) ->
    cookieValue = null
    if document.cookie and document.cookie isnt ''
        cookies = document.cookie.split ';'
        for cookie in cookies
            cookie = jQuery.trim(cookie)
            # Does this cookie string begin with the name we want?
            if cookie.substring(0, name.length + 1) is (name + '=')
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                break
    cookieValue


  # Add csrf token to ajax requests
  jQuery(document).ajaxSend (event, xhr, settings) ->
    sameOrigin = (url) ->
      # url could be relative or scheme relative or absolute
      host = document.location.host  # host + port
      protocol = document.location.protocol
      sr_origin = '//' + host
      origin = protocol + sr_origin
      # Allow absolute or scheme relative URLs to same origin
      return (
               url is origin or
               url.slice(0, origin.length + 1) is origin + '/'
             ) or (
               url is sr_origin or
               url.slice(0, sr_origin.length + 1) is sr_origin + '/'
             ) or (
               # or any other URL that isn't scheme relative or absolute
               # i.e relative.
               not (/^(\/\/|http:|https:).*/.test(url))
             )

      safeMethod = (method) ->
          /^(GET|HEAD|OPTIONS|TRACE)$/.test(method)

      if not safeMethod(settings.type) and sameOrigin(settings.url)
          xhr.setRequestHeader "X-CSRFToken", getCookie('csrftoken')


  ##
  #  retrieve params from url
  ##
  window.getUrlVars = () ->
      vars = []
      hashes = window.location.href.slice(
          window.location.href.indexOf('?') + 1).split('&')
      console?.log hashes
      for hash in hashes
        hash = hash.split '='
        vars.push hash[0]
        vars[hash[0]] = hash[1]
      vars



