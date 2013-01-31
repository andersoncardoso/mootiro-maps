define (require) ->
  dutils = require 'dutils'
  urls = require 'dutils_urls'

  route = (name) ->
    # Converts Django urls to Backbone routes format

    dutils.conf.urls[name].replace(/^\/(.*)(\/)$/, '$1(/)')  # Set trailing slash optional
      .replace(/<([^>]*)>/g, ':$1')  # Convert django variables to backbone format
      .replace(/\.\*/g, '*path')  # Convert wildcard

  return {
    resolve: urls.resolve
    route: route
  }
