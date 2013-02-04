(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var BaseForm, commonWidgets, reForm, widgets;
    reForm = require('reForm');
    commonWidgets = reForm.commonWidgets;
    widgets = require('./form_widgets');
    BaseForm = (function(_super) {

      __extends(BaseForm, _super);

      function BaseForm() {
        BaseForm.__super__.constructor.apply(this, arguments);
      }

      BaseForm.prototype.template = require('text!templates/forms/_inline_form.html');

      BaseForm.prototype.events = {
        'click .cancel': 'onCancelClick'
      };

      BaseForm.prototype.initialize = function() {
        BaseForm.__super__.initialize.apply(this, arguments);
        return this.render();
      };

      BaseForm.prototype.onCancelClick = function(e) {
        if (e != null) e.preventDefault();
        this.set(this.model.toJSON());
        return this.trigger('cancel');
      };

      BaseForm.prototype.wasChanged = function() {
        return !_.isEqual(this.get(), _.pick(this.model.toJSON(), _.pluck(this.fields, 'name')));
      };

      return BaseForm;

    })(reForm.Form);
    return {
      commonWidgets: commonWidgets,
      widgets: widgets,
      BaseForm: BaseForm
    };
  });

}).call(this);
