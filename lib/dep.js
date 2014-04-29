// ******* Small Dependency Functions with Jquery ******* //
var jQuery = require('jquery');

function dep() {

	return jQuery.fn.extend({

		// Find Css Float Value
		cssFloat: function(prop) {
			return parseFloat(this.css(prop)) || 0;
		},

		// Find Css Integer Value
		cssInt: function(prop) {
			return parseInt(this.css(prop),10) || 0;
		},

		// Rotate Css with Transformed Origin
		rotate: function(degrees) {
			$(this).css({
				'-webkit-transform' : 'rotate('+ degrees +'rad)',
				'-moz-transform' : 'rotate('+ degrees +'rad)',
				'-ms-transform' : 'rotate('+ degrees +'rad)',
				'transform' : 'rotate('+ degrees +'rad)',
				'transformOrigin':"left top"
			});
		}
	});
}

exports.dep = dep;


