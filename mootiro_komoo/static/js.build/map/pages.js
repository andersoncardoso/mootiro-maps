(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","jquery","backbone","app","core/page_manager"],function(e){var n,r,i,s,o;return n=e("jquery"),r=e("backbone"),s=e("app"),o=e("core/page_manager"),i=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),n.prototype.initialize=function(){return n.__super__.initialize.apply(this,arguments),this.id="mainMap"},n.prototype.open=function(){return s.showMainMap()},n.prototype.close=function(){return s.hideMainMap()},n}(o.Page),{MapPage:i}})}).call(this);