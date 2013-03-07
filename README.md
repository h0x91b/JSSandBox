JSSandBox by h0x91B (Arseniy Pavlenko)
=========

JSSandBox is a JavaScript file and module loader. 
It is optimized for in-browser use. 
Using a modular script loader like JSSandBox will improve the speed and quality of your code.


Why you need it
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

How it works
==========
It create a own iframe in the body, and for every module adds aditional iframe with the script into the master iframe.
See inspector on example page.

How to use it
==========
