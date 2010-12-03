<!doctype html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
        <title>JS Async Loading</title>
				<script type="text/javascript">
				<?php include "../jQl.js"?>
				<?php include "jQldemo.js"?>
				jQl.boot();
				</script>
				<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
    </head>
    <body>
	    <a href="http://www.yterium.net/jQl-an-asynchronous-jQuery-Loader">http://www.yterium.net/jQl-an-asynchronous-jQuery-Loader</a>
			<h1>script jQuery Loading</h1>
			<p>Queuing : <span id="queuing">0</span> inline document.ready calls</p>
			<p>Triyng to boot jQuery : <span id="waiting">0</span> times</p>
			<h1>Inline scripts</h1>
			<p id="test1"></p>
			<script type="text/javascript">
				$(function(){$("#test1").html("This is text inserted with inline JS and $(function(){}) shorthand")});
			</script>
			<p id="test2"></p>
			<script type="text/javascript">
				$('document').ready(function(){$("#test2").html("This is text inserted with inline JS and $('document').ready(function(){})")});
			</script>
    </body>
</html>
