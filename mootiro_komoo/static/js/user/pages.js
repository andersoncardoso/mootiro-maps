(function() {

  define(function(require) {
    'use strict';
    var $, Backbone, getUser, pageManager, profile;
    $ = require('jquery');
    Backbone = require('backbone');
    pageManager = require('page_manager');
    getUser = function(id) {
      var User, user;
      if (!(id != null)) {
        if (typeof console !== "undefined" && console !== null) {
          console.log('User id not specified');
        }
        return;
      }
      User = require('./models').User;
      user = new User();
      user.id = id;
      user.on('request', function(model) {
        return Backbone.trigger('app::working', model);
      });
      user.on('sync', function(model, resp, options) {
        return Backbone.trigger('app::done', model);
      });
      user.on('error', function(model, error) {
        if (error.status != null) return Backbone.trigger('app::done', model);
      });
      return user;
    };
    profile = {
      render: function(id) {
        var dfd, user, views;
        views = require('./views');
        dfd = new $.Deferred();
        user = getUser(id);
        user.fetch().done(function() {
          var profilePage;
          $('#action-bar').empty();
          profilePage = new pageManager.Page({
            sidebar: new views.Sidebar({
              model: user
            }),
            mainContent: new views.Profile({
              model: user
            })
          });
          pageManager.open(profilePage);
          return dfd.resolve();
        }).fail(function(jqXHR) {
          return dfd.reject(jqXHR);
        });
        return dfd.promise();
      }
    };
    return {
      getUser: getUser,
      profile: profile
    };
  });

}).call(this);
