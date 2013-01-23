(function() {

  define(function(require) {
    var App, Backbone, User, jQuery, mainViews, storage;
    jQuery = require('jquery');
    Backbone = require('backbone');
    storage = require('storage');
    User = require('user/models').User;
    mainViews = require('main/views');
    App = (function() {

      function App() {
        $.when(this.handleModulesError(), this.interceptAjaxRequests(), this.initializeUser(), this.drawLayout(), this.initializeRouters(), this.initializeAnalytics()).done(function() {
          return Backbone.trigger('initialize');
        });
      }

      App.prototype.handleModulesError = function() {
        requirejs.onError = function(err) {
          if (err.requireType === 'timeout') {
            alert("Timeout: Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente.");
          } else {
            throw err;
          }
          return Backbone.trigger('error', err);
        };
        return true;
      };

      App.prototype.interceptAjaxRequests = function() {
        var lastSessionId, safeMethod, sameOrigin;
        sameOrigin = function(url) {
          var host, origin, protocol, sr_origin;
          host = document.location.host;
          protocol = document.location.protocol;
          sr_origin = '//' + host;
          origin = protocol + sr_origin;
          return (url === origin || url.slice(0, origin.length + 1) === origin + '/') || (url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin + '/') || (!/^(\/\/|http:|https:).*/.test(url));
        };
        safeMethod = function(method) {
          return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
        };
        jQuery(document).ajaxSend(function(event, xhr, settings) {
          if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
            return xhr.setRequestHeader("X-CSRFToken", storage.cookie.get('csrftoken'));
          }
        });
        lastSessionId = storage.cookie.get('sessionid');
        jQuery(document).ajaxSuccess(function(event, xhr, settings) {
          var sessionId;
          sessionId = storage.cookie.get('sessionid');
          if (sameOrigin(settings.url) && lastSessionId !== sessionId) {
            Backbone.trigger('change:session', sessionId);
          }
          return lastSessionId = sessionId;
        });
        jQuery(document).ajaxStart(function() {
          return Backbone.trigger('working');
        });
        jQuery(document).ajaxStop(function() {
          return Backbone.trigger('done');
        });
        return true;
      };

      App.prototype.initializeUser = function() {
        if (KomooNS.isAuthenticated) {
          KomooNS.user = new User(KomooNS.user_data);
        } else {
          KomooNS.user = new User({});
        }
        Backbone.on('change:session', function(sessionId) {
          KomooNS.user.clear();
          KomooNS.user.set('id', 'me');
          return KomooNS.user.fetch({
            success: function(model) {
              KomooNS.isAuthenticated = model.get('id') !== null;
              return model.trigger('change');
            }
          });
        });
        return true;
      };

      App.prototype.drawLayout = function() {
        var feedback, footer, header;
        $('body').prepend($('<div id="fb-root" />'));
        feedback = new mainViews.Feedback({
          el: '#feedback-container'
        });
        header = new mainViews.Header({
          el: '#header-container',
          model: KomooNS.user
        });
        footer = new mainViews.Footer({
          el: '#footer-container'
        });
        return true;
      };

      App.prototype.initializeRouters = function() {
        var dfd,
          _this = this;
        dfd = new $.Deferred();
        this.routers = [];
        $(function() {
          return require(['main/router', 'authentication/router', 'user/router'], function() {
            var router, _i, _len;
            for (_i = 0, _len = arguments.length; _i < _len; _i++) {
              router = arguments[_i];
              _this.routers.push(new router);
            }
            Backbone.history.start({
              pushState: true,
              root: '/'
            });
            return dfd.resolve(true);
          });
        });
        return dfd.promise();
      };

      App.prototype.initializeAnalytics = function() {
        var dfd;
        dfd = new $.Deferred();
        $(function() {
          return require(['services/analytics'], function(analytics) {
            return dfd.resolve(analytics.initialize());
          });
        });
        return dfd.promise();
      };

      return App;

    })();
    return {
      App: App
    };
  });

}).call(this);
