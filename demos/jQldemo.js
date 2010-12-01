var c1=0;
jQl._ready = jQl.ready;
jQl.ready = function(f){
	if(typeof f=='function'){
		c1++;
		// for demo purpose, to be removed
		if (document.getElementById('queuing')) document.getElementById('queuing').innerHTML=c1;
	}
	// return jQl in order to support jQuery(document).ready()
	return jQl._ready(f);
};
jQl._boot = jQl.boot;
jQl.boot = function(c){
	// for demo purpose, to be removed
	if (document.getElementById('waiting')) document.getElementById('waiting').innerHTML++;
	return jQl._boot(c);
}
$=jQl.ready;jQuery=$;
