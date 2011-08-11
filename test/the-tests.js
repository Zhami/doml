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

		test('element creation: first argument is array should fail', 1, function() {
			elem = doml.create(['div', 'text1']);
			ok(!elem, 'element not created');
		});

		test('element creation: basic', 7, function() {
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

		test('element creation: attributes', 7, function() {
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

		test('element creation: text', 4, function() {
			elem = doml.create('p', 'hello', 'world');
			ok(elem.nodeName === 'P', 'element has proper tag');
			ok(elem.innerHTML === 'helloworld', 'has proper text');
			ok(!elem.getAttribute('id'), 'has no ID');
			ok(elem.className === '', 'has no class');
		});

		test('element creation: ignore text for certain tags', 2, function() {
			elem = doml.create('input', 'input', {type:'checkbox', checked: true});
			ok(elem.nodeName === 'INPUT', 'element has proper tag');
			ok(!elem.innerHTML, 'has no text');
		});

		test('element creation: child node', 3, function() {
			elem = doml.create('p', doml.create('span'));
			ok(elem.nodeName === 'P', 'element has proper tag');
			ok(elem.children.length === 1, 'element has 1 child');
			ok(elem.firstChild.nodeName === 'SPAN', 'child has proper tag');
		});

		test('element creation: two child nodes', 4, function() {
			elem = doml.create('div', doml.create('p'), doml.create('span'));
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 2, 'element has 2 children');
			ok(elem.firstChild.nodeName === 'P', '1st child has proper tag');
			ok(elem.firstChild.nextSibling.nodeName === 'SPAN', '2nd child has proper tag');
		});

		test('element creation: apply CSS', 3, function() {
			elem = doml.create('p', 'hello', {css: "color:red; border:2px solid green;"});
			ok(elem.nodeName === 'P', 'element has proper tag');
			ok(elem.style.color === "red", 'element has proper color');
			ok(elem.style.border === "2px solid green", 'element has proper border');
		});

		test('element creation: mixed text and child nodes', 9, function() {
			elem = doml.create('div', 'text1', doml.create('p', 'p-text'), 'text2', doml.create('span', 'span-text'));
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 2, 'element has proper number of (element) children');
			ok(elem.childNodes.length === 4, 'element has proper number of (elements & text) children');
			elem = elem.firstChild;
			ok(elem.nodeType === 3, '1st child is proper type');
			ok(elem.nodeValue === 'text1', '1st child has proper text');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'P', '2nd child has proper tag');
			elem = elem.nextSibling;
			ok(elem.nodeType === 3, '3rd child is proper type');
			ok(elem.nodeValue === 'text2', '3rd child has proper text');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'SPAN', '4th child has proper tag');
		});

		test('element creation: array arguments for children', 9, function() {
			elem = doml.create('div', 'text1', ['p', 'p-text'], 'text2', ['span', 'span-text']);
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 2, 'element has proper number of (element) children');
			ok(elem.childNodes.length === 4, 'element has proper number of (elements & text) children');
			elem = elem.firstChild;
			ok(elem.nodeType === 3, '1st child is proper type');
			ok(elem.nodeValue === 'text1', '1st child has proper text');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'P', '2nd child has proper tag');
			elem = elem.nextSibling;
			ok(elem.nodeType === 3, '3rd child is proper type');
			ok(elem.nodeValue === 'text2', '3rd child has proper text');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'SPAN', '4th child has proper tag');
		});

		test('element creation: array of nodes', 7, function() {
			elem = doml.create('div', [doml.create('p', 'p-text'), doml.create('span', 'span-text')]);
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 2, 'element has proper number of (element) children');
			ok(elem.childNodes.length === 2, 'element has proper number of (elements & text) children');
			elem = elem.firstChild;
			ok(elem.nodeName === 'P', '1st child has proper tag');
			ok(elem.innerHTML === 'p-text', '1st child has proper text');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'SPAN', '2nd child has proper tag');
			ok(elem.innerHTML === 'span-text', '2nd child has proper text');
		});

		test('element creation: array of mixed arguments', 7, function() {
			elem = doml.create('div', [doml.create('p', 'p-text'), 'hello', {"id": "myID"}]);
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.getAttribute('id') === 'myID', 'element has proper ID');
			ok(elem.children.length === 1, 'element has proper number of (element) children');
			ok(elem.childNodes.length === 2, 'element has proper number of (elements & text) children');
			ok(elem.lastChild.nodeValue === 'hello', 'element has proper text');
			elem = elem.firstChild;
			ok(elem.nodeName === 'P', '1st child has proper tag');
			ok(elem.innerHTML === 'p-text', '1st child has proper text');
		});

		test('element creation: subtree', 9, function() {
			elem = doml.create('div', ['p', 'hello', {id: "p-hello"}, ['span', 'there']]);
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 1, 'element has 1 child');
			elem = elem.firstChild;
			ok(elem.nodeName === 'P', 'child has proper tag');
			ok(elem.getAttribute('id') === 'p-hello', 'child has proper ID');
			ok(elem.children.length === 1, 'child has 1 child');
			ok(elem.childNodes.length === 2, 'element has proper number of elements & text');
			elem = elem.firstChild; // text node
			elem = elem.nextSibling; // SPAN element
			ok(elem.nodeName === 'SPAN', 'grandchild has proper tag');
			ok(elem.childNodes.length === 1, 'granchild has proper number of nodes');
			ok(elem.lastChild.nodeValue === 'there', 'grandchild has proper text');
		});
		
		test('element creation: array of arrays argument for children', 9, function() {
			elem = doml.create('div', 'text1', [['p', 'p-text'], 'text2', ['span', 'span-text']]);
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 2, 'element has proper number of (element) children');
			ok(elem.childNodes.length === 4, 'element has proper number of (elements & text) children');
			elem = elem.firstChild;
			ok(elem.nodeType === 3, '1st child is proper type');
			ok(elem.nodeValue === 'text1', '1st child has proper text');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'P', '2nd child has proper tag');
			elem = elem.nextSibling;
			ok(elem.nodeType === 3, '3rd child is proper type');
			ok(elem.nodeValue === 'text2', '3rd child has proper text');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'SPAN', '4th child has proper tag');
		});

		test('element creation: function invocation returns nothing', 3, function() {
			elem = doml.create('div', 'hello', function (args) {}, {text: 'hello'}, 'final');
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 0, 'element has proper number of (element) children');
			ok(elem.childNodes.length === 2, 'element has proper number of (elements & text) children');
		});

		test('element creation: function invocation returns an element', 11, function() {
			elem = doml.create('div', 'hello', function (args) {
				return doml.create('p', args.text, {className: args.className, "id": args.id});
			}, {className: "myClass", "id": "myID", text: 'hello'}, 'final');
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 1, 'element has proper number of (element) children');
			ok(elem.childNodes.length === 3, 'element has proper number of (elements & text) children');
			elem = elem.firstChild;
			ok(elem.nodeType === 3, '1st child is proper type');
			ok(elem.nodeValue === 'hello', '1st child has proper text');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'P', 'function generated child element has proper tag');
			ok(elem.innerHTML === 'hello', 'function generated child has proper text value');
			ok(elem.getAttribute('id') === 'myID', 'function generated child has proper ID');
			ok(elem.className === 'myClass', 'function generated child has proper class');
			elem = elem.nextSibling;
			ok(elem.nodeType === 3, '3rd child is proper type');
			ok(elem.nodeValue === 'final', '3rd child has proper text');
		});

		test('element creation: function invocation returns array of elements', 6, function() {
			elem = doml.create('div', function (args) {
				var elems = [];
				elems.push(doml.create('p', args.text1));
				elems.push(doml.create('span', args.text2));
				return elems;
			}, {text1: 'text1', text2: 'text2'});
			ok(elem.children.length === 2, 'element has proper number of (element) children');
			ok(elem.childNodes.length === 2, 'element has proper number of (elements & text) children');
			elem = elem.firstChild;
			ok(elem.nodeName === 'P', '1st child element has proper tag');
			ok(elem.innerHTML === 'text1', '1st child has proper text value');
			elem = elem.nextSibling;
			ok(elem.nodeName === 'SPAN', '2nd child element has proper tag');
			ok(elem.innerHTML === 'text2', '2nd child has proper text value');
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
	
