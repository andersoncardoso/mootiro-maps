(function() {

  define(function(require) {
    'use strict';
    var PermissionMixin, _;
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
    return {
      PermissionMixin: PermissionMixin
    };
  });

}).call(this);
