define (require) ->
  dutils = require 'dutils'
  urls = require 'dutils_urls'

  route = (name) ->
    dutils.conf.urls[name].replace(/^\/(.*)(\/)$/, '$1(/)').replace(/<([^>]*)>/g, ':$1')

  return {
    resolve: urls.resolve
    route: route
  }
