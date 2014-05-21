/**
 * JQuery Loader
 *
 * Help to async load jQuery and supporting inline javascript with calls like
 * $(function(){})
 * or
 * $(document).ready(function(){})
 *
 * Include it, then just call :
 * jQl.loadjQ('//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
 *
 * You can also use it to load jQuery-dependent module in parallel,
 * it will be queue and run after jQuery is loaded :
 * jQl.loadjQ('//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
 * jQl.loadjQdep('my.example.com/js/myplugin.jquery.js');
 *
 * If you use a defer inline script, you have to manually call boot() function :
 *
 * &lt;script defer type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js">&lt;/script>
 * &lt;script type="text/javascript">jQl.boot();&lt;/script>
 *
 *
 *
 * jQuery will be loaded without blocking browser rendering,
 * and during this all inline calls to $(document).ready() and $.getScript()
 * will be queued.
 * As soon as jQuery is ready, all queued ready() and getScript() calls will be run
 * respecting their initial order
 *
 * Be careful :
 * At the moment, inline call and getScript executions are not waiting jQuery-dependent modules,
 * but only jQuery core
 * However, when jQuery is loaded, jQuery-dependent modules already loaded
 * are run before inline scripts. But if some modules are longer to load and arrive
 * after jQuery, they will be run after queued inline calls
 *
 * v 1.3.0
 * (c) 2010-2013 Cedric Morin licence GPL
 *
 */
