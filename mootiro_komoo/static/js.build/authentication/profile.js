(function(){var e;e=jQuery,window.Contribution=Backbone.Model.extend({imageName:function(){var e;return this.model_name==="organizationbranch"?e="organization":e=this.model_name,"/static/img/updates-page/"+e+"-"+this.typeExt()+".png"},typeExt:function(e){var t;return e==null&&(e=!1),t={A:"added",E:"edited",C:"discussed",D:"deleted"}[this.type],e?gettext(t):t},modelPrettyName:function(){var e;return e={organization:gettext("Organization"),organizationbranch:gettext("Organization"),need:gettext("Need"),community:gettext("Community"),resource:gettext("Resource")},e[this.model_name]},actionDesc:function(){var e;return e=gettext("at"),""+this.modelPrettyName()+" "+this.typeExt(!0)+" "+e+" "+this.date+"."},toJSON:function(e){var t;return t=Backbone.Model.prototype.toJSON.call(this,e),_.extend(t,{imageName:this.imageName,actionDesc:this.actionDesc,typeExt:this.typeExt,modelPrettyName:this.modelPrettyName})}}),window.Contributions=Backbone.Collection.extend({model:Contribution}),window.ContributionView=Backbone.View.extend({tagName:"div",className:"contribution",initialize:function(){return _.bindAll(this,"render"),this.template=_.template(e("#contribution-template").html())},render:function(){var t;return t=this.template(this.model.toJSON()),e(this.el).html(t),this}}),window.ContributionsView=Backbone.View.extend({initialize:function(){return _.bindAll(this,"render"),this.template=_.template(e("#contributions-template").html()),this.collection.bind("reset",this.render)},render:function(){var t,n;return e(this.el).html(this.template({})),t=this.$(".profile-cp-contributions"),n=this.collection,n.each(function(e){var r;return r=new ContributionView({model:e,collection:n}),t.append(r.render().el)}),this}}),e(function(){var t,n;return n=new Contributions,n.reset(window.KomooNS.contributions),t=new ContributionsView({collection:n}),e(".profile-central-pane").append(t.render().el)})}).call(this);