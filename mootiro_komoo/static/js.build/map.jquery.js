(function(){define(["require","jquery"],function(e){var t;return t=e("jquery"),function(t){var n,r,i,s;return r=function(e){var t;return t=e.data.map,n(t),i(t),t.refresh()},n=function(e,n){var r,i,s;return n==null&&(n=t("#map-panel")),s=t(e.element).parent(),r=s.innerHeight(),t(e.element).height(r),n.height(r),i=t(".panel-info-wrapper"),i&&(r-=i.height()+30),t(".panel",n).height(r-146)},i=function(e,n){var r,i;n==null&&(n=t("#map-panel")),i=n.innerWidth();try{r=n.position().left}catch(s){r=0}return t(e.element).css({marginLeft:i+r,width:"auto"})},s={init:function(n){return this.each(function(){var i,s,o,u,a,f=this;i=t(this),i.addClass("komoo-map-googlemap"),s=t.extend({element:i.get(0)},t.fn.komooMap.defaults,n),s.width!=null&&i.width(s.width),s.height!=null&&i.height(s.height);if((s!=null?s.type:void 0)==="preview"&&!(s!=null?(o=s.geojson)!=null?(u=o.features)!=null?(a=u[0])!=null?a.geometry:void 0:void 0:void 0:void 0)&&(s!=null?!s.force:!void 0)){i.html(t("<div>").addClass("placeholder").text("Informação geométrica não disponível")),i.parent().parent().find(".see-on-map").hide();return}return e(["map/maps"],function(e){var n;n=e.makeMap(s),n.subscribe("features_loaded",function(e){return i.trigger("features_loaded",e)}),i.data("map",n),s.mapType!=null&&n.googleMap.setMapTypeId(s.mapType);if(s.height==="100%")return t(window).resize({map:n},r),t(window).resize()})})},edit:function(e){var n;return(n=t(this).data("map"))!=null&&n.editFeature(e),t(this)},geojson:function(e){var n,r;return e==null?(n=t(this).data("map"))!=null?n.getGeoJson():void 0:(r=t(this).data("map"))!=null?r.loadGeoJson(e):void 0},goTo:function(e){var n,r;return(n=t(this).data("map"))!=null&&n.panTo((r=e.position)!=null?r:e.address,e.displayMarker),t(this)},highlight:function(e){var n;return(n=t(this).data("map"))!=null&&n.highlightFeature(e.type,e.id),t(this)},resize:function(){return t(window).resize(),t(this)},refresh:function(){var e;return(e=t(this).data("map"))!=null&&e.refresh(),t(this)},fit:function(){var e;return(e=t(this).data("map"))!=null&&e.fitBounds(),t(this)},center:function(){var e;return e=t(this).data("map"),e!=null&&e.googleMap.setCenter(e!=null?e.features.getCenter():void 0),t(this)},remove:function(){var e;return(e=t(this).data("map"))!=null&&e.remove(),t(this).empty(),t(this).html(""),t(this).remove(),t(this)},clear:function(){var e;return(e=t(this).data("map"))!=null&&e.clear(),t(this)}},t.fn.komooMap=function(e){return s[e]?s[e].apply(this,Array.prototype.slice.call(arguments,1)):typeof e=="object"||!e?s.init.apply(this,arguments):t.error("Method "+e+" does not exist on jQuery.komooMap")},t.fn.komooMap.defaults={type:"editor"}}(t)})}).call(this);