JQuery Loader
=============

Help to async load jQuery and supporting inline javascript with calls like:

$(function(){})

or

$(document).ready(function(){})


Include it, then just call:

jQl.loadjQ('//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');

You can also use it to load jQuery-dependent module in parallel,
it will be queue and run after jQuery is loaded:

jQl.loadjQ('//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
jQl.loadjQdep('my.example.com/js/myplugin.jquery.js');

If you use a defer inline script, you have to manually call boot() function :

<script defer="defer" type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript">jQl.boot();</script>

jQuery will be loaded without blocking browser rendering,
and during this all inline calls to $(document).ready() will be queued.

As soon as jQuery is ready,
all queued inline calls will be run respecting their initial order.

At the moment, inline call executions now do wait for jQuery-dependent modules.

v 1.1.4
(c) 29-11-2010 Cedric Morin licence GPL
(c) 22-07-2012 Filip Oščádal licence GPL
(c) 09-04-2013 Julian Waller licence GPL
