(function(){define(["require","jquery","underscore","backbone"],function(e){var t,n,r,i;return t=e("jquery"),i=e("underscore"),n=e("backbone"),r=n.View.extend({tagName:"ul",className:"list",initialize:function(){return i.bindAll(this),this.listenTo(this.collection,"add",this.addOne),this.listenTo(this.collection,"reset",this.addAll),this.listenTo(this.collection,"all",this.render),this.itemViews={},this.ItemView=this.options.ItemView,this.subViews=[],this.collection.pager(),this.render()},render:function(){},addAll:function(){return this.$el.empty(),this.collection.each(this.addOne),this},addOne:function(e){var t;return t=new this.ItemView({model:e}),this.$el.append(t.render().$el),this.subViews.push(t),this}}),r})}).call(this);