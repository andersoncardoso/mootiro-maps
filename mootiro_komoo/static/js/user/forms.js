(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var UserInfoForm, reForm;
    reForm = require('reForm');
    UserInfoForm = (function(_super) {

      __extends(UserInfoForm, _super);

      function UserInfoForm() {
        UserInfoForm.__super__.constructor.apply(this, arguments);
      }

      UserInfoForm.prototype.fields = [
        {
          name: 'name',
          container_class: 'name',
          widget: reForm.commonWidgets.TextWidget,
          label: i18n('Name')
        }, {
          name: 'about_me',
          container_class: 'about-me',
          widget: reForm.commonWidgets.TextAreaWidget,
          label: i18n('About me')
        }
      ];

      return UserInfoForm;

    })(reForm.Form);
    return {
      UserInfoForm: UserInfoForm
    };
  });

}).call(this);
