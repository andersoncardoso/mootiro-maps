define (require) ->
  'use strict'

  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  ReForm = require 'reForm'


  #### Profile Main View ####

  #
  # Generic view for model fields
  #
  FieldView = Backbone.View.extend
    initialize: ->
      _.bindAll this
      @listenTo @model, "change", @render
      @_template = _.template @template
      @render()

    render: ->
      @$el.html @_template model: @model.toJSON()


  NameView = FieldView.extend
    template: '<%= model.name %>'


  UserInfoView = FieldView.extend
    template: '<%= model.about_me || i18n("User has not wrote about oneself")  %>'

  #
  # Main profile View
  #
  Profile = Backbone.View.extend
    initialize: ->
      window.model = @model
      _.bindAll this
      @template = _.template require 'text!templates/user/_profile.html'
      @listenTo @model, 'change', @render

      # FIXME: this is not safe
      if KomooNS?.user and KomooNS.user.id is @model.id
        NameView = NameField
        UserInfoView = UserInfoField

      @nameView = new NameView
        model: @model

      @userInfoView = new UserInfoView
        model: @model

      @updatesView = new Updates
        collection: @model.getUpdates()

      @subViews = [
        @nameView
        @userInfoView
        @updatesView
      ]

      @render()

    render: ->
      @nameView.$el.detach()  # Dont lost the updates element
      @userInfoView.$el.detach()  # Dont lost the updates element
      @updatesView.$el.detach()  # Dont lost the updates element
      @$el.html @template
        user: @model.toJSON()
      @$('#user-name-container').append @nameView.$el
      @$('#user-info-container').append @userInfoView.$el
      @$('#user-updates-container').append @updatesView.$el
      this


  #### Inline forms ####

  #
  # Generic inline form view
  #
  InlineForm = ReForm.Form.extend
    events:
      'click .edit': 'toggle'
      'click .cancel': 'toggle'

    initialize: ->
      ReForm.Form.prototype.initialize.apply this, arguments
      @listenTo @model, "change", @update
      @formTemplate = _.template require 'text!templates/forms/_inline_form.html'
      @_displayView = new @displayView @options
      @subViews = [@_displayView]
      @render()

    render: ->
      @_displayView?.$el?.detach()
      ReForm.Form.prototype.render.apply this, arguments
      if @_displayView?
        @$('.display .content').append @_displayView.$el
      this

    update: ->
      if @model
        @set @model.toJSON()

    toggle: (e) ->
      e.preventDefault()
      @update()
      @$('.display, form.inline-form').toggleClass('open').toggleClass('closed')


  NameField = InlineForm.extend
    fields: [
      label: i18n('Name')
      name: 'name'
      widget: ReForm.commonWidgets.TextWidget
    ]
    displayView: NameView


  UserInfoField = InlineForm.extend
    fields: [
      label: i18n('About me')
      name: 'about_me'
      widget: ReForm.commonWidgets.TextAreaWidget
    ]
    displayView: UserInfoView


  #### Profile Sidebar ####

  Sidebar = Backbone.View.extend
    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_sidebar.html'
      @render()

    render: ->
      @$el.html @template
        user: @model.toJSON()
      this


  #### Profile Blocks ####

  Update = Backbone.View.extend
    tagName: 'li'

    events:
      'click .see-on-map': 'seeOnMap'

    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_update_item.html'
      @listenTo @model, 'change', @render
      @render()

    render: ->
      @$el.removeClass().addClass [
          @model.get('type')?.toLowerCase(),
          @model.get('action')?.toLowerCase()
      ]
      @$el.html @template
        update: @model.toJSON()
      this

    seeOnMap: (e) ->
      e?.preventDefault?()
      Backbone.trigger 'map::see-on-map', @model
      this


  Updates = Backbone.View.extend
    events:
      'click a.previous': 'previousPage'
      'click a.next': 'nextPage'
      'keypress .current-page': 'goTo'

    initialize: ->
      _.bindAll this
      @template = _.template require 'text!templates/user/_updates_block.html'
      List = require 'widgets/list'
      @listView = new List
        collection: @collection
        className: 'updates list'
        ItemView: Update
      @subViews = [@listView]
      @listenTo @collection, 'reset', @update
      @render()

    render: ->
      @listView.$el.detach()  # Dont lost the updates element
      @$el.html @template(@collection)
      @$('.list-container').prepend @listView.$el
      this

    update: ->
      @$('.current-page').val @collection.currentPage + 1
      @$('.total-pages').text @collection.totalPages

      if @collection.currentPage is 0
        @$('.previous').addClass 'disabled'
      else
        @$('.previous').removeClass 'disabled'

      if @collection.currentPage is @collection.totalPages - 1
        @$('.next').addClass 'disabled'
      else
        @$('.next').removeClass 'disabled'


    previousPage: (e) ->
      e?.preventDefault?()
      if @collection.currentPage > @collection.firstPage
        @collection.requestPreviousPage()
      this

    nextPage: (e) ->
      e?.preventDefault?()
      if @collection.currentPage < @collection.totalPages - 1
        @collection.requestNextPage()
      this

    goTo: (e) ->
      if e.keyCode isnt 13 then return

      page = parseInt @$('.current-page').val(), 10
      if _.isNaN(page) or page <= 0 or page > @collection.totalPages
        @update()
        return

      @collection.goTo (page - 1)


  Profile: Profile
  Updates: Updates
  Sidebar: Sidebar
