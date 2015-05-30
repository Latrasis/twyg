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

	/*********** Mouse Panel (Pops next to the mouse) **************/

	

	/************************ Twyg-Tools ***************************/

	// Ruler (v.0.1)

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

	Array.slice(arguments, 1).forEach(function(cb) {
		if(typeof cb === 'function'){
			cb(input, _react)
		} else if (typeof cb.read === 'function'){
			cb.read(input, _react)
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
function bboxRead(input, done) {
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

	}
};


module.exports = {
	read: bboxRead
}
},{}],"/Users/jacobpayne/Documents/Repos/Github/twyg/lib/tools/ruler.js":[function(require,module,exports){
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
			$(document).unbind('mousemove');
			document.getElementById("twyg_ruler").parentNode.removeChild("twyg_ruler");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvY29uc29sZS5qcyIsImxpYi9tb3VzZXBhbmVsLmpzIiwibGliL3N0eWxlcy5qc29uIiwibGliL3Rvb2xzL2Jib3guanMiLCJsaWIvdG9vbHMvcnVsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Z0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBUd3lnLmpzIC0gVHdlYWsgV2hhdCBZb3UgR2V0IHwgQ1NTIEVkaXRvclxuICogdjAuMC4yXG4gKlxuICogQ29weXJpZ2h0IDIwMTQsIEphY29iIFBheW5lIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICpcbiAqIERhdGU6IDIwMTQtMDItMDRcbiAqL1xuXG52YXIgc3R5bGVzID0gcmVxdWlyZSgnLi9zdHlsZXMuanNvbicpO1xudmFyIHR3eWdDb25zb2xlID0gcmVxdWlyZSgnLi9jb25zb2xlLmpzJyk7XG5cbnZhciB0b29sUnVsZXIgPSByZXF1aXJlKCcuL3Rvb2xzL3J1bGVyLmpzJyk7XG52YXIgdG9vbEJib3ggPSByZXF1aXJlKCcuL3Rvb2xzL2Jib3guanMnKVxuXG52YXIgVHd5ZyA9IChmdW5jdGlvbigpIHtcblxuXHQvLyAqKioqKioqIFNtYWxsIERlcGVuZGVuY3kgRnVuY3Rpb25zIHdpdGggSnF1ZXJ5ICoqKioqKiogLy9cblxuXHQvLyBGaW5kIENzcyBGbG9hdCBWYWx1ZVxuXHRqUXVlcnkuZm4uY3NzRmxvYXQgPSBmdW5jdGlvbiAocHJvcCkge1xuXHQgICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy5jc3MocHJvcCkpIHx8IDA7XG5cdH07XG5cblx0Ly8gRmluZCBDc3MgSW50ZWdlciBWYWx1ZVxuXHRqUXVlcnkuZm4uY3NzSW50ID0gZnVuY3Rpb24gKHByb3ApIHtcblx0ICAgIHJldHVybiBwYXJzZUludCh0aGlzLmNzcyhwcm9wKSwxMCkgfHwgMDtcblx0fTtcblxuXHQvLyBSb3RhdGUgQ3NzIHdpdGggVHJhbnNmb3JtZWQgT3JpZ2luXG5cdGpRdWVyeS5mbi5yb3RhdGUgPSBmdW5jdGlvbihkZWdyZWVzKSB7XG5cdCAgICAkKHRoaXMpLmNzcyh7Jy13ZWJraXQtdHJhbnNmb3JtJyA6ICdyb3RhdGUoJysgZGVncmVlcyArJ3JhZCknLFxuXHQgICAgICAgICAgICAgICAgJy1tb3otdHJhbnNmb3JtJyA6ICdyb3RhdGUoJysgZGVncmVlcyArJ3JhZCknLFxuXHQgICAgICAgICAgICAgICAgJy1tcy10cmFuc2Zvcm0nIDogJ3JvdGF0ZSgnKyBkZWdyZWVzICsncmFkKScsXG5cdCAgICAgICAgICAgICAgICAndHJhbnNmb3JtJyA6ICdyb3RhdGUoJysgZGVncmVlcyArJ3JhZCknLFxuXHQgICAgXHRcdFx0J3RyYW5zZm9ybU9yaWdpbic6XCJsZWZ0IHRvcFwifSk7XG5cdH07XG5cblx0Ly8gKioqKioqKiBTdHlsaW5nICoqKioqKiogLy9cblx0ZnVuY3Rpb24gc3R5bGVfYW5jaG9ycygpIHskKFwiI3R3eWdfYmJveFwiKS5jc3Moc3R5bGVzLnRvb2xzLmJib3guYW5jaG9ycyl9XG5cblx0Ly8gQWRkaW5nIFR3eWcgdG8gdGhlIEJvZHlcblxuXHR3aW5kb3cub25Mb2FkID0gdHd5Z0NvbnNvbGUuc2hvdygpO1xuXG5cdC8vIFVzaW5nIE1vdXNldHJhcC5qcyBsZXQncyBCaW5kIHRoZSB2aWV3IG9mIHRoZSBUd3lnIENvbnNvbGUgdG8gdGhlIEtleXN0cm9rZSBDYXBpdGFsIFwiVFwiXG5cdE1vdXNldHJhcC5iaW5kKCdQJyxmdW5jdGlvbiAoKSB7IHR3eWdDb25zb2xlLnRvZ2dsZSgpOyB9KTtcblxuXHQvLyBBY3Rpb25zIG9uIFdoYXQgdG8gZG8gb24gUHJlc3NpbmcgZWl0aGVyIFwiRW50ZXJcIiBvciBcIkVzY1wiXG5cblx0JChcImJvZHlcIikua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuXHRcdC8vIEJ5IFByZXNzaW5nIFwiRXNjXCIgdGhlIENvbnNvbGUgaXMgVG9nZ2xlZCBpZiBWaXNpYmxlXG5cdFx0Ly8gSWYgdGhlIENvbnNvbGUgaXMgbm90IHZpc2libGUgdGhvdWdoIGFueSBCb3VuZGluZyBCb3hlcyBhcmUgUmVtb3ZlZFxuXHRcdGlmIChlLmtleUNvZGUgPT0gMjcpIHtcblx0XHRcdGlmICgkKCcjdHd5Z19jb25zb2xlJykuaXMoJzpoaWRkZW4nKSkgeyQoXCIjdHd5Z19iYm94XCIpLnJlbW92ZSgpO31cblx0XHRcdGlmICgkKCcjdHd5Z19jb25zb2xlJykuaXMoJzp2aXNpYmxlJykpIHskKFwiI3R3eWdfY29uc29sZVwiKS50b2dnbGUoKTt9XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI3R3eWdfY29uc29sZVwiKS5rZXlwcmVzcyhmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBUd3lnX2lucHV0ID0gJChcIiN0d3lnX2NvbnNvbGVcIikudmFsKCk7XG5cdC8vIEJ5IFByZXNzaW5nIFwiRW50ZXJcIiB0aGUgRmllbGQgQ29udGVudCBpcyBQYXNzZWQgdG8gdGhlIFBhcnNpbmcgRnVuY3Rpb25cblx0ICBpZiAoZS53aGljaCA9PSAxMykge1xuXHRcdCQoXCIjdHd5Z19jb25zb2xlXCIpLnN1Ym1pdCgpO1xuXHRcdC8vIElmIGEgQm91bmRpbmcgQm94IGFscmVhZHkgRXhpc3RzIHdlIGRlbGV0ZSBpdFxuXHRcdGlmICgkKFwiI3R3eWdfYmJveFwiKS5sZW5ndGggPiAwKSB7ICQoXCIjdHd5Z19iYm94XCIpLnJlbW92ZSgpO31cblx0XHR0d3lnQ29uc29sZS5yZWFkKFR3eWdfaW5wdXQsIHRvb2xSdWxlciwgdG9vbEJib3gpO1xuXHQgIH1cblx0fSk7XG5cblx0LyoqKioqKioqKioqIE1vdXNlIFBhbmVsIChQb3BzIG5leHQgdG8gdGhlIG1vdXNlKSAqKioqKioqKioqKioqKi9cblxuXHRcblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqIFR3eWctVG9vbHMgKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdC8vIFJ1bGVyICh2LjAuMSlcblxuXHQvKioqKioqKioqKioqKioqKioqKipCb3VuZGluZy1Cb3gtQ3JlYXRpb24qKioqKioqKioqKioqKioqKioqKioqXG5cblx0VGhpcyBpcyB3aGVyZSB3ZSBzdGFydCBCb3VuZC1Cb3hpbmcgdGhlIEVsZW1lbnQgYmFzZWQgb24gdGhlIEdpdmVuIFByb3BlcnR5XG5cblx0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdGZ1bmN0aW9uIFR3eWdfYm91bmQoZV9pbnB1dCxwX2lucHV0LHVfaW5wdXQpIHtcblxuXHRcdHZhciAkZWxlbWVudCA9ICQoXCJcIitlX2lucHV0K1wiXCIpO1xuXHRcdHZhciAkcHJvcGVydHkgPSBwX2lucHV0O1xuXHRcdHZhciAkdW5pdCA9IHVfaW5wdXQ7XG5cblx0XHQvLyBDaGVjayBpZiBJbnB1dCBpcyBJbmNsdWRlZCAoaWYgbm90IHZhbGlkIGRlZmF1bHQgdG8gXCJweFwiKVxuXHRcdFx0aWYgKCEoJHVuaXQgPT0gXCJweFwiIHx8XG5cdFx0XHRcdFx0JHVuaXQgPT0gXCIlXCIgfHxcblx0XHRcdFx0XHQkdW5pdCA9PSBcImVtXCIgfHxcblx0XHRcdFx0XHQkdW5pdCA9PSBcImV4XCIgfHxcblx0XHRcdFx0XHQkdW5pdCA9PSBcInB0XCIgfHxcblx0XHRcdFx0XHQkdW5pdCA9PSBcInBjXCIgfHxcblx0XHRcdFx0XHQkdW5pdCA9PSBcIm1tXCIgfHxcblx0XHRcdFx0XHQkdW5pdCA9PSBcImNtXCIgfHxcblx0XHRcdFx0XHQkdW5pdCA9PSBcImluXCIpKSB7JHVuaXQgPSBcInB4XCI7fVxuXG5cdFx0Ly8gUmV0cmlldmUgRWxlbWVudCBQcm9wZXJ0aWVzXG5cblx0XHR2YXIgJGVsZW1lbnRwcm9wZXJ0aWVzID0ge1xuXHRcdFx0ZV93aWR0aDokZWxlbWVudC5jc3NGbG9hdChcIndpZHRoXCIpLFxuXHRcdFx0ZV9oZWlnaHQ6JGVsZW1lbnQuY3NzRmxvYXQoXCJoZWlnaHRcIiksXG5cblx0XHRcdGVfbWFyZ2luX3Q6JGVsZW1lbnQuY3NzRmxvYXQoXCJtYXJnaW4tdG9wXCIpLFxuXHRcdFx0ZV9tYXJnaW5fcjokZWxlbWVudC5jc3NGbG9hdChcIm1hcmdpbi1yaWdodFwiKSxcblx0XHRcdGVfbWFyZ2luX2I6JGVsZW1lbnQuY3NzRmxvYXQoXCJtYXJnaW4tYm90dG9tXCIpLFxuXHRcdFx0ZV9tYXJnaW5fbDokZWxlbWVudC5jc3NGbG9hdChcIm1hcmdpbi1sZWZ0XCIpLFxuXG5cdFx0XHRlX3BhZGRpbmdfdDokZWxlbWVudC5jc3NGbG9hdChcInBhZGRpbmctdG9wXCIpLFxuXHRcdFx0ZV9wYWRkaW5nX3I6JGVsZW1lbnQuY3NzRmxvYXQoXCJwYWRkaW5nLXJpZ2h0XCIpLFxuXHRcdFx0ZV9wYWRkaW5nX2I6JGVsZW1lbnQuY3NzRmxvYXQoXCJwYWRkaW5nLWJvdHRvbVwiKSxcblx0XHRcdGVfcGFkZGluZ19sOiRlbGVtZW50LmNzc0Zsb2F0KFwicGFkZGluZy1sZWZ0XCIpLFxuXG5cdFx0XHQvLyBSZXRyaWV2ZSBFbGVtZW50IFBvc2l0aW9uXG5cdFx0XHRlX3RvcDokZWxlbWVudC5vZmZzZXQoKS50b3AsXG5cdFx0XHRlX2xlZnQ6JGVsZW1lbnQub2Zmc2V0KCkubGVmdCxcblx0XHRcdGVfcmlnaHQ6JGVsZW1lbnQub2Zmc2V0KCkucmlnaHQsXG5cdFx0XHRlX2JvdHRvbTokZWxlbWVudC5vZmZzZXQoKS5ib3R0b20sXG5cdFx0fTtcblxuXG5cdFx0Ly8gSGVyZSB3ZSBzdGFydCBwaWNraW5nIG91dCB3aGF0IHRoZSBQcm9wZXJ0eSBhY3R1YWxseSBpcyBhbmQgd2hhdCBCb3VuZGluZyBCb3hlcyB3ZSBzaG93XG5cdFx0Ly8gVGhlIFJlc3BvbnNlcyB3aWxsIHJldHVybiBhcHByb3ByaWF0ZSBCb3VuZGluZyBCb3ggRnVuY3Rpb25zIHdoaWNoIGFsbG93IHRvIGVkaXQgdGhlIGVsZW1lbnQgd2l0aCB0aGUgbW91c2VcblxuXHRcdC8vIEhlaWdodCBhbmQgV2lkdGggUHJvcGVydGllc1xuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJoZWlnaHRcIikge1R3eWdfZWRpdChcImhlaWdodFwiKTt9XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcIndpZHRoXCIpIHtUd3lnX2VkaXQoXCJ3aWR0aFwiKTt9XG5cblx0XHQvLyBNYXJnaW4gUHJvcGVydHlcblx0XHRpZiAoJHByb3BlcnR5ID09IFwibWFyZ2luXCIpIHtUd3lnX2VkaXQoXCJtYXJnaW5cIixcImFsbFwiKTt9XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcIm1hcmdpbi1sZWZ0XCIpIHtUd3lnX2VkaXQoXCJtYXJnaW5cIixcImxlZnRcIik7fVxuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJtYXJnaW4tcmlnaHRcIikge1R3eWdfZWRpdChcIm1hcmdpblwiLFwicmlnaHRcIik7fVxuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJtYXJnaW4tYm90dG9tXCIpIHtUd3lnX2VkaXQoXCJtYXJnaW5cIixcImJvdHRvbVwiKTt9XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcIm1hcmdpbi10b3BcIikge1R3eWdfZWRpdChcIm1hcmdpblwiLFwidG9wXCIpO31cblxuXHRcdC8vIFBhZGRpbmcgUHJvcGVydHlcblx0XHRpZiAoJHByb3BlcnR5ID09IFwicGFkZGluZ1wiKSB7VHd5Z19lZGl0KFwicGFkZGluZ1wiLFwiYWxsXCIpO31cblx0XHRpZiAoJHByb3BlcnR5ID09IFwicGFkZGluZy1sZWZ0XCIpIHtUd3lnX2VkaXQoXCJwYWRkaW5nXCIsXCJsZWZ0XCIpO31cblx0XHRpZiAoJHByb3BlcnR5ID09IFwicGFkZGluZy1yaWdodFwiKSB7VHd5Z19lZGl0KFwicGFkZGluZ1wiLFwicmlnaHRcIik7fVxuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJwYWRkaW5nLWJvdHRvbVwiKSB7VHd5Z19lZGl0KFwicGFkZGluZ1wiLFwiYm90dG9tXCIpO31cblx0XHRpZiAoJHByb3BlcnR5ID09IFwicGFkZGluZy10b3BcIikge1R3eWdfZWRpdChcInBhZGRpbmdcIixcInRvcFwiKTt9XG5cdFx0XG5cdFx0Ly8gTGV0dGVyL0ZvbnQgUHJvcGVydGllc1xuXHRcdGlmICgkcHJvcGVydHkgPT0gXCJmb250LXNpemVcIikge1R3eWdfZWRpdChcImZvbnQtc2l6ZVwiKTt9XG5cdFx0aWYgKCRwcm9wZXJ0eSA9PSBcIndvcmQtc3BhY2luZ1wiKSB7VHd5Z19lZGl0KFwid29yZC1zcGFjaW5nXCIpO31cblx0XHRpZiAoJHByb3BlcnR5ID09IFwibGV0dGVyLXNwYWNpbmdcIikge1R3eWdfZWRpdChcImxldHRlci1zcGFjaW5nXCIpO31cblxuXG5cdFx0Ly8gQm91bmRpbmcgQm94IEZ1bmN0aW9uc1xuXG5cdFx0ZnVuY3Rpb24gVHd5Z19lZGl0KHR5cGUsc2lkZSkge1xuXG5cdFx0XHQvLyBTY2FmZm9sZCBCYWNrIG9mIHRoZSBCQm94IHdpdGhpbiB0aGUgVHd5ZyBEaXZcblx0XHRcdCRlbGVtZW50LnByZXBlbmQoJzxkaXYgaWQ9XCJ0d3lnX2Jib3hcIj48L2Rpdj4nKTtcblx0XHRcdHZhciAkYmJveF9iYWNrID0gJCgnI3R3eWdfYmJveCcpO1xuXG5cdFx0XHRmdW5jdGlvbiBQb3NpdGlvbkJib3goZWxlbWVudHByb3BlcnRpZXMpIHtcblxuXHRcdFx0XHQvLyBDb25zdHJ1Y3QgQkJveCBGb3IgSGVpZ2h0ICYgV2lkdGhcblx0XHRcdFx0aWYgKHR5cGUgPT0gXCJoZWlnaHRcIiB8fCB0eXBlID09IFwid2lkdGhcIikge1xuXHRcdFx0XHRcdCRiYm94X2JhY2suY3NzKHtcblx0XHRcdFx0XHRcdFwiYm94LXNpemluZ1wiOlwiYm9yZGVyLWJveFwiLFxuXHRcdFx0XHRcdFx0XCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHRcdFwibWFyZ2luXCI6XCIwcHhcIixcblx0XHRcdFx0XHRcdC8vIFwibWFyZ2luLWxlZnRcIjotZWxlbWVudHByb3BlcnRpZXMuZV9tYXJnaW5fbCsgLWVsZW1lbnRwcm9wZXJ0aWVzLmVfcGFkZGluZ19sICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0Ly8gXCJtYXJnaW4tdG9wXCI6LWVsZW1lbnRwcm9wZXJ0aWVzLmVfbWFyZ2luX3QrIC1lbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfdCArIFwicHhcIixcblx0XHRcdFx0XHRcdFwid2lkdGhcIjogK2VsZW1lbnRwcm9wZXJ0aWVzLmVfd2lkdGggICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0XCJoZWlnaHRcIjorZWxlbWVudHByb3BlcnRpZXMuZV9oZWlnaHQgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlclwiOlwic29saWQgMXB4IHJnYmEoMzMsMzMsMzMsMC4xKVwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDb25zdHJ1Y3QgQkJveCBGb3IgTWFyZ2luXG5cdFx0XHRcdGlmICh0eXBlID09IFwibWFyZ2luXCIpIHtcblx0XHRcdFx0XHQkYmJveF9iYWNrLmNzcyh7XG5cdFx0XHRcdFx0XHRcImJveC1zaXppbmdcIjpcImJvcmRlci1ib3hcIixcblx0XHRcdFx0XHRcdFwicG9zaXRpb25cIjpcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0XHRcIm1hcmdpblwiOlwiMHB4XCIsXG5cdFx0XHRcdFx0XHRcIm1hcmdpbi1sZWZ0XCI6LWVsZW1lbnRwcm9wZXJ0aWVzLmVfbWFyZ2luX2wrIC1lbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfbCArIFwicHhcIixcblx0XHRcdFx0XHRcdFwibWFyZ2luLXRvcFwiOi1lbGVtZW50cHJvcGVydGllcy5lX21hcmdpbl90KyAtZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX3QgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcIndpZHRoXCI6ICgrZWxlbWVudHByb3BlcnRpZXMuZV93aWR0aCArICtlbGVtZW50cHJvcGVydGllcy5lX21hcmdpbl9yICsgK2VsZW1lbnRwcm9wZXJ0aWVzLmVfbWFyZ2luX2wgKyArZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX2wgKyArZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX3IpICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0XCJoZWlnaHRcIjooK2VsZW1lbnRwcm9wZXJ0aWVzLmVfaGVpZ2h0ICsgK2VsZW1lbnRwcm9wZXJ0aWVzLmVfbWFyZ2luX3QgKyArZWxlbWVudHByb3BlcnRpZXMuZV9tYXJnaW5fYiArICtlbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfdCArICtlbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfYikgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlclwiOlwic29saWQgMXB4IHJnYmEoMzMsMzMsMzMsMC4xKVwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDb25zdHJ1Y3QgQkJveCBmb3IgUGFkZGluZ1xuXHRcdFx0XHRpZiAodHlwZSA9PSBcInBhZGRpbmdcIikge1xuXHRcdFx0XHRcdCRiYm94X2JhY2suY3NzKHtcblx0XHRcdFx0XHRcdFwiYm94LXNpemluZ1wiOlwiYm9yZGVyLWJveFwiLFxuXHRcdFx0XHRcdFx0XCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHRcdFwibWFyZ2luXCI6XCIwcHhcIixcblx0XHRcdFx0XHRcdFwibWFyZ2luLWxlZnRcIjotZWxlbWVudHByb3BlcnRpZXMuZV9wYWRkaW5nX2wrXCJweFwiLFxuXHRcdFx0XHRcdFx0XCJtYXJnaW4tdG9wXCI6LWVsZW1lbnRwcm9wZXJ0aWVzLmVfcGFkZGluZ190K1wicHhcIixcblx0XHRcdFx0XHRcdFwid2lkdGhcIjogKCtlbGVtZW50cHJvcGVydGllcy5lX3dpZHRoICsgK2VsZW1lbnRwcm9wZXJ0aWVzLmVfcGFkZGluZ19sICsgK2VsZW1lbnRwcm9wZXJ0aWVzLmVfcGFkZGluZ19yKSArIFwicHhcIixcblx0XHRcdFx0XHRcdFwiaGVpZ2h0XCI6KCtlbGVtZW50cHJvcGVydGllcy5lX2hlaWdodCArICtlbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfdCArICtlbGVtZW50cHJvcGVydGllcy5lX3BhZGRpbmdfYikgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcImJvcmRlclwiOlwic29saWQgMXB4IHJnYmEoMzMsMzMsMzMsMC4xKVwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRQb3NpdGlvbkJib3goJGVsZW1lbnRwcm9wZXJ0aWVzKTtcblxuXHRcdFx0Ly8gQWRkIEJveCBBbmNob3JzXG5cdFx0XHR2YXIgQW5jaG9yc19hZGQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gSW5zZXJ0IFRvcCBMZWZ0IFwidGxcIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYmFjay5hcHBlbmQoJzxkaXYgaWQ9XCJ0d3lnX2Jib3hfYW5jaF90bFwiIGNsYXNzPXR3eWdfYmJveF9hbmNoXCI+PC9kaXY+Jyk7XG5cdFx0XHRcdC8vIEluc2VydCBUb3AgTWlkZGxlIFwidG1cIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYmFjay5hcHBlbmQoJzxkaXYgaWQ9XCJ0d3lnX2Jib3hfYW5jaF90bVwiIGNsYXNzPXR3eWdfYmJveF9hbmNoXCI+PC9kaXY+Jyk7XG5cdFx0XHRcdC8vIEluc2VydCBUb3AgUmlnaHQgXCJ0clwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9iYWNrLmFwcGVuZCgnPGRpdiBpZD1cInR3eWdfYmJveF9hbmNoX3RyXCIgY2xhc3M9dHd5Z19iYm94X2FuY2hcIj48L2Rpdj4nKTtcblx0XHRcdFx0Ly8gSW5zZXJ0IFJpZ2h0IE1pZGRsZSBcInJtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2JhY2suYXBwZW5kKCc8ZGl2IGlkPVwidHd5Z19iYm94X2FuY2hfcm1cIiBjbGFzcz10d3lnX2Jib3hfYW5jaFwiPjwvZGl2PicpO1xuXHRcdFx0XHQvLyBJbnNlcnQgTGVmdCBNaWRkbGUgXCJsbVwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9iYWNrLmFwcGVuZCgnPGRpdiBpZD1cInR3eWdfYmJveF9hbmNoX2xtXCIgY2xhc3M9dHd5Z19iYm94X2FuY2hcIj48L2Rpdj4nKTtcblx0XHRcdFx0Ly8gSW5zZXJ0IEJvdHRvbSBMZWZ0IFwiYnJcIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYmFjay5hcHBlbmQoJzxkaXYgaWQ9XCJ0d3lnX2Jib3hfYW5jaF9iclwiIGNsYXNzPXR3eWdfYmJveF9hbmNoXCI+PC9kaXY+Jyk7XG5cdFx0XHRcdC8vIEluc2VydCBCb3R0b20gTWlkZGxlIFwiYm1cIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYmFjay5hcHBlbmQoJzxkaXYgaWQ9XCJ0d3lnX2Jib3hfYW5jaF9ibVwiIGNsYXNzPXR3eWdfYmJveF9hbmNoXCI+PC9kaXY+Jyk7XG5cdFx0XHRcdC8vIEluc2VydCBCb3R0b20gUmlnaHQgXCJibFwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9iYWNrLmFwcGVuZCgnPGRpdiBpZD1cInR3eWdfYmJveF9hbmNoX2JsXCIgY2xhc3M9dHd5Z19iYm94X2FuY2hcIj48L2Rpdj4nKTtcblx0XHRcdH07XG5cblx0XHRcdEFuY2hvcnNfYWRkKCk7XG5cblx0XHRcdC8vIE1ha2UgQW5jaG9yIFJlZmVyZW5jZSBMaXN0XG5cblx0XHRcdHZhciAkYmJveF9hbmNob3JfdGwgPSAkKCcjdHd5Z19iYm94X2FuY2hfdGwnKTsgLy8gVG9wIExlZnRcblx0XHRcdHZhciAkYmJveF9hbmNob3JfdG0gPSAkKCcjdHd5Z19iYm94X2FuY2hfdG0nKTsgLy8gVG9wIE1pZGRsZVxuXHRcdFx0dmFyICRiYm94X2FuY2hvcl90ciA9ICQoJyN0d3lnX2Jib3hfYW5jaF90cicpOyAvLyBUb3AgUmlnaHRcblx0XHRcdHZhciAkYmJveF9hbmNob3Jfcm0gPSAkKCcjdHd5Z19iYm94X2FuY2hfcm0nKTsgLy8gUmlnaHQgTWlkZGxlXG5cdFx0XHR2YXIgJGJib3hfYW5jaG9yX2xtID0gJCgnI3R3eWdfYmJveF9hbmNoX2xtJyk7IC8vIExlZnQgTWlkZGxlXG5cdFx0XHR2YXIgJGJib3hfYW5jaG9yX2JyID0gJCgnI3R3eWdfYmJveF9hbmNoX2JyJyk7IC8vIEJvdHRvbSBSaWdodFxuXHRcdFx0dmFyICRiYm94X2FuY2hvcl9ibSA9ICQoJyN0d3lnX2Jib3hfYW5jaF9ibScpOyAvLyBCb3R0b20gTWlkZGxlXG5cdFx0XHR2YXIgJGJib3hfYW5jaG9yX2JsID0gJCgnI3R3eWdfYmJveF9hbmNoX2JsJyk7IC8vIEJvdHRvbSBMZWZ0XG5cblx0XHRcdC8vIFN0eWxlIEFsbCBBbmNob3JzIEZ1bmN0aW9uXG5cdFx0XHRmdW5jdGlvbiBBbmNob3JzX2NzcyhzdHlsZSkge1xuXHRcdFx0XHQvLyBTdHlsZSBUb3AgTGVmdCBcInRsXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl90bC5jc3Moc3R5bGUpO1xuXHRcdFx0XHQvLyBTdHlsZSBUb3AgTWlkZGxlIFwidG1cIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYW5jaG9yX3RtLmNzcyhzdHlsZSk7XG5cdFx0XHRcdC8vIFN0eWxlIFRvcCBSaWdodCBcInRyXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl90ci5jc3Moc3R5bGUpO1xuXG5cdFx0XHRcdC8vIFN0eWxlIFJpZ2h0IE1pZGRsZSBcInJtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl9ybS5jc3Moc3R5bGUpO1xuXHRcdFx0XHQvLyBTdHlsZSBMZWZ0IE1pZGRsZSBcImxtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl9sbS5jc3Moc3R5bGUpO1xuXG5cdFx0XHRcdC8vIFN0eWxlIEJvdHRvbSBSaWdodCBcImJyXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl9ici5jc3Moc3R5bGUpO1xuXHRcdFx0XHQvLyBTdHlsZSBCb3R0b20gTWlkZGxlIFwiYm1cIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYW5jaG9yX2JtLmNzcyhzdHlsZSk7XG5cdFx0XHRcdC8vIFN0eWxlIEJvdHRvbSBMZWZ0IFwiYmxcIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYW5jaG9yX2JsLmNzcyhzdHlsZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN0eWxlIHRoZSBBbmNob3JzXG5cdFx0XHRBbmNob3JzX2NzcyhzdHlsZXMudG9vbHMuYmJveC5hbmNob3JzKTtcblxuXHRcdFx0Ly8gUG9zaXRpb24gdGhlIEFuY2hvcnNcblxuXHRcdFx0ZnVuY3Rpb24gUG9zaXRpb25BbmNob3JzKCkge1xuXG5cdFx0XHRcdHZhciBiYm94X3dpZHRoID0gKyRiYm94X2JhY2suY3NzRmxvYXQoJ3dpZHRoJyksXG5cdFx0XHRcdFx0YmJveF9oZWlnaHQgPSArJGJib3hfYmFjay5jc3NGbG9hdCgnaGVpZ2h0Jyk7XG5cblxuXHRcdFx0XHQvLyBQb3NpdGlvbiBUb3AgTGVmdCBcInRsXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl90bC5jc3Moe1xuXHRcdFx0XHRcdFwibGVmdFwiOlwiLTNcIitcInB4XCIsXG5cdFx0XHRcdFx0XCJ0b3BcIjpcIi0zXCIrXCJweFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcblx0XHRcdFx0Ly8gUG9zaXRpb24gVG9wIE1pZGRsZSBcInRtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl90bS5jc3Moe1xuXHRcdFx0XHRcdFwibGVmdFwiOmJib3hfd2lkdGgqMC41ICsgLVwiNlwiK1wicHhcIixcblx0XHRcdFx0XHRcInRvcFwiOlwiLTNcIitcInB4XCIsXG5cdFx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0XHQvLyBQb3NpdGlvbiBUb3AgUmlnaHQgXCJ0clwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfdHIuY3NzKHtcblx0XHRcdFx0XHRcImxlZnRcIjpiYm94X3dpZHRoICsgLVwiNlwiK1wicHhcIixcblx0XHRcdFx0XHRcInRvcFwiOlwiLTNcIitcInB4XCIsXG5cdFx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0XHQvLyBQb3NpdGlvbiBSaWdodCBNaWRkbGUgXCJybVwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3Jfcm0uY3NzKHtcblx0XHRcdFx0XHRcImxlZnRcIjpiYm94X3dpZHRoICsgLVwiNlwiK1wicHhcIixcblx0XHRcdFx0XHRcInRvcFwiOmJib3hfaGVpZ2h0KjAuNSsgLVwiNlwiICtcInB4XCIsXG5cdFx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0XHQvLyBQb3NpdGlvbiBMZWZ0IE1pZGRsZSBcImxtXCIgQW5jaG9yXG5cdFx0XHRcdCRiYm94X2FuY2hvcl9sbS5jc3Moe1xuXHRcdFx0XHRcdFwibGVmdFwiOlwiLTNcIitcInB4XCIsXG5cdFx0XHRcdFx0XCJ0b3BcIjpiYm94X2hlaWdodCowLjUrIC1cIjZcIiArXCJweFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcblx0XHRcdFx0Ly8gUG9zaXRpb24gQm90dG9tIFJpZ2h0IFwiYnJcIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYW5jaG9yX2JyLmNzcyh7XG5cdFx0XHRcdFx0XCJsZWZ0XCI6YmJveF93aWR0aCArIC1cIjZcIitcInB4XCIsXG5cdFx0XHRcdFx0XCJ0b3BcIjpiYm94X2hlaWdodCsgLVwiNlwiICtcInB4XCIsXG5cdFx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0XHQvLyBQb3NpdGlvbiBCb3R0b20gTWlkZGxlIFwiYm1cIiBBbmNob3Jcblx0XHRcdFx0JGJib3hfYW5jaG9yX2JtLmNzcyh7XG5cdFx0XHRcdFx0XCJsZWZ0XCI6YmJveF93aWR0aCowLjUgKyAtXCI2XCIrXCJweFwiLFxuXHRcdFx0XHRcdFwidG9wXCI6YmJveF9oZWlnaHQrIC1cIjZcIiArXCJweFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcblx0XHRcdFx0Ly8gUG9zaXRpb24gQm90dG9tIExlZnQgXCJibFwiIEFuY2hvclxuXHRcdFx0XHQkYmJveF9hbmNob3JfYmwuY3NzKHtcblx0XHRcdFx0XHRcImxlZnRcIjpcIi0zXCIrXCJweFwiLFxuXHRcdFx0XHRcdFwidG9wXCI6YmJveF9oZWlnaHQrIC1cIjZcIiArXCJweFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0UG9zaXRpb25BbmNob3JzKCk7XG5cblx0XHRcdC8vIE1hcmdpbiBCQm94IFN0YXRpYyBCZWhhdm9pclxuXHRcdFx0JChcIiN0d3lnX2Jib3ggZGl2XCIpXG5cdFx0XHRcdC5ob3Zlcihcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdC8vICRiYm94X2JhY2suY3NzKHsnYm9yZGVyLWJvdHRvbSc6J3NvbGlkIDFweCAjMzMzJ30pO1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5jc3Moe1wiYmFja2dyb3VuZC1jb2xvclwiOidncmV5J30pO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmNzcyh7XCJiYWNrZ3JvdW5kLWNvbG9yXCI6J3doaXRlJ30pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0XHQubW91c2Vkb3duIChcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCQodGhpcykuY3NzKHtcImJhY2tncm91bmQtY29sb3JcIjonYmxhY2snfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRcdC5tb3VzZXVwIChcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCQodGhpcykuY3NzKHtcImJhY2tncm91bmQtY29sb3JcIjonZ3JleSd9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0LyoqKioqKioqKioqKioqKioqKioqQm91bmRpbmctQm94LUJlaGF2b2lyKioqKioqKioqKioqKioqKioqKioqKlxuXG5cdFRoaXMgaXMgd2hlcmUgQm91bmRpbmcgQm94IEJlaGF2b2lyIGlzIE1hZGUgYXMgd2VsbCBhcyBEeW5hbWljIEJlaGF2b2lyIGluIEdlbmVyYWxcblxuXHQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblx0XHRcdC8vIENoYW5nZSBIZWlnaHQgJiBXaWR0aFxuXHRcdFx0aWYgKHR5cGUgPT0gXCJoZWlnaHRcIiB8fCB0eXBlID09IFwid2lkdGhcIil7XG5cdFx0XHRcdEVkaXRFbGVtZW50KCRiYm94X2FuY2hvcl9ibSxcImhlaWdodFwiLFwieVwiLC0xKTtcblx0XHRcdFx0RWRpdEVsZW1lbnQoJGJib3hfYW5jaG9yX3RtLFwiaGVpZ2h0XCIsXCJ5XCIsKzEpO1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3JfbG0sXCJ3aWR0aFwiLFwieFwiLCsxKTtcblx0XHRcdFx0RWRpdEVsZW1lbnQoJGJib3hfYW5jaG9yX3JtLFwid2lkdGhcIixcInhcIiwtMSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoYW5nZSBFbGVtZW50IE1hcmdpblxuXHRcdFx0aWYgKHR5cGUgPT0gXCJtYXJnaW5cIil7XG5cdFx0XHRcdEVkaXRFbGVtZW50KCRiYm94X2FuY2hvcl9ibSxcIm1hcmdpbi1ib3R0b21cIixcInlcIiwtMSk7XG5cdFx0XHRcdEVkaXRFbGVtZW50KCRiYm94X2FuY2hvcl90bSxcIm1hcmdpbi10b3BcIixcInlcIiwrMSk7XG5cdFx0XHRcdEVkaXRFbGVtZW50KCRiYm94X2FuY2hvcl9sbSxcIm1hcmdpbi1sZWZ0XCIsXCJ4XCIsKzEpO1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3Jfcm0sXCJtYXJnaW4tcmlnaHRcIixcInhcIiwtMSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoYW5nZSBFbGVtZW50IFBhZGRpbmdcblx0XHRcdGlmICh0eXBlID09IFwicGFkZGluZ1wiKSB7XG5cdFx0XHRcdEVkaXRFbGVtZW50KCRiYm94X2FuY2hvcl9ibSxcInBhZGRpbmctYm90dG9tXCIsXCJ5XCIsLTEpO1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3JfdG0sXCJwYWRkaW5nLXRvcFwiLFwieVwiLCsxKTtcblx0XHRcdFx0RWRpdEVsZW1lbnQoJGJib3hfYW5jaG9yX2xtLFwicGFkZGluZy1sZWZ0XCIsXCJ4XCIsKzEpO1xuXHRcdFx0XHRFZGl0RWxlbWVudCgkYmJveF9hbmNob3Jfcm0sXCJwYWRkaW5nLXJpZ2h0XCIsXCJ4XCIsLTEpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEeW5hbWljIEJlaGF2b2lyIFxuXHRcdFx0ZnVuY3Rpb24gRWRpdEVsZW1lbnQoc2VsZWN0ZWRfYW5jaG9yLHNlbGVjdGVkX3Byb3BlcnR5LGF4aXMsZGlyZWN0aW9uKSB7XG5cdFx0XHRcdHNlbGVjdGVkX2FuY2hvci5tb3VzZWRvd24oZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdC8vIFByZXZlbnQgRGVmYXVsdHNcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHQvLyBGaW5kIFNpZGUgVHlwZVxuXHRcdFx0XHRcdHZhciBzZWxlY3RlZF9zaWRlID0gc2VsZWN0ZWRfcHJvcGVydHkuc3BsaXQoXCItXCIpWzFdO1xuXG5cdFx0XHRcdFx0Ly8gRmluZCB3aGF0IG9yZWludGF0aW9uIGlzIG5lZWRlZCBmcm9tIHBhcmVudDogZWl0aGVyIEhlaWdodCBvciBXaWR0aFxuXHRcdFx0XHRcdGlmIChzZWxlY3RlZF9zaWRlID09IFwibGVmdFwiIHx8IHNlbGVjdGVkX3NpZGUgPT0gXCJyaWdodFwiKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGFyZW50c2l6ZSA9ICskZWxlbWVudC5wYXJlbnQoKS53aWR0aCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChzZWxlY3RlZF9zaWRlID09IFwidG9wXCIgfHwgc2VsZWN0ZWRfc2lkZSA9PSBcImJvdHRvbVwiKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGFyZW50c2l6ZSA9ICskZWxlbWVudC5wYXJlbnQoKS5oZWlnaHQoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZpbmQgUHJvcGVydHkncyBJbml0aWFsIFVuaXRcblx0XHRcdFx0XHR2YXIgaW5pdGlhbHVuaXQgPSBmdW5jdGlvbihzZWxlY3RlZF9wcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0dmFyIG4gPSBcIlwiKyAkZWxlbWVudC5jc3NGbG9hdChzZWxlY3RlZF9wcm9wZXJ0eSksXG5cdFx0XHRcdFx0XHRcdGl1ID0gJGVsZW1lbnQuY3NzKHNlbGVjdGVkX3Byb3BlcnR5KS5zcGxpdChuKVsxXTtcblx0XHRcdFx0XHRcdHJldHVybiBpdTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0dmFyICRzaWRldW5pdCA9IGluaXRpYWx1bml0KHNlbGVjdGVkX3Byb3BlcnR5KTtcblxuXG5cdFx0XHRcdFx0Ly8gVG9nZ2xlIE1vdXNlIFBhbmVsXG5cdFx0XHRcdFx0JG1vdXNlcGFuZWwuYWRkKCk7XG5cdFx0XHRcdFx0JG1vdXNlcGFuZWwuc3R5bGUoKTtcblx0XHRcdFx0XHQkbW91c2VwYW5lbC5wb3NpdGlvbihlKTtcblxuXHRcdFx0XHRcdC8vIFNldCBQb3NpdGlvblxuXHRcdFx0XHRcdHZhciBsYXN0X3Bvc2l0aW9uID0gKHt9KTtcblxuXHRcdFx0XHRcdCQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG5cblx0XHRcdFx0XHRcdCRiYm94X2JhY2suY3NzKCdib3JkZXItY29sb3InLCdibHVlJyk7XG5cdFx0XHRcdFx0XHRBbmNob3JzX2Nzcyh7XCJib3JkZXJcIiA6XCJzb2xpZCAxcHggcmdiYSgwLDAsMjU1LDAuOClcIn0pO1xuXG5cdFx0XHRcdFx0XHQvL2NoZWNrIHRvIG1ha2Ugc3VyZSB0aGVyZSBpcyBkYXRhIHRvIGNvbXBhcmUgYWdhaW5zdFxuXHRcdFx0XHRcdFx0aWYgKGxhc3RfcG9zaXRpb24ueCAhPT0gdW5kZWZpbmVkKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU2V0IE1vdXNlIFBhbmVsIFBvc2l0aW9uXG5cdFx0XHRcdFx0XHRcdCRtb3VzZXBhbmVsLnBvc2l0aW9uKGUpO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBjaGFuZ2UgPSBmdW5jdGlvbihzZWxlY3RlZF9wcm9wZXJ0eSxjaGFuZ2VieSkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSWYgdW5pdCBpcyBcInB4XCIgZ28gd2l0aCBkZWZhdWx0XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCR1bml0ID09IFwicHhcIil7dmFyIGkgPSArJGVsZW1lbnQuY3NzSW50KHNlbGVjdGVkX3Byb3BlcnR5KSArIGNoYW5nZWJ5ICsgJHVuaXQ7fVxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSWYgdW5pdCBpcyBcIiVcIiBkbyBjb252ZXJzaW9uXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCR1bml0ID09IFwiJVwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBwID0gKCskZWxlbWVudC5jc3NGbG9hdChzZWxlY3RlZF9wcm9wZXJ0eSkvK3BhcmVudHNpemUpKjEwMDtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBtID0gcGFyc2VJbnQocCwxMCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgaSA9IG0gKyBjaGFuZ2VieSArICR1bml0O1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdC8vIFNldCBNb3VzZSBQYW5lbCBJbmZvXG5cdFx0XHRcdFx0XHRcdFx0JG1vdXNlcGFuZWwuY29udGV4dChzZWxlY3RlZF9wcm9wZXJ0eSArIFwiIDogXCIgKyBpKTtcblx0XHRcdFx0XHRcdFx0XHQvLyBTZXQgTW91c2UgUGFuZWwgQ29sb3Jcblx0XHRcdFx0XHRcdFx0XHQvLyAkbW91c2VwYW5lbC5jb2xvcih0eXBlKTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHQkZWxlbWVudC5jc3Moc2VsZWN0ZWRfcHJvcGVydHksaSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdFx0Ly9nZXQgdGhlIGNoYW5nZSBmcm9tIGxhc3QgcG9zaXRpb24gdG8gdGhpcyBwb3NpdGlvblxuXHRcdFx0XHRcdFx0XHR2YXIgZGVsdGFYID0gbGFzdF9wb3NpdGlvbi54IC0gZS5jbGllbnRYLFxuXHRcdFx0XHRcdFx0XHRcdGRlbHRhWSA9IGxhc3RfcG9zaXRpb24ueSAtIGUuY2xpZW50WTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoYXhpcyA9PT0gXCJ4XCIpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGVsdGFYID4gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFuZ2Uoc2VsZWN0ZWRfcHJvcGVydHksZGlyZWN0aW9uKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRlbHRhWCA8IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2hhbmdlKHNlbGVjdGVkX3Byb3BlcnR5LC1kaXJlY3Rpb24pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmIChheGlzID09PSBcInlcIikge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkZWx0YVkgPiAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdGNoYW5nZShzZWxlY3RlZF9wcm9wZXJ0eSxkaXJlY3Rpb24pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZiAoZGVsdGFZIDwgMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFuZ2Uoc2VsZWN0ZWRfcHJvcGVydHksLWRpcmVjdGlvbik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBVcGRhdGUgRWxlbWVudCdzIFByb3BlcnRpZXNcblx0XHRcdFx0XHRcdHZhciAkZWxlbWVudHByb3BlcnRpZXMgPSB7XG5cdFx0XHRcdFx0XHRcdGVfd2lkdGg6JGVsZW1lbnQuY3NzRmxvYXQoXCJ3aWR0aFwiKSxcblx0XHRcdFx0XHRcdFx0ZV9oZWlnaHQ6JGVsZW1lbnQuY3NzRmxvYXQoXCJoZWlnaHRcIiksXG5cblx0XHRcdFx0XHRcdFx0ZV9tYXJnaW5fdDokZWxlbWVudC5jc3NGbG9hdChcIm1hcmdpbi10b3BcIiksXG5cdFx0XHRcdFx0XHRcdGVfbWFyZ2luX3I6JGVsZW1lbnQuY3NzRmxvYXQoXCJtYXJnaW4tcmlnaHRcIiksXG5cdFx0XHRcdFx0XHRcdGVfbWFyZ2luX2I6JGVsZW1lbnQuY3NzRmxvYXQoXCJtYXJnaW4tYm90dG9tXCIpLFxuXHRcdFx0XHRcdFx0XHRlX21hcmdpbl9sOiRlbGVtZW50LmNzc0Zsb2F0KFwibWFyZ2luLWxlZnRcIiksXG5cblx0XHRcdFx0XHRcdFx0ZV9wYWRkaW5nX3Q6JGVsZW1lbnQuY3NzRmxvYXQoXCJwYWRkaW5nLXRvcFwiKSxcblx0XHRcdFx0XHRcdFx0ZV9wYWRkaW5nX3I6JGVsZW1lbnQuY3NzRmxvYXQoXCJwYWRkaW5nLXJpZ2h0XCIpLFxuXHRcdFx0XHRcdFx0XHRlX3BhZGRpbmdfYjokZWxlbWVudC5jc3NGbG9hdChcInBhZGRpbmctYm90dG9tXCIpLFxuXHRcdFx0XHRcdFx0XHRlX3BhZGRpbmdfbDokZWxlbWVudC5jc3NGbG9hdChcInBhZGRpbmctbGVmdFwiKSxcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXRyaWV2ZSBFbGVtZW50IFBvc2l0aW9uXG5cdFx0XHRcdFx0XHRcdGVfdG9wOiRlbGVtZW50Lm9mZnNldCgpLnRvcCxcblx0XHRcdFx0XHRcdFx0ZV9sZWZ0OiRlbGVtZW50Lm9mZnNldCgpLmxlZnQsXG5cdFx0XHRcdFx0XHRcdGVfcmlnaHQ6JGVsZW1lbnQub2Zmc2V0KCkucmlnaHQsXG5cdFx0XHRcdFx0XHRcdGVfYm90dG9tOiRlbGVtZW50Lm9mZnNldCgpLmJvdHRvbSxcblxuXHRcdFx0XHRcdFx0XHQvLyBcblxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0Ly8gUmVmcmVzaCBBbmNob3IgUG9zaXRpb25zXG5cdFx0XHRcdFx0XHRQb3NpdGlvbkJib3goJGVsZW1lbnRwcm9wZXJ0aWVzKTtcblx0XHRcdFx0XHRcdFBvc2l0aW9uQW5jaG9ycygpO1xuXG5cdFx0XHRcdFx0XHQvLyBzZXQgcG9zaXRpb24gZm9yIG5leHQgdGltZVxuXHRcdFx0XHRcdFx0bGFzdF9wb3NpdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0eCA6IGUuY2xpZW50WCxcblx0XHRcdFx0XHRcdFx0eSA6IGUuY2xpZW50WVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHQkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdFx0Ly8gVW5iaW5kIE1vdXNlTW92ZVxuXHRcdFx0XHRcdFx0JChkb2N1bWVudCkudW5iaW5kKCdtb3VzZW1vdmUnKTtcblx0XHRcdFx0XHRcdC8vIFRvZ2dsZSBNb3VzZSBQYW5lbFxuXHRcdFx0XHRcdFx0JG1vdXNlcGFuZWwucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHQvLyBSZXNldCBCQm94IFN0eWxlXG5cdFx0XHRcdFx0XHQkYmJveF9iYWNrLmNzcygnYm9yZGVyLWNvbG9yJywnIzMzMycpO1xuXHRcdFx0XHRcdFx0QW5jaG9yc19jc3Moe1wiYm9yZGVyXCIgOlwic29saWQgMXB4IHJnYmEoMzMsMzMsMzMsMC44KVwifSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRcbn0pICgpO1xuXG5cbiIsInZhciBzdHlsZXMgPSByZXF1aXJlKCcuL3N0eWxlcycpO1xuXG5mdW5jdGlvbiBfcmVhZChpbnB1dCkge1xuXG5cdEFycmF5LnNsaWNlKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihjYikge1xuXHRcdGlmKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRjYihpbnB1dCwgX3JlYWN0KVxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGNiLnJlYWQgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0Y2IucmVhZChpbnB1dCwgX3JlYWN0KVxuXHRcdH1cblx0fSlcblxufVxuXG4vLyBBZ2FpbiBGb3IgTm93IEZvciBFdmVyeXRoaW5nIEVsc2UgV2UgU2ltcGx5IFJlc3BvbmQgV2l0aCBhIFwiTm9wZVwiIEFuaW1hdGlvblxuLy8gRnV0dXJlIFZlcnNpb25zIHNob3VsZCBoYXZlIGEgbW9yZSB3aWRlIHJhbmdlIG9mIHJlc3BvbnNlc1xuZnVuY3Rpb24gX3JlYWN0KGVycikge1xuXHRpZiAoZXJyKXtcblx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0JChcIiN0d3lnX2NvbnNvbGVcIilcblx0XHRcdC5hbmltYXRlKHsnbGVmdCc6JzEwcHgnfSwgNzApXG5cdFx0XHQuYW5pbWF0ZSh7J2xlZnQnOiczMHB4J30sIDcwKVxuXHRcdFx0LmFuaW1hdGUoeydsZWZ0JzonMjBweCd9LCA3MCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gX3Nob3coKSB7XG5cdCQoXCJib2R5XCIpXG5cdFx0LnByZXBlbmQoJzxkaXYgaWQ9XCJ0d3lnXCI+PC9kaXY+Jylcblx0XHQuY3NzKCdwb3NpdGlvbicsJ3JlbGF0aXZlJyk7XG5cdCQoXCIjdHd5Z1wiKVxuXHRcdC5wcmVwZW5kKCc8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInR3eWdfY29uc29sZVwiPjwvaW5wdXQ+Jyk7XG5cdCQoXCIjdHd5Z19jb25zb2xlXCIpLmNzcyhzdHlsZXMuY29uc29sZSlcblx0JCgnI3R3eWdfY29uc29sZScpLnRvZ2dsZSgpO1xufTtcblxuZnVuY3Rpb24gX3RvZ2dsZSgpIHtcblx0dmFyIHRleHRfaW5wdXQgPSAkKCcjdHd5Z19jb25zb2xlJyk7XG5cdHRleHRfaW5wdXQudG9nZ2xlKCk7XG5cdHRleHRfaW5wdXQuZm9jdXMgKCk7XG5cdHRleHRfaW5wdXQuc2VsZWN0ICgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c2hvdzogX3Nob3csXG5cdHRvZ2dsZTogX3RvZ2dsZSxcblx0cmVhZDogX3JlYWRcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuXHRhZGQ6ZnVuY3Rpb24oKSB7XG5cdFx0JChcIiN0d3lnXCIpLnByZXBlbmQoJzxkaXYgaWQ9XCJtb3VzZXBhbmVsXCI+PC9kaXY+Jyk7XG5cdH0sXG5cdHJlbW92ZTpmdW5jdGlvbigpIHtcblx0XHQkKFwiI21vdXNlcGFuZWxcIikucmVtb3ZlKCk7XG5cdH0sXG5cdHN0eWxlOmZ1bmN0aW9uKCkge1xuXHRcdCQoXCIjbW91c2VwYW5lbFwiKS5jc3Moe1xuXHRcdFx0XCJ3aWR0aFwiOlwiYXV0b1wiLFxuXHRcdFx0XCJoZWlnaHRcIjpcIjE1cHhcIixcblx0XHRcdFwibWFyZ2luXCI6XCIwcHhcIixcblx0XHRcdFwicGFkZGluZ1wiOlwiNHB4IDdweFwiLFxuXHRcdFx0XCJiYWNrZ3JvdW5kLWNvbG9yXCI6XCIjOTk5XCIsXG5cdFx0XHRcImNvbG9yXCI6XCIjMDAwXCIsXG5cdFx0XHRcImZvbnQtc2l6ZVwiOlwiMTJweFwiLFxuXHRcdFx0XCJmb250LWZhbWlseVwiOlwibW9ub3NwYWNlXCIsXG5cdFx0XHRcImJvcmRlci1yYWRpdXNcIjpcIjJweFwiXG5cdFx0fSk7XG5cdH0sXG5cdGNvbG9yOmZ1bmN0aW9uKHR5cGUpIHtcblx0XHRpZiAodHlwZSA9PSBcIm1hcmdpblwiKSB7JChcIiNtb3VzZXBhbmVsXCIpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsXCJ5ZWxsb3dcIik7fVxuXHRcdGlmICh0eXBlID09IFwicGFkZGluZ1wiKSB7JChcIiNtb3VzZXBhbmVsXCIpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsXCJyZWRcIik7fVxuXHR9LFxuXHRwb3NpdGlvbjpmdW5jdGlvbihlKSB7XG5cdFx0JChcIiNtb3VzZXBhbmVsXCIpLmNzcyh7XG5cdFx0XHRcInBvc2l0aW9uXCI6XCJhYnNvbHV0ZVwiLFxuXHRcdFx0XCJsZWZ0XCI6K2UuY2xpZW50WCArMTUgKyBcInB4XCIsXG5cdFx0XHRcInRvcFwiOitlLmNsaWVudFkgKyBcInB4XCIsXG5cdFx0fSk7XG5cdH0sXG5cblx0Y29udGV4dDpmdW5jdGlvbihpbmZvKSB7XG5cdFx0JChcIiNtb3VzZXBhbmVsXCIpLnRleHQoaW5mbyk7XG5cdH0sXG59OyIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJjb25zb2xlXCI6e1xuXHRcdFwid2lkdGhcIjpcIjQwJVwiLFxuXHRcdFwiaGVpZ2h0XCI6XCJhdXRvXCIsXG5cdFx0XCJiYWNrZ3JvdW5kLWNvbG9yXCI6XCJyZ2JhKDIwMCwyMDAsMjAwLDAuOClcIixcblx0XHRcInBhZGRpbmdcIjpcIjIwcHhcIixcblx0XHRcImNvbG9yXCI6XCIjMzMzXCIsXG5cdFx0XCJmb250LXNpemVcIjpcIjJlbVwiLFxuXHRcdFwiZm9udC1mYW1pbHlcIjpcInNhbnMtc2VyaWZcIixcblx0XHRcInBvc2l0aW9uXCI6XCJmaXhlZFwiLFxuXHRcdFwiei1pbmRleFwiOlwiMTAwMFwiLFxuXHRcdFwidG9wXCI6XCIyMHB4XCIsXG5cdFx0XCJsZWZ0XCI6XCIyMHB4XCIsXG5cdFx0XCJib3JkZXJcIjpcIm5vbmVcIlxuXHR9LFxuXHRcInRvb2xzXCI6IHtcblx0XHRcImJib3hcIjoge1xuXHRcdFx0XCJhbmNob3JzXCI6IHtcblx0XHRcdFx0XCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIixcblx0XHRcdFx0XCJ3aWR0aFwiOiBcIjZweFwiLFxuXHRcdFx0XHRcImhlaWdodFwiOlwiNnB4XCIsXG5cdFx0XHRcdFwiYmFja2dyb3VuZC1jb2xvclwiOlwiI2ZmZlwiLFxuXHRcdFx0XHRcImJvcmRlclwiOlwic29saWQgMXB4IHJnYmEoMzMsMzMsMzMsMC44KVwiXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInJ1bGVyXCI6IHtcblx0XHRcdFwicG9zaXRpb25cIjpcImFic29sdXRlXCIsXG5cdFx0XHRcImJhY2tncm91bmQtY29sb3JcIjpcIiNmMDBcIixcblx0XHRcdFwiYm9yZGVyXCI6XCJzb2xpZCAxcHggI2VlZVwiLFxuXHRcdFx0XCJoZWlnaHRcIjpcIjFweFwiXG5cdFx0fVxuXHR9XG59IiwiZnVuY3Rpb24gYmJveFJlYWQoaW5wdXQsIGRvbmUpIHtcblx0Ly8gQm91bmRpbmcgQm94IFBhcnNlXG5cdGlmIChcblx0XHQvLyBBIFByb3BlcnR5IGlzIERlZmluZWQgYW5kLi4uXG5cdFx0aW5wdXQuaW5kZXhPZihcIntcIikgIT0gLTEgXG5cdFx0Ly9JZiB0aGVyZSBpcyBvbmx5IDEgcHJvcGVydHlcblx0XHQmJiBpbnB1dC5zcGxpdChcIntcIikubGVuZ3RoIDw9IDJcblx0XHQvL0lmIHRoZXJlIG5vIG1vcmUgdGhhbiAxIHVuaXQgdHlwZVxuXHRcdCYmIGlucHV0LnNwbGl0KFwiL1wiKS5sZW5ndGggPD0gMiBcblx0XHQvL0lmIHRoZSBwcm9wZXJ0eSBpcyB2YWxpZCAoZnV0dXJlIHZlcnNpb25zIHNob3VsZCBoYXZlIGEgdmFsaWRhdG9yIC0gZm9yIG5vdyBpdCdzIGp1c3QgdHJ1ZSlcblx0XHQmJiB0cnVlKSB7XG5cdFx0XHQvLyBFbGVtZW50IElucHV0IGZvciBKcXVlcnkgUGFyc2luZ1xuXHRcdFx0dmFyIGVfaW5wdXQgPSBpbnB1dC5zcGxpdChcIntcIilbMF07XG5cdFx0XHQvLyBQcm9wZXJ0eSBJbnB1dCBmb3IgVHd5ZyBFZGl0aW5nXG5cdFx0XHR2YXIgcF9pbnB1dCA9IGlucHV0LnNwbGl0KFwie1wiKVsxXS5zcGxpdChcIi9cIilbMF07XG5cdFx0XHQvLyBQcm9wZXJ0eSBVbml0IGlmIEluY2x1ZGVkXG5cdFx0XHR2YXIgdV9pbnB1dCA9IGlucHV0LnNwbGl0KFwiL1wiKVsxXTtcblx0XHRcdFxuXHRcdFx0Ly8gTGV0J3MgQWxzbyBIaWRlIHRoZSBUd3lnIENvbnNvbGVcblx0XHRcdCQoJyN0d3lnX2NvbnNvbGUnKS50b2dnbGUoKTtcblxuXHRcdFx0Ly8gQW5kIFBhc3MgdGhlIEVsZW1lbnQgSW5wdXQgJiBQcm9wZXJ0eSBJbnB1dCB0byB0aGUgVHd5ZyBFZGl0b3Jcblx0XHRcdC8vIHJldHVybiBUd3lnX2JvdW5kKGVfaW5wdXQscF9pbnB1dCx1X2lucHV0KTtcblxuXHR9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWFkOiBiYm94UmVhZFxufSIsInZhciBzdHlsZXMgPSByZXF1aXJlKCcuLi9zdHlsZXMuanNvbicpO1xudmFyIG1vdXNlcGFuZWwgPSByZXF1aXJlKCcuLi9tb3VzZXBhbmVsJyk7XG5cbmZ1bmN0aW9uIF9yZWFkIChpbnB1dCwgZG9uZSkge1xuXHRpZiAoaW5wdXQgPT0gXCJydWxlclwiIHx8IGlucHV0ID09IFwiUnVsZXJcIikge1xuXHRcdC8vIEhpZGUgQ29uc29sZVxuXHRcdCQoJyN0d3lnX2NvbnNvbGUnKS50b2dnbGUoKTtcblx0XHRfd2F0Y2goZG9uZSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gX3dhdGNoKGRvbmUpIHtcblx0JChkb2N1bWVudCkubW91c2Vkb3duKGZ1bmN0aW9uKGUpIHtcblx0XHQvLyBQcmV2ZW50IERlZmF1bHRzXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Ly8gQ3JlYXRlIFJ1bGVyXG5cdFx0JCgnI3R3eWcnKS5hcHBlbmQoJzxkaXYgaWQ9XCJ0d3lnX3J1bGVyXCI+PC9kaXY+Jyk7XG5cdFx0JHJ1bGVyID0gJCgnI3R3eWdfcnVsZXInKTtcblxuXHRcdC8vIFN0eWxlIFJ1bGVyXG5cdFx0JChcIiN0d3lnX3J1bGVyXCIpLmNzcyhzdHlsZXMudG9vbHMucnVsZXIpXG5cblx0XHQvLyBUb2dnbGUgTW91c2UgUGFuZWxcblx0XHRtb3VzZXBhbmVsLmFkZCgpO1xuXHRcdG1vdXNlcGFuZWwuc3R5bGUoKTtcblx0XHRtb3VzZXBhbmVsLnBvc2l0aW9uKGUpO1xuXG5cdFx0Ly8gU2V0IFN0YXJ0IFBvaW50XG5cdFx0dmFyIHN0YXJ0X3ggPSBlLnBhZ2VYLFxuXHRcdFx0c3RhcnRfeSA9IGUucGFnZVk7XG5cblx0XHQvLyBTZXQgUnVsZXIgRmlyc3QgUG9zaXRpb25cblx0XHQkcnVsZXIuY3NzKHtcImxlZnRcIjpzdGFydF94LFwidG9wXCI6c3RhcnRfeX0pO1xuXG5cdFx0JChkb2N1bWVudCkubW91c2Vtb3ZlKGZ1bmN0aW9uKGUpIHtcdFxuXG5cdFx0XHQvLyBQb3NpdGlvbiBNb3VzZVBhbmVsXG5cdFx0XHRtb3VzZXBhbmVsLnBvc2l0aW9uKGUpO1xuXG5cdFx0XHQvLyBTZXQgRW5kIFBvaW50XG5cdFx0XHR2YXIgZW5kX3ggPSBlLnBhZ2VYLFxuXHRcdFx0XHRlbmRfeSA9IGUucGFnZVk7XG5cblx0XHRcdC8vIFNldCBEaWZmZXJlbmNlXG5cdFx0XHR2YXIgY2hhbmdlX3ggPSBlbmRfeCAtIHN0YXJ0X3gsXG5cdFx0XHRcdGNoYW5nZV95ID0gZW5kX3kgLSBzdGFydF95O1xuXHRcdFx0XG5cdFx0XHR2YXIgc3F1YXJlZF94ID0gY2hhbmdlX3gqY2hhbmdlX3gsXG5cdFx0XHRcdHNxdWFyZWRfeSA9IGNoYW5nZV95KmNoYW5nZV95O1xuXG5cdFx0XHQvLyBTZXQgcnVsZXIgTGVuZ3RoXG5cdFx0XHR2YXIgcnVsZXJfbGVuZ3RoID0gTWF0aC5zcXJ0KHNxdWFyZWRfeCArIHNxdWFyZWRfeSk7XG5cblx0XHRcdC8vIFNldCBSdWxlciBBbmdsZVxuXHRcdFx0dmFyIHJ1bGVyX2FuZ2xlID0gTWF0aC5hdGFuKGNoYW5nZV95L2NoYW5nZV94KTtcblxuXHRcdFx0JHJ1bGVyLmNzcyhcIndpZHRoXCIscnVsZXJfbGVuZ3RoICsgXCJweFwiKTtcblx0XHRcdCRydWxlci5yb3RhdGUocnVsZXJfYW5nbGUpO1xuXG5cdFx0XHRtb3VzZXBhbmVsLmNvbnRleHQocnVsZXJfbGVuZ3RoICsgXCJweFwiKTtcblx0XHRcblx0XHR9KTtcblxuXHRcdCQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSl7XG5cdFx0XHQvLyBVbmJpbmQgTW91c2VNb3ZlXG5cdFx0XHQkKGRvY3VtZW50KS51bmJpbmQoJ21vdXNlbW92ZScpO1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0d3lnX3J1bGVyXCIpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoXCJ0d3lnX3J1bGVyXCIpO1xuXHRcdFx0Ly8gVG9nZ2xlIE1vdXNlIFBhbmVsXG5cdFx0XHRtb3VzZXBhbmVsLnJlbW92ZSgpO1xuXHRcdFx0ZG9uZSgpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IF9yZWFkXG59XG4iXX0=
