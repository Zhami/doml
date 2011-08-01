// Ender "bridge"

!function ($) {
	
  	var	d = require('doml');
	
	$.ender({
		doml: function () {
			return $([d.create.apply(d, arguments)]);
		}
	});

	$.ender({
 		doml: function () {
			var element = d.create.apply(d, arguments);		// a shiny new element
  			this.forEach(function (el, index) {
				if (index) {
					// if we are appending to more than one element, then clone a new copy
					element = d.create.call(d, element);
				}
  				el.appendChild(element);
  			})
  		}
	}, true);	

	$.id = function (id) {
		return $([document.getElementById(id)]);
	};

}(ender || $);