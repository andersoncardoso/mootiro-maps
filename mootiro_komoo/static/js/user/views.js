(function() {

  define(function(require) {
    'use strict';
    var $, Backbone, FieldView, InlineForm, NameField, NameView, Profile, ReForm, Sidebar, Update, Updates, UserInfoField, UserInfoView, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    ReForm = require('reForm');
    FieldView = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this);
        this.listenTo(this.model, "change", this.render);
        this._template = _.template(this.template);
        return this.render();
      },
      render: function() {
        return this.$el.html(this._template({
          model: this.model.toJSON()
        }));
      }
    });
    NameView = FieldView.extend({
      template: '<%= model.name %>'
    });
    UserInfoView = FieldView.extend({
      template: '<%= model.about_me || i18n("User has not wrote about oneself")  %>'
    });
    Profile = Backbone.View.extend({
      initialize: function() {
        window.model = this.model;
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_profile.html'));
        this.listenTo(this.model, 'change', this.render);
        if ((typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.user : void 0) && KomooNS.user.id === this.model.id) {
          NameView = NameField;
          UserInfoView = UserInfoField;
        }
        this.nameView = new NameView({
          model: this.model
        });
        this.userInfoView = new UserInfoView({
          model: this.model
        });
        this.updatesView = new Updates({
          collection: this.model.getUpdates()
        });
        this.subViews = [this.nameView, this.userInfoView, this.updatesView];
        return this.render();
      },
      render: function() {
        this.nameView.$el.detach();
        this.userInfoView.$el.detach();
        this.updatesView.$el.detach();
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        this.$('#user-name-container').append(this.nameView.$el);
        this.$('#user-info-container').append(this.userInfoView.$el);
        this.$('#user-updates-container').append(this.updatesView.$el);
        return this;
      }
    });
    InlineForm = ReForm.Form.extend({
      events: {
        'click .edit': 'toggle',
        'click .cancel': 'toggle'
      },
      initialize: function() {
        ReForm.Form.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, "change", this.update);
        this.formTemplate = _.template(require('text!templates/forms/_inline_form.html'));
        this._displayView = new this.displayView(this.options);
        this.subViews = [this._displayView];
        return this.render();
      },
      render: function() {
        var _ref, _ref2;
        if ((_ref = this._displayView) != null) {
          if ((_ref2 = _ref.$el) != null) _ref2.detach();
        }
        ReForm.Form.prototype.render.apply(this, arguments);
        if (this._displayView != null) {
          this.$('.display .content').append(this._displayView.$el);
        }
        return this;
      },
      update: function() {
        if (this.model) return this.set(this.model.toJSON());
      },
      toggle: function(e) {
        e.preventDefault();
        this.update();
        return this.$('.display, form.inline-form').toggleClass('open').toggleClass('closed');
      }
    });
    NameField = InlineForm.extend({
      fields: [
        {
          label: i18n('Name'),
          name: 'name',
          widget: ReForm.commonWidgets.TextWidget
        }
      ],
      displayView: NameView
    });
    UserInfoField = InlineForm.extend({
      fields: [
        {
          label: i18n('About me'),
          name: 'about_me',
          widget: ReForm.commonWidgets.TextAreaWidget
        }
      ],
      displayView: UserInfoView
    });
    Sidebar = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_sidebar.html'));
        return this.render();
      },
      render: function() {
        this.$el.html(this.template({
          user: this.model.toJSON()
        }));
        return this;
      }
    });
    Update = Backbone.View.extend({
      tagName: 'li',
      events: {
        'click .see-on-map': 'seeOnMap'
      },
      initialize: function() {
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_update_item.html'));
        this.listenTo(this.model, 'change', this.render);
        return this.render();
      },
      render: function() {
        var _ref, _ref2;
        this.$el.removeClass().addClass([(_ref = this.model.get('type')) != null ? _ref.toLowerCase() : void 0, (_ref2 = this.model.get('action')) != null ? _ref2.toLowerCase() : void 0]);
        this.$el.html(this.template({
          update: this.model.toJSON()
        }));
        return this;
      },
      seeOnMap: function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        Backbone.trigger('map::see-on-map', this.model);
        return this;
      }
    });
    Updates = Backbone.View.extend({
      events: {
        'click a.previous': 'previousPage',
        'click a.next': 'nextPage',
        'keypress .current-page': 'goTo'
      },
      initialize: function() {
        var List;
        _.bindAll(this);
        this.template = _.template(require('text!templates/user/_updates_block.html'));
        List = require('widgets/list');
        this.listView = new List({
          collection: this.collection,
          className: 'updates list',
          ItemView: Update
        });
        this.subViews = [this.listView];
        this.listenTo(this.collection, 'reset', this.update);
        return this.render();
      },
      render: function() {
        this.listView.$el.detach();
        this.$el.html(this.template(this.collection));
        this.$('.list-container').prepend(this.listView.$el);
        return this;
      },
      update: function() {
        this.$('.current-page').val(this.collection.currentPage + 1);
        this.$('.total-pages').text(this.collection.totalPages);
        if (this.collection.currentPage === 0) {
          this.$('.previous').addClass('disabled');
        } else {
          this.$('.previous').removeClass('disabled');
        }
        if (this.collection.currentPage === this.collection.totalPages - 1) {
          return this.$('.next').addClass('disabled');
        } else {
          return this.$('.next').removeClass('disabled');
        }
      },
      previousPage: function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        if (this.collection.currentPage > this.collection.firstPage) {
          this.collection.requestPreviousPage();
        }
        return this;
      },
      nextPage: function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") e.preventDefault();
        }
        if (this.collection.currentPage < this.collection.totalPages - 1) {
          this.collection.requestNextPage();
        }
        return this;
      },
      goTo: function(e) {
        var page;
        if (e.keyCode !== 13) return;
        page = parseInt(this.$('.current-page').val(), 10);
        if (_.isNaN(page) || page <= 0 || page > this.collection.totalPages) {
          this.update();
          return;
        }
        return this.collection.goTo(page - 1);
      }
    });
    return {
      Profile: Profile,
      Updates: Updates,
      Sidebar: Sidebar
    };
  });

}).call(this);
