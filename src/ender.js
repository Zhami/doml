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
			var element = d.create.apply(d, arguments);
  			this.forEach(function (el) {
  				el.appendChild(d.create.call(d, element));
  			})
  		}
	}, true);	

	$.id = function (id) {
		return $([document.getElementById(id)]);
	};

}(ender || $);