(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var ContactWidget, MultiWidget, UserInfoForm, reForm;
    reForm = require('reForm');
    MultiWidget = require('main/forms').MultiWidget;
    ContactWidget = (function(_super) {

      __extends(ContactWidget, _super);

      function ContactWidget() {
        ContactWidget.__super__.constructor.apply(this, arguments);
      }

      ContactWidget.prototype.fieldTemplate = "<div class=\"subfield-container <%=container_class%>\">\n  <div class=\"widget-container\"></div>\n</div>";

      ContactWidget.prototype.fields = [
        {
          name: 'type',
          container_class: 'type',
          widget: reForm.commonWidgets.TextWidget
        }, {
          name: 'value',
          container_class: 'value',
          widget: reForm.commonWidgets.TextWidget
        }
      ];

      return ContactWidget;

    })(MultiWidget);
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

      return UserInfoForm;

    })(reForm.Form);
    return {
      UserInfoForm: UserInfoForm
    };
  });

}).call(this);
