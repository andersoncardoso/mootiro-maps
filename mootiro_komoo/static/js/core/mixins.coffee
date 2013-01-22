define (require) ->
  'use strict'

  _ = require 'underscore'

  PermissionMixin =
    defaultPermissions:
      view: true
      edit: true

    hasPermission: (action, user) ->
      permission = @permissions?[action] ? @defaultPermissions[action]

      if not permission
        return false

      if _.isFunction permission
        user ?= KomooNS.user
        permission = permission.apply this, [user]

      return permission


  PermissionMixin: PermissionMixin
