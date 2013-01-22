define (require) ->
  ##
  #  Utilitary functions for working with session and local storage
  #  usage:
  #      storage.session.set('my_key', my_obj)
  #      storage.session.get('my_key')
  #
  #      storage.local.set('otherkey', otherobj)
  #      sotrage.local.remove('otherkey')
  #
  #      storage.cookie.set('key', 'string')
  #      storage.cookie.get('key')
  #      sotrage.cookie.remove('key')
  ##

  storage = {
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

    cookie:
      set: (key, val, days) ->
        expires =
        if days
          date = new Date()
          date.setTime date.getTime() + (days * 24 * 60 * 60 * 1000)
          "; expires=#{date.toGMTString()}"
        else
          ""
        document.cookie = "#{key}=#{val}#{expires}; path=/"
      get: (key) ->
        nameEQ = "#{key}="
        ca = document.cookie.split ';'
        for c in ca
          while c.charAt(0) is ' '
            c = c.substring 1, c.length
          return c.substring(nameEQ.length, c.length) if c.indexOf(nameEQ) is 0
        return null
      remove: (key) ->
        storage.cookie.set key, '', -1
  }


  return storage
