(function() {

  define(function(require) {
    var Backbone, drawLayout, handleModulesError, initializeAnalytics, initializeApp, initializeRouters, interceptAjaxRequests, jQuery, storage;
    jQuery = require('jquery');
    Backbone = require('backbone');
    storage = require('storage');
    handleModulesError = function() {
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
    interceptAjaxRequests = function() {
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
    drawLayout = function() {
      var dfd;
      dfd = new $.Deferred();
      $('body').prepend($('<div id="fb-root" />'));
      require(['main/views'], function(mainViews) {
        var User, feedbackView, footer, header, modelsWorking;
        feedbackView = new mainViews.Feedback();
        $('#feedback-container').append(feedbackView.$el);
        modelsWorking = 0;
        Backbone.on('working', function() {
          modelsWorking++;
          return feedbackView.display('Working...');
        });
        Backbone.on('done', function() {
          if (--modelsWorking === 0) return feedbackView.close();
        });
        Backbone.trigger('working');
        User = require('user/models').User;
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
        header = new mainViews.Header({
          el: '#header-container',
          model: KomooNS.user
        });
        footer = new mainViews.Footer({
          el: '#footer-container'
        });
        return dfd.resolve(true);
      });
      return dfd.promise();
    };
    initializeRouters = function() {
      var dfd;
      dfd = new $.Deferred();
      $(function() {
        return require(['main/router', 'authentication/router', 'user/router'], function() {
          Backbone.history.start({
            pushState: true,
            root: '/'
          });
          Backbone.trigger('done');
          return dfd.resolve(true);
        });
      });
      return dfd.promise();
    };
    initializeAnalytics = function() {
      var dfd;
      dfd = new $.Deferred();
      $(function() {
        return require(['services/analytics'], function(analytics) {
          analytics.init();
          return dfd.resolve(true);
        });
      });
      return dfd.promise();
    };
    initializeApp = function() {
      var i18n;
      i18n = require('i18n');
      return $.when(handleModulesError(), interceptAjaxRequests(), drawLayout(), initializeRouters(), initializeAnalytics()).done(function() {
        return Backbone.trigger('initialize');
      });
    };
    return {
      initializeApp: initializeApp
    };
  });

}).call(this);
