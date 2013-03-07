/*
Author: h0x91b (h0x91b@gmail.com Arseniy Pavlenko)
Date: 2013-03-07 10:31
Available via the MIT or new BSD license

https://github.com/h0x91b/JSTimeoutManager
*/

_ready = false //need to wait for this module

exports = {} //module export nothing

global.require([
		'main/timeout'
	],function(
		timeout
	)
	{
		console.log('module main ready with timeout manager')
		
		timeout.set(function(){
			console.log('example interval, he will work only while tab is visible, and be paused on tab visibility check')
		},5000,true)
		
		//create new timeout manager for important thing, he will never be stoped...
		var TimeoutManager = new timeout.Timeout();
		TimeoutManager.set(function(){
			console.log('this inteval will never stoped by tab focus check...')
		},5000,true)
		
		//let`s load tab blur check
		global.require(['main/tab_blur_focus'])
		//that all =)
		
		/*
		example core loaded, lets do some routing
		
		every JSSandBox module have own window and body, you can safely change window vars and you can`t broke anything,
		but if you need to change some global var you can access to it over "global.window", 
		for this example i`il need a document.location.hash on real document, 
		so i just change local "document" variable to a real document
		*/
		var document = global.window.document
		var page = document.location.hash || '#index' //if no hash in url, this index...
		
		switch(page){
			case '#about':
				//if i not set a name, by default it will be "i.js" file, 
				//so this will be SandBoxModules/about_page/i.js
				global.require(['about_page']);
				break;
			case '#index':
				global.require(['index_page']);
				break;
			default:
				console.log('unknown page, load index page router');
				global.require(['index_page']);
				break;
		}
		
		_ready = true //module ready
	}
)