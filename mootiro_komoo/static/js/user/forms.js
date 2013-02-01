(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var ContactWidget, UserInfoForm, reForm;
    reForm = require('reForm');
    ContactWidget = require('widgets/reForm/contact').ContactWidget;
    UserInfoForm = (function(_super) {

      __extends(UserInfoForm, _super);

      function UserInfoForm() {
        UserInfoForm.__super__.constructor.apply(this, arguments);
      }

      UserInfoForm.prototype.template = require('text!templates/forms/_inline_form.html');

      UserInfoForm.prototype.fields = [
        {
          name: 'name',
          container_class: 'name',
          widget: reForm.commonWidgets.TextWidget,
          label: i18n('Name')
        }, {
          name: 'contact',
          container_class: 'contact',
          widget: ContactWidget,
          label: i18n('Contact')
        }, {
          name: 'about_me',
          container_class: 'about-me',
          widget: reForm.commonWidgets.TextAreaWidget,
          label: i18n('About me')
        }
      ];

      UserInfoForm.prototype.events = {
        'click .cancel': 'onCancelClick'
      };

      UserInfoForm.prototype.onCancelClick = function(e) {
        if (e != null) e.preventDefault();
        this.set(this.model.toJSON());
        return this.trigger('cancel');
      };

      UserInfoForm.prototype.wasChanged = function() {
        return !_.isEqual(this.get(), _.pick(this.model.toJSON(), _.pluck(this.fields, 'name')));
      };

      return UserInfoForm;

    })(reForm.Form);
    return {
      UserInfoForm: UserInfoForm
    };
  });

}).call(this);
