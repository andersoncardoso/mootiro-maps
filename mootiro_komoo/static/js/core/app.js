(function() {

  define(function(require) {
    'use strict';
    var $, App, Backbone, pageManager, storage, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    storage = require('storage');
    pageManager = require('core/page_manager');
    App = (function() {

      _.extend(App.prototype, Backbone.Events);

      function App() {
        var _this = this;
        $.when(this.interceptAjaxRequests(), this.handleModulesError(), this.initializeUser(), this.initializeRouters(), this.initializeAnalytics()).done(function() {
          return $.when(_this.drawLayout(), _this.initializeMapEditor()).done(function() {
            return _this.trigger('initialize');
          });
        });
      }

      App.prototype.goTo = function(url, page) {
        var _this = this;
        return $.when(pageManager.canClose()).done(function() {
          if (page != null) {
            _this.routers[0].navigate(url);
            return pageManager.open(page);
          } else {
            return _this.routers[0].navigate(url, {
              trigger: true
            });
          }
        });
      };

      App.prototype.handleModulesError = function() {
        var _this = this;
        requirejs.onError = function(err) {
          if (err.requireType === 'timeout') {
            alert("Timeout: Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente.");
          } else {
            throw err;
          }
          return _this.trigger('error', err);
        };
        return true;
      };

      App.prototype.interceptAjaxRequests = function() {
        var lastSessionId, safeMethod, sameOrigin,
          _this = this;
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
        $(document).ajaxSend(function(event, xhr, settings) {
          if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
            return xhr.setRequestHeader("X-CSRFToken", storage.cookie.get('csrftoken'));
          }
        });
        lastSessionId = storage.cookie.get('sessionid');
        $(document).ajaxSuccess(function(event, xhr, settings) {
          var sessionId;
          sessionId = storage.cookie.get('sessionid');
          if (sameOrigin(settings.url) && lastSessionId !== sessionId) {
            _this.trigger('change:session', sessionId);
          }
          return lastSessionId = sessionId;
        });
        $(document).ajaxStart(function() {
          return _this.trigger('working');
        });
        $(document).ajaxStop(function() {
          return _this.trigger('done');
        });
        return true;
      };

      App.prototype.initializeUser = function() {
        var dfd,
          _this = this;
        dfd = new $.Deferred();
        require(['user/models'], function(userModels) {
          var User;
          User = userModels.User;
          if (KomooNS.isAuthenticated) {
            KomooNS.user = new User(KomooNS.user_data);
          } else {
            KomooNS.user = new User({});
          }
          _this.on('change:session', function(sessionId) {
            KomooNS.user.clear();
            KomooNS.user.set('id', 'me');
            return KomooNS.user.fetch({
              success: function(model) {
                KomooNS.isAuthenticated = model.get('id') !== null;
                return model.trigger('change');
              }
            });
          });
          return dfd.resolve(true);
        });
        return dfd.promise();
      };

      App.prototype.drawLayout = function() {
        var dfd,
          _this = this;
        dfd = new $.Deferred();
        require(['main/views'], function(mainViews) {
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
          true;
          return dfd.resolve(true);
        });
        return dfd.promise();
      };

      App.prototype.initializeRouters = function() {
        var dfd,
          _this = this;
        dfd = new $.Deferred();
        this.routers = [];
        $(function() {
          return require(['main/router', 'authentication/router', 'user/router', 'map/router'], function() {
            var router, _i, _len;
            for (_i = 0, _len = arguments.length; _i < _len; _i++) {
              router = arguments[_i];
              _this.routers.push(new router);
            }
            window.routers = _this.routers;
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

      App.prototype.initializeMapEditor = function() {
        var dfd,
          _this = this;
        dfd = new $.Deferred();
        require(['main/views'], function(mainViews) {
          var mapEditor;
          $('#map-editor-container').hide();
          mapEditor = new mainViews.MapEditor({
            el: '#map-editor-container'
          });
          _this.mapEditor = mapEditor.getMap();
          return dfd.resolve(true);
        });
        return dfd.promise();
      };

      App.prototype.showMainMap = function() {
        return $('#map-editor-container').show();
      };

      App.prototype.hideMainMap = function() {
        return $('#map-editor-container').hide();
      };

      return App;

    })();
    return {
      App: App
    };
  });

}).call(this);
