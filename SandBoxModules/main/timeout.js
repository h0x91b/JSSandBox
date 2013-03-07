/*
Author: h0x91b (h0x91b@gmail.com Arseniy Pavlenko)
Date: 2013-03-07 10:31
Available via the MIT or new BSD license

https://github.com/h0x91b/JSTimeoutManager
*/
console.log('module timeout loaded')
_ready = true //no need to wait for this module


function e(){this.d=setTimeout;this.f=clearTimeout;this.set=this.n;this.del=this.l;this.pause=this.j;this.resume=this.k;this.a={}}
e.prototype={i:1,d:null,f:null,o:function(){for(var a in this.a)this.j(a)},p:function(){for(var a in this.a)this.k(a)},n:function(a,c,g){var f=this,d=this.i++,b={e:0,start:(new Date).getTime(),time:c,b:c,m:g||!1,c:!1,h:a,g:function(){b.m?(b.h(),b.start=(new Date).getTime(),b.e=f.d.call(window,b.g,c)):(delete f.a[d],b.h(),b=null)}};b.e=this.d.call(window,b.g,c);this.a[d]=b;return d},l:function(a){if(a){var c=this.a[a];c&&(this.f.call(window,c.e),delete this.a[a])}},j:function(a){if(!a)return this.o();
if((a=this.a[a])&&!a.c){var c=(new Date).getTime();this.f.call(window,a.e);a.b=a.time-(c-a.start);a.b=0<a.b?a.b:1;a.c=!0}},k:function(a){if(!a)return this.p();if((a=this.a[a])&&a.c)a.i=this.d.call(window,a.g,a.b),a.c=!1}};window.Timeout=e;

TimeoutManager = new Timeout()
exports = TimeoutManager //exports TimeoutManager for other modules
exports.Timeout = Timeout //if need more then one manager...