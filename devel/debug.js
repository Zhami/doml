var	body, Doml, doml, elem, global, report, run, sink, startSink, theDocument,
	Doml = require('../src/doml.js'),
	eyes = require('eyes'),
	jsdom = require('jsdom'),
	sink = require('sink-test');

global = this;
startSink = sink.start;
sink = sink.sink;
sys = require ('sys');


document = jsdom.jsdom('<html><head></head><body><span id="the-span">hello world</body></html>'),
window = jsdom.createWindow();

body = document.getElementsByTagName('BODY')[0];
doml = new Doml(document);
		
elem = doml.create('div', function (args) {
	var elems = [];
	elems.push(doml.create('p', args.text1));
	elems.push(doml.create('span', args.text2));
	return elems;
}, {text1: 'text1', text2: 'text2'});

console.log('elem.children.length: ' + elem.children.length)
console.log('elem.childNodes.length: ' + elem.childNodes.length)
elem = elem.firstChild;
console.log('child: elem.nodeType: ' + elem.nodeType);
elem = elem.nextSibling;
console.log('child: elem.nodeType: ' + elem.nodeType);

console.log('END');

sink('Doml', function(test, ok, before, after) {


		test('element creation: function invocation returns an element', 11, function() {
			elem = doml.create('div', 'hello', function (args) {
				return doml.create('p', args.text, {className: args.className, "id": args.id});
			}, {className: "myClass", "id": "myID", text: 'hello'}, 'final');
			ok(elem.nodeName === 'DIV', 'element has proper tag');
			ok(elem.children.length === 2, 'element has proper number of (element) children');
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
console.log('elem.nodeName=' + elem.nodeName);
			ok(elem.nodeType === 3, '3rd child is proper type');
			ok(elem.nodeValue === 'final', '3rd child has proper text');
		});


});

//startSink();
