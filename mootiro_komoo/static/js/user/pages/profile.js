(function() {

  define(function(require) {
    var $, User, render, start, userModels, userViews;
    $ = require('jquery');
    userModels = require('user/models');
    userViews = require('user/views');
    User = userModels.User;
    render = function(id) {
      var dfd, user, _ref, _ref2, _ref3;
      if (!(id != null)) {
        if (typeof console !== "undefined" && console !== null) {
          console.log('User id not specified');
        }
        return;
      }
      if ((id != null) && ((_ref = KomooNS.data) != null ? (_ref2 = _ref.user) != null ? _ref2.id : void 0 : void 0) === id) {
        dfd = user = new User(KomooNS.data.user);
      } else if (id !== 'me') {
        user = new User();
        user.id = id;
        dfd = user.fetch();
      } else if ((_ref3 = KomooNS.user) != null ? _ref3.id : void 0) {
        user = new User(KomooNS.user);
        dfd = user.fetch();
      }
      window.user = user;
      $.when(dfd).done(function() {
        var profileView, sidebarView;
        $('#action-bar').empty();
        profileView = new userViews.Profile({
          model: user,
          el: '#main-content'
        });
        return sidebarView = new userViews.Sidebar({
          model: user,
          el: '#sidebar'
        });
      }).fail(function() {
        var Backbone;
        Backbone = require('backbone');
        return Backbone.trigger('main::notfound');
      });
      return true;
    };
    start = function() {};
    return {
      start: start,
      render: render
    };
  });

}).call(this);
