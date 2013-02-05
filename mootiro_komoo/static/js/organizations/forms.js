(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var OrganizationForm, form;
    form = require('core/form');
    OrganizationForm = (function(_super) {

      __extends(OrganizationForm, _super);

      function OrganizationForm() {
        OrganizationForm.__super__.constructor.apply(this, arguments);
      }

      OrganizationForm.prototype.fields = [
        {
          name: 'name',
          label: i18n('Name'),
          widget: form.commonWidgets.TextWidget
        }, {
          name: 'description',
          label: i18n('Description'),
          widget: form.commonWidgets.TextWidget
        }, {
          name: 'contact',
          label: i18n('Contact'),
          container_class: 'contact',
          widget: form.widgets.ContactWidget
        }
      ];

      return OrganizationForm;

    })(form.BaseForm);
    return {
      OrganizationForm: OrganizationForm
    };
  });

}).call(this);
