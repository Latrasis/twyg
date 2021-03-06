var $ = require('jquery');
var Mousetrap = require('mousetrap');

var styles = require('../styles.json');
var mousepanel = require('../mousepanel');

const TWYG_CONSOLE = "#twyg";
const UNITS = ["px","%","em","ex","pt","pc","mm","cm","in"];
const PROPERTIES = ["width", "height", "margin", "padding"];

function _read(input, done, next) {
	// Bounding Box Parse
	if (
		// A Property is Defined and...
		input.indexOf("{") != -1 
		//If there is only 1 property
		&& input.split("{").length <= 2
		//If there no more than 1 unit type
		&& input.split("/").length <= 2 
		//If the property is valid (future versions should have a validator - for now it's just true)
		&& true) {
			// Element Input for Jquery Parsing
			var element = input.split("{")[0];
			// Property Input for Twyg Editing
			var property = input.split("{")[1].split("/")[0];
			// Property Unit if Included
			var unit = input.split("/")[1];
			
			// Let's Also Hide the Twyg Console
			$('#twyg_console').toggle();

			// And Pass the Element Input & Property Input to the Twyg Editor
			var BB = new BoundingBox(element, property, unit);
			BB.construct();
			done();
	} else {
		next();
	}
};


function BoundingBox(element, property, unit){

	// Search for Matching Element out of Given List and String
	// Otherwise use First as Default
	function getMatch(match, str){
		return match.filter(function(u) {
			return (str ? str.toLowerCase().indexOf(u) >= 0 : 0)
		})[0] || match[0];
	}

	this.unit = getMatch(UNITS, unit);
	this.property = getMatch(PROPERTIES, property);
	this.element = element;
	this.constructed = false;

}

BoundingBox.prototype.target = function() {
	var $element = $(this.element);
	var $elementFloat = $element.cssFloat;
	var $elementOffset = $element.offset;

	return {
		width:$elementFloat("width"),
		height:$elementFloat("height"),

		margin: {
			top: $elementFloat("margin-top"),
			right: $elementFloat("margin-right"),
			bottom: $elementFloat("margin-bottom"),
			left: $elementFloat("margin-left")
		},
		padding: {
			top: $elementFloat("padding-top"),
			right: $elementFloat("padding-right"),
			bottom: $elementFloat("padding-bottom"),
			left: $elementFloat("padding-left")
		},

		// Retrieve Element Position
		top:$elementOffset().top,
		left:$elementOffset().left,
		right:$elementOffset().right,
		bottom:$elementOffset().bottom,
	};
};

BoundingBox.prototype.construct = function(){

	var that = this;
	var $element = $(this.element);

	$element.prepend('<div id="twyg_bbox"></div>');
	this.node = $('#twyg_bbox');
	this.anchors = [];
	this.constructed = true;

	// Construct Anchors
	for (var i = 0; i < 8; i++) {
		that.node.append('<div id="twyg_bbox_anch_'+i+'" class="twyg_bbox_anch"></div>');
		that.anchors[i] = $('#twyg_bbox_anch_'+ i);
	};

	// Set BoundingBox Styling
	this.node
		.css(styles.tools.bbox.node)
		.children()
			.css(styles.tools.bbox.anchors)
			.hover(
				function() {
					$(this).css({"background-color":'grey'});
				},
				function() {
					$(this).css({"background-color":'white'});
				}
			)
			.mousedown (
				function() {
					$(this).css({"background-color":'black'});
				}
			)
			.mouseup (
				function() {
					$(this).css({"background-color":'grey'});
				}
			);

	this.set();

}

