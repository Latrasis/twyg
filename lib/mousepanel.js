var $ = require('jquery');
var Mousetrap = require('mousetrap');

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
		return this;
	},
	color:function(type) {
		if (type == "margin") {$("#mousepanel").css('background-color',"yellow");}
		if (type == "padding") {$("#mousepanel").css('background-color',"red");}
		return this;
	},
	position:function(e) {
		$("#mousepanel").css({
			"position":"absolute",
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