(function() {

  define(function(require) {
    var App, jQuery;
    App = require('app');
    jQuery = require('jquery');
    requirejs.onError = function(err) {
      if (err.requireType === 'timeout') {
        alert('Timeout', "Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente.");
        return typeof console !== "undefined" && console !== null ? console.error(err) : void 0;
      } else {
        throw err;
      }
    };
    window.storage = {
      session: {
        set: function(key, obj) {
          return window.sessionStorage.setItem(key, JSON.stringify(obj));
        },
        get: function(key) {
          return JSON.parse(window.sessionStorage.getItem(key));
        },
        remove: function(key) {
          return window.sessionStorage.removeItem(key);
        }
      },
      local: {
        set: function(key, obj) {
          return window.localStorage.setItem(key, JSON.stringify(obj));
        },
        get: function(key) {
          return JSON.parse(window.localStorage.getItem(key));
        },
        remove: function(key) {
          return window.localStorage.removeItem(key);
        }
      }
    };
    window.getCookie = function(name) {
      var cookie, cookieValue, cookies, _i, _len;
      cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        cookies = document.cookie.split(';');
        for (_i = 0, _len = cookies.length; _i < _len; _i++) {
          cookie = cookies[_i];
          cookie = jQuery.trim(cookie);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    };
    return jQuery(document).ajaxSend(function(event, xhr, settings) {
      var safeMethod, sameOrigin;
      sameOrigin = function(url) {
        var host, origin, protocol, sr_origin;
        host = document.location.host;
        protocol = document.location.protocol;
        sr_origin = '//' + host;
        origin = protocol + sr_origin;
        return (url === origin || url.slice(0, origin.length + 1) === origin + '/') || (url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin + '/') || (!(/^(\/\/|http:|https:).*/.test(url)));
      };
      safeMethod = function(method) {
        return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
      };
      if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        return xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
      }
    });
  });

  window.getUrlVars = function() {
    var hash, hashes, vars, _i, _len;
    vars = [];
    hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    console.log(hashes);
    for (_i = 0, _len = hashes.length; _i < _len; _i++) {
      hash = hashes[_i];
      hash = hash.split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  };

}).call(this);
