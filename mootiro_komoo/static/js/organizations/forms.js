(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var OrganizationForm, app, reForm;
    app = require('app');
    reForm = require('reForm');
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
        }
      ];

      OrganizationForm.prototype.initialize = function() {
        OrganizationForm.__super__.initialize.apply(this, arguments);
        return this.bind('success', this.onSuccess);
      };

      OrganizationForm.prototype.onSuccess = function(data) {
        console.log("OrganizationForm::onSuccess");
        console.log(data);
        app.trigger('change', this.model);
        return this.model.show();
      };

      return OrganizationForm;

    })(reForm.Form);
    return {
      OrganizationForm: OrganizationForm
    };
  });

}).call(this);
