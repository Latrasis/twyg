var styles = require('../styles.json');
var mousepanel = require('../mousepanel');

function _read (input, done) {
	if (input == "ruler" || input == "Ruler") {
		// Hide Console
		$('#twyg_console').toggle();
		_watch(done);
	}
}

function _watch(done) {
	$(document).mousedown(function(e) {
		// Prevent Defaults
		e.preventDefault();

		// Create Ruler
		$('#twyg').append('<div id="twyg_ruler"></div>');
		$ruler = $('#twyg_ruler');

		// Style Ruler
		$("#twyg_ruler").css(styles.tools.ruler)

		// Toggle Mouse Panel
		mousepanel.add();
		mousepanel.style();
		mousepanel.position(e);

		// Set Start Point
		var start_x = e.pageX,
			start_y = e.pageY;

		// Set Ruler First Position
		$ruler.css({"left":start_x,"top":start_y});

		$(document).mousemove(function(e) {	

			// Position MousePanel
			mousepanel.position(e);

			// Set End Point
			var end_x = e.pageX,
				end_y = e.pageY;

			// Set Difference
			var change_x = end_x - start_x,
				change_y = end_y - start_y;
			
			var squared_x = change_x*change_x,
				squared_y = change_y*change_y;

			// Set ruler Length
			var ruler_length = Math.sqrt(squared_x + squared_y);

			// Set Ruler Angle
			var ruler_angle = Math.atan(change_y/change_x);

			$ruler.css("width",ruler_length + "px");
			$ruler.rotate(ruler_angle);

			mousepanel.context(ruler_length + "px");
		
		});

		$(document).mouseup(function(e){
			// Unbind MouseMove
			document.getElementById("twyg_ruler").parentNode.removeChild("twyg_ruler");
			mousepanel.remove();
			$(document).unbind('mousemove');
			// Toggle Mouse Panel
			done();
		});
	});
}

module.exports = {
	read: _read
}
