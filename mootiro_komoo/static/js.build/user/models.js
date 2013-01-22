(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","underscore","backbone","core/mixins","./collections","urls"],function(e){var n,r,i,s,o,u;return u=e("underscore"),n=e("backbone"),r=e("core/mixins").PermissionMixin,i=e("./collections").PaginatedUpdates,o=e("urls"),s=function(e){function s(){s.__super__.constructor.apply(this,arguments)}return t(s,e),u.extend(s.prototype,r),s.prototype.permissions={edit:function(e){return e instanceof s&&(e.isSuperuser()||e.get("id")===this.get("id"))}},s.prototype.urlRoot=o.resolve("user_api"),s.prototype.defaults={about_me:"",geojson:{type:"FeatureCollection",features:[{geometry:{type:"Point",coordinates:[-23.566743,-46.746802]},type:"Feature",properties:{type:"User"}}]}},s.prototype.getUpdates=function(){var e;return(e=this.updates)!=null?e:this.updates=new i([],{user:this})},s.prototype.goToProfile=function(){if(this.id!=null)return n.trigger("open:detail",this)},s.prototype.edit=function(){if(this.id!=null)return n.trigger("open:edit",this)},s.prototype.isSuperuser=function(){return!1},s}(n.Model),{User:s}})}).call(this);