(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, Preview, SearchBoxView, _;
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
    Preview = (function(_super) {

      __extends(Preview, _super);

      function Preview() {
        Preview.__super__.constructor.apply(this, arguments);
      }

      Preview.prototype.initialize = function() {
        var _this = this;
        return require(['map.jquery'], function() {
          var _ref, _ref2;
          _this.map = _this.$el.komooMap({
            type: 'preview',
            width: (_ref = _this.options.width) != null ? _ref : '244px',
            height: (_ref2 = _this.options.height) != null ? _ref2 : '175px',
            geojson: _this.model.get('geojson')
          });
          return _this.render();
        });
      };

      Preview.prototype.render = function() {};

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
