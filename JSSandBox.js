/*
Author: h0x91b (h0x91b@gmail.com Arseniy Pavlenko)
Date: 2013-03-07 10:46
Available via the MIT or new BSD license

https://github.com/h0x91b/JSSandBox
*/
(function(){
	//prefix in your case will be something like: 'http://www.example.com/js/SandBoxModules/'
	var prefix = document.location.href.split('#')[0].replace('/SandBox.html','/SandBoxModules/')
	/*
	version will be added to all js modules, ?v=...
	so if you use something like cloudflare, you can add rule for caching this file for 1 minute and ALL js files for years,
	if you change modules just increment this version for flushing cache on clients
	*/
	var version = 1
	
	//no need to change nothing below this line
	var starttime = new Date().getTime()
	var lasttime = starttime
	var _log = []
	var report_logs = false
	var _profile = {}
	var _timeout = null
	setInterval(function(){
		if('sandbox_debug' in window){
			report_logs = true
			delete window.sandbox_debug
			sandbox_debug()
		}
	},500)
	var sandbox_debug = function(){
		console.group('report sandbox')
		_log.map(function(log){
			console.log(log)
		})
		console.groupEnd('report sandbox')
		var profile = []
		for(var k in _profile){
			profile.push({name:k,time:_profile[k]})
		}
		profile = profile.sort(function(a,b){
			if(a.time == b.time) return 0
			return a.time < b.time ? 1 : -1
		})
		console.group('profile_modules')
		profile.map(function(item){
			console.log('"'+item.name+'" loads in '+item.time+'ms')
		})
		console.groupEnd('profile_modules')
	}
	var log = function(msg){
		var msglog = '+' + (new Date().getTime()-lasttime) + 'ms (+'+(new Date().getTime()-starttime)+'ms total) '+msg
		_log.push(msglog)
		if(report_logs) console.log(msglog)
		lasttime = new Date().getTime()
	}
	var ready_modules = {}
	var require_iframe = document.createElement('iframe')
	var iframe_ready = 0
	//require_iframe.style.display = 'none' //fire fix not fire ready on hidden iframes...
	require_iframe.style.position = 'absolute'
	require_iframe.style.top = '-10400600px'
	require_iframe.style.visibillity = 'hidden'
	require_iframe.style.overflow = 'hidden'
	require_iframe.style.width = '1px'
	require_iframe.style.height = '1px'
	require_iframe.style.zIndex = '-2147483645'
	require_iframe.style.margin = '0'
	require_iframe.style.padding = '0'
	require_iframe.style.border = '0'
	require_iframe.setAttribute('name','JSSandBox_by_h0x91b')

	log('starting require')

	require_iframe.onload = function(){
		log('master iframe onload')
		iframe_ready = 2
		start()
	}
	var require = function(module,callback){
		log('require modules "'+module.join(', ')+'" version '+version)
		//console.time('module '+module)
		var need_to_load = module.length
		var done = function(){
			//console.timeEnd('module '+module)
			if(typeof callback == 'undefined') {
				return
			}
			var args = []
			module.map(function(module){
				if(module.indexOf('/')==-1 || module[module.length-1]=='/')
					module+='/i'
				module = module.replace(/\/\//g,'/')
				var func = module.split(':')
				if(func.length>1){
					module= module.split(':')[0]
					func[1].split(',').map(function(func){
						args.push(ready_modules[module][func])
					})
				}
				else
					args.push(ready_modules[module])
			})
			log('module "'+module+'" ready, call callback')
			callback.apply(window,args)
		}

		module.map(function(module){
			module = module.split(':')[0]
			if(module.indexOf('/')==-1 || module[module.length-1]=='/')
				module+='/i'
			module = module.replace(/\/\//g,'/')
			if(module in ready_modules && ready_modules[module]!=null){
				if(--need_to_load==0) done()
				return
			}
			var check_for_module_ready = function(){
				if(module in ready_modules && ready_modules[module]===null){
					setTimeout(check_for_module_ready,30)
					return
				}
				else{
					if(--need_to_load==0) done()
					return
				}
			}
			if(module in ready_modules && ready_modules[module]===null){
				check_for_module_ready()
				return
			}
			ready_modules[module] = null
			_profile[module] = new Date().getTime()
			var iframe = document.createElement('iframe')
			iframe.setAttribute('name',module)

			var iframe_onload = false
			iframe.onload = function(){
				if(iframe_onload) return
				iframe_onload = true
				iframe.contentWindow.onerror = function(errorMsg, url, lineNumber){
					console.log(
						'JSSandBox error on module "'
						+module
						+'" ErrorMsg: '
						+errorMsg+" url: "
						+url+" Line: "
						+lineNumber
					)
					// doesnt work on chrome... "Script error." always with no detail
					//http://code.google.com/p/chromium/issues/detail?id=159566
				}

				var onload = function(){
					var check_for_ready = function(){
						if(ready_modules[module]) {
							return
						}
						var exports = iframe.contentWindow.exports
						if(iframe.contentWindow._ready){
							ready_modules[module] = exports
							_profile[module] = new Date().getTime() - _profile[module]
							if(--need_to_load==0) {
								log('all modules done, call done()')
								done()
							}
						}
						else{
							log('module "'+module+'" not ready, waiting')
							setTimeout(check_for_ready,30)
						}
					}
					check_for_ready()
				}

				iframe.contentWindow.global = {
					require: require,
					window: window
				}
				iframe.contentWindow._callback = onload
				var script = document.createElement('script')
				script.src = prefix+module+'.js?v='+version
				script.src = script.src
				script.setAttribute('charset','UTF-8')
				script.setAttribute('type','text/javascript')
				if(document.location.host!='localhost')
					script.setAttribute('crossorigin','anonymous')
				script.onerror = function(err){
					log('error on loading module "'+module+'"')
				}
				script.onload = onload
				iframe.contentWindow.document.head.appendChild(script)
			}

			require_iframe.contentWindow.document.body.appendChild(iframe)

			if(!iframe_onload){
				var iframeDoc = iframe.contentDocument
				//bugfix for opera & firefox, они не тригерили onload на iframe
				iframeDoc.open()
				iframeDoc.write('<!doctype html><html><head></head><body></body></html>')
				iframeDoc.close()
			}
		})

	}

	var _init = false
	var start = function(){
		if(_timeout) clearTimeout(_timeout)
		if(_init) return
		if(!document.body){
			_timeout = setTimeout(start,30)
			return
		}
		if(iframe_ready==0){
			iframe_ready = 1
			document.body.appendChild(require_iframe)
			_timeout = setTimeout(start,30)
			return 
		}
		if(iframe_ready==1){
			_timeout = setTimeout(start,30)
			return
		}
		if(iframe_ready==2 && (!require_iframe.contentDocument.body || !require_iframe.contentDocument.head)){
			_timeout = setTimeout(start,30)
			return
		}
		log('require ready, start')
		_init = true
		require(['main/router'])
	}
	start()
})()