/*
Author: h0x91b (h0x91b@gmail.com Arseniy Pavlenko)
Date: 2013-03-07 10:46
Available via the MIT or new BSD license

https://github.com/h0x91b/JSSandBox
*/
console.log('tab_blur_focus module loaded')
_ready = true //no need for waiting

exports = {
	is_active: true
}

function getHiddenProp(){
	var prefixes = ['webkit','moz','ms','o'];
	
	// if 'hidden' is natively supported just return it
	if ('hidden' in global.window.document) return 'hidden';
	
	// otherwise loop over all the known prefixes until we find one
	for (var i = 0; i < prefixes.length; i++){
		if ((prefixes[i] + 'Hidden') in global.window.document) 
			return prefixes[i] + 'Hidden';
	}

	// otherwise it's not supported
	return null;
}

function isHidden() {
	var prop = getHiddenProp();
	if (!prop) return false;

	return global.window.document[prop];
}


global.require(['main/timeout'],function(timeout){
	/*
	every JSSandBox module have own window and body, you can safely change window vars and you can`t broke anything,
	but if you need to change some global var you can access to it over "global.window", 
	for this example i`il need to hook on real document event "visibilitychange", 
	so i just change local "document" variable to a real document
	*/
	var document = global.window.document
	
	var visProp = getHiddenProp();
	if (!visProp) {
		console.log('visibility not supported')
		exports.is_active = true
		return
	}
	
	var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
	document.addEventListener(evtname, function(e){
		if(isHidden()){
			console.log('tab blur, pause timeouts')
			timeout.pause()
			exports.is_active = false
		}
		else{
			console.log('tab focus, resume timeouts')
			timeout.resume()
			exports.is_active = true
		}
	});
})