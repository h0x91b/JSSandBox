JSSandBox by h0x91B (Arseniy Pavlenko)
=========

JSSandBox is a JavaScript file and module loader. 
It is optimized for in-browser use. 
Using a modular script loader like JSSandBox will improve the speed and quality of your code.


Why do you need it
=========
* 100% isolation of modules by native iframe sandbox.
* Absolutely no global variables, so no script can access to modules and broke them.
* Every module loaded in own iframe and have own window / document, so it can`t broke anything on real window.
* Every module can load any other module, without any aditional requests (1 request per module), so no aditional bandwidth will be used.
* Every module can exports any objects/functions and can be easily used by other modules =)
* No need to special define for module, just require it.
* You can use every conflict libraries together without any problem.
* No external depends, work out of the box.
* It simple, just 230 lines of non minimized code.
* Ideal for heavy web 2.0 webpages like gmail.
* Works fine with crossdomain & cdn like cloudflare.

How it works
==========
It create a own iframe in the body, and for every module adds aditional iframe with the script into the master iframe.
See inspector on example page.

How to use it
==========
Add to page 
<code><nowiki>&lt;script src="JSSandBox.js"></ script></nowiki></code>

Edit JSSandBox.js
Change if you need <code>var prefix = 'http://www.example.com/sand_box_modules_location/';</code>

Open SandBoxModules/main/router.js - it is a root module, so in this module you can do routing.

Internal variables
==========
Every module have global variables in his scopes.

<code>global.require</code> - used to require aditional modules.

<code>global.window</code> - reference to a global real window, so you can change what you want on real window.

<code>_ready = true</code> - Sandbox will be wait for your module while this not a true.

<code>exports = {}</code> - Exports of a module, can be function/string/object/ineger/undefined.


Thats all...

How to use JSSandBox require
==========
Lets require some module.

Type in any module.
<code>
<pre>
global.require( 
  [
    'main/jQuery-1.9.1',
    'main/jQuery-1.6.3'
  ], 
  function( jQuery191, jQuery163 ){
    console.log('here we have two jQueries =)',jQuery191,jQuery163);
  }
)
</pre>
</code>

How to build your module
=========

Create a folder in SandBoxModules, for example "my_module"

Create a js file in SandBoxModules/my_module/module.js

Type in module:
<code>
<pre>
_ready = true;

exports = "hello world";
</pre>
</code>

Now you can require it from another module like this:
<code>
<pre>
_ready = false;

global.require(['my_module/module'], function(my_module){
  console.log(my_module); //"hello world"
  _ready = true;
});
</pre>
</code>
