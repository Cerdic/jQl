<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>jQ asynchronous lazy loading</title>
	<script type="text/javascript">
		<?php include "../jQl.min.js"?>
		<?php include "jQldemo.js"?>
		jQl.loadjQ('//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
	</script>
</head>
<body>
<h1>loadjQ jQuery Loading</h1>
<p>Queuing: <span id="queuing">0</span> inline document.ready calls</p>
<p>Trying to boot jQuery: <span id="waiting">0</span> times</p>
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