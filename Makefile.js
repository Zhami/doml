require('smoosh')
	.config('./Makeconfig.json')
	.clean()	// removes dist directory
	.run()		// runs jshint on full build
	.build()	// builds both uncompressed and compressed files
	.analyze();	// analyzes all