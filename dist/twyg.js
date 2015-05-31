(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./lib/index.js":[function(require,module,exports){
/*!
 * Twyg.js - Tweak What You Get | CSS Editor
 * v0.0.2
 *
 * Copyright 2014, Jacob Payne and other contributors
 * Released under the MIT license
 *
 * Date: 2014-02-04
 */

var styles = require('./styles.json');
var twygConsole = require('./console.js');

var toolRuler = require('./tools/ruler.js');
var toolBbox = require('./tools/bbox.js')

var Twyg = (function() {

	// ******* Small Dependency Functions with Jquery ******* //

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
	    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'rad)',
	                '-moz-transform' : 'rotate('+ degrees +'rad)',
	                '-ms-transform' : 'rotate('+ degrees +'rad)',
	                'transform' : 'rotate('+ degrees +'rad)',
	    			'transformOrigin':"left top"});
	};

	// ******* Styling ******* //
	function style_anchors() {$("#twyg_bbox").css(styles.tools.bbox.anchors)}

	// Adding Twyg to the Body

	window.onLoad = twygConsole.show();

	// Using Mousetrap.js let's Bind the view of the Twyg Console to the Keystroke Capital "T"
	Mousetrap.bind('P',function () { twygConsole.toggle(); });

	// Actions on What to do on Pressing either "Enter" or "Esc"

	$("body").keypress(function(e) {
		// By Pressing "Esc" the Console is Toggled if Visible
		// If the Console is not visible though any Bounding Boxes are Removed
		if (e.keyCode == 27) {
			if ($('#twyg_console').is(':hidden')) {$("#twyg_bbox").remove();}
			if ($('#twyg_console').is(':visible')) {$("#twyg_console").toggle();}
		}
	});

	$("#twyg_console").keypress(function (e) {
		var Twyg_input = $("#twyg_console").val();
	// By Pressing "Enter" the Field Content is Passed to the Parsing Function
	  if (e.which == 13) {
		$("#twyg_console").submit();
		// If a Bounding Box already Exists we delete it
		if ($("#twyg_bbox").length > 0) { $("#twyg_bbox").remove();}
		twygConsole.read(Twyg_input, toolRuler, toolBbox);
	  }
	});


	/********************Bounding-Box-Creation**********************

	This is where we start Bound-Boxing the Element based on the Given Property

	****************************************************************/


	function Twyg_bound(e_input,p_input,u_input) {

		var $element = $(""+e_input+"");
		var $property = p_input;
		var $unit = u_input;

		// Check if Input is Included (if not valid default to "px")
			if (!($unit == "px" ||
					$unit == "%" ||
					$unit == "em" ||
					$unit == "ex" ||
					$unit == "pt" ||
					$unit == "pc" ||
					$unit == "mm" ||
					$unit == "cm" ||
					$unit == "in")) {$unit = "px";}

		// Retrieve Element Properties

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


		// Here we start picking out what the Property actually is and what Bounding Boxes we show
		// The Responses will return appropriate Bounding Box Functions which allow to edit the element with the mouse

		// Height and Width Properties
		if ($property == "height") {Twyg_edit("height");}
		if ($property == "width") {Twyg_edit("width");}

		// Margin Property
		if ($property == "margin") {Twyg_edit("margin","all");}
		if ($property == "margin-left") {Twyg_edit("margin","left");}
		if ($property == "margin-right") {Twyg_edit("margin","right");}
		if ($property == "margin-bottom") {Twyg_edit("margin","bottom");}
		if ($property == "margin-top") {Twyg_edit("margin","top");}

		// Padding Property
		if ($property == "padding") {Twyg_edit("padding","all");}
		if ($property == "padding-left") {Twyg_edit("padding","left");}
		if ($property == "padding-right") {Twyg_edit("padding","right");}
		if ($property == "padding-bottom") {Twyg_edit("padding","bottom");}
		if ($property == "padding-top") {Twyg_edit("padding","top");}
		
		// Letter/Font Properties
		if ($property == "font-size") {Twyg_edit("font-size");}
		if ($property == "word-spacing") {Twyg_edit("word-spacing");}
		if ($property == "letter-spacing") {Twyg_edit("letter-spacing");}


		// Bounding Box Functions

		function Twyg_edit(type,side) {

			// Scaffold Back of the BBox within the Twyg Div
			$element.prepend('<div id="twyg_bbox"></div>');
			var $bbox_back = $('#twyg_bbox');

			function PositionBbox(elementproperties) {

				// Construct BBox For Height & Width
				if (type == "height" || type == "width") {
					$bbox_back.css({
						"box-sizing":"border-box",
						"position":"absolute",
						"margin":"0px",
						// "margin-left":-elementproperties.e_margin_l+ -elementproperties.e_padding_l + "px",
						// "margin-top":-elementproperties.e_margin_t+ -elementproperties.e_padding_t + "px",
						"width": +elementproperties.e_width  + "px",
						"height":+elementproperties.e_height + "px",
						"border":"solid 1px rgba(33,33,33,0.1)"
					});
				}

				// Construct BBox For Margin
				if (type == "margin") {
					$bbox_back.css({
						"box-sizing":"border-box",
						"position":"absolute",
						"margin":"0px",
						"margin-left":-elementproperties.e_margin_l+ -elementproperties.e_padding_l + "px",
						"margin-top":-elementproperties.e_margin_t+ -elementproperties.e_padding_t + "px",
						"width": (+elementproperties.e_width + +elementproperties.e_margin_r + +elementproperties.e_margin_l + +elementproperties.e_padding_l + +elementproperties.e_padding_r) + "px",
						"height":(+elementproperties.e_height + +elementproperties.e_margin_t + +elementproperties.e_margin_b + +elementproperties.e_padding_t + +elementproperties.e_padding_b) + "px",
						"border":"solid 1px rgba(33,33,33,0.1)"
					});
				}

				// Construct BBox for Padding
				if (type == "padding") {
					$bbox_back.css({
						"box-sizing":"border-box",
						"position":"absolute",
						"margin":"0px",
						"margin-left":-elementproperties.e_padding_l+"px",
						"margin-top":-elementproperties.e_padding_t+"px",
						"width": (+elementproperties.e_width + +elementproperties.e_padding_l + +elementproperties.e_padding_r) + "px",
						"height":(+elementproperties.e_height + +elementproperties.e_padding_t + +elementproperties.e_padding_b) + "px",
						"border":"solid 1px rgba(33,33,33,0.1)"
					});
				}

			}

			PositionBbox($elementproperties);

			// Add Box Anchors
			var Anchors_add = function() {
				// Insert Top Left "tl" Anchor
				$bbox_back.append('<div id="twyg_bbox_anch_tl" class=twyg_bbox_anch"></div>');
				// Insert Top Middle "tm" Anchor
				$bbox_back.append('<div id="twyg_bbox_anch_tm" class=twyg_bbox_anch"></div>');
				// Insert Top Right "tr" Anchor
				$bbox_back.append('<div id="twyg_bbox_anch_tr" class=twyg_bbox_anch"></div>');
				// Insert Right Middle "rm" Anchor
				$bbox_back.append('<div id="twyg_bbox_anch_rm" class=twyg_bbox_anch"></div>');
				// Insert Left Middle "lm" Anchor
				$bbox_back.append('<div id="twyg_bbox_anch_lm" class=twyg_bbox_anch"></div>');
				// Insert Bottom Left "br" Anchor
				$bbox_back.append('<div id="twyg_bbox_anch_br" class=twyg_bbox_anch"></div>');
				// Insert Bottom Middle "bm" Anchor
				$bbox_back.append('<div id="twyg_bbox_anch_bm" class=twyg_bbox_anch"></div>');
				// Insert Bottom Right "bl" Anchor
				$bbox_back.append('<div id="twyg_bbox_anch_bl" class=twyg_bbox_anch"></div>');
			};

			Anchors_add();

			// Make Anchor Reference List

			var $bbox_anchor_tl = $('#twyg_bbox_anch_tl'); // Top Left
			var $bbox_anchor_tm = $('#twyg_bbox_anch_tm'); // Top Middle
			var $bbox_anchor_tr = $('#twyg_bbox_anch_tr'); // Top Right
			var $bbox_anchor_rm = $('#twyg_bbox_anch_rm'); // Right Middle
			var $bbox_anchor_lm = $('#twyg_bbox_anch_lm'); // Left Middle
			var $bbox_anchor_br = $('#twyg_bbox_anch_br'); // Bottom Right
			var $bbox_anchor_bm = $('#twyg_bbox_anch_bm'); // Bottom Middle
			var $bbox_anchor_bl = $('#twyg_bbox_anch_bl'); // Bottom Left

			// Style All Anchors Function
			function Anchors_css(style) {
				// Style Top Left "tl" Anchor
				$bbox_anchor_tl.css(style);
				// Style Top Middle "tm" Anchor
				$bbox_anchor_tm.css(style);
				// Style Top Right "tr" Anchor
				$bbox_anchor_tr.css(style);

				// Style Right Middle "rm" Anchor
				$bbox_anchor_rm.css(style);
				// Style Left Middle "lm" Anchor
				$bbox_anchor_lm.css(style);

				// Style Bottom Right "br" Anchor
				$bbox_anchor_br.css(style);
				// Style Bottom Middle "bm" Anchor
				$bbox_anchor_bm.css(style);
				// Style Bottom Left "bl" Anchor
				$bbox_anchor_bl.css(style);
			}

			// Style the Anchors
			Anchors_css(styles.tools.bbox.anchors);

			// Position the Anchors

			function PositionAnchors() {

				var bbox_width = +$bbox_back.cssFloat('width'),
					bbox_height = +$bbox_back.cssFloat('height');


				// Position Top Left "tl" Anchor
				$bbox_anchor_tl.css({
					"left":"-3"+"px",
					"top":"-3"+"px",
				});
		
				// Position Top Middle "tm" Anchor
				$bbox_anchor_tm.css({
					"left":bbox_width*0.5 + -"6"+"px",
					"top":"-3"+"px",
				});
		
				// Position Top Right "tr" Anchor
				$bbox_anchor_tr.css({
					"left":bbox_width + -"6"+"px",
					"top":"-3"+"px",
				});
		
				// Position Right Middle "rm" Anchor
				$bbox_anchor_rm.css({
					"left":bbox_width + -"6"+"px",
					"top":bbox_height*0.5+ -"6" +"px",
				});
		
				// Position Left Middle "lm" Anchor
				$bbox_anchor_lm.css({
					"left":"-3"+"px",
					"top":bbox_height*0.5+ -"6" +"px",
				});
		
				// Position Bottom Right "br" Anchor
				$bbox_anchor_br.css({
					"left":bbox_width + -"6"+"px",
					"top":bbox_height+ -"6" +"px",
				});
		
				// Position Bottom Middle "bm" Anchor
				$bbox_anchor_bm.css({
					"left":bbox_width*0.5 + -"6"+"px",
					"top":bbox_height+ -"6" +"px",
				});
		
				// Position Bottom Left "bl" Anchor
				$bbox_anchor_bl.css({
					"left":"-3"+"px",
					"top":bbox_height+ -"6" +"px",
				});
			}

			PositionAnchors();

			// Margin BBox Static Behavoir
			$("#twyg_bbox div")
				.hover(
					function() {
						// $bbox_back.css({'border-bottom':'solid 1px #333'});
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
				EditElement($bbox_anchor_bm,"height","y",-1);
				EditElement($bbox_anchor_tm,"height","y",+1);
				EditElement($bbox_anchor_lm,"width","x",+1);
				EditElement($bbox_anchor_rm,"width","x",-1);
			}

			// Change Element Margin
			if (type == "margin"){
				EditElement($bbox_anchor_bm,"margin-bottom","y",-1);
				EditElement($bbox_anchor_tm,"margin-top","y",+1);
				EditElement($bbox_anchor_lm,"margin-left","x",+1);
				EditElement($bbox_anchor_rm,"margin-right","x",-1);
			}

			// Change Element Padding
			if (type == "padding") {
				EditElement($bbox_anchor_bm,"padding-bottom","y",-1);
				EditElement($bbox_anchor_tm,"padding-top","y",+1);
				EditElement($bbox_anchor_lm,"padding-left","x",+1);
				EditElement($bbox_anchor_rm,"padding-right","x",-1);
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
					$mousepanel.add();
					$mousepanel.style();
					$mousepanel.position(e);

					// Set Position
					var last_position = ({});

					$(document).mousemove(function(e) {

						$bbox_back.css('border-color','blue');
						Anchors_css({"border" :"solid 1px rgba(0,0,255,0.8)"});

						//check to make sure there is data to compare against
						if (last_position.x !== undefined) {

							// Set Mouse Panel Position
							$mousepanel.position(e);

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
								$mousepanel.context(selected_property + " : " + i);
								// Set Mouse Panel Color
								// $mousepanel.color(type);
								
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

							// 

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
						$mousepanel.remove();
						// Reset BBox Style
						$bbox_back.css('border-color','#333');
						Anchors_css({"border" :"solid 1px rgba(33,33,33,0.8)"});
					});
				});
			}
		}
	}
	
}) ();



},{"./console.js":"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/console.js","./styles.json":"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/styles.json","./tools/bbox.js":"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/tools/bbox.js","./tools/ruler.js":"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/tools/ruler.js"}],"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/console.js":[function(require,module,exports){
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
},{"./styles":"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/styles.json"}],"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/mousepanel.js":[function(require,module,exports){
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
},{}],"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/styles.json":[function(require,module,exports){
module.exports={
	"console":{
		"width":"40%",
		"height":"auto",
		"background-color":"rgba(200,200,200,0.8)",
		"padding":"20px",
		"color":"#333",
		"font-size":"2em",
		"font-family":"sans-serif",
		"position":"fixed",
		"z-index":"1000",
		"top":"20px",
		"left":"20px",
		"border":"none"
	},
	"tools": {
		"bbox": {
			"anchors": {
				"position":"absolute",
				"width": "6px",
				"height":"6px",
				"background-color":"#fff",
				"border":"solid 1px rgba(33,33,33,0.8)"
			}
		},
		"ruler": {
			"position":"absolute",
			"background-color":"#f00",
			"border":"solid 1px #eee",
			"height":"1px"
		}
	}
}
},{}],"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/tools/bbox.js":[function(require,module,exports){
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
			// return Twyg_bound(e_input,p_input,u_input);

	} else {
		next();
	}
};


