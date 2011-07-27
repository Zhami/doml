!function(context) {
	var	jsdom = require('jsdom'),
		tests = require('./the-tests.js');
	
	document = jsdom.jsdom('<html><head></head><body><span id="the-span">hello world</body></html>'),
	window = jsdom.createWindow();

	tests.run(document);

}(this);