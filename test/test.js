!function(context) {
	var	jsdom = require('jsdom'),
		tests = require('./the-tests.js');
	
	document = jsdom.jsdom("<html><head></head><body>hello world</body></html>"),
	window = jsdom.createWindow();

	tests.run(document);

}(this);