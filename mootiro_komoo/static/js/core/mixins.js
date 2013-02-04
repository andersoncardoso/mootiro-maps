(function() {

  define(function(require) {
    'use strict';
    var EditOverlayMixin, PermissionMixin, _;
    _ = require('underscore');
    PermissionMixin = {
      defaultPermissions: {
        view: true,
        edit: true
      },
      hasPermission: function(action, user) {
        var permission, _ref, _ref2;
        permission = (_ref = (_ref2 = this.permissions) != null ? _ref2[action] : void 0) != null ? _ref : this.defaultPermissions[action];
        if (!permission) return false;
        if (_.isFunction(permission)) {
          if (user == null) user = KomooNS.user;
          permission = permission.apply(this, [user]);
        }
        return permission;
      }
    };
    EditOverlayMixin = {
      _overlayTemplate: _.template(require('text!templates/core/_edit_overlay.html')),
      setMode: function(mode) {
        var _ref;
        this.mode = mode != null ? mode : (_ref = this.options.mode) != null ? _ref : 'show';
        if (this.mode === 'edit') {
          return this.showOverlay();
        } else {
          return this.hideOverlay();
        }
      },
      showOverlay: function(msg) {
        if (msg == null) msg = i18n("Edit this");
        if (this._overlay == null) {
          this._overlay = $(this._overlayTemplate({
            msg: msg
          }));
        }
        return this.$el.append(this._overlay.css({
          marginTop: this.$el.height() * -1,
          height: this.$el.height()
        }));
      },
      hideOverlay: function() {
        var _ref;
        return (_ref = this._overlay) != null ? _ref.detach() : void 0;
      }
    };
    return {
      PermissionMixin: PermissionMixin,
      EditOverlayMixin: EditOverlayMixin
    };
  });

}).call(this);
