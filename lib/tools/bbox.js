var $ = require('jquery');
var Mousetrap = require('mousetrap');

var styles = require('../styles.json');
var mousepanel = require('../mousepanel');

const TWYG_CONSOLE = "#twyg";

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

	this.unit = getMatch(["px","%","em","ex","pt","pc","mm","cm","in"], unit);
	this.property = getMatch(["width", "height", "margin", "padding"], property);
	this.element = element;
	this.constructed = false;

}

BoundingBox.prototype.target = function() {

	var $element = $(this.element);

	return {
		width:$element.cssFloat("width"),
		height:$element.cssFloat("height"),

		margin: {
			top: $element.cssFloat("margin-top"),
			right: $element.cssFloat("margin-right"),
			bottom: $element.cssFloat("margin-bottom"),
			left: $element.cssFloat("margin-left")
		},
		padding: {
			top: $element.cssFloat("padding-top"),
			right: $element.cssFloat("padding-right"),
			bottom: $element.cssFloat("padding-bottom"),
			left: $element.cssFloat("padding-left")
		},

		// Retrieve Element Position
		top:$element.offset().top,
		left:$element.offset().left,
		right:$element.offset().right,
		bottom:$element.offset().bottom,
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
		console.log(target.width, target.height)
		node.css({
			"width": target.width+ "px",
			"height": target.height+ "px",
		});
	} else if(prop === "margin"){
		node.css({
			"margin-left":-target.margin.left+ -target.padding.left + "px",
			"margin-top":-target.margin.top+ -target.padding.top + "px",
			"width": (target.width+target.margin.right+target.margin.left+target.padding.left+target.padding.right) + "px",
			"height":(target.height+target.margin.top+target.margin.b+target.padding.top+target.padding.b) + "px",
		});
	} else if(prop === "padding"){
		node.css({
			"margin-left":-target.padding.left+"px",
			"margin-top":-target.padding.top+"px",
			"width": (target.width+target.padding.left+target.padding.right) + "px",
			"height":(target.height+target.padding.top+target.padding.b) + "px",
		});
	}

	// Set Anchor Positions Clockwise
	// Starting from Top-Left
	// Each Anchor Location: [x, y]
	[[0,0],[0.5,0],[1,0],[1,0.5],[1,1],[0.5,1],[0,1],[0,0.5]].forEach(function(pos,i) {
		anchors[i].css({
			left: (pos[0]*target.width -6) +"px",
			top: (pos[1]*target.height -6) + "px",
		})
	});

	done();
};

BoundingBox.prototype.update = function(done){
	this.set(this.property, done)
}

// Bounding Box Functions

function Twyg_edit(type, side) {

	var $bbox_anchor = {};

	// Position the Anchor

	var bbox_width = +$bbox_back.cssFloat('width'),
		bbox_height = +$bbox_back.cssFloat('height');


/********************Bounding-Box-Behavoir**********************

This is where Bounding Box Behavoir is Made as well as Dynamic Behavoir in General

****************************************************************/


	// Change Height & Width
	if (type == "height" || type == "width"){
		EditElement($bbox_anchor.bm,"height","y",-1);
		EditElement($bbox_anchor.tm,"height","y",+1);
		EditElement($bbox_anchor.lm,"width","x",+1);
		EditElement($bbox_anchor.rm,"width","x",-1);
	}

	// Change Element Margin
	if (type == "margin"){
		EditElement($bbox_anchor.bm,"margin-bottom","y",-1);
		EditElement($bbox_anchor.tm,"margin-top","y",+1);
		EditElement($bbox_anchor.lm,"margin-left","x",+1);
		EditElement($bbox_anchor.rm,"margin-right","x",-1);
	}

	// Change Element Padding
	if (type == "padding") {
		EditElement($bbox_anchor.bm,"padding-bottom","y",-1);
		EditElement($bbox_anchor.tm,"padding-top","y",+1);
		EditElement($bbox_anchor.lm,"padding-left","x",+1);
		EditElement($bbox_anchor.rm,"padding-right","x",-1);
	}
}

// Dynamic Behavoir 
function EditElement(selected_anchor,selected_property,axis,direction) {
	selected_anchor.mousedown(function(e) {

		// Prevent Defaults
		e.preventDefault();

		// Find Side Type
		var selected_side = selected_property.split("-")[1];

		// Find what oreintation is needed from parent: either Height or Width
		if (selected_side == "left" || selected_side == "right") {
			var parentsize = +$element.parent().width();
			}
		if (selected_side == "top" || selected_side == "bottom") {
			var parentsize = +$element.parent().height();
			}

		// Find Property's Initial Unit
		var initialunit = function(selected_property) {
			var n = ""+ $element.cssFloat(selected_property),
				iu = $element.css(selected_property).split(n)[1];
			return iu;
		};

		var $sideunit = initialunit(selected_property);


		// Toggle Mouse Panel
		mousepanel.add();
		mousepanel.style();
		mousepanel.position(e);

		// Set Position
		var last_position = ({});

		$(document).mousemove(function(e) {

			$bbox_back.css('border-color','blue');

			//check to make sure there is data to compare against
			if (last_position.x !== undefined) {

				// Set Mouse Panel Position
				mousepanel.position(e);

				var change = function(selected_property,changeby) {

					// If unit is "px" go with default
					if ($unit == "px"){var i = +$element.cssInt(selected_property) + changeby + $unit;}

					// If unit is "%" do conversion
					if ($unit == "%"){
						var p = (+$element.cssFloat(selected_property)/+parentsize)*100;
						var m = parseInt(p,10);
						var i = m + changeby + $unit;
					}

					// Set Mouse Panel Info
					mousepanel.context(selected_property + " : " + i);
					// Set Mouse Panel Color
					// mousepanel.color(type);
					
					$element.css(selected_property,i);
				};

				//get the change from last position to this position
				var deltaX = last_position.x - e.clientX,
					deltaY = last_position.y - e.clientY;

				if (axis === "x") {
					if (deltaX > 0){
						change(selected_property,direction);
					}
					if (deltaX < 0){
						change(selected_property,-direction);
					}
				}

				if (axis === "y") {
					if (deltaY > 0){
						change(selected_property,direction);
					}
					if (deltaY < 0){
						change(selected_property,-direction);
					}
				}
				
			}

			// Update Element's Properties
			var $elementproperties = {
				e_width:$element.cssFloat("width"),
				e_height:$element.cssFloat("height"),

				e_margin_t:$element.cssFloat("margin-top"),
				e_margin_r:$element.cssFloat("margin-right"),
				e_margin_b:$element.cssFloat("margin-bottom"),
				e_margin_l:$element.cssFloat("margin-left"),

				e_padding_t:$element.cssFloat("padding-top"),
				e_padding_r:$element.cssFloat("padding-right"),
				e_padding_b:$element.cssFloat("padding-bottom"),
				e_padding_l:$element.cssFloat("padding-left"),

				// Retrieve Element Position
				e_top:$element.offset().top,
				e_left:$element.offset().left,
				e_right:$element.offset().right,
				e_bottom:$element.offset().bottom,

			};

			// Refresh Anchor Positions
			PositionBbox($elementproperties);
			PositionAnchors();

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
}

module.exports = {
	read: _read
}