var jQl={
	/**
	 * the inline calls queue
	 */
	"q":[],

	/**
	 * the jQuery dependencies xhr loaded queue
	 */
	"dq":[],

	/**
	 * Map the dependency request order to their data
	 */
	"dMap":[],

	/**
	 * The amount of dependencies loaded
	 */
	"dLoaded":0,

	/**
	 * the jQuery.getScript queue
	 */
	"gs":[],

	/**
	 * the ready function that collect calls and put it in the queue
	 */
	"ready":function(f){
		if(typeof f=='function'){
			jQl.q.push(f);
		}
		// return jQl in order to support jQuery(document).ready()
		return jQl;
	},
	"getScript":function(s,c){
		jQl.gs.push([s,c]);
	},

	/**
	 * unqueue ready() function
	 * run all queues inline $.ready() calls
	 * in the right order and purge the queue
	 *
	 */
	"unq":function(){
		for(var i=0;i<jQl.q.length;i++)
			jQl.q[i]();
		jQl.q=[];},

	/**
	 * unqueue getScript() function
	 * run all queues $.getScript calls
	 * in the right order and purge the queue
	 *
	 */
	"ungs":function(){
		for(var i=0;i<jQl.gs.length;i++)
			jQuery.getScript(jQl.gs[i][0],jQl.gs[i][1]);
		jQl.gs=[];
	},

	/**
	 * boot function
	 * call it after calling jQuery in order to wait it's loaded
	 * or use it in onload='' on script defer/async element
	 *
	 * @param function callback
	 *	a callback to call after jQuery is loaded
	 *
	 */
	"bId":null,
	"boot":function(callback){
		if(typeof window.jQuery.fn == 'undefined'){
			if (!jQl.bId) {
				jQl.bId = setInterval(function(){jQl.boot(callback)},25);
			}
			return;
		}
		if (jQl.bId) {
			clearInterval(jQl.bId);
		}
		jQl.bId=0;

		jQl.testFinished();
		// then unqueue all getScript calls
		jQl.ungs();

		// and last unqueue all inline calls
		// (when document is ready)
		jQuery(jQl.unq);

		// call the callback if provided
		if(typeof callback=='function') callback();
	},

	"booted":function(){return jQl.bId===0},

	/**
	 * Test whether jquery and all dependencies have loaded.
	 * If so, then run all dependencies and ready calls
	 */
	"testFinished":function(){
		if (typeof window.jQuery.fn=="undefined"){
			setTimeout(jQl.testFinished, 10);
			return;
		}
		
		if(jQl.dLoaded != jQl.dMap.length){
			setTimeout(jQl.testFinished, 10);
			return;
		}

		// OK, jQuery is loaded,
		// we can load additional jQuery dependents modules
		jQl.unqjQdep(true);

		// then unqueue all inline calls
		// (when document is ready)
		$(jQl.unq());
	},

	/**
	 * load jQuery script asynchronously in all browsers
	 * by delayed dom injection
	 * @param string src
	 *   jQuery url to use, can be a CDN hosted,
	 *   or a compiled js including jQuery
	 * @param callback
	 */
	"loadjQ":function(src,callback){
		setTimeout(
			function(){
				var s=document.createElement('script');
				s.src=src;
				document.getElementsByTagName('head')[0].appendChild(s)
			},
			1);
		jQl.boot(callback);
	},


	/**
	 *
	 *
	 *
	 * jQuery-dependant modules loading
	 * this section is not necessary in case of loading only one script
	 * including jQuery
	 * Can be removed to make the booter smaller
	 *
	 *
	 *
	 *
	 *
	 *
	 */

	/**
	 * load a jQuery-dependent script
	 * parallel loading in most browsers by xhr loading and injection
	 * the jQ-dependant script is queued or run when loaded,
	 * depending of jQuery loading state
	 */
	"loadjQdep":function(src){
		jQl.dMap.push(src);
		jQl.loadxhr(src, jQl.qdep);
		jQl.dCount++;
	},

	/**
	 * queue jQuery-dependent script if download finish before jQuery loading
	 * or run it directly if jQuery loaded, and previous loaded modules are run
	 * (preserve initial order)
	 *
	 * @param string txt
	 *   the js script to inject inline in dom
	 * @param string src
	 *   the source url of the script, not used here
	 */
	"qdep":function(txt, src){
		if (txt){
			jQl.dLoaded++;
			jQl.dq[src] = txt;
		}
	},

	/**
	 * dequeue jQuery-dependent modules loaded before jQuery
	 * call once only
	 */
	"unqjQdep":function(force){
		// security, should never happen
		// so we keep setTimeout even if setInterval would be cleaner
		if (typeof force!="undefined" && typeof window.jQuery.fn=="undefined"){
			setTimeout(jQl.unqjQdep, 50);
			return;
		}
		for (var i=0;i<jQl.dMap.length;i++) jQl.rs(jQl.dq[jQl.dMap[i]]);
		jQl.dq = [];
		jQl.dMap = [];
	},


	/**
	 * run a text script as inline js
	 * @param string txt
	 *   js script
	 * @param string src
	 *   original source of the script (not used here)
	 */
	"rs":function(txt, src){
		var se = document.createElement('script');
		document.getElementsByTagName('head')[0].appendChild(se);
		se.text = txt;
	},

	/**
	 * multi-browsers XHr loader,
	 * credits http://www.stevesouders.com/blog/2009/04/27/loading-scripts-without-blocking/
	 *
	 */
	"loadxhr":function(src,callback) {
		var xoe;
		xoe = jQl.getxo();
		xoe.onreadystatechange = function() {
			if ( xoe.readyState != 4 || 200 != xoe.status ) return;
			callback(xoe.responseText,src);
		};
		try {
			xoe.open('GET', src, true);
			xoe.send('');
		}
		catch(e) {
		}
	},

	/**
	 * facilitie for XHr loader
	 * credits http://www.stevesouders.com/blog/2009/04/27/loading-scripts-without-blocking/
	 *
	 */
	"getxo":function (){
		var xhrObj = false;
		try {
			xhrObj = new XMLHttpRequest();
		}
		catch(e){
			var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
			for ( var i=0; i < progid.length; ++i ) {
				try {
					xhrObj = new ActiveXObject(progid[i]);
				}
				catch(e){
					continue;
				}
				break;
			}
		}
		finally {
			return xhrObj;
		}
	}
};


/**
 *
 * map $ and jQuery to the jQl.ready() function in order to catch all
 * inline calls like :
 * $(function(){...})
 * jQuery(function(){...})
 * $('document').ready(function(){...})
 * jQuery('document').ready(function(){...})
 *
 * $.getScript() and jQuery.getScript() also catched and called
 *
 * only if jQuery is not already loaded
 */
if (typeof window.jQuery=='undefined'){var $=jQl.ready,jQuery=$;$.getScript=jQl.getScript;}
