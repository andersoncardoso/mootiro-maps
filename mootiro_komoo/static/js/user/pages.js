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
      User = require('user/models').User;
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
        var profilePage, user, userViews;
        userViews = require('user/views');
        user = getUser(id);
        user.on('error', function(model, error) {
          if (error.status === 404) {
            return Backbone.trigger('main::notFound', model);
          }
        });
        window.user = user;
        $('#action-bar').empty();
        profilePage = new pageManager.Page({
          sidebar: new userViews.Sidebar({
            model: user
          }),
          mainContent: new userViews.Profile({
            model: user
          })
        });
        return $.when(user.fetch()).done(function() {
          return pageManager.open(profilePage);
        });
      }
    };
    return {
      getUser: getUser,
      profile: profile
    };
  });

}).call(this);