BoundingBox.prototype.set = function(done){

	done = done || function(){};

	var target = this.target();
	var prop = this.property;
	var node = this.node;
	var anchors = this.anchors;

	if(prop === "height" || prop === "width"){
		node.css({
			"width": target.width+ "px",
			"height": target.height+ "px",
		});
	} else if(prop === "margin"){
		node.css({
			"margin-left":-target.margin.left+ -target.padding.left + "px",
			"margin-top":-target.margin.top+ -target.padding.top + "px",
			"width": (target.width+target.margin.right+target.margin.left+target.padding.left+target.padding.right) + "px",
			"height":(target.height+target.margin.top+target.margin.bottom+target.padding.top+target.padding.bottom) + "px",
		});
	} else if(prop === "padding"){
		node.css({
			"margin-left":-target.padding.left+"px",
			"margin-top":-target.padding.top+"px",
			"width": (target.width+target.padding.left+target.padding.right) + "px",
			"height":(target.height+target.padding.top+target.padding.bottom) + "px",
		});
	}

	// Get BBox Height and Width
	var t_width = +node.cssFloat('width');
	var t_height = +node.cssFloat('height');

	// Set Anchor Positions Clockwise
	// Starting from Top-Left
	// Each Anchor Location: [x, y]
	[[0,0],[0.5,0],[1,0],[1,0.5],[1,1],[0.5,1],[0,1],[0,0.5]].forEach(function(pos,i) {
		anchors[i].css({
			left: (pos[0]*t_width -6) +"px",
			top: (pos[1]*t_height -6) + "px",
		})
	});

	done();
};

BoundingBox.prototype.update = function(done){
	this.set(this.property, done)
}

BoundingBox.prototype.edit = function(unit, side, changeby) {

	var property = this.property + '-' + side;
	var element = $(this.element);
	var change = 0;

	// If unit is "px" go with default
	if (unit == "px"){change = +$element.cssInt(property) + changeby + unit;}

	// If unit is "%" do conversion
	if (unit == "%"){
		// Find what oreintation is needed from parent: either Height or Width
		if (side == "left" || side == "right") {
			var parentsize = +element.parent().width();
		}
		if (side == "top" || side == "bottom") {
			var parentsize = +element.parent().height();
		}

		var p = (+element.cssFloat(property)/+parentsize)*100;
		var m = parseInt(p,10);
		change = m + changeby + unit;
	}

	// Set Mouse Panel Info
	mousepanel.context(property + " : " + change);
	
	element.css(property,change);
};

// Dynamic Behavoir 
BoundingBox.prototype.behavoir = function() {
	var that = this;

	var anchors = this.anchors;
	var property = this.property;

	// Find Property's Initial Unit
	var initialunit = function(property) {
		var n = ""+ $element.cssFloat(property),
			iu = $element.css(property).split(n)[1];
		return iu;
	};

	var unit = initialunit(property);

	anchors.forEach(function(anchor, pos) {

		var axis = (pos == 1 || pos == 3) ? "y" : "x";
		var side;

		switch(pos){
			case 1: side = "top";
			case 3: side = "right";
			case 5: side = "bottom";
			case 7: side = "left";
		};

		anchor.mousedown(function(e) {

			// Prevent Defaults
			e.preventDefault();

			// Toggle Mouse Panel
			mousepanel.add().style().position(e);

			// Set Position
			var last_position = ({});

			$(document).mousemove(function(e) {

				// $bbox_back.css('border-color','blue');

				//check to make sure there is data to compare against
				if (last_position.x !== undefined) {

					// Set Mouse Panel Position
					mousepanel.position(e);

					//get the change from last position to this position
					var deltaX = last_position.x - e.clientX,
						deltaY = last_position.y - e.clientY;

					if (axis === "x") {
						if (deltaX > 0){
							change(property, direction);
						}
						if (deltaX < 0){
							change(property,-direction);
						}
					}

					if (axis === "y") {
						if (deltaY > 0){
							change(property,direction);
						}
						if (deltaY < 0){
							change(property,-direction);
						}
					}
					
				}

				that.update()

				// set position for next time
				last_position = {
					x : e.clientX,
					y : e.clientY
				};

			});

			$(document).mouseup(function(e){
				// Unbind MouseMove
				$(document).unbind('mousemove');
				// Toggle Mouse Panel
				mousepanel.remove();
				// Reset BBox Style
				$bbox_back.css('border-color','#333');
				Anchors_css({"border" :"solid 1px rgba(33,33,33,0.8)"});
			});
		});
	})

}

module.exports = {
	read: _read
}