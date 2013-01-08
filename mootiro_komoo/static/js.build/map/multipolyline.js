/**
 * MultiPolyline for Google Maps.
 *
 * @name multipolyline.js
 * @fileOverview Group Google Maps Polylines together.
 * @version 0.1.0
 * @author Luiz Armesto
 * @copyright (c) 2012 it3s
 */

define(["services/googlemaps"],function(e){return MultiPolyline=function(t){t=t||{},this.polylines_=new e.MVCArray(t.polylines||[]),this.paths_=new e.MVCArray(t.paths||[]),this.map_=t.map,this.visible_=t.visible,this.clickable_=t.clickable,this.zIndex=t.zIndex||0,this.strokeColor_=t.strokeColor||"black",this.strokOpacity_=t.strokeOpacity||1,this.strokeWeight_=t.strokeWeight||3},MultiPolyline.prototype.getPaths=function(){this.paths_.clear();for(var e=0;e<this.polylines_.getLength();e++)this.paths_.push(this.polylines_.getAt(e).getPath());return this.paths_},MultiPolyline.prototype.setPaths=function(e){if(e.length!=this.polylines_.getLength())throw"Invalid length.";this.paths_.clear();for(var t=0;t<this.polylines_.getLength();t++)this.polylines_.getAt(t).setPath(e[t]),this.paths_.push(e[t])},MultiPolyline.prototype.addPolyline=function(t,n){var r=this;this.polylines_.push(t),n!=1&&t.setOptions({clickable:this.clickable_,zIndex:this.zIndex,strokeColor:this.strokeColor_,strokeOpacity:this.strokOpacity_,strokeWeight:this.strokeWeight_}),e.event.addListener(t,"click",function(n){e.event.trigger(r,"click",n,t)}),e.event.addListener(t,"mouseover",function(n){e.event.trigger(r,"mouseover",n,t)}),e.event.addListener(t,"mouseout",function(n){e.event.trigger(r,"mouseout",n,t)}),e.event.addListener(t,"mousemove",function(n){e.event.trigger(r,"mousemove",n,t)})},MultiPolyline.prototype.addPolylines=function(e,t){for(var n=0;n<e.length;n++)this.addPolyline(e[n],t)},MultiPolyline.prototype.getPolylines=function(){return this.polylines_},MultiPolyline.prototype.setMap=function(e){for(var t=0;t<this.polylines_.getLength();t++)this.polylines_.getAt(t).setMap(e);this.map_=e},MultiPolyline.prototype.getMap=function(){return this.map_},MultiPolyline.prototype.setVisible=function(e){for(var t=0;t<this.polylines_.getLength();t++)this.polylines_.getAt(t).setVisible(e);this.visible_=e},MultiPolyline.prototype.setEditable=function(e){for(var t=0;t<this.polylines_.getLength();t++)this.polylines_.getAt(t).setEditable(e);this.visible_=e},MultiPolyline.prototype.setOptions=function(e){for(var t=0;t<this.polylines_.getLength();t++)this.polylines_.getAt(t).setOptions(e);this.options_=e},MultiPolyline.prototype.getVisible=function(){return this.visible_},MultiPolyline});