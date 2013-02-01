(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var ContactWidget, OrganizationForm, app, reForm;
    app = require('app');
    reForm = require('reForm');
    ContactWidget = require('widgets/reForm/contact').ContactWidget;
    OrganizationForm = (function(_super) {

      __extends(OrganizationForm, _super);

      function OrganizationForm() {
        OrganizationForm.__super__.constructor.apply(this, arguments);
      }

      OrganizationForm.prototype.fields = [
        {
          name: 'name',
          widget: reForm.commonWidgets.TextWidget,
          label: i18n('Name')
        }, {
          name: 'description',
          widget: reForm.commonWidgets.TextWidget,
          label: i18n('Description')
        }, {
          name: 'contact',
          container_class: 'contact',
          widget: ContactWidget,
          label: i18n('Contact')
        }
      ];

      return OrganizationForm;

    })(reForm.Form);
    return {
      OrganizationForm: OrganizationForm
    };
  });

}).call(this);
