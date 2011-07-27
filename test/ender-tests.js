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
		
		test('$.doml exists and is a function', 2, function() {
			ok($.doml, '$.doml exists');
			ok(typeof $.doml === 'function', '$.dom lis a function');
		});

		test('$.doml returns an ender set', 4, function() {
			enderSet = $.doml('div', 'hello');
			ok(enderSet, '$.doml() emits something');
			ok(typeof enderSet === 'object', '$.doml() emits an object');
			ok(Object.prototype.toString.apply(enderSet) === '[object Array]', '$.doml() emits an Array');
			ok(enderSet.length === 1, '$.doml() emits an Array of 1 item');
		});

		test('$.doml creates a propr element', 8, function() {
			enderSet = $.doml('div', 'hello');
			elem = enderSet[0];
			body.appendChild(elem);
			ok(elem.constructor.toString().match(/HTMLDivElement/), 'elem constructor matches HTMLDivElement')
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(document.getElementsByTagName('DIV')[0] === elem, 'got elem by tagName');
			ok(elem.innerHTML === 'hello', 'has proper text');
			ok(!elem.getAttribute('id'), 'has no ID');
			ok(elem.className === '', 'has no class');
			ok(!elem.checked, 'is not checked');
			ok(!elem.selected, 'is not selected');
			body.removeChild(elem);
		});
		
		test('node cloning', 1, function() {
			elem = document.getElementById('the-span');
			enderSet = $.doml(elem);
			elem = enderSet[0];
			ok(elem.nodeName === 'SPAN', 'cloned element has proper nodeName');
		});

		test('doml works on Ender element chain', 2, function() {
			$(body).doml('div', 'hello');
			elem = body.lastChild;
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.innerHTML === 'hello', 'has proper text');
			body.removeChild(elem);
		});
		
	});

	context.tests = {
		run: run
	}

}(this);
	
