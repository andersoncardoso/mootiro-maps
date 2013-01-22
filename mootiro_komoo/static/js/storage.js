(function() {

  define(function(require) {
    var storage;
    storage = {
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
      },
      cookie: {
        set: function(key, val, days) {
          var date, expires;
          expires = days ? (date = new Date(), date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)), "; expires=" + (date.toGMTString())) : "";
          return document.cookie = "" + key + "=" + val + expires + "; path=/";
        },
        get: function(key) {
          var c, ca, nameEQ, _i, _len;
          nameEQ = "" + key + "=";
          ca = document.cookie.split(';');
          for (_i = 0, _len = ca.length; _i < _len; _i++) {
            c = ca[_i];
            while (c.charAt(0) === ' ') {
              c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
              return c.substring(nameEQ.length, c.length);
            }
          }
          return null;
        },
        remove: function(key) {
          return storage.cookie.set(key, '', -1);
        }
      }
    };
    return storage;
  });

}).call(this);
