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
			var e_input = input.split("{")[0];
			// Property Input for Twyg Editing
			var p_input = input.split("{")[1].split("/")[0];
			// Property Unit if Included
			var u_input = input.split("/")[1];
			
			// Let's Also Hide the Twyg Console
			$('#twyg_console').toggle();

			// And Pass the Element Input & Property Input to the Twyg Editor
			_bound(e_input,p_input,u_input);

	} else {
		next();
	}
};


function BoundingBox(element, property, unit){

	// Search for Matching Element out of Given List and String
	// Otherwise use First as Default
	function getMatch(match, str){
		return match.filter(function(u) {
			return (str.toLowerCase().indexOf(u) >= 0)
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
	this.constructed = true;

	// Set BoundingBox Styling
	this.node.css({
		"box-sizing":"border-box",
		"position":"absolute",
		"margin":"0px",
		"border":"solid 1px rgba(33,33,33,0.1)"
	});

	// Set Anchor Styling
	["tl","tm","tr","rm","lm","br","bm","bl"].forEach(function(pos) {
			$bbox_back.append('<div id="twyg_bbox_anch_'+pos+'" class="twyg_bbox_anch"></div>');
			$bbox_anchor[pos] = $('#twyg_bbox_anch_'+ pos);
			$bbox_anchor[pos].css(styles.tools.bbox.anchors);
		})

}

BoundingBox.prototype.set = function(prop, done){

	var target = this.target();
	var node = this.node;

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

	done();
};

BoundingBox.prototype.update = function(done){
	this.set(this.property, done)
}

function _bound(e_input,p_input,u_input) {


	// Bounding Box Functions

	function Twyg_edit(type, side) {

		// Scaffold Back of the BBox within the Twyg Div
		$element.prepend('<div id="twyg_bbox"></div>');
		var $bbox_back = $('#twyg_bbox');

		var $bbox_anchor = {};

		// Position the Anchor

		var bbox_width = +$bbox_back.cssFloat('width'),
			bbox_height = +$bbox_back.cssFloat('height');


		function PositionAnchors() {

			// Position Top Left "tl" Anchor
			$bbox_anchor.tl.css({
				"left":"-3"+"px",
				"top":"-3"+"px",
			});

			// Position Top Middle "tm" Anchor
			$bbox_anchor.tm.css({
				"left":bbox_width*0.5 + -"6"+"px",
				"top":"-3"+"px",
			});

			// Position Top Right "tr" Anchor
			$bbox_anchor.tr.css({
				"left":bbox_width + -"6"+"px",
				"top":"-3"+"px",
			});

			// Position Right Middle "rm" Anchor
			$bbox_anchor.rm.css({
				"left":bbox_width + -"6"+"px",
				"top":bbox_height*0.5+ -"6" +"px",
			});

			// Position Left Middle "lm" Anchor
			$bbox_anchor.lm.css({
				"left":"-3"+"px",
				"top":bbox_height*0.5+ -"6" +"px",
			});

			// Position Bottom Right "br" Anchor
			$bbox_anchor.br.css({
				"left":bbox_width + -"6"+"px",
				"top":bbox_height+ -"6" +"px",
			});

			// Position Bottom Middle "bm" Anchor
			$bbox_anchor.bm.css({
				"left":bbox_width*0.5 + -"6"+"px",
				"top":bbox_height+ -"6" +"px",
			});

			// Position Bottom Left "bl" Anchor
			$bbox_anchor.bl.css({
				"left":"-3"+"px",
				"top":bbox_height+ -"6" +"px",
			});	
		}

		PositionAnchors();

		// Margin BBox Static Behavoir
		$("#twyg_bbox div")
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