var	body, Doml, doml, elem, global, report, run, sink, startSink, theDocument,
	Doml = require('../src/doml.js'),
	jsdom = require('jsdom'),
	sink = require('sink-test');

global = this;
startSink = sink.start;
sink = sink.sink;
sys = require ('sys');
console = {
	log: function () {
		sys.puts.apply(global, arguments);
	}
}

document = jsdom.jsdom('<html><head></head><body><span id="the-span">hello world</body></html>'),
window = jsdom.createWindow();

body = document.getElementsByTagName('BODY')[0];
doml = new Doml(document);
		

sink('Doml', function(test, ok, before, after) {


	test('node cloning', 2, function() {
		var	newElem;
		elem = document.getElementById('the-span');
		newElem = doml.create(elem);
		ok(newElem !== elem, 'cloned element is not original element');
		ok(newElem.nodeName === 'SPAN', 'cloned element has proper nodeName');
	});


});

startSink();
