/*
* imageTick for jQuery
* http://boedesign.com/blog/2008/06/08/imagetick-for-jquery/
*
* Copyright (c) 2011 Jordan Boesch
* Dual licensed under the MIT and GPL licenses.
*
* Date: February 5, 2011
* Version: 2.2
* 
* Modified by André Casimiro
* Date: April 4, 2012
* Lines: 183-187
*/

(function(e){e.imageTick={logging:!1},e.fn.imageTick=function(t,n){function s(){e.imageTick.logging&&console&&console.log&&console.log.apply(console,arguments)}function u(e){var t=e.src.split("/").pop(),n=i.no_tick_image_path.split("/").pop();return t==n}function a(t,n,r){if(t)n=="radio"&&e("."+i.image_tick_class).removeClass(i.custom_button_selected_class),e(this).toggleClass(i.custom_button_selected_class);else{if(n=="checkbox")var s=u(this)?i.tick_image_path:i.no_tick_image_path;else{e("."+i.image_tick_class).attr("src",i.no_tick_image_path);var s=i.tick_image_path}this.src=s}}var r={tick_image_path:"",no_tick_image_path:"",image_tick_class:"ticks_"+Math.floor(Math.random()*999999),img_html:'<img src="%s1" alt="no_tick" class="%s2" id="tick_img_%s3" />',custom_button:!1,custom_button_selected_class:"selected"},i=e.extend({},r,t);i._tick_img_id_format="tick_img_%s",i._valid_types=["checkbox","radio"];if(t==="disabled"){if(this.selector.indexOf("#")==-1){s('COULD NOT DISABLE "'+this.selector+'": You need to specify the id of the <input> when calling disabled true/false.');return}var o=e("#"+i._tick_img_id_format.replace("%s",this[0].id));n?(e(this).attr("disabled","disabled"),method_type="add"):(e(this).removeAttr("disabled"),method_type="remove"),o[method_type+"Class"]("disabled");return}return this.each(function(){var t=e(this),n=t[0].type;if(e.inArray(n,i._valid_types)==-1)throw new Error(n+" is not a valid input type. Must be radio or checkbox.");var r=t[0].id,s=e("#"+r),o=e("label[for='"+r+"']"),u=i._tick_img_id_format.replace("%s",r),f=e.isFunction(i.custom_button),l="";f?l=e(i.custom_button(o)).attr("id",u.replace("%s",r)).addClass(i.image_tick_class):l=i.img_html.replace("%s1",i.no_tick_image_path).replace("%s2",i.image_tick_class).replace("%s3",r),t.before(l).hide();var c=e("#"+u);s[0].disabled&&c.addClass("disabled"),t[0].checked&&(c[0].src?c[0].src=i.tick_image_path:c.addClass(i.custom_button_selected_class)),c.click(function(e){if(s[0].disabled)return;e.preventDefault(),s.trigger("click"),n=="checkbox"&&s.attr("checked",!s.attr("checked")),a.call(this,f,n,s)}),o.length&&o.click(function(e){e.preventDefault(),c.trigger("click")})})}})(jQuery);