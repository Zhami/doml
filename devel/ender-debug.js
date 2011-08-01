!function(context) {
	var	body, run, sink, startSink;

	sink = context.sink;
	startSink = context.start;
	window && !('console' in window) && !function () {
		context.console = {log: function () {}};
	}();

	run = function (doc) {
		theDocument = doc;
		body = document.getElementsByTagName('BODY')[0];
		startSink();
	};

	sink('Doml', function(test, ok, before, after) {
		var elem, enderSet;
		

		test('doml appends supplied node as child', 3, function() {
			enderSet = $.doml('span', 'a span');
			elem = enderSet[0];
console.log('ender test: have an elem: ', elem);
			$(body).doml('p', 'hello', elem);
			elem = body.lastElementChild;
			ok(elem.nodeName === 'P', 'element has proper tag');
			ok(elem.children.length === 1, 'element has 1 child');
			ok(elem.firstElementChild.nodeName === 'SPAN', 'child has proper tag');
		});


	});

	context.tests = {
		run: run
	}

}(this);
	
