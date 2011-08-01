var	body, Doml, doml, elem, global, report, run, sink, startSink, theDocument,
	Doml = require('../src/doml.js'),
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
		
var elem1 = doml.create('span', 'a span');

elem = doml.create('p', "a para", elem1);

console.log('elem children: ' + elem.children.length)


sink('Doml', function(test, ok, before, after) {


	test('node cloning', 2, function() {
		var	newElem;
		elem = document.getElementById('the-span');
		newElem = doml.create(elem);
		ok(newElem !== elem, 'cloned element is not original element');
		ok(newElem.nodeName === 'SPAN', 'cloned element has proper nodeName');
	});


});

//startSink();
