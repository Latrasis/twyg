var $ = require('jquery');
var Mousetrap = require('mousetrap');

/*********** Mouse Panel (Pops next to the mouse) **************/

module.exports = {

	add:function() {
		$("#twyg").prepend('<div id="mousepanel"></div>');
	},
	remove:function() {
		$("#mousepanel").remove();
	},
	style:function() {
		$("#mousepanel").css({
			"width":"auto",
			"height":"15px",
			"margin":"0px",
			"padding":"4px 7px",
			"background-color":"#999",
			"color":"#000",
			"font-size":"12px",
			"font-family":"monospace",
			"border-radius":"2px"
		});
	},
	color:function(type) {
		if (type == "margin") {$("#mousepanel").css('background-color',"yellow");}
		if (type == "padding") {$("#mousepanel").css('background-color',"red");}
	},
	position:function(e) {
		$("#mousepanel").css({
			"position":"absolute",
			"left":+e.clientX +15 + "px",
			"top":+e.clientY + "px",
		});
	},

	context:function(info) {
		$("#mousepanel").text(info);
	},
};