// ******* Small Dependency Functions with Jquery ******* //

require(['jquery'], function(jQuery) {
	// Find Css Float Value
	jQuery.fn.cssFloat = function (prop) {
	    return parseFloat(this.css(prop)) || 0;
	};

	// Find Css Integer Value
	jQuery.fn.cssInt = function (prop) {
	    return parseInt(this.css(prop),10) || 0;
	};

	// Rotate Css with Transformed Origin
	jQuery.fn.rotate = function(degrees) {
	    $(this).css({
		'-webkit-transform' : 'rotate('+ degrees +'rad)',
	    '-moz-transform' : 'rotate('+ degrees +'rad)',
	    '-ms-transform' : 'rotate('+ degrees +'rad)',
	    'transform' : 'rotate('+ degrees +'rad)',
		'transformOrigin':"left top"
		});
	};
});
