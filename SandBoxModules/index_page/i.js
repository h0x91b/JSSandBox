/*
Author: h0x91b
Date: 2013-03-07 11:53

Available via the MIT or new BSD license

https://github.com/h0x91b/JSSandBox
*/
console.log('index_page router loaded')
_ready = false //i will need some modules, so wait...
exports = {} //nothing to export

global.require(['main/timeout'],function(timeout){
	
	timeout.set(function(){
		console.log('index page example timer')
	},3000)
	
	//all modules loaded, so i am a ready
	_ready = true
});

