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
			this.forEach(function (el) {
				var element = d.create.apply(d, arguments);
				el.appendChild(element);
			})
		}
	}, true);	

	$.id = function (id) {
		return $([document.getElementById(id)]);
	};

}(ender || $);