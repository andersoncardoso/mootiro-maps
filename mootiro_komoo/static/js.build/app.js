(function(){define(["common"],function(){return require(["analytics","facebook-jssdk"],function(e,t){return e.init(),t.init(typeof KomooNS!="undefined"&&KomooNS!==null?KomooNS.facebookAppId:void 0)}),require(["moderation/moderation","lib/shortcut","utils"],function(){}),{}})}).call(this)