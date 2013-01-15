(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, Preview, SearchBoxView, mapElementCache, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    SearchBoxView = (function(_super) {

      __extends(SearchBoxView, _super);

      function SearchBoxView() {
        SearchBoxView.__super__.constructor.apply(this, arguments);
      }

      SearchBoxView.prototype.events = {
        'click .search': 'onSearchBtnClick',
        'change .location-type': 'onTypeChange'
      };

      SearchBoxView.prototype.initialize = function() {
        return this.template = _.template(require('text!templates/map/_searchbox.html'));
      };

      SearchBoxView.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template();
        this.$el.html(renderedContent);
        return this;
      };

      SearchBoxView.prototype.onTypeChange = function() {
        var type;
        type = this.$('.location-type').val();
        if (type === 'address') {
          this.$('.latLng-container').hide();
          return this.$('.address-container').show();
        } else {
          this.$('.address-container').hide();
          return this.$('.latLng-container').show();
        }
      };

      SearchBoxView.prototype.onSearchBtnClick = function() {
        var position, type;
        type = this.$('.location-type').val();
        position = type === 'address' ? this.$('.address').val() : [parseFloat(this.$('.lat').val().replace(',', '.')), parseFloat(this.$('.lng').val().replace(',', '.'))];
        this.search(type, position);
        return false;
      };

      SearchBoxView.prototype.search = function(type, position) {
        if (type == null) type = 'address';
        this.trigger('search', {
          type: type,
          position: position
        });
        return this;
      };

      return SearchBoxView;

    })(Backbone.View);
    mapElementCache = null;
    require('map.jquery');
    Preview = (function(_super) {

      __extends(Preview, _super);

      function Preview() {
        Preview.__super__.constructor.apply(this, arguments);
      }

      Preview.prototype.initialize = function() {
        _.bindAll(this);
        this.listenTo(Backbone, 'module::error', this.onError);
        if (mapElementCache) {
          this.map = mapElementCache;
          this.loaded = true;
        } else {
          this.map = $('<div>');
          this.loaded = false;
        }
        this.render();
        return window.pm = this;
      };

      Preview.prototype.onError = function(err) {
        if (!this.loaded && err.message.indexOf('goog!maps' > -1)) {
          return this.$el.html("<div class=\"loading\">" + (i18n('Map unavailable!')) + "</div>");
        }
      };

      Preview.prototype.onOpen = function() {
        return this.refresh();
      };

      Preview.prototype.remove = function() {
        this.map.detach().unbind();
        this.map.komooMap('clear');
        this.stopListening();
        return Preview.__super__.remove.apply(this, arguments);
      };

      Preview.prototype.refresh = function() {
        return this.map.komooMap('refresh').komooMap('center');
      };

      Preview.prototype.render = function() {
        var _ref, _ref2,
          _this = this;
        this.map.detach();
        this.$el.html("<div class=\"loading\">" + (i18n('Loading...')) + "</div>");
        this.map.one('features_loaded', function(e) {
          _this.map.fadeTo(0, 0);
          _this.$el.empty().css({
            height: '100%'
          }).append(_this.map);
          _this.refresh().fadeTo(100, 1);
          mapElementCache = _this.map;
          return _this.loaded = true;
        });
        if (!this.loaded) {
          this.map.komooMap({
            type: 'preview',
            mapType: 'roadmap',
            zoom: 16,
            geojson: this.model.get('geojson'),
            width: (_ref = this.options.width) != null ? _ref : '244px',
            height: (_ref2 = this.options.height) != null ? _ref2 : '150px'
          });
        } else {
          this.map.komooMap('geojson', this.model.get('geojson'));
        }
        return this;
      };

      return Preview;

    })(Backbone.View);
    return {
      internal: {
        SearchBoxView: SearchBoxView
      },
      Preview: Preview
    };
  });

}).call(this);
