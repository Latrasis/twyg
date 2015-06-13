var $ = require('jquery');
var Mousetrap = require('mousetrap');

var styles = require('./styles.json');

/*********** Mouse Panel (Pops next to the mouse) **************/

module.exports = {

	add:function() {
		$("#twyg").prepend('<div id="mousepanel"></div>');
		return this;
	},
	remove:function() {
		$("#mousepanel").remove();
		return this;
	},
	style:function() {
		$("#mousepanel").css(styles.mousepanel);
		return this;
	},
	color:function(color) {
		$("#mousepanel").css('background-color', color);
		return this;
	},
	position:function(e) {
		$("#mousepanel").css({
			"left":+e.clientX +15 + "px",
			"top":+e.clientY + "px",
		});
		return this;
	},

	context:function(info) {
		$("#mousepanel").text(info);
		return this;
	},
};