module.exports = {
	read: _read
}
},{}],"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/tools/ruler.js":[function(require,module,exports){
var styles = require('../styles.json');
var mousepanel = require('../mousepanel');

// Ruler (v.0.1)

function _read (input, done, next) {
	if (input == "ruler" || input == "Ruler") {
		// Hide Console
		$('#twyg_console').toggle();
		_watch(done);
	} else {
		next();
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
			$(document).unbind('mousemove');
			$("twyg_ruler").remove();
			// Toggle Mouse Panel
			mousepanel.remove();
			done();
		});
	});
}

module.exports = {
	read: _read
}

},{"../mousepanel":"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/mousepanel.js","../styles.json":"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/styles.json"}]},{},["./lib/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvY29uc29sZS5qcyIsImxpYi9tb3VzZXBhbmVsLmpzIiwibGliL3N0eWxlcy5qc29uIiwibGliL3Rvb2xzL2Jib3guanMiLCJsaWIvdG9vbHMvcnVsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogVHd5Zy5qcyAtIFR3ZWFrIFdoYXQgWW91IEdldCB8IENTUyBFZGl0b3JcbiAqIHYwLjAuMlxuICpcbiAqIENvcHlyaWdodCAyMDE0LCBKYWNvYiBQYXluZSBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqXG4gKiBEYXRlOiAyMDE0LTAyLTA0XG4gKi9cblxudmFyIHN0eWxlcyA9IHJlcXVpcmUoJy4vc3R5bGVzLmpzb24nKTtcbnZhciB0d3lnQ29uc29sZSA9IHJlcXVpcmUoJy4vY29uc29sZS5qcycpO1xuXG52YXIgdG9vbFJ1bGVyID0gcmVxdWlyZSgnLi90b29scy9ydWxlci5qcycpO1xudmFyIHRvb2xCYm94ID0gcmVxdWlyZSgnLi90b29scy9iYm94LmpzJylcblxudmFyIFR3eWcgPSAoZnVuY3Rpb24oKSB7XG5cblx0Ly8gKioqKioqKiBTbWFsbCBEZXBlbmRlbmN5IEZ1bmN0aW9ucyB3aXRoIEpxdWVyeSAqKioqKioqIC8vXG5cblx0Ly8gRmluZCBDc3MgRmxvYXQgVmFsdWVcblx0alF1ZXJ5LmZuLmNzc0Zsb2F0ID0gZnVuY3Rpb24gKHByb3ApIHtcblx0ICAgIHJldHVybiBwYXJzZUZsb2F0KHRoaXMuY3NzKHByb3ApKSB8fCAwO1xuXHR9O1xuXG5cdC8vIEZpbmQgQ3NzIEludGVnZXIgVmFsdWVcblx0alF1ZXJ5LmZuLmNzc0ludCA9IGZ1bmN0aW9uIChwcm9wKSB7XG5cdCAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5jc3MocHJvcCksMTApIHx8IDA7XG5cdH07XG5cblx0Ly8gUm90YXRlIENzcyB3aXRoIFRyYW5zZm9ybWVkIE9yaWdpblxuXHRqUXVlcnkuZm4ucm90YXRlID0gZnVuY3Rpb24oZGVncmVlcykge1xuXHQgICAgJCh0aGlzKS5jc3Moeyctd2Via2l0LXRyYW5zZm9ybScgOiAncm90YXRlKCcrIGRlZ3JlZXMgKydyYWQpJyxcblx0ICAgICAgICAgICAgICAgICctbW96LXRyYW5zZm9ybScgOiAncm90YXRlKCcrIGRlZ3JlZXMgKydyYWQpJyxcblx0ICAgICAgICAgICAgICAgICctbXMtdHJhbnNmb3JtJyA6ICdyb3RhdGUoJysgZGVncmVlcyArJ3JhZCknLFxuXHQgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybScgOiAncm90YXRlKCcrIGRlZ3JlZXMgKydyYWQpJyxcblx0ICAgIFx0XHRcdCd0cmFuc2Zvcm1PcmlnaW4nOlwibGVmdCB0b3BcIn0pO1xuXHR9O1xuXG5cdC8vICoqKioqKiogU3R5bGluZyAqKioqKioqIC8vXG5cdGZ1bmN0aW9uIHN0eWxlX2FuY2hvcnMoKSB7JChcIiN0d3lnX2Jib3hcIikuY3NzKHN0eWxlcy50b29scy5iYm94LmFuY2hvcnMpfVxuXG5cdC8vIEFkZGluZyBUd3lnIHRvIHRoZSBCb2R5XG5cblx0d2luZG93Lm9uTG9hZCA9IHR3eWdDb25zb2xlLnNob3coKTtcblxuXHQvLyBVc2luZyBNb3VzZXRyYXAuanMgbGV0J3MgQmluZCB0aGUgdmlldyBvZiB0aGUgVHd5ZyBDb25zb2xlIHRvIHRoZSBLZXlzdHJva2UgQ2FwaXRhbCBcIlRcIlxuXHRNb3VzZXRyYXAuYmluZCgnUCcsZnVuY3Rpb24gKCkgeyB0d3lnQ29uc29sZS50b2dnbGUoKTsgfSk7XG5cblx0Ly8gQWN0aW9ucyBvbiBXaGF0IHRvIGRvIG9uIFByZXNzaW5nIGVpdGhlciBcIkVudGVyXCIgb3IgXCJFc2NcIlxuXG5cdCQoXCJib2R5XCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcblx0XHQvLyBCeSBQcmVzc2luZyBcIkVzY1wiIHRoZSBDb25zb2xlIGlzIFRvZ2dsZWQgaWYgVmlzaWJsZVxuXHRcdC8vIElmIHRoZSBDb25zb2xlIGlzIG5vdCB2aXNpYmxlIHRob3VnaCBhbnkgQm91bmRpbmcgQm94ZXMgYXJlIFJlbW92ZWRcblx0XHRpZiAoZS5rZXlDb2RlID09IDI3KSB7XG5cdFx0XHRpZiAoJCgnI3R3eWdfY29uc29sZScpLmlzKCc6aGlkZGVuJykpIHskKFwiI3R3eWdfYmJveFwiKS5yZW1vdmUoKTt9XG5cdFx0XHRpZiAoJCgnI3R3eWdfY29uc29sZScpLmlzKCc6dmlzaWJsZScpKSB7JChcIiN0d3lnX2NvbnNvbGVcIikudG9nZ2xlKCk7fVxuXHRcdH1cblx0fSk7XG5cblx0JChcIiN0d3lnX2NvbnNvbGVcIikua2V5cHJlc3MoZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgVHd5Z19pbnB1dCA9ICQoXCIjdHd5Z19jb25zb2xlXCIpLnZhbCgpO1xuXHQvLyBCeSBQcmVzc2luZyBcIkVudGVyXCIgdGhlIEZpZWxkIENvbnRlbnQgaXMgUGFzc2VkIHRvIHRoZSBQYXJzaW5nIEZ1bmN0aW9uXG5cdCAgaWYgKGUud2hpY2ggPT0gMTMpIHtcblx0XHQkKFwiI3R3eWdfY29uc29sZVwiKS5zdWJtaXQoKTtcblx0XHQvLyBJZiBhIEJvdW5kaW5nIEJveCBhbHJlYWR5IEV4aXN0cyB3ZSBkZWxldGUgaXRcblx0XHRpZiAoJChcIiN0d3lnX2Jib3hcIikubGVuZ3RoID4gMCkgeyAkKFwiI3R3eWdfYmJveFwiKS5yZW1vdmUoKTt9XG5cdFx0dHd5Z0NvbnNvbGUucmVhZChUd3lnX2lucHV0LCB0b29sUnVsZXIsIHRvb2xCYm94KTtcblx0ICB9XG5cdH0pO1xuXG5cblx0LyoqKioqKioqKioqKioqKioqKioqQm91bmRpbmctQm94LUNyZWF0aW9uKioqKioqKioqKioqKioqKioqKioqKlxuXG5cdFRoaXMgaXMgd2hlcmUgd2Ugc3RhcnQgQm91bmQtQm94aW5nIHRoZSBFbGVtZW50IGJhc2VkIG9uIHRoZSBHaXZlbiBQcm9wZXJ0eVxuXG5cdCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuXHRmdW5jdGlvbiBUd3lnX2JvdW5kKGVfaW5wdXQscF9pbnB1dCx1X2lucHV0KSB7XG5cblx0XHR2YXIgJGVsZW1lbnQgPSAkKFwiXCIrZV9pbnB1dCtcIlwiKTtcblx0XHR2YXIgJHByb3BlcnR5ID0gcF9pbnB1dDtcblx0XHR2YXIgJHVuaXQgPSB1X2lucHV0O1xuXG5cdFx0Ly8gQ2hlY2sgaWYgSW5wdXQgaXMgSW5jbHVkZWQgKGlmIG5vdCB2YWxpZCBkZWZhdWx0IHRvIFwicHhcIilcblx0XHRcdGlmICghKCR1bml0ID09IFwicHhcIiB8fFxuXHRcdFx0XHRcdCR1bml0ID09IFwiJVwiIHx8XG5cdFx0XHRcdFx0JHVuaXQgPT0gXCJlbVwiIHx8XG5cdFx0XHRcdFx0JHVuaXQgPT0gXCJleFwiIHx8XG5cdFx0XHRcdFx0JHVuaXQgPT0gXCJwdFwiIHx8XG5cdFx0XHRcdFx0JHVuaXQgPT0gXCJwY1wiIHx8XG5cdFx0XHRcdFx0JHVuaXQgPT0gXCJtbVwiIHx8XG5cdFx0XHRcdFx0JHVuaXQgPT0gXCJjbVwiIHx8XG5cdFx0XHRcdFx0JHVuaXQgPT0gXCJpblwiKSkgeyR1bml0ID0gXCJweFwiO31cblxuXHRcdC8vIFJldHJpZXZlIEVsZW1lbnQgUHJvcGVydGllc1xuXG5cdFx0dmFyICRlbGVtZW50cHJvcGVydGllcyA9IHtcblx0XHRcdGVfd2lkdGg6JGVsZW1lbnQuY3NzRmxvYXQoXCJ3aWR0aFwiKSxcblx0XHRcdGVfaGVpZ2h0OiRlbGVtZW50LmNzc0Zsb2F0KFwiaGVpZ2h0XCIpLFxuXG5cdFx0XHRlX21hcmdpbl90OiRlbGVtZW50LmNzc0Zsb2F0KFwibWFyZ2luLXRvcFwiKSxcblx0XHRcdGVfbWFyZ2luX3I6JGVsZW1lbnQuY3NzRmxvYXQoXCJtYXJnaW4tcmlnaHRcIiksXG5cdFx0XHRlX21hcmdpbl9iOiRlbGVtZW50LmNzc0Zsb2F0KFwibWFyZ2luLWJvdHRvbVwiKSxcblx0XHRcdGVfbWFyZ2luX2w6JGVsZW1lbnQuY3NzRmxvYXQoXCJtYXJnaW4tbGVmdFwiKSxcblxuXHRcdFx0ZV9wYWRkaW5nX3Q6JGVsZW1lbnQuY3NzRmxvYXQoXCJwYWRkaW5nLXRvcFwiKSxcblx0XHRcdGVfcGFkZGluZ19yOiRlbGVtZW50LmNzc0Zsb2F0KFwicGFkZGluZy1yaWdodFwiKSxcblx0XHRcdGVfcGFkZGluZ19iOiRlbGVtZW50LmNzc0Zsb2F0KFwicGFkZGluZy1ib3R0b21cIiksXG5cdFx0XHRlX3BhZGRpbmdfbDokZWxlbWVudC5jc3NGbG9hdChcInBhZGRpbmctbGVmdFwiKSxcblxuXHRcdFx0Ly8gUmV0cmlldmUgRWxlbWVudCBQb3NpdGlvblxuXHRcdFx0ZV90b3A6JGVsZW1lbnQub2Zmc2V0KCkudG9wLFxuXHRcdFx0ZV9sZWZ0OiRlbGVtZW50Lm9mZnNldCgpLmxlZnQsXG5cdFx0XHRlX3JpZ2h0OiRlbGVtZW50Lm9mZnNldCgpLnJpZ2h0LFxuXHRcdFx0ZV9ib3R0b206JGVsZW1lbnQub2Zmc2V0KCkuYm90dG9tLFxuXHRcdH07XG5cblxuXHRcdC8vIEhlcmUgd2Ugc3RhcnQgcGlja2luZyBvdXQgd2hhdCB0aGUgUHJvcGVydHkgYWN0dWFsbHkgaXMgYW5kIHdoYXQgQm91bmRpbmcgQm94ZXMgd2Ugc2hvd1xuXHRcdC8vIFRoZSBSZXNwb25zZXMgd2lsbCByZXR1cm4gYXBwcm9wcmlhdGUgQm91bmRpbmcgQm94IEZ1bmN0aW9ucyB3aGljaCBhbGxvdyB0byBlZGl0IHRoZSBlbGVtZW50IHdpdGggdGhlIG1vdXNlXG5cblx0XHQvLyBIZWlnaHQgYW5kIFdpZHRoIFByb3BlcnRpZXNcblx0XHRpZiAoJHByb3BlcnR5ID09IFwiaGVpZ2h0XCIpIHtUd3lnX2VkaXQoXCJoZWlnaHRcIik7fVxuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJ3aWR0aFwiKSB7VHd5Z19lZGl0KFwid2lkdGhcIik7fVxuXG5cdFx0Ly8gTWFyZ2luIFByb3BlcnR5XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcIm1hcmdpblwiKSB7VHd5Z19lZGl0KFwibWFyZ2luXCIsXCJhbGxcIik7fVxuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJtYXJnaW4tbGVmdFwiKSB7VHd5Z19lZGl0KFwibWFyZ2luXCIsXCJsZWZ0XCIpO31cblx0XHRpZiAoJHByb3BlcnR5ID09IFwibWFyZ2luLXJpZ2h0XCIpIHtUd3lnX2VkaXQoXCJtYXJnaW5cIixcInJpZ2h0XCIpO31cblx0XHRpZiAoJHByb3BlcnR5ID09IFwibWFyZ2luLWJvdHRvbVwiKSB7VHd5Z19lZGl0KFwibWFyZ2luXCIsXCJib3R0b21cIik7fVxuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJtYXJnaW4tdG9wXCIpIHtUd3lnX2VkaXQoXCJtYXJnaW5cIixcInRvcFwiKTt9XG5cblx0XHQvLyBQYWRkaW5nIFByb3BlcnR5XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcInBhZGRpbmdcIikge1R3eWdfZWRpdChcInBhZGRpbmdcIixcImFsbFwiKTt9XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcInBhZGRpbmctbGVmdFwiKSB7VHd5Z19lZGl0KFwicGFkZGluZ1wiLFwibGVmdFwiKTt9XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcInBhZGRpbmctcmlnaHRcIikge1R3eWdfZWRpdChcInBhZGRpbmdcIixcInJpZ2h0XCIpO31cblx0XHRpZiAoJHByb3BlcnR5ID09IFwicGFkZGluZy1ib3R0b21cIikge1R3eWdfZWRpdChcInBhZGRpbmdcIixcImJvdHRvbVwiKTt9XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcInBhZGRpbmctdG9wXCIpIHtUd3lnX2VkaXQoXCJwYWRkaW5nXCIsXCJ0b3BcIik7fVxuXHRcdFxuXHRcdC8vIExldHRlci9Gb250IFByb3BlcnRpZXNcblx0XHRpZiAoJHByb3BlcnR5ID09IFwiZm9udC1zaXplXCIpIHtUd3lnX2VkaXQoXCJmb250LXNpemVcIik7fVxuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJ3b3JkLXNwYWNpbmdcIikge1R3eWdfZWRpdChcIndvcmQtc3BhY2luZ1wiKTt9XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcImxldHRlci1zcGFjaW5nXCIpIHtUd3lnX2VkaXQoXCJsZXR0ZXItc3BhY2luZ1wiKTt9XG5cblxuXHRcdC8vIEJvdW5kaW5nIEJveCBGdW5jdGlvbnNcblxuXHRcdGZ1bmN0aW9uIFR3eWdfZWRpdCh0eXBlLHNpZGUpIHtcblxuXHRcdFx0Ly8gU2NhZmZvbGQgQmFjayBvZiB0aGUgQkJveCB3aXRoaW4gdGhlIFR3eWcgRGl2XG5cdFx0XHQkZWxlbWVudC5wcmVwZW5kKCc8ZGl2IGlkPVwidHd5Z19iYm94XCI+PC9kaXY+Jyk7XG5cdFx0XHR2YXIgJGJib3hfYmFjayA9ICQoJyN0d3lnX2Jib3gnKTtcblxuXHRcdFx0ZnVuY3Rpb24gUG9zaXRpb25CYm94KGVsZW1lbnRwcm9wZXJ0aWVzKSB7XG5cblx0XHRcdFx0Ly8gQ29uc3RydWN0IEJCb3ggRm9yIEhlaWdodCAmIFdpZHRoXG5cdFx0XHRcdGlmICh0eXBlID09IFwiaGVpZ2h0XCIgfHwgdHlwZSA9PSBcIndpZHRoXCIpIHtcblx0XHRcdFx0XHQkYmJveF9iYWNrLmNzcyh7XG5cdFx0XHRcdFx0XHRcImJveC1zaXppbmdcIjpcImJvcmRlci1ib3hcIixcblx0XHRcdFx0XHRcdFwicG9zaXRpb25cIjpcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0XHRcIm1hcmdpblwiOlwiMHB4XCIsXG5cdFx0XHRcdFx0XHQvLyBcIm1hcmdpbi1sZWZ0XCI6LWVsZW1lbnRwcm9wZXJ0aWVzLmVfbWFyZ2luX2wrIC1lbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfbCArIFwicHhcIixcblx0XHRcdFx0XHRcdC8vIFwibWFyZ2luLXRvcFwiOi1lbGVtZW50cHJvcGVydGllcy5lX21hcmdpbl90KyAtZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX3QgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcIndpZHRoXCI6ICtlbGVtZW50cHJvcGVydGllcy5lX3dpZHRoICArIFwicHhcIixcblx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6K2VsZW1lbnRwcm9wZXJ0aWVzLmVfaGVpZ2h0ICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXJcIjpcInNvbGlkIDFweCByZ2JhKDMzLDMzLDMzLDAuMSlcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ29uc3RydWN0IEJCb3ggRm9yIE1hcmdpblxuXHRcdFx0XHRpZiAodHlwZSA9PSBcIm1hcmdpblwiKSB7XG5cdFx0XHRcdFx0JGJib3hfYmFjay5jc3Moe1xuXHRcdFx0XHRcdFx0XCJib3gtc2l6aW5nXCI6XCJib3JkZXItYm94XCIsXG5cdFx0XHRcdFx0XHRcInBvc2l0aW9uXCI6XCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRcdFx0XCJtYXJnaW5cIjpcIjBweFwiLFxuXHRcdFx0XHRcdFx0XCJtYXJnaW4tbGVmdFwiOi1lbGVtZW50cHJvcGVydGllcy5lX21hcmdpbl9sKyAtZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX2wgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcIm1hcmdpbi10b3BcIjotZWxlbWVudHByb3BlcnRpZXMuZV9tYXJnaW5fdCsgLWVsZW1lbnRwcm9wZXJ0aWVzLmVfcGFkZGluZ190ICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0XCJ3aWR0aFwiOiAoK2VsZW1lbnRwcm9wZXJ0aWVzLmVfd2lkdGggKyArZWxlbWVudHByb3BlcnRpZXMuZV9tYXJnaW5fciArICtlbGVtZW50cHJvcGVydGllcy5lX21hcmdpbl9sICsgK2VsZW1lbnRwcm9wZXJ0aWVzLmVfcGFkZGluZ19sICsgK2VsZW1lbnRwcm9wZXJ0aWVzLmVfcGFkZGluZ19yKSArIFwicHhcIixcblx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6KCtlbGVtZW50cHJvcGVydGllcy5lX2hlaWdodCArICtlbGVtZW50cHJvcGVydGllcy5lX21hcmdpbl90ICsgK2VsZW1lbnRwcm9wZXJ0aWVzLmVfbWFyZ2luX2IgKyArZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX3QgKyArZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX2IpICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXJcIjpcInNvbGlkIDFweCByZ2JhKDMzLDMzLDMzLDAuMSlcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ29uc3RydWN0IEJCb3ggZm9yIFBhZGRpbmdcblx0XHRcdFx0aWYgKHR5cGUgPT0gXCJwYWRkaW5nXCIpIHtcblx0XHRcdFx0XHQkYmJveF9iYWNrLmNzcyh7XG5cdFx0XHRcdFx0XHRcImJveC1zaXppbmdcIjpcImJvcmRlci1ib3hcIixcblx0XHRcdFx0XHRcdFwicG9zaXRpb25cIjpcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0XHRcIm1hcmdpblwiOlwiMHB4XCIsXG5cdFx0XHRcdFx0XHRcIm1hcmdpbi1sZWZ0XCI6LWVsZW1lbnRwcm9wZXJ0aWVzLmVfcGFkZGluZ19sK1wicHhcIixcblx0XHRcdFx0XHRcdFwibWFyZ2luLXRvcFwiOi1lbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfdCtcInB4XCIsXG5cdFx0XHRcdFx0XHRcIndpZHRoXCI6ICgrZWxlbWVudHByb3BlcnRpZXMuZV93aWR0aCArICtlbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfbCArICtlbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfcikgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcImhlaWdodFwiOigrZWxlbWVudHByb3BlcnRpZXMuZV9oZWlnaHQgKyArZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX3QgKyArZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX2IpICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0XCJib3JkZXJcIjpcInNvbGlkIDFweCByZ2JhKDMzLDMzLDMzLDAuMSlcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0UG9zaXRpb25CYm94KCRlbGVtZW50cHJvcGVydGllcyk7XG5cblx0XHRcdC8vIEFkZCBCb3ggQW5jaG9yc1xuXHRcdFx0dmFyIEFuY2hvcnNfYWRkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIEluc2VydCBUb3AgTGVmdCBcInRsXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2JhY2suYXBwZW5kKCc8ZGl2IGlkPVwidHd5Z19iYm94X2FuY2hfdGxcIiBjbGFzcz10d3lnX2Jib3hfYW5jaFwiPjwvZGl2PicpO1xuXHRcdFx0XHQvLyBJbnNlcnQgVG9wIE1pZGRsZSBcInRtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2JhY2suYXBwZW5kKCc8ZGl2IGlkPVwidHd5Z19iYm94X2FuY2hfdG1cIiBjbGFzcz10d3lnX2Jib3hfYW5jaFwiPjwvZGl2PicpO1xuXHRcdFx0XHQvLyBJbnNlcnQgVG9wIFJpZ2h0IFwidHJcIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYmFjay5hcHBlbmQoJzxkaXYgaWQ9XCJ0d3lnX2Jib3hfYW5jaF90clwiIGNsYXNzPXR3eWdfYmJveF9hbmNoXCI+PC9kaXY+Jyk7XG5cdFx0XHRcdC8vIEluc2VydCBSaWdodCBNaWRkbGUgXCJybVwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9iYWNrLmFwcGVuZCgnPGRpdiBpZD1cInR3eWdfYmJveF9hbmNoX3JtXCIgY2xhc3M9dHd5Z19iYm94X2FuY2hcIj48L2Rpdj4nKTtcblx0XHRcdFx0Ly8gSW5zZXJ0IExlZnQgTWlkZGxlIFwibG1cIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYmFjay5hcHBlbmQoJzxkaXYgaWQ9XCJ0d3lnX2Jib3hfYW5jaF9sbVwiIGNsYXNzPXR3eWdfYmJveF9hbmNoXCI+PC9kaXY+Jyk7XG5cdFx0XHRcdC8vIEluc2VydCBCb3R0b20gTGVmdCBcImJyXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2JhY2suYXBwZW5kKCc8ZGl2IGlkPVwidHd5Z19iYm94X2FuY2hfYnJcIiBjbGFzcz10d3lnX2Jib3hfYW5jaFwiPjwvZGl2PicpO1xuXHRcdFx0XHQvLyBJbnNlcnQgQm90dG9tIE1pZGRsZSBcImJtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2JhY2suYXBwZW5kKCc8ZGl2IGlkPVwidHd5Z19iYm94X2FuY2hfYm1cIiBjbGFzcz10d3lnX2Jib3hfYW5jaFwiPjwvZGl2PicpO1xuXHRcdFx0XHQvLyBJbnNlcnQgQm90dG9tIFJpZ2h0IFwiYmxcIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYmFjay5hcHBlbmQoJzxkaXYgaWQ9XCJ0d3lnX2Jib3hfYW5jaF9ibFwiIGNsYXNzPXR3eWdfYmJveF9hbmNoXCI+PC9kaXY+Jyk7XG5cdFx0XHR9O1xuXG5cdFx0XHRBbmNob3JzX2FkZCgpO1xuXG5cdFx0XHQvLyBNYWtlIEFuY2hvciBSZWZlcmVuY2UgTGlzdFxuXG5cdFx0XHR2YXIgJGJib3hfYW5jaG9yX3RsID0gJCgnI3R3eWdfYmJveF9hbmNoX3RsJyk7IC8vIFRvcCBMZWZ0XG5cdFx0XHR2YXIgJGJib3hfYW5jaG9yX3RtID0gJCgnI3R3eWdfYmJveF9hbmNoX3RtJyk7IC8vIFRvcCBNaWRkbGVcblx0XHRcdHZhciAkYmJveF9hbmNob3JfdHIgPSAkKCcjdHd5Z19iYm94X2FuY2hfdHInKTsgLy8gVG9wIFJpZ2h0XG5cdFx0XHR2YXIgJGJib3hfYW5jaG9yX3JtID0gJCgnI3R3eWdfYmJveF9hbmNoX3JtJyk7IC8vIFJpZ2h0IE1pZGRsZVxuXHRcdFx0dmFyICRiYm94X2FuY2hvcl9sbSA9ICQoJyN0d3lnX2Jib3hfYW5jaF9sbScpOyAvLyBMZWZ0IE1pZGRsZVxuXHRcdFx0dmFyICRiYm94X2FuY2hvcl9iciA9ICQoJyN0d3lnX2Jib3hfYW5jaF9icicpOyAvLyBCb3R0b20gUmlnaHRcblx0XHRcdHZhciAkYmJveF9hbmNob3JfYm0gPSAkKCcjdHd5Z19iYm94X2FuY2hfYm0nKTsgLy8gQm90dG9tIE1pZGRsZVxuXHRcdFx0dmFyICRiYm94X2FuY2hvcl9ibCA9ICQoJyN0d3lnX2Jib3hfYW5jaF9ibCcpOyAvLyBCb3R0b20gTGVmdFxuXG5cdFx0XHQvLyBTdHlsZSBBbGwgQW5jaG9ycyBGdW5jdGlvblxuXHRcdFx0ZnVuY3Rpb24gQW5jaG9yc19jc3Moc3R5bGUpIHtcblx0XHRcdFx0Ly8gU3R5bGUgVG9wIExlZnQgXCJ0bFwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfdGwuY3NzKHN0eWxlKTtcblx0XHRcdFx0Ly8gU3R5bGUgVG9wIE1pZGRsZSBcInRtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl90bS5jc3Moc3R5bGUpO1xuXHRcdFx0XHQvLyBTdHlsZSBUb3AgUmlnaHQgXCJ0clwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfdHIuY3NzKHN0eWxlKTtcblxuXHRcdFx0XHQvLyBTdHlsZSBSaWdodCBNaWRkbGUgXCJybVwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3Jfcm0uY3NzKHN0eWxlKTtcblx0XHRcdFx0Ly8gU3R5bGUgTGVmdCBNaWRkbGUgXCJsbVwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfbG0uY3NzKHN0eWxlKTtcblxuXHRcdFx0XHQvLyBTdHlsZSBCb3R0b20gUmlnaHQgXCJiclwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfYnIuY3NzKHN0eWxlKTtcblx0XHRcdFx0Ly8gU3R5bGUgQm90dG9tIE1pZGRsZSBcImJtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl9ibS5jc3Moc3R5bGUpO1xuXHRcdFx0XHQvLyBTdHlsZSBCb3R0b20gTGVmdCBcImJsXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl9ibC5jc3Moc3R5bGUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdHlsZSB0aGUgQW5jaG9yc1xuXHRcdFx0QW5jaG9yc19jc3Moc3R5bGVzLnRvb2xzLmJib3guYW5jaG9ycyk7XG5cblx0XHRcdC8vIFBvc2l0aW9uIHRoZSBBbmNob3JzXG5cblx0XHRcdGZ1bmN0aW9uIFBvc2l0aW9uQW5jaG9ycygpIHtcblxuXHRcdFx0XHR2YXIgYmJveF93aWR0aCA9ICskYmJveF9iYWNrLmNzc0Zsb2F0KCd3aWR0aCcpLFxuXHRcdFx0XHRcdGJib3hfaGVpZ2h0ID0gKyRiYm94X2JhY2suY3NzRmxvYXQoJ2hlaWdodCcpO1xuXG5cblx0XHRcdFx0Ly8gUG9zaXRpb24gVG9wIExlZnQgXCJ0bFwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfdGwuY3NzKHtcblx0XHRcdFx0XHRcImxlZnRcIjpcIi0zXCIrXCJweFwiLFxuXHRcdFx0XHRcdFwidG9wXCI6XCItM1wiK1wicHhcIixcblx0XHRcdFx0fSk7XG5cdFx0XG5cdFx0XHRcdC8vIFBvc2l0aW9uIFRvcCBNaWRkbGUgXCJ0bVwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfdG0uY3NzKHtcblx0XHRcdFx0XHRcImxlZnRcIjpiYm94X3dpZHRoKjAuNSArIC1cIjZcIitcInB4XCIsXG5cdFx0XHRcdFx0XCJ0b3BcIjpcIi0zXCIrXCJweFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcblx0XHRcdFx0Ly8gUG9zaXRpb24gVG9wIFJpZ2h0IFwidHJcIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYW5jaG9yX3RyLmNzcyh7XG5cdFx0XHRcdFx0XCJsZWZ0XCI6YmJveF93aWR0aCArIC1cIjZcIitcInB4XCIsXG5cdFx0XHRcdFx0XCJ0b3BcIjpcIi0zXCIrXCJweFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcblx0XHRcdFx0Ly8gUG9zaXRpb24gUmlnaHQgTWlkZGxlIFwicm1cIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYW5jaG9yX3JtLmNzcyh7XG5cdFx0XHRcdFx0XCJsZWZ0XCI6YmJveF93aWR0aCArIC1cIjZcIitcInB4XCIsXG5cdFx0XHRcdFx0XCJ0b3BcIjpiYm94X2hlaWdodCowLjUrIC1cIjZcIiArXCJweFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcblx0XHRcdFx0Ly8gUG9zaXRpb24gTGVmdCBNaWRkbGUgXCJsbVwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfbG0uY3NzKHtcblx0XHRcdFx0XHRcImxlZnRcIjpcIi0zXCIrXCJweFwiLFxuXHRcdFx0XHRcdFwidG9wXCI6YmJveF9oZWlnaHQqMC41KyAtXCI2XCIgK1wicHhcIixcblx0XHRcdFx0fSk7XG5cdFx0XG5cdFx0XHRcdC8vIFBvc2l0aW9uIEJvdHRvbSBSaWdodCBcImJyXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl9ici5jc3Moe1xuXHRcdFx0XHRcdFwibGVmdFwiOmJib3hfd2lkdGggKyAtXCI2XCIrXCJweFwiLFxuXHRcdFx0XHRcdFwidG9wXCI6YmJveF9oZWlnaHQrIC1cIjZcIiArXCJweFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcblx0XHRcdFx0Ly8gUG9zaXRpb24gQm90dG9tIE1pZGRsZSBcImJtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl9ibS5jc3Moe1xuXHRcdFx0XHRcdFwibGVmdFwiOmJib3hfd2lkdGgqMC41ICsgLVwiNlwiK1wicHhcIixcblx0XHRcdFx0XHRcInRvcFwiOmJib3hfaGVpZ2h0KyAtXCI2XCIgK1wicHhcIixcblx0XHRcdFx0fSk7XG5cdFx0XG5cdFx0XHRcdC8vIFBvc2l0aW9uIEJvdHRvbSBMZWZ0IFwiYmxcIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYW5jaG9yX2JsLmNzcyh7XG5cdFx0XHRcdFx0XCJsZWZ0XCI6XCItM1wiK1wicHhcIixcblx0XHRcdFx0XHRcInRvcFwiOmJib3hfaGVpZ2h0KyAtXCI2XCIgK1wicHhcIixcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdFBvc2l0aW9uQW5jaG9ycygpO1xuXG5cdFx0XHQvLyBNYXJnaW4gQkJveCBTdGF0aWMgQmVoYXZvaXJcblx0XHRcdCQoXCIjdHd5Z19iYm94IGRpdlwiKVxuXHRcdFx0XHQuaG92ZXIoXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvLyAkYmJveF9iYWNrLmNzcyh7J2JvcmRlci1ib3R0b20nOidzb2xpZCAxcHggIzMzMyd9KTtcblx0XHRcdFx0XHRcdCQodGhpcykuY3NzKHtcImJhY2tncm91bmQtY29sb3JcIjonZ3JleSd9KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5jc3Moe1wiYmFja2dyb3VuZC1jb2xvclwiOid3aGl0ZSd9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdFx0Lm1vdXNlZG93biAoXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmNzcyh7XCJiYWNrZ3JvdW5kLWNvbG9yXCI6J2JsYWNrJ30pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0XHQubW91c2V1cCAoXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmNzcyh7XCJiYWNrZ3JvdW5kLWNvbG9yXCI6J2dyZXknfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdC8qKioqKioqKioqKioqKioqKioqKkJvdW5kaW5nLUJveC1CZWhhdm9pcioqKioqKioqKioqKioqKioqKioqKipcblxuXHRUaGlzIGlzIHdoZXJlIEJvdW5kaW5nIEJveCBCZWhhdm9pciBpcyBNYWRlIGFzIHdlbGwgYXMgRHluYW1pYyBCZWhhdm9pciBpbiBHZW5lcmFsXG5cblx0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdFx0XHQvLyBDaGFuZ2UgSGVpZ2h0ICYgV2lkdGhcblx0XHRcdGlmICh0eXBlID09IFwiaGVpZ2h0XCIgfHwgdHlwZSA9PSBcIndpZHRoXCIpe1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3JfYm0sXCJoZWlnaHRcIixcInlcIiwtMSk7XG5cdFx0XHRcdEVkaXRFbGVtZW50KCRiYm94X2FuY2hvcl90bSxcImhlaWdodFwiLFwieVwiLCsxKTtcblx0XHRcdFx0RWRpdEVsZW1lbnQoJGJib3hfYW5jaG9yX2xtLFwid2lkdGhcIixcInhcIiwrMSk7XG5cdFx0XHRcdEVkaXRFbGVtZW50KCRiYm94X2FuY2hvcl9ybSxcIndpZHRoXCIsXCJ4XCIsLTEpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDaGFuZ2UgRWxlbWVudCBNYXJnaW5cblx0XHRcdGlmICh0eXBlID09IFwibWFyZ2luXCIpe1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3JfYm0sXCJtYXJnaW4tYm90dG9tXCIsXCJ5XCIsLTEpO1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3JfdG0sXCJtYXJnaW4tdG9wXCIsXCJ5XCIsKzEpO1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3JfbG0sXCJtYXJnaW4tbGVmdFwiLFwieFwiLCsxKTtcblx0XHRcdFx0RWRpdEVsZW1lbnQoJGJib3hfYW5jaG9yX3JtLFwibWFyZ2luLXJpZ2h0XCIsXCJ4XCIsLTEpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDaGFuZ2UgRWxlbWVudCBQYWRkaW5nXG5cdFx0XHRpZiAodHlwZSA9PSBcInBhZGRpbmdcIikge1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3JfYm0sXCJwYWRkaW5nLWJvdHRvbVwiLFwieVwiLC0xKTtcblx0XHRcdFx0RWRpdEVsZW1lbnQoJGJib3hfYW5jaG9yX3RtLFwicGFkZGluZy10b3BcIixcInlcIiwrMSk7XG5cdFx0XHRcdEVkaXRFbGVtZW50KCRiYm94X2FuY2hvcl9sbSxcInBhZGRpbmctbGVmdFwiLFwieFwiLCsxKTtcblx0XHRcdFx0RWRpdEVsZW1lbnQoJGJib3hfYW5jaG9yX3JtLFwicGFkZGluZy1yaWdodFwiLFwieFwiLC0xKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRHluYW1pYyBCZWhhdm9pciBcblx0XHRcdGZ1bmN0aW9uIEVkaXRFbGVtZW50KHNlbGVjdGVkX2FuY2hvcixzZWxlY3RlZF9wcm9wZXJ0eSxheGlzLGRpcmVjdGlvbikge1xuXHRcdFx0XHRzZWxlY3RlZF9hbmNob3IubW91c2Vkb3duKGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHQvLyBQcmV2ZW50IERlZmF1bHRzXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Ly8gRmluZCBTaWRlIFR5cGVcblx0XHRcdFx0XHR2YXIgc2VsZWN0ZWRfc2lkZSA9IHNlbGVjdGVkX3Byb3BlcnR5LnNwbGl0KFwiLVwiKVsxXTtcblxuXHRcdFx0XHRcdC8vIEZpbmQgd2hhdCBvcmVpbnRhdGlvbiBpcyBuZWVkZWQgZnJvbSBwYXJlbnQ6IGVpdGhlciBIZWlnaHQgb3IgV2lkdGhcblx0XHRcdFx0XHRpZiAoc2VsZWN0ZWRfc2lkZSA9PSBcImxlZnRcIiB8fCBzZWxlY3RlZF9zaWRlID09IFwicmlnaHRcIikge1xuXHRcdFx0XHRcdFx0dmFyIHBhcmVudHNpemUgPSArJGVsZW1lbnQucGFyZW50KCkud2lkdGgoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoc2VsZWN0ZWRfc2lkZSA9PSBcInRvcFwiIHx8IHNlbGVjdGVkX3NpZGUgPT0gXCJib3R0b21cIikge1xuXHRcdFx0XHRcdFx0dmFyIHBhcmVudHNpemUgPSArJGVsZW1lbnQucGFyZW50KCkuaGVpZ2h0KCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGaW5kIFByb3BlcnR5J3MgSW5pdGlhbCBVbml0XG5cdFx0XHRcdFx0dmFyIGluaXRpYWx1bml0ID0gZnVuY3Rpb24oc2VsZWN0ZWRfcHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdHZhciBuID0gXCJcIisgJGVsZW1lbnQuY3NzRmxvYXQoc2VsZWN0ZWRfcHJvcGVydHkpLFxuXHRcdFx0XHRcdFx0XHRpdSA9ICRlbGVtZW50LmNzcyhzZWxlY3RlZF9wcm9wZXJ0eSkuc3BsaXQobilbMV07XG5cdFx0XHRcdFx0XHRyZXR1cm4gaXU7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHZhciAkc2lkZXVuaXQgPSBpbml0aWFsdW5pdChzZWxlY3RlZF9wcm9wZXJ0eSk7XG5cblxuXHRcdFx0XHRcdC8vIFRvZ2dsZSBNb3VzZSBQYW5lbFxuXHRcdFx0XHRcdCRtb3VzZXBhbmVsLmFkZCgpO1xuXHRcdFx0XHRcdCRtb3VzZXBhbmVsLnN0eWxlKCk7XG5cdFx0XHRcdFx0JG1vdXNlcGFuZWwucG9zaXRpb24oZSk7XG5cblx0XHRcdFx0XHQvLyBTZXQgUG9zaXRpb25cblx0XHRcdFx0XHR2YXIgbGFzdF9wb3NpdGlvbiA9ICh7fSk7XG5cblx0XHRcdFx0XHQkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuXG5cdFx0XHRcdFx0XHQkYmJveF9iYWNrLmNzcygnYm9yZGVyLWNvbG9yJywnYmx1ZScpO1xuXHRcdFx0XHRcdFx0QW5jaG9yc19jc3Moe1wiYm9yZGVyXCIgOlwic29saWQgMXB4IHJnYmEoMCwwLDI1NSwwLjgpXCJ9KTtcblxuXHRcdFx0XHRcdFx0Ly9jaGVjayB0byBtYWtlIHN1cmUgdGhlcmUgaXMgZGF0YSB0byBjb21wYXJlIGFnYWluc3Rcblx0XHRcdFx0XHRcdGlmIChsYXN0X3Bvc2l0aW9uLnggIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFNldCBNb3VzZSBQYW5lbCBQb3NpdGlvblxuXHRcdFx0XHRcdFx0XHQkbW91c2VwYW5lbC5wb3NpdGlvbihlKTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgY2hhbmdlID0gZnVuY3Rpb24oc2VsZWN0ZWRfcHJvcGVydHksY2hhbmdlYnkpIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIElmIHVuaXQgaXMgXCJweFwiIGdvIHdpdGggZGVmYXVsdFxuXHRcdFx0XHRcdFx0XHRcdGlmICgkdW5pdCA9PSBcInB4XCIpe3ZhciBpID0gKyRlbGVtZW50LmNzc0ludChzZWxlY3RlZF9wcm9wZXJ0eSkgKyBjaGFuZ2VieSArICR1bml0O31cblxuXHRcdFx0XHRcdFx0XHRcdC8vIElmIHVuaXQgaXMgXCIlXCIgZG8gY29udmVyc2lvblxuXHRcdFx0XHRcdFx0XHRcdGlmICgkdW5pdCA9PSBcIiVcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgcCA9ICgrJGVsZW1lbnQuY3NzRmxvYXQoc2VsZWN0ZWRfcHJvcGVydHkpLytwYXJlbnRzaXplKSoxMDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbSA9IHBhcnNlSW50KHAsMTApO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGkgPSBtICsgY2hhbmdlYnkgKyAkdW5pdDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBTZXQgTW91c2UgUGFuZWwgSW5mb1xuXHRcdFx0XHRcdFx0XHRcdCRtb3VzZXBhbmVsLmNvbnRleHQoc2VsZWN0ZWRfcHJvcGVydHkgKyBcIiA6IFwiICsgaSk7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gU2V0IE1vdXNlIFBhbmVsIENvbG9yXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJG1vdXNlcGFuZWwuY29sb3IodHlwZSk7XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0JGVsZW1lbnQuY3NzKHNlbGVjdGVkX3Byb3BlcnR5LGkpO1xuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRcdC8vZ2V0IHRoZSBjaGFuZ2UgZnJvbSBsYXN0IHBvc2l0aW9uIHRvIHRoaXMgcG9zaXRpb25cblx0XHRcdFx0XHRcdFx0dmFyIGRlbHRhWCA9IGxhc3RfcG9zaXRpb24ueCAtIGUuY2xpZW50WCxcblx0XHRcdFx0XHRcdFx0XHRkZWx0YVkgPSBsYXN0X3Bvc2l0aW9uLnkgLSBlLmNsaWVudFk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGF4aXMgPT09IFwieFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRlbHRhWCA+IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2hhbmdlKHNlbGVjdGVkX3Byb3BlcnR5LGRpcmVjdGlvbik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZWx0YVggPCAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdGNoYW5nZShzZWxlY3RlZF9wcm9wZXJ0eSwtZGlyZWN0aW9uKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoYXhpcyA9PT0gXCJ5XCIpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGVsdGFZID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFuZ2Uoc2VsZWN0ZWRfcHJvcGVydHksZGlyZWN0aW9uKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRlbHRhWSA8IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2hhbmdlKHNlbGVjdGVkX3Byb3BlcnR5LC1kaXJlY3Rpb24pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gVXBkYXRlIEVsZW1lbnQncyBQcm9wZXJ0aWVzXG5cdFx0XHRcdFx0XHR2YXIgJGVsZW1lbnRwcm9wZXJ0aWVzID0ge1xuXHRcdFx0XHRcdFx0XHRlX3dpZHRoOiRlbGVtZW50LmNzc0Zsb2F0KFwid2lkdGhcIiksXG5cdFx0XHRcdFx0XHRcdGVfaGVpZ2h0OiRlbGVtZW50LmNzc0Zsb2F0KFwiaGVpZ2h0XCIpLFxuXG5cdFx0XHRcdFx0XHRcdGVfbWFyZ2luX3Q6JGVsZW1lbnQuY3NzRmxvYXQoXCJtYXJnaW4tdG9wXCIpLFxuXHRcdFx0XHRcdFx0XHRlX21hcmdpbl9yOiRlbGVtZW50LmNzc0Zsb2F0KFwibWFyZ2luLXJpZ2h0XCIpLFxuXHRcdFx0XHRcdFx0XHRlX21hcmdpbl9iOiRlbGVtZW50LmNzc0Zsb2F0KFwibWFyZ2luLWJvdHRvbVwiKSxcblx0XHRcdFx0XHRcdFx0ZV9tYXJnaW5fbDokZWxlbWVudC5jc3NGbG9hdChcIm1hcmdpbi1sZWZ0XCIpLFxuXG5cdFx0XHRcdFx0XHRcdGVfcGFkZGluZ190OiRlbGVtZW50LmNzc0Zsb2F0KFwicGFkZGluZy10b3BcIiksXG5cdFx0XHRcdFx0XHRcdGVfcGFkZGluZ19yOiRlbGVtZW50LmNzc0Zsb2F0KFwicGFkZGluZy1yaWdodFwiKSxcblx0XHRcdFx0XHRcdFx0ZV9wYWRkaW5nX2I6JGVsZW1lbnQuY3NzRmxvYXQoXCJwYWRkaW5nLWJvdHRvbVwiKSxcblx0XHRcdFx0XHRcdFx0ZV9wYWRkaW5nX2w6JGVsZW1lbnQuY3NzRmxvYXQoXCJwYWRkaW5nLWxlZnRcIiksXG5cblx0XHRcdFx0XHRcdFx0Ly8gUmV0cmlldmUgRWxlbWVudCBQb3NpdGlvblxuXHRcdFx0XHRcdFx0XHRlX3RvcDokZWxlbWVudC5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0XHRcdGVfbGVmdDokZWxlbWVudC5vZmZzZXQoKS5sZWZ0LFxuXHRcdFx0XHRcdFx0XHRlX3JpZ2h0OiRlbGVtZW50Lm9mZnNldCgpLnJpZ2h0LFxuXHRcdFx0XHRcdFx0XHRlX2JvdHRvbTokZWxlbWVudC5vZmZzZXQoKS5ib3R0b20sXG5cblx0XHRcdFx0XHRcdFx0Ly8gXG5cblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdC8vIFJlZnJlc2ggQW5jaG9yIFBvc2l0aW9uc1xuXHRcdFx0XHRcdFx0UG9zaXRpb25CYm94KCRlbGVtZW50cHJvcGVydGllcyk7XG5cdFx0XHRcdFx0XHRQb3NpdGlvbkFuY2hvcnMoKTtcblxuXHRcdFx0XHRcdFx0Ly8gc2V0IHBvc2l0aW9uIGZvciBuZXh0IHRpbWVcblx0XHRcdFx0XHRcdGxhc3RfcG9zaXRpb24gPSB7XG5cdFx0XHRcdFx0XHRcdHggOiBlLmNsaWVudFgsXG5cdFx0XHRcdFx0XHRcdHkgOiBlLmNsaWVudFlcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0JChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdC8vIFVuYmluZCBNb3VzZU1vdmVcblx0XHRcdFx0XHRcdCQoZG9jdW1lbnQpLnVuYmluZCgnbW91c2Vtb3ZlJyk7XG5cdFx0XHRcdFx0XHQvLyBUb2dnbGUgTW91c2UgUGFuZWxcblx0XHRcdFx0XHRcdCRtb3VzZXBhbmVsLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0Ly8gUmVzZXQgQkJveCBTdHlsZVxuXHRcdFx0XHRcdFx0JGJib3hfYmFjay5jc3MoJ2JvcmRlci1jb2xvcicsJyMzMzMnKTtcblx0XHRcdFx0XHRcdEFuY2hvcnNfY3NzKHtcImJvcmRlclwiIDpcInNvbGlkIDFweCByZ2JhKDMzLDMzLDMzLDAuOClcIn0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0XG59KSAoKTtcblxuXG4iLCJ2YXIgc3R5bGVzID0gcmVxdWlyZSgnLi9zdHlsZXMnKTtcblxuZnVuY3Rpb24gX3JlYWQoaW5wdXQpIHtcblxuXHR2YXIgY291bnRlciA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdFxuXHRmdW5jdGlvbiBwYXNzKCkge1xuXHRcdGlmKGNvdW50ZXIgPD0gMil7XG5cdFx0XHRfcmVhY3QoRXJyb3IoXCJObyBWYWxpZCBUb29sIFNwZWNpZmllZFwiKSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y291bnRlci0tO1xuXHRcdH1cblx0fTtcblxuXHRBcnJheS5zbGljZShhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oY2IpIHtcblx0XHRpZih0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0Y2IoaW5wdXQsIF9yZWFjdCwgcGFzcylcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjYi5yZWFkID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdGNiLnJlYWQoaW5wdXQsIF9yZWFjdCwgcGFzcylcblx0XHR9XG5cdH0pXG5cbn1cblxuLy8gQWdhaW4gRm9yIE5vdyBGb3IgRXZlcnl0aGluZyBFbHNlIFdlIFNpbXBseSBSZXNwb25kIFdpdGggYSBcIk5vcGVcIiBBbmltYXRpb25cbi8vIEZ1dHVyZSBWZXJzaW9ucyBzaG91bGQgaGF2ZSBhIG1vcmUgd2lkZSByYW5nZSBvZiByZXNwb25zZXNcbmZ1bmN0aW9uIF9yZWFjdChlcnIpIHtcblx0aWYgKGVycil7XG5cdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdCQoXCIjdHd5Z19jb25zb2xlXCIpXG5cdFx0XHQuYW5pbWF0ZSh7J2xlZnQnOicxMHB4J30sIDcwKVxuXHRcdFx0LmFuaW1hdGUoeydsZWZ0JzonMzBweCd9LCA3MClcblx0XHRcdC5hbmltYXRlKHsnbGVmdCc6JzIwcHgnfSwgNzApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIF9zaG93KCkge1xuXHQkKFwiYm9keVwiKVxuXHRcdC5wcmVwZW5kKCc8ZGl2IGlkPVwidHd5Z1wiPjwvZGl2PicpXG5cdFx0LmNzcygncG9zaXRpb24nLCdyZWxhdGl2ZScpO1xuXHQkKFwiI3R3eWdcIilcblx0XHQucHJlcGVuZCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ0d3lnX2NvbnNvbGVcIj48L2lucHV0PicpO1xuXHQkKFwiI3R3eWdfY29uc29sZVwiKS5jc3Moc3R5bGVzLmNvbnNvbGUpXG5cdCQoJyN0d3lnX2NvbnNvbGUnKS50b2dnbGUoKTtcbn07XG5cbmZ1bmN0aW9uIF90b2dnbGUoKSB7XG5cdHZhciB0ZXh0X2lucHV0ID0gJCgnI3R3eWdfY29uc29sZScpO1xuXHR0ZXh0X2lucHV0LnRvZ2dsZSgpO1xuXHR0ZXh0X2lucHV0LmZvY3VzICgpO1xuXHR0ZXh0X2lucHV0LnNlbGVjdCAoKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHNob3c6IF9zaG93LFxuXHR0b2dnbGU6IF90b2dnbGUsXG5cdHJlYWQ6IF9yZWFkXG59IiwiLyoqKioqKioqKioqIE1vdXNlIFBhbmVsIChQb3BzIG5leHQgdG8gdGhlIG1vdXNlKSAqKioqKioqKioqKioqKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0YWRkOmZ1bmN0aW9uKCkge1xuXHRcdCQoXCIjdHd5Z1wiKS5wcmVwZW5kKCc8ZGl2IGlkPVwibW91c2VwYW5lbFwiPjwvZGl2PicpO1xuXHR9LFxuXHRyZW1vdmU6ZnVuY3Rpb24oKSB7XG5cdFx0JChcIiNtb3VzZXBhbmVsXCIpLnJlbW92ZSgpO1xuXHR9LFxuXHRzdHlsZTpmdW5jdGlvbigpIHtcblx0XHQkKFwiI21vdXNlcGFuZWxcIikuY3NzKHtcblx0XHRcdFwid2lkdGhcIjpcImF1dG9cIixcblx0XHRcdFwiaGVpZ2h0XCI6XCIxNXB4XCIsXG5cdFx0XHRcIm1hcmdpblwiOlwiMHB4XCIsXG5cdFx0XHRcInBhZGRpbmdcIjpcIjRweCA3cHhcIixcblx0XHRcdFwiYmFja2dyb3VuZC1jb2xvclwiOlwiIzk5OVwiLFxuXHRcdFx0XCJjb2xvclwiOlwiIzAwMFwiLFxuXHRcdFx0XCJmb250LXNpemVcIjpcIjEycHhcIixcblx0XHRcdFwiZm9udC1mYW1pbHlcIjpcIm1vbm9zcGFjZVwiLFxuXHRcdFx0XCJib3JkZXItcmFkaXVzXCI6XCIycHhcIlxuXHRcdH0pO1xuXHR9LFxuXHRjb2xvcjpmdW5jdGlvbih0eXBlKSB7XG5cdFx0aWYgKHR5cGUgPT0gXCJtYXJnaW5cIikgeyQoXCIjbW91c2VwYW5lbFwiKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLFwieWVsbG93XCIpO31cblx0XHRpZiAodHlwZSA9PSBcInBhZGRpbmdcIikgeyQoXCIjbW91c2VwYW5lbFwiKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLFwicmVkXCIpO31cblx0fSxcblx0cG9zaXRpb246ZnVuY3Rpb24oZSkge1xuXHRcdCQoXCIjbW91c2VwYW5lbFwiKS5jc3Moe1xuXHRcdFx0XCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIixcblx0XHRcdFwibGVmdFwiOitlLmNsaWVudFggKzE1ICsgXCJweFwiLFxuXHRcdFx0XCJ0b3BcIjorZS5jbGllbnRZICsgXCJweFwiLFxuXHRcdH0pO1xuXHR9LFxuXG5cdGNvbnRleHQ6ZnVuY3Rpb24oaW5mbykge1xuXHRcdCQoXCIjbW91c2VwYW5lbFwiKS50ZXh0KGluZm8pO1xuXHR9LFxufTsiLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiY29uc29sZVwiOntcblx0XHRcIndpZHRoXCI6XCI0MCVcIixcblx0XHRcImhlaWdodFwiOlwiYXV0b1wiLFxuXHRcdFwiYmFja2dyb3VuZC1jb2xvclwiOlwicmdiYSgyMDAsMjAwLDIwMCwwLjgpXCIsXG5cdFx0XCJwYWRkaW5nXCI6XCIyMHB4XCIsXG5cdFx0XCJjb2xvclwiOlwiIzMzM1wiLFxuXHRcdFwiZm9udC1zaXplXCI6XCIyZW1cIixcblx0XHRcImZvbnQtZmFtaWx5XCI6XCJzYW5zLXNlcmlmXCIsXG5cdFx0XCJwb3NpdGlvblwiOlwiZml4ZWRcIixcblx0XHRcInotaW5kZXhcIjpcIjEwMDBcIixcblx0XHRcInRvcFwiOlwiMjBweFwiLFxuXHRcdFwibGVmdFwiOlwiMjBweFwiLFxuXHRcdFwiYm9yZGVyXCI6XCJub25lXCJcblx0fSxcblx0XCJ0b29sc1wiOiB7XG5cdFx0XCJiYm94XCI6IHtcblx0XHRcdFwiYW5jaG9yc1wiOiB7XG5cdFx0XHRcdFwicG9zaXRpb25cIjpcImFic29sdXRlXCIsXG5cdFx0XHRcdFwid2lkdGhcIjogXCI2cHhcIixcblx0XHRcdFx0XCJoZWlnaHRcIjpcIjZweFwiLFxuXHRcdFx0XHRcImJhY2tncm91bmQtY29sb3JcIjpcIiNmZmZcIixcblx0XHRcdFx0XCJib3JkZXJcIjpcInNvbGlkIDFweCByZ2JhKDMzLDMzLDMzLDAuOClcIlxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJydWxlclwiOiB7XG5cdFx0XHRcInBvc2l0aW9uXCI6XCJhYnNvbHV0ZVwiLFxuXHRcdFx0XCJiYWNrZ3JvdW5kLWNvbG9yXCI6XCIjZjAwXCIsXG5cdFx0XHRcImJvcmRlclwiOlwic29saWQgMXB4ICNlZWVcIixcblx0XHRcdFwiaGVpZ2h0XCI6XCIxcHhcIlxuXHRcdH1cblx0fVxufSIsImZ1bmN0aW9uIF9yZWFkKGlucHV0LCBkb25lLCBuZXh0KSB7XG5cdC8vIEJvdW5kaW5nIEJveCBQYXJzZVxuXHRpZiAoXG5cdFx0Ly8gQSBQcm9wZXJ0eSBpcyBEZWZpbmVkIGFuZC4uLlxuXHRcdGlucHV0LmluZGV4T2YoXCJ7XCIpICE9IC0xIFxuXHRcdC8vSWYgdGhlcmUgaXMgb25seSAxIHByb3BlcnR5XG5cdFx0JiYgaW5wdXQuc3BsaXQoXCJ7XCIpLmxlbmd0aCA8PSAyXG5cdFx0Ly9JZiB0aGVyZSBubyBtb3JlIHRoYW4gMSB1bml0IHR5cGVcblx0XHQmJiBpbnB1dC5zcGxpdChcIi9cIikubGVuZ3RoIDw9IDIgXG5cdFx0Ly9JZiB0aGUgcHJvcGVydHkgaXMgdmFsaWQgKGZ1dHVyZSB2ZXJzaW9ucyBzaG91bGQgaGF2ZSBhIHZhbGlkYXRvciAtIGZvciBub3cgaXQncyBqdXN0IHRydWUpXG5cdFx0JiYgdHJ1ZSkge1xuXHRcdFx0Ly8gRWxlbWVudCBJbnB1dCBmb3IgSnF1ZXJ5IFBhcnNpbmdcblx0XHRcdHZhciBlX2lucHV0ID0gaW5wdXQuc3BsaXQoXCJ7XCIpWzBdO1xuXHRcdFx0Ly8gUHJvcGVydHkgSW5wdXQgZm9yIFR3eWcgRWRpdGluZ1xuXHRcdFx0dmFyIHBfaW5wdXQgPSBpbnB1dC5zcGxpdChcIntcIilbMV0uc3BsaXQoXCIvXCIpWzBdO1xuXHRcdFx0Ly8gUHJvcGVydHkgVW5pdCBpZiBJbmNsdWRlZFxuXHRcdFx0dmFyIHVfaW5wdXQgPSBpbnB1dC5zcGxpdChcIi9cIilbMV07XG5cdFx0XHRcblx0XHRcdC8vIExldCdzIEFsc28gSGlkZSB0aGUgVHd5ZyBDb25zb2xlXG5cdFx0XHQkKCcjdHd5Z19jb25zb2xlJykudG9nZ2xlKCk7XG5cblx0XHRcdC8vIEFuZCBQYXNzIHRoZSBFbGVtZW50IElucHV0ICYgUHJvcGVydHkgSW5wdXQgdG8gdGhlIFR3eWcgRWRpdG9yXG5cdFx0XHQvLyByZXR1cm4gVHd5Z19ib3VuZChlX2lucHV0LHBfaW5wdXQsdV9pbnB1dCk7XG5cblx0fSBlbHNlIHtcblx0XHRuZXh0KCk7XG5cdH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IF9yZWFkXG59IiwidmFyIHN0eWxlcyA9IHJlcXVpcmUoJy4uL3N0eWxlcy5qc29uJyk7XG52YXIgbW91c2VwYW5lbCA9IHJlcXVpcmUoJy4uL21vdXNlcGFuZWwnKTtcblxuLy8gUnVsZXIgKHYuMC4xKVxuXG5mdW5jdGlvbiBfcmVhZCAoaW5wdXQsIGRvbmUsIG5leHQpIHtcblx0aWYgKGlucHV0ID09IFwicnVsZXJcIiB8fCBpbnB1dCA9PSBcIlJ1bGVyXCIpIHtcblx0XHQvLyBIaWRlIENvbnNvbGVcblx0XHQkKCcjdHd5Z19jb25zb2xlJykudG9nZ2xlKCk7XG5cdFx0X3dhdGNoKGRvbmUpO1xuXHR9IGVsc2Uge1xuXHRcdG5leHQoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBfd2F0Y2goZG9uZSkge1xuXHQkKGRvY3VtZW50KS5tb3VzZWRvd24oZnVuY3Rpb24oZSkge1xuXHRcdC8vIFByZXZlbnQgRGVmYXVsdHNcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQvLyBDcmVhdGUgUnVsZXJcblx0XHQkKCcjdHd5ZycpLmFwcGVuZCgnPGRpdiBpZD1cInR3eWdfcnVsZXJcIj48L2Rpdj4nKTtcblx0XHQkcnVsZXIgPSAkKCcjdHd5Z19ydWxlcicpO1xuXG5cdFx0Ly8gU3R5bGUgUnVsZXJcblx0XHQkKFwiI3R3eWdfcnVsZXJcIikuY3NzKHN0eWxlcy50b29scy5ydWxlcilcblxuXHRcdC8vIFRvZ2dsZSBNb3VzZSBQYW5lbFxuXHRcdG1vdXNlcGFuZWwuYWRkKCk7XG5cdFx0bW91c2VwYW5lbC5zdHlsZSgpO1xuXHRcdG1vdXNlcGFuZWwucG9zaXRpb24oZSk7XG5cblx0XHQvLyBTZXQgU3RhcnQgUG9pbnRcblx0XHR2YXIgc3RhcnRfeCA9IGUucGFnZVgsXG5cdFx0XHRzdGFydF95ID0gZS5wYWdlWTtcblxuXHRcdC8vIFNldCBSdWxlciBGaXJzdCBQb3NpdGlvblxuXHRcdCRydWxlci5jc3Moe1wibGVmdFwiOnN0YXJ0X3gsXCJ0b3BcIjpzdGFydF95fSk7XG5cblx0XHQkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1x0XG5cblx0XHRcdC8vIFBvc2l0aW9uIE1vdXNlUGFuZWxcblx0XHRcdG1vdXNlcGFuZWwucG9zaXRpb24oZSk7XG5cblx0XHRcdC8vIFNldCBFbmQgUG9pbnRcblx0XHRcdHZhciBlbmRfeCA9IGUucGFnZVgsXG5cdFx0XHRcdGVuZF95ID0gZS5wYWdlWTtcblxuXHRcdFx0Ly8gU2V0IERpZmZlcmVuY2Vcblx0XHRcdHZhciBjaGFuZ2VfeCA9IGVuZF94IC0gc3RhcnRfeCxcblx0XHRcdFx0Y2hhbmdlX3kgPSBlbmRfeSAtIHN0YXJ0X3k7XG5cdFx0XHRcblx0XHRcdHZhciBzcXVhcmVkX3ggPSBjaGFuZ2VfeCpjaGFuZ2VfeCxcblx0XHRcdFx0c3F1YXJlZF95ID0gY2hhbmdlX3kqY2hhbmdlX3k7XG5cblx0XHRcdC8vIFNldCBydWxlciBMZW5ndGhcblx0XHRcdHZhciBydWxlcl9sZW5ndGggPSBNYXRoLnNxcnQoc3F1YXJlZF94ICsgc3F1YXJlZF95KTtcblxuXHRcdFx0Ly8gU2V0IFJ1bGVyIEFuZ2xlXG5cdFx0XHR2YXIgcnVsZXJfYW5nbGUgPSBNYXRoLmF0YW4oY2hhbmdlX3kvY2hhbmdlX3gpO1xuXG5cdFx0XHQkcnVsZXIuY3NzKFwid2lkdGhcIixydWxlcl9sZW5ndGggKyBcInB4XCIpO1xuXHRcdFx0JHJ1bGVyLnJvdGF0ZShydWxlcl9hbmdsZSk7XG5cblx0XHRcdG1vdXNlcGFuZWwuY29udGV4dChydWxlcl9sZW5ndGggKyBcInB4XCIpO1xuXHRcdFxuXHRcdH0pO1xuXG5cdFx0JChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKXtcblx0XHRcdC8vIFVuYmluZCBNb3VzZU1vdmVcblx0XHRcdCQoZG9jdW1lbnQpLnVuYmluZCgnbW91c2Vtb3ZlJyk7XG5cdFx0XHQkKFwidHd5Z19ydWxlclwiKS5yZW1vdmUoKTtcblx0XHRcdC8vIFRvZ2dsZSBNb3VzZSBQYW5lbFxuXHRcdFx0bW91c2VwYW5lbC5yZW1vdmUoKTtcblx0XHRcdGRvbmUoKTtcblx0XHR9KTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWFkOiBfcmVhZFxufVxuIl19
