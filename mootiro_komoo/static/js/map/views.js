(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, Base, Editor, Preview, app, mapElementCache, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    app = require('app');
    require('map.jquery');
    mapElementCache = {};
    Base = (function(_super) {

      __extends(Base, _super);

      function Base() {
        Base.__super__.constructor.apply(this, arguments);
      }

      Base.prototype.initialize = function() {
        var _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
        _.bindAll(this);
        this.listenTo(app, 'error', this.onError);
        if (this.mapData == null) {
          this.mapData = {
            type: this.type
          };
        }
        ({
          mapType: 'roadmap',
          zoom: (_ref = this.options.zoom) != null ? _ref : 16,
          geojson: (_ref2 = (_ref3 = this.options.geojson) != null ? _ref3 : (_ref4 = this.model) != null ? _ref4.get('geojson') : void 0) != null ? _ref2 : {},
          width: (_ref5 = this.options.width) != null ? _ref5 : '244px',
          height: (_ref6 = this.options.height) != null ? _ref6 : '150px'
        });
        if (mapElementCache[this.type] != null) {
          this.mapElement = mapElementCache[this.type];
          this.loaded = true;
        } else {
          this.mapElement = $('<div>');
          this.loaded = false;
        }
        this.render();
        return window.pm = this;
      };

      Base.prototype.render = function() {
        var _this = this;
        this.mapElement.detach();
        this.$el.html("<div class=\"loading\">" + (i18n('Loading...')) + "</div>");
        this.mapElement.one('features_loaded', function(e) {
          _this.mapElement.fadeTo(0, 0);
          _this.$el.empty().css({
            height: '100%'
          }).append(_this.mapElement);
          _this.refresh().fadeTo(100, 1);
          mapElementCache[_this.type] = _this.mapElement;
          return _this.loaded = true;
        });
        if (!this.loaded) {
          this.mapElement.komooMap(this.mapData);
        } else {
          this.mapElement.komooMap('geojson', this.model.get('geojson'));
        }
        return this;
      };

      Base.prototype.onError = function(err) {
        if (!this.loaded && err.message.indexOf('goog!maps' > -1)) {
          return this.$el.html("<div class=\"loading\">" + (i18n('Map unavailable!')) + "</div>");
        }
      };

      Base.prototype.onOpen = function() {
        return this.refresh();
      };

      Base.prototype.remove = function() {
        this.mapElement.detach().unbind();
        this.mapElement.komooMap('clear');
        this.stopListening();
        return Base.__super__.remove.apply(this, arguments);
      };

      Base.prototype.refresh = function() {
        return this.mapElement.komooMap('refresh').komooMap('center');
      };

      Base.prototype.getMap = function() {
        return this.mapElement.data('map');
      };

      return Base;

    })(Backbone.View);
    Preview = (function(_super) {

      __extends(Preview, _super);

      function Preview() {
        Preview.__super__.constructor.apply(this, arguments);
      }

      Preview.prototype.type = 'preview';

      Preview.prototype.initialize = function() {
        var _ref, _ref2, _ref3;
        this.mapData = {
          type: this.type,
          mapType: 'roadmap',
          zoom: (_ref = this.options.zoom) != null ? _ref : 16,
          geojson: this.model.get('geojson'),
          width: (_ref2 = this.options.width) != null ? _ref2 : '244px',
          height: (_ref3 = this.options.height) != null ? _ref3 : '150px'
        };
        return Preview.__super__.initialize.apply(this, arguments);
      };

      return Preview;

    })(Base);
    Editor = (function(_super) {

      __extends(Editor, _super);

      function Editor() {
        Editor.__super__.constructor.apply(this, arguments);
      }

      Editor.prototype.type = 'main';

      Editor.prototype.initialize = function() {
        var _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
        this.mapData = {
          type: this.type,
          mapType: 'roadmap',
          zoom: (_ref = this.options.zoom) != null ? _ref : 16,
          geojson: (_ref2 = (_ref3 = this.options.geojson) != null ? _ref3 : (_ref4 = this.model) != null ? _ref4.get('geojson') : void 0) != null ? _ref2 : {},
          width: (_ref5 = this.options.width) != null ? _ref5 : '100%',
          height: (_ref6 = this.options.height) != null ? _ref6 : '100%'
        };
        return Editor.__super__.initialize.apply(this, arguments);
      };

      return Editor;

    })(Base);
    return {
      Preview: Preview,
      Editor: Editor
    };
  });

}).call(this);
