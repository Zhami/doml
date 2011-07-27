!function(context) {
	var	body, run, sink, startSink;

//	Doml = context.Doml.noConflict();
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
		var elem;
		
		test('$.doml exists and creates an element', 4, function() {
			ok($.doml, '$.doml exists');
			ok(typeof $.doml === 'function', '$.dom lis a function');
			elem = $.doml('div', 'hello');
			ok(elem, '$.doml() emits something');
			ok(typeof elem === 'object', '$.doml() emits an object');
		});

		test('$.doml creates a propr element', 7, function() {
			elem = $.doml('div', 'hello');
			body.appendChild(elem);
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(document.getElementsByTagName('DIV')[0] === elem, 'got elem by tagName');
			ok(elem.innerHTML === 'hello', 'has proper text');
			ok(!elem.getAttribute('id'), 'has no ID');
			ok(elem.className === '', 'has no class');
			ok(!elem.checked, 'is not checked');
			ok(!elem.selected, 'is not selected');
			body.removeChild(elem);
		});

	});

	context.tests = {
		run: run
	}

}(this);
	
