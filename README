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
and during this all inline calls to $(document).ready() and $.getScript() will be queued.

As soon as jQuery is ready,
all queued inline calls will be run respecting their initial order.

Inline call executions now do wait for jQuery-dependent modules.

v 1.3.0
(c) 2010-2013 Cedric Morin licence GPL
