var	Doml = require('../src/doml.js'),
	eyes = require('eyes'),
	jsdom = require('jsdom'),
	sink = require('sink-test'),
	start = sink.start,
	sys = require('sys'),
	doml, document, elem, window;
	
sink = sink.sink;


document = jsdom.jsdom("<html><head></head><body>hello world</body></html>"),
window = jsdom.createWindow();

doml = new Doml(document);
	

sink('element creation #1', function(test, ok, before, after) {
	before(function () {
		elem = doml.create('div');
	});
	test('element attributes', 6, function() {
		ok(elem.nodeName === 'DIV', 'element has proper tag');
		ok(elem.nodeValue === null, 'has no text node');
		ok(elem.getAttribute('id') === '', 'has no ID');
		ok(elem.className === '', 'has no class');
		ok(!elem.checked, 'is not checked');
		ok(!elem.selected, 'is not selected');
	});
});

sink('element creation #2', function(test, ok, before, after) {
	before(function () {
		elem = doml.create('li', {id:'myID', selected: true});
	});
	test('element attributes', 6, function() {
		ok(elem.nodeName === 'LI', 'element has proper tag');
		ok(elem.nodeValue === null, 'has no text node');
		ok(elem.getAttribute('id') === 'myID', 'has ID');
		ok(elem.className === '', 'has no class');
		ok(!elem.checked, 'is not checked');
		ok(elem.selected, 'is selected');
	});
});

sink('element creation #3', function(test, ok, before, after) {
	before(function () {
		elem = doml.create('input', {type:'checkbox', checked: true});
	});
	test('element attributes', 7, function() {
		ok(elem.nodeName === 'INPUT', 'element has proper tag');
		ok(elem.nodeValue === null, 'has no text node');
		ok(elem.getAttribute('id') === '', 'has no ID');
		ok(elem.getAttribute('type') === 'checkbox', 'has type attribute');
		ok(elem.className === '', 'has no class');
		ok(elem.checked, 'is checked');
		ok(!elem.selected, 'is not selected');
	});
});

sink('element creation #4', function(test, ok, before, after) {
	before(function () {
		elem = doml.create('div', 'hello', {className: "myClass", "id": "myID", myAttr: 3}, function (ctxt) {
			sys.puts('anon function invoked');
			return {checked: 1, selected: true};
		});
	});
	test('element attributes', 8, function() {
		ok(elem.nodeName === 'DIV', 'element has proper tag');
		ok(elem.nodeValue === 'hello', 'has proper text value');
		ok(elem.getAttribute('id') === 'myID', 'has ID');
		ok(elem.getAttribute('myAttr') === "3", 'has attribute');
		ok(elem.getAttribute('type') === '', 'has no type attribute');
		ok(elem.className === 'myClass', 'has class');
		ok(elem.checked, 'is checked');
		ok(elem.selected, 'is selected');
	});
});

start();
	
	
