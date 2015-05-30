var styles = require('./styles');

function _read(input) {

	var counter = arguments.length;
	
	function pass() {
		if(counter <= 2){
			_react(Error("No Valid Tool Specified"))
		} else {
			counter--;
		}
	};

	Array.slice(arguments, 1).forEach(function(cb) {
		if(typeof cb === 'function'){
			cb(input, _react, pass)
		} else if (typeof cb.read === 'function'){
			cb.read(input, _react, pass)
		}
	})

}

// Again For Now For Everything Else We Simply Respond With a "Nope" Animation
// Future Versions should have a more wide range of responses
function _react(err) {
	if (err){
		console.error(err);
		$("#twyg_console")
			.animate({'left':'10px'}, 70)
			.animate({'left':'30px'}, 70)
			.animate({'left':'20px'}, 70);
	}
}

function _show() {
	$("body")
		.prepend('<div id="twyg"></div>')
		.css('position','relative');
	$("#twyg")
		.prepend('<input type="text" id="twyg_console"></input>');
	$("#twyg_console").css(styles.console)
	$('#twyg_console').toggle();
};

function _toggle() {
	var text_input = $('#twyg_console');
	text_input.toggle();
	text_input.focus ();
	text_input.select ();
};


module.exports = {
	show: _show,
	toggle: _toggle,
	read: _read
}