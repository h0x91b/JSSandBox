/*
Author: h0x91b
Date: 2013-03-07 11:53

Available via the MIT or new BSD license

https://github.com/h0x91b/JSSandBox
*/
console.log('jquery_page router loaded')
_ready = false //i will need some modules, so wait...
exports = {} //nothing to export

global.require(['main/timeout','main/jQuery-1.9.1'],function(timeout,$){
	
	console.log('jquery there =)',$)
	
	var document = global.window.document
	$(document).ready(function(){
		console.log('jQuery ready event');
		$p = $(".jQuery");
		$p.load('SandBox.html h1',function(){
			$p.after($('<p>html loaded, jQuery works</p>'))
		});
	})
	//all modules loaded, so i am a ready
	_ready = true;
});

