(function() {
  var CommonObject, FormCommonObject, _base;

  CommonObject = Backbone.Model.extend({
    urlRoot: '/api/objects/'
  });

  FormCommonObject = ReForm.Form.extend({
    template: window.KomooNS.templates.formTemplate,
    fields: [
      {
        name: 'type',
        widget: ReForm.commonWidgets.DropdownWidget,
        label: i18n('Object Type'),
        args: {
          choices: [
            {
              value: 'community',
              title: i18n('Community')
            }, {
              value: 'organization',
              title: i18n('Organization')
            }, {
              value: 'need',
              title: i18n('Need')
            }, {
              value: 'resource',
              title: i18n('Resource')
            }
          ]
        }
      }, {
        name: 'name',
        widget: ReForm.commonWidgets.TextWidget,
        label: i18n('Name')
      }, {
        name: 'description',
        widget: window.KomooNS.widgets.MarkItUpWidget,
        label: 'Description'
      }, {
        name: 'contact',
        widget: window.KomooNS.widgets.ContactWidget,
        container_class: 'contact',
        label: i18n('Contact')
      }, {
        name: 'tags',
        label: i18n('Classifiers'),
        container_class: 'tags',
        widget: window.KomooNS.widgets.NamespacedTagsWidget
      }, {
        name: 'geometry',
        widget: ReForm.commonWidgets.HiddenWidget,
        label: ''
      }
    ]
  });

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).forms == null) _base.forms = {};

  window.KomooNS.forms.FormCommonObject = FormCommonObject;

  $(function() {
    var form, model, _ref, _ref2, _ref3;
    model = new CommonObject();
    if (((_ref = KomooNS.data) != null ? _ref.type : void 0) != null) {
      model.set({
        type: KomooNS.data.type
      });
    }
    form = new FormCommonObject({
      formId: 'form_object',
      model: model
    });
    if (((_ref2 = KomooNS.data) != null ? _ref2.object : void 0) != null) {
      form.model.set(KomooNS.data.object);
    }
    $('#reForm-wrapper').html(form.render().el);
    if (((_ref3 = KomooNS.data) != null ? _ref3.object : void 0) != null) {
      return form.instances.tags.set(KomooNS.data.object.tags);
    }
  });

}).call(this);
