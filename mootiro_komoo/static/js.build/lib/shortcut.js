shortcut={all_shortcuts:{},add:function(e,t,n){var r={type:"keydown",propagate:!1,disable_in_input:!1,target:document,keycode:!1};if(!n)n=r;else for(var i in r)typeof n[i]=="undefined"&&(n[i]=r[i]);var s=n.target;typeof n.target=="string"&&(s=document.getElementById(n.target)),e=e.toLowerCase();var o=function(r){r=r||window.event;if(n.disable_in_input){var i;r.target?i=r.target:r.srcElement&&(i=r.srcElement),i.nodeType==3&&(i=i.parentNode);if(i.tagName=="INPUT"||i.tagName=="TEXTAREA")return}r.keyCode?code=r.keyCode:r.which&&(code=r.which);var s=String.fromCharCode(code).toLowerCase();code==188&&(s=","),code==190&&(s=".");var o=e.split("+"),u=0,a={"`":"~",1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")","-":"_","=":"+",";":":","'":'"',",":"<",".":">","/":"?","\\":"|"},f={esc:27,escape:27,tab:9,space:32,"return":13,enter:13,backspace:8,scrolllock:145,scroll_lock:145,scroll:145,capslock:20,caps_lock:20,caps:20,numlock:144,num_lock:144,num:144,pause:19,"break":19,insert:45,home:36,"delete":46,end:35,pageup:33,page_up:33,pu:33,pagedown:34,page_down:34,pd:34,left:37,up:38,right:39,down:40,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123},l={shift:{wanted:!1,pressed:!1},ctrl:{wanted:!1,pressed:!1},alt:{wanted:!1,pressed:!1},meta:{wanted:!1,pressed:!1}};r.ctrlKey&&(l.ctrl.pressed=!0),r.shiftKey&&(l.shift.pressed=!0),r.altKey&&(l.alt.pressed=!0),r.metaKey&&(l.meta.pressed=!0);for(var c=0;k=o[c],c<o.length;c++)k=="ctrl"||k=="control"?(u++,l.ctrl.wanted=!0):k=="shift"?(u++,l.shift.wanted=!0):k=="alt"?(u++,l.alt.wanted=!0):k=="meta"?(u++,l.meta.wanted=!0):k.length>1?f[k]==code&&u++:n.keycode?n["keycode"]==code&&u++:s==k?u++:a[s]&&r.shiftKey&&(s=a[s],s==k&&u++);if(u==o.length&&l.ctrl.pressed==l.ctrl.wanted&&l.shift.pressed==l.shift.wanted&&l.alt.pressed==l.alt.wanted&&l.meta.pressed==l.meta.wanted){t(r);if(!n.propagate)return r.cancelBubble=!0,r.returnValue=!1,r.stopPropagation&&(r.stopPropagation(),r.preventDefault()),!1}};this.all_shortcuts[e]={callback:o,target:s,event:n.type},s.addEventListener?s.addEventListener(n.type,o,!1):s.attachEvent?s.attachEvent("on"+n.type,o):s["on"+n.type]=o},remove:function(e){e=e.toLowerCase();var t=this.all_shortcuts[e];delete this.all_shortcuts[e];if(!t)return;var n=t.event,r=t.target,i=t.callback;r.detachEvent?r.detachEvent("on"+n,i):r.removeEventListener?r.removeEventListener(n,i,!1):r["on"+n]=!1}};