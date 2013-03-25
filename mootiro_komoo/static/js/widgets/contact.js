(function() {
  var ContactWidget, MultiWidget, _base,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  MultiWidget = KomooNS.widgets.MultiWidget;

  ContactWidget = (function(_super) {

    __extends(ContactWidget, _super);

    function ContactWidget() {
      ContactWidget.__super__.constructor.apply(this, arguments);
    }

    ContactWidget.prototype.fieldTemplate = "<div class=\"subfield-container <%=container_class%>\">\n<div class=\"widget-container\"></div>\n</div>";

    ContactWidget.prototype.fields = [
      {
        name: 'type',
        container_class: 'type',
        widget: ReForm.commonWidgets.DropdownWidget,
        args: {
          choices: [
            {
              title: '',
              value: ''
            }, {
              title: i18n('Address'),
              value: 'address'
            }, {
              title: i18n('Phone'),
              value: 'phone'
            }, {
              title: i18n('Email'),
              value: 'email'
            }, {
              title: i18n('Website'),
              value: 'website'
            }, {
              title: i18n('Skype'),
              value: 'skype'
            }, {
              title: i18n('Facebook'),
              value: 'facebook'
            }, {
              title: i18n('Google Plus'),
              value: 'gplus'
            }, {
              title: i18n('Twitter'),
              value: 'twitter'
            }
          ]
        }
      }, {
        name: 'value',
        container_class: 'value',
        widget: ReForm.commonWidgets.TextWidget
      }
    ];

    return ContactWidget;

  })(MultiWidget);

  if (window.KomooNS == null) window.KomooNS = {};

  if ((_base = window.KomooNS).widgets == null) _base.widgets = {};

  window.KomooNS.widgets.ContactWidget = ContactWidget;

}).call(this);
