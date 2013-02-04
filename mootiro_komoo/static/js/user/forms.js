(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var UserInfoForm, form;
    form = require('core/form');
    UserInfoForm = (function(_super) {

      __extends(UserInfoForm, _super);

      function UserInfoForm() {
        UserInfoForm.__super__.constructor.apply(this, arguments);
      }

      UserInfoForm.prototype.fields = [
        {
          name: 'name',
          label: i18n('Name'),
          container_class: 'name',
          widget: form.commonWidgets.TextWidget
        }, {
          name: 'contact',
          label: i18n('Contact'),
          container_class: 'contact',
          widget: form.widgets.ContactWidget
        }, {
          name: 'about_me',
          label: i18n('About me'),
          container_class: 'about-me',
          widget: form.commonWidgets.TextAreaWidget
        }
      ];

      return UserInfoForm;

    })(form.BaseForm);
    return {
      UserInfoForm: UserInfoForm
    };
  });

}).call(this);
