/*!
 * Twyg.js - Tweak What You Get | CSS Editor
 * v0.0.2
 *
 * Copyright 2014, Jacob Payne and other contributors
 * Released under the MIT license
 *
 * Date: 2014-02-04
 */


// ******* Styling ******* //

// Console Style

var $console_styles = {
	'width':'40%',
	'height':'auto',
	'background-color':'rgba(200,200,200,0.8)',
	'padding':'20px',
	'color':'#333',
	'font-size':'2em',
	'font-family':'sans-serif',
	'position':'fixed',
	'z-index':'1000',
	'top':'20px',
	'left':'20px',
	'border':'none'
};

// Border Box Style + Anchor Style

var $bbox_anchor_styles = {
	"position":"absolute",
	"width": "6px",
	"height":"6px",
	"background-color":"#fff",
	"border":"solid 1px rgba(33,33,33,0.8)"
};

function style_console() {$("#twyg_console").css($console_styles);}
function style_anchors() {$("#twyg_bbox").css($bbox_anchor_styles);}

// Adding Twyg to the Body

var Twyg_show = function() {
	$("body")
		.prepend('<div id="twyg"></div>')
		.css('position','relative');
	$("#twyg")
		.prepend('<input type="text" id="twyg_console"></input>');
	style_console();
	$('#twyg_console').toggle();
};

// Create Twyg Console On Page Load
window.onLoad = Twyg_show();

// Toggle/Hide Twyg Console

var Twyg_toggle = function() {
	var text_input = $('#twyg_console');
	text_input.toggle();
	text_input.focus ();
	text_input.select ();
};

// Using Mousetrap.js let's Bind the view of the Twyg Console to the Keystroke Capital "T"
Mousetrap.bind('P',function () { Twyg_toggle(); });

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
	Twyg_parse(Twyg_input);
  }
});

/********************Parse-Console-Input************************

Parse the Contents of the Input
See if the Input is Valid, If the Property is Valid, If the Element is Given
Then Pass the element to the Bounding-Box-Maker Function

****************************************************************/

function Twyg_parse(input) {

	if (
		// A Property is Defined and...
		input.indexOf("{") != -1 
		//If there is only 1 property
		&& input.split("{").length <= 2
		//If there no more than 1 unit type
		&& input.split("/").length <= 2 
		//If the property is valid (future versions should have a validator - for now it's just true)
		&& true) {
			// Since Jquery cannot parse properties we split the input accordingly
			// Element Input for Jquery Parsing
			var e_input = input.split("{")[0];
			// Property Input for Twyg Editing
			var p_input = input.split("{")[1].split("/")[0];
			// Property Unit if Included
			var u_input = input.split("/")[1];
			
			// Let's Also Hide the Twyg Console
			$('#twyg_console').toggle();

			// And Pass the Element Input & Property Input to the Twyg Editor
			return Twyg_bound(e_input,p_input,u_input);

	}

	// Again For Now For Everything Else We Simply Respond With a "Nope" Animation
	// Future Versions should have a more wide range of responses
	else {
		$("#twyg_console")
			.animate({'left':'10px'},70)
			.animate({'left':'30px'},70)
			.animate({'left':'20px'},70);
	}
}


/********************Bounding-Box-Creation**********************

This is where we start Bound-Boxing the Element based on the Given Property

****************************************************************/


