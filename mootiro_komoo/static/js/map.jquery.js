(function() {

  define(function(require) {
    var $;
    $ = require('jquery');
    return (function($) {
      var fixMapHeight, fixMapSize, fixMapWidth, methods;
      fixMapSize = function(e) {
        var map;
        map = e.data.map;
        fixMapHeight(map);
        fixMapWidth(map);
        return map.refresh();
      };
      fixMapHeight = function(map, mapPanel) {
        var height, panelInfo, parent;
        if (mapPanel == null) mapPanel = $('#map-panel');
        parent = $(map.element).parent();
        height = parent.innerHeight();
        $(map.element).height(height);
        mapPanel.height(height);
        panelInfo = $('.panel-info-wrapper');
        if (panelInfo) height -= panelInfo.height() + 30;
        return $('.panel', mapPanel).height(height - 146);
      };
      fixMapWidth = function(map, mapPanel) {
        var panelLeft, panelWidth;
        if (mapPanel == null) mapPanel = $('#map-panel');
        panelWidth = mapPanel.innerWidth();
        try {
          panelLeft = mapPanel.position().left;
        } catch (err) {
          panelLeft = 0;
        }
        return $(map.element).css({
          marginLeft: panelWidth + panelLeft,
          width: 'auto'
        });
      };
      methods = {
        init: function(options) {
          return this.each(function() {
            var $this, opts, _ref, _ref2, _ref3,
              _this = this;
            $this = $(this);
            $this.addClass('komoo-map-googlemap');
            opts = $.extend({
              element: $this.get(0)
            }, $.fn.komooMap.defaults, options);
            if (opts.width != null) $this.width(opts.width);
            if (opts.height != null) $this.height(opts.height);
            if ((opts != null ? opts.type : void 0) === 'preview' && !(opts != null ? (_ref = opts.geojson) != null ? (_ref2 = _ref.features) != null ? (_ref3 = _ref2[0]) != null ? _ref3.geometry : void 0 : void 0 : void 0 : void 0) && !(opts != null ? opts.force : void 0)) {
              $this.html($('<div>').addClass('placeholder').text('Informação geométrica não disponível'));
              $this.parent().parent().find('.see-on-map').hide();
              return;
            }
            return require(['map/maps'], function(maps) {
              var map;
              map = maps.makeMap(opts);
              map.subscribe('features_loaded', function(features) {
                return $this.trigger('features_loaded', features);
              });
              $this.data('map', map);
              if (opts.mapType != null) map.googleMap.setMapTypeId(opts.mapType);
              if (opts.height === '100%') {
                $(window).resize({
                  map: map
                }, fixMapSize);
                return $(window).resize();
              }
            });
          });
        },
        edit: function(feature) {
          var _ref;
          if ((_ref = $(this).data('map')) != null) _ref.editFeature(feature);
          return $(this);
        },
        geojson: function(geojson) {
          var _ref, _ref2;
          if (!(geojson != null)) {
            return (_ref = $(this).data('map')) != null ? _ref.getGeoJson() : void 0;
          } else {
            return (_ref2 = $(this).data('map')) != null ? _ref2.loadGeoJson(geojson) : void 0;
          }
        },
        goTo: function(opts) {
          var _ref, _ref2;
          if ((_ref = $(this).data('map')) != null) {
            _ref.panTo((_ref2 = opts.position) != null ? _ref2 : opts.address, opts.displayMarker);
          }
          return $(this);
        },
        highlight: function(opts) {
          var _ref;
          if ((_ref = $(this).data('map')) != null) {
            _ref.highlightFeature(opts.type, opts.id);
          }
          return $(this);
        },
        resize: function() {
          $(window).resize();
          return $(this);
        },
        refresh: function() {
          var _ref;
          if ((_ref = $(this).data('map')) != null) _ref.refresh();
          return $(this);
        },
        fit: function() {
          var _ref;
          if ((_ref = $(this).data('map')) != null) _ref.fitBounds();
          return $(this);
        },
        center: function() {
          var map;
          map = $(this).data('map');
          if (map != null) {
            map.googleMap.setCenter(map != null ? map.features.getCenter() : void 0);
          }
          return $(this);
        },
        remove: function() {
          var _ref;
          if ((_ref = $(this).data('map')) != null) _ref.remove();
          $(this).empty();
          $(this).html('');
          $(this).remove();
          return $(this);
        },
        clear: function() {
          var _ref;
          if ((_ref = $(this).data('map')) != null) _ref.clear();
          return $(this);
        }
      };
      $.fn.komooMap = function(method) {
        if (methods[method]) {
          return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
          return methods.init.apply(this, arguments);
        } else {
          return $.error("Method " + method + " does not exist on jQuery.komooMap");
        }
      };
      return $.fn.komooMap.defaults = {
        type: 'editor'
      };
    })($);
  });

}).call(this);
