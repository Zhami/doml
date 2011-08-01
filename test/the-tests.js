!function(context) {
	var	body, Doml, doml, elem, 
		isHeadless = (typeof module !== 'undefined' && module.exports),
		report, run, sink, startSink, theDocument;

	if (isHeadless) {
		Doml = require('../src/doml.js');
		sink = require('sink-test');
		startSink = sink.start;
		sink = sink.sink;
		sys = require ('sys');
		console = {
			log: function () {
				sys.puts.apply(context, arguments);
			}
		}
	} else {
		Doml = context.Doml.noConflict();
		sink = context.sink;
		startSink = context.start;
		window && !('console' in window) && !function () {
			context.console = {log: function () {}};
		}();
	}

	run = function (doc) {
		theDocument = doc;
		body = document.getElementsByTagName('BODY')[0];
		doml = new Doml(doc);
		startSink();
	};


	sink('Doml', function(test, ok, before, after) {
		if (!isHeadless) {	
			test('noConflict() method should restore original', 1, function() {
				ok(context.Doml() === 'original', 'Doml() is original');
			});
			test('evaluate constructor method', 1, function() {
				elem = doml.create('div', 'hello');
				ok(elem.constructor.toString().match(/HTMLDivElement/), 'elem constructor matches HTMLDivElement')
			});
		}

		test('node cloning', 2, function() {
			var	newElem;
			elem = document.getElementById('the-span');
			newElem = doml.create(elem);
			ok(newElem !== elem, 'cloned element is not original element');
			ok(elem.nodeName === 'SPAN', 'cloned element has proper nodeName');
		});

		test('element creation #1', 7, function() {
			elem = doml.create('div', 'hello');
			body.appendChild(elem);
			ok(elem.nodeName === 'DIV', 'element has proper nodeName');
			ok(document.getElementsByTagName('DIV')[0] === elem, 'got elem by tagName');
			ok(elem.innerHTML === 'hello', 'has proper text');
			ok(!elem.getAttribute('id'), 'has no ID');
			ok(elem.className === '', 'has no class');
			ok(!elem.checked, 'is not checked');
			ok(!elem.selected, 'is not selected');
			body.removeChild(elem);
		});

		test('element creation #2', 7, function() {
			elem = doml.create('li', {id:'myID', className: 'myClass', selected: true});
			body.appendChild(elem);		// in Browser, must be appended to be able to getById
			ok(elem.nodeName === 'LI', 'element has proper tag');
			ok(!elem.innerHTML, 'has no text');
			ok(elem.getAttribute('id') === 'myID', 'has ID');
			ok(document.getElementById('myID') === elem, 'got elem by ID');
			ok(elem.className === 'myClass', 'has class');
			ok(!elem.checked, 'is not checked');
			ok(elem.selected, 'is selected');
			body.removeChild(elem);
		});

		test('element creation #3', 4, function() {
			elem = doml.create('p', 'hello', 'world');
			ok(elem.nodeName === 'P', 'element has proper tag');
			ok(elem.innerHTML === 'helloworld', 'has proper text');
			ok(!elem.getAttribute('id'), 'has no ID');
			ok(elem.className === '', 'has no class');
		});

		test('element creation #4', 7, function() {
			elem = doml.create('input', 'input', {type:'checkbox', checked: true});
			ok(elem.nodeName === 'INPUT', 'element has proper tag');
			ok(!elem.innerHTML, 'has no text');
			ok(!elem.getAttribute('id'), 'has no ID');
			ok(elem.getAttribute('type') === 'checkbox', 'has type attribute');
			ok(elem.className === '', 'has no class');
			ok(elem.checked, 'is checked');
			ok(!elem.selected, 'is not selected');
		});

		test('element creation #5', 8, function() {
			elem = doml.create('div', 'hello', {className: "myClass", "id": "myID", myAttr: 3}, function (ctxt) {
				console.log('==> anon function invoked');
				return {checked: 1, selected: true};
			});
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.innerHTML === 'hello', 'has proper text value');
			ok(elem.getAttribute('id') === 'myID', 'has ID');
			ok(elem.getAttribute('myAttr') === "3", 'has attribute');
			ok(!elem.getAttribute('type'), 'has no type attribute');
			ok(elem.className === 'myClass', 'has class');
			ok(elem.checked, 'is checked');
			ok(elem.selected, 'is selected');
		});

		test('element creation #6: child node', 3, function() {
			elem = doml.create('p', doml.create('span'));
			ok(elem.nodeName === 'P', 'element has proper tag');
			ok(elem.children.length === 1, 'element has 1 child');
			ok(elem.firstChild.nodeName === 'SPAN', 'child has proper tag');
		});

		test('element creation #7: two child nodes', 4, function() {
			elem = doml.create('div', doml.create('p'), doml.create('span'));
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 2, 'element has 2 children');
			ok(elem.firstChild.nodeName === 'P', '1st child has proper tag');
			ok(elem.firstChild.nextSibling.nodeName === 'SPAN', '2nd child has proper tag');
		});

	});


	if (isHeadless) {
		module.exports = {
			run: run
		}
	} else {
		context.tests = {
			run: run
		}
	}

}(this);
	