function Twyg_bound(e_input,p_input,u_input) {

	var $element = $(""+e_input+"");
	var $property = p_input;
	var $unit = u_input;

	// Retrieve Element Properties

	var $elementproperties = {
		e_width:$element.css("width").split("px")[0],
		e_height:$element.css("height").split("px")[0],

		e_margin_t:$element.css("margin-top").split("px")[0],
		e_margin_r:$element.css("margin-right").split("px")[0],
		e_margin_b:$element.css("margin-bottom").split("px")[0],
		e_margin_l:$element.css("margin-left").split("px")[0],

		e_padding_t:$element.css("padding-top").split("px")[0],
		e_padding_r:$element.css("padding-right").split("px")[0],
		e_padding_b:$element.css("padding-bottom").split("px")[0],
		e_padding_l:$element.css("padding-left").split("px")[0],

		// Retrieve Element Position
		e_top:$element.offset().top,
		e_left:$element.offset().left,
		e_right:$element.offset().right,
		e_bottom:$element.offset().bottom,
	};


	// Here we start picking out what the Property actually is and what Bounding Boxes we show
	// The Responses will return appropriate Bounding Box Functions which allow to edit the element with the mouse

	// Height and Width Properties
	if ($property == "height") {bbox_chng_height();}
	if ($property == "width") {bbox_chng_width();}

	// Margin Property
	if ($property == "margin") {bbox_chng_margin("all");}
	if ($property == "margin-left") {bbox_chng_margin("left");}
	if ($property == "margin-right") {bbox_chng_margin("right");}
	if ($property == "margin-bottom") {bbox_chng_margin("bottom");}
	if ($property == "margin-top") {bbox_chng_margin("top");}

	// Padding Property
	if ($property == "padding") {bbox_chng_padding("all");}
	if ($property == "padding-left") {bbox_chng_padding("left");}
	if ($property == "padding-right") {bbox_chng_padding("right");}
	if ($property == "padding-bottom") {bbox_chng_padding("bottom");}
	if ($property == "padding-top") {bbox_chng_padding("top");}
	
	// Letter/Font Properties
	if ($property == "font-size") {bbox_chng_fontsize();}
	if ($property == "word-spacing") {bbox_chng_wordspacing();}
	if ($property == "letter-spacing") {bbox_chng_letterspacing();}


	// Bounding Box Functions
	// Margin Bounding Box
	function bbox_chng_margin(side) {

		// Scaffold Back of the BBox within the Twyg Div
		$element.prepend('<div id="twyg_bbox"></div>');

		var $bbox_back = $('#twyg_bbox');

		function PositionBbox(elementproperties) {
			$bbox_back.css({
				"box-sizing":"border-box",
				"position":"absolute",
				"margin":"0px",
				"margin-left":-elementproperties.e_margin_l+"px",
				"margin-top":-elementproperties.e_margin_t+"px",
				"width": (+elementproperties.e_width + +elementproperties.e_margin_r + +elementproperties.e_margin_l + +elementproperties.e_padding_l + +elementproperties.e_padding_r) + "px",
				"height":(+elementproperties.e_height + +elementproperties.e_margin_t + +elementproperties.e_margin_b + +elementproperties.e_padding_t + +elementproperties.e_padding_b) + "px",
				"border":"solid 1px rgba(33,33,33,0.1)"
			});
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
		Anchors_css($bbox_anchor_styles);

		// Position the Anchors

		PositionAnchors($elementproperties);

		function PositionAnchors(elementproperties) {

			var bbox_width = (+elementproperties.e_width + +elementproperties.e_margin_r + +elementproperties.e_margin_l + +elementproperties.e_padding_l + +elementproperties.e_padding_r);
			var bbox_height = (+elementproperties.e_height + +elementproperties.e_margin_t + +elementproperties.e_margin_b + +elementproperties.e_padding_t + +elementproperties.e_padding_b);

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

		// Bbox Dynamic Behavoir 

		EditElement($bbox_anchor_bm,"margin-bottom");
		EditElement($bbox_anchor_tm,"margin-top");
		EditElement($bbox_anchor_lm,"margin-left");
		EditElement($bbox_anchor_rm,"margin-right");

		function EditElement(selected_anchor,selected_property) {
			selected_anchor.mousedown(function(e) {
				e.preventDefault();
				$bbox_back.css('border-color','blue');
				Anchors_css({"border" :"solid 1px rgba(0,0,255,0.8)"});
				var last_position = ({});

				$(document).mousemove(function(e) {
					//check to make sure there is data to compare against
					if (last_position.x !== undefined) {

						var change = function(selected_property,changeby) {
							var i = +$element.css(selected_property).split("px")[0] + changeby + "px";
							$element.css(selected_property,i);
						};

						//get the change from last position to this position
						var deltaX = last_position.x - e.clientX,
							deltaY = last_position.y - e.clientY;

						if (deltaY >= 0){
							if (selected_property == "margin-bottom") {
								change("margin-bottom",-1);
							}

							if (selected_property == "margin-top") {
								change("margin-top",+1);
							}

						}

						if (deltaY < 0){
							if (selected_property == "margin-bottom") {
								change("margin-bottom",+1);
							}
							if (selected_property == "margin-top") {
								change("margin-top",-1);
							}
						}

						if (deltaX >= 0){
							if (selected_property == "margin-right") {
								change("margin-right",-1);
							}

							if (selected_property == "margin-left") {
								change("margin-left",+1);
							}

						}

						if (deltaX < 0){
							if (selected_property == "margin-right") {
								change("margin-right",+1);
							}
							if (selected_property == "margin-left") {
								change("margin-left",-1);
							}
						}
						
					}

					// Update Element's Properties
					var $elementproperties = {
						e_width:$element.css("width").split("px")[0],
						e_height:$element.css("height").split("px")[0],

						e_margin_t:$element.css("margin-top").split("px")[0],
						e_margin_r:$element.css("margin-right").split("px")[0],
						e_margin_b:$element.css("margin-bottom").split("px")[0],
						e_margin_l:$element.css("margin-left").split("px")[0],

						e_padding_t:$element.css("padding-top").split("px")[0],
						e_padding_r:$element.css("padding-right").split("px")[0],
						e_padding_b:$element.css("padding-bottom").split("px")[0],
						e_padding_l:$element.css("padding-left").split("px")[0],

						// Retrieve Element Position
						e_top:$element.offset().top,
						e_left:$element.offset().left,
						e_right:$element.offset().right,
						e_bottom:$element.offset().bottom,
					};

					// Refresh Anchor Positions
					PositionBbox($elementproperties);
					PositionAnchors($elementproperties);

					// set position for next time
					last_position = {
						x : e.clientX,
						y : e.clientY
					};

					
				});

				$(document).mouseup(function(e){
					$(document).unbind('mousemove');
					$bbox_back.css('border-color','#333');
					Anchors_css({"border" :"solid 1px rgba(33,33,33,0.8)"});
				});
			});
		}

	}
	

}


