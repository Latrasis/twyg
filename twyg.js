/*!
 * Twyg.js - Tweak What You Get | CSS Editor
 * N/A
 *
 * Copyright 2014, Jacob Payne and other contributors
 * Released under the MIT license
 *
 * Date: 2014-01-29
 */


// ******* Styling ******* //

// Console Style
function style_console() {
	$("#twyg").css({
		'width':'40%',
		'height':'auto',
		'background-color':'rgba(200,200,200,0.8)',
		'padding':'20px',
		'color':'#333',
		'font-size':'2em',
		'font-family':'sans-serif',
		'position':'absolute',
		'z-index':'1000',
		'top':'20px',
		'left':'20px',
		'border':'none'
	});
}

var Twyg_show = function() {
	$("body")
		.prepend('<input type="text" id="twyg"></input>')
		.css('position','relative');
	style_console();
	$('#twyg').toggle();
}

// Create Twyg Console On Page Load
window.onLoad = Twyg_show();

// Toggle/Hide Twyg Console

var Twyg_toggle = function() {
	var text_input = $('#twyg');
	text_input.toggle();
	text_input.focus ();
	text_input.select ();
}

// Using Mousetrap.js let's Bind the view of the Twyg Console to the Keystroke Capital "T"
Mousetrap.bind('P',function () { Twyg_toggle(); });

// Actions on What to do on Pressing either "Enter" or "Esc"

$("body").keypress(function(e) {
	// By Pressing "Esc" the Console is Toggled if Visible
	// If the Console is not visible though any Bounding Boxes are Removed
	if (e.keyCode == 27) {
		if ($('#twyg').is(':hidden')) {$("#twyg_bbox").remove()};
		if ($('#twyg').is(':visible')) {$("#twyg").toggle()};
	};
});

$("#twyg").keypress(function (e) {
	var Twyg_input = $("#twyg").val();
// By Pressing "Enter" the Field Content is Passed to the Parsing Function
  if (e.which == 13) {
    $("#twyg").submit();
    // If a Bounding Box already Exists we delete it
    if ($("#twyg_bbox").length > 0) { $("#twyg_bbox").remove();} 
    Twyg_parse(Twyg_input);
  }
});


// Parse the Contents of the Input
// See if a property is given to change or not

function Twyg_parse(input) {

	if (
		// A Property is Defined and...
		input.indexOf("{") != -1 
		// ...there is only 1 property
		&& input.split("{").length <= 2 
		// ...there no more than 1 unit type
		&& input.split("/").length <= 2 
		// ...the property is valid (future versions should have a validator - for now it's just true)
		&& true) {
			// Since Jquery cannot parse properties we split the input accordingly
			// Element Input for Jquery Parsing
			var e_input = input.split("{")[0];
			// Property Input for Twyg Editing
			var p_input = input.split("{")[1].split("/")[0];
			// Property Unit if Included
			var u_input = input.split("/")[1];
			
			// Let's Also Hide the Twyg Console
			$('#twyg').toggle();

			// And Pass the Element Input & Property Input to the Twyg Editor
			return Twyg_bound(e_input,p_input,u_input);

	}

	// Again For Now For Everything Else We Simply Respond With a "Nope" Animation
	// Future Versions should have a more wide range of responses
	else {
		$("#twyg")
			.animate({'left':'10px'},70)
			.animate({'left':'30px'},70)
			.animate({'left':'20px'},70);
	}
}

// This is where we start Initiating the Element with the Given Property
function Twyg_bound(e_input,p_input,u_input) {

	var $element = $(""+e_input+"");
	var $property = p_input;
	var $unit = u_input;

	// Retrieve Element Properties
	var $p_width = $element.css("width").split("px")[0];
	var $p_height = $element.css("height").split("px")[0];
	var $p_margin_t = $element.css("margin-top").split("px")[0];
	var $p_margin_r = $element.css("margin-right").split("px")[0];
	var $p_margin_b = $element.css("margin-bottom").split("px")[0];
	var $p_margin_l = $element.css("margin-left").split("px")[0];

	// Here we start picking out what the Property actually is and what Bounding Boxes we show
	// The Responses will return appropriate Bounding Box Functions which allow to edit the element with the mouse

	// Margin Property
	if ($property == "margin") {bbox_margin("all")}
	if ($property == "margin-left") {bbox_margin("left");}
	if ($property == "margin-right") {bbox_margin("right");}
	if ($property == "margin-bottom") {bbox_margin("bottom");}
	if ($property == "margin-top") {bbox_margin("top");}

	// Padding Property
	if ($property == "padding") {bbox_padding("all")}
	if ($property == "padding-left") {bbox_padding("left");}
	if ($property == "padding-right") {bbox_padding("right");}
	if ($property == "padding-bottom") {bbox_padding("bottom");}
	if ($property == "padding-top") {bbox_padding("top");}

	// Height and Width Properties
	if ($property == "height") {bbox_height();}
	if ($property == "width") {bbox_width();}

	// Letter/Font Properties
	if ($property == "font-size") {bbox_fontsize();}
	if ($property == "word-spacing") {bbox_wordspacing();}
	if ($property == "letter-spacing") {bbox_letterspacing();}


	// Bounding Box Functions
	// Margin Bounding Box
	function bbox_margin(side) {

		// Scaffold Back of the BBox

		$element.prepend('<div id="twyg_bbox"></div>');
		$element.css({'position':'relative'});

		var $bbox_back = $('#twyg_bbox');
		$bbox_back.css({
			"box-sizing":"border-box",
			"position":"absolute",

			"margin":"0px",
			"margin-left": -$p_margin_l + "px",
			"margin-top": -$p_margin_t + "px",
			"width": (+$p_width + +$p_margin_r + +$p_margin_l) + "px",
			"height":(+$p_height + +$p_margin_t + +$p_margin_b) + "px",
			"border":"solid 1px rgba(33,33,33,0.1)"
		});

		// Add Box Anchors

		// Insert Top Left "tl" Anchor
		$bbox_back.append('<div id="twyg_bbox_anch_tl" class=twyg_bbox_anch"></div>');
		var $bbox_anchor_tl = $('#twyg_bbox_anch_tl');

		// Insert Top Middle "tm" Anchor
		$bbox_back.append('<div id="twyg_bbox_anch_tm" class=twyg_bbox_anch"></div>');
		var $bbox_anchor_tm = $('#twyg_bbox_anch_tm');

		// Insert Top Right "tr" Anchor
		$bbox_back.append('<div id="twyg_bbox_anch_tr" class=twyg_bbox_anch"></div>');
		var $bbox_anchor_tr = $('#twyg_bbox_anch_tr');

		// Insert Right Middle "rm" Anchor
		$bbox_back.append('<div id="twyg_bbox_anch_rm" class=twyg_bbox_anch"></div>');
		var $bbox_anchor_rm = $('#twyg_bbox_anch_rm');

		// Insert Left Middle "lm" Anchor
		$bbox_back.append('<div id="twyg_bbox_anch_lm" class=twyg_bbox_anch"></div>');
		var $bbox_anchor_lm = $('#twyg_bbox_anch_lm');

		// Insert Bottom Left "br" Anchor
		$bbox_back.append('<div id="twyg_bbox_anch_br" class=twyg_bbox_anch"></div>');
		var $bbox_anchor_br = $('#twyg_bbox_anch_br');

		// Insert Bottom Middle "bm" Anchor
		$bbox_back.append('<div id="twyg_bbox_anch_bm" class=twyg_bbox_anch"></div>');
		var $bbox_anchor_bm = $('#twyg_bbox_anch_bm');

		// Insert Bottom Right "bl" Anchor
		$bbox_back.append('<div id="twyg_bbox_anch_bl" class=twyg_bbox_anch"></div>');
		var $bbox_anchor_bl = $('#twyg_bbox_anch_bl');

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
		var $bbox_anchor_styles = {
			"position":"absolute",
			"width": "6px",
			"height":"6px",
			"background-color":"#fff",
			"border":"solid 1px rgba(33,33,33,0.8)"
		}

		Anchors_css($bbox_anchor_styles);

		// Position the Anchors

		var totalwidth = (+$p_width + +$p_margin_r + +$p_margin_l);
		var totalheight = (+$p_height + +$p_margin_t + +$p_margin_b);

		// Position Top Left "tl" Anchor
		$bbox_anchor_tl.css({
			"left":"-3"+"px",
			"top":"-3"+"px",
		});

		// Position Top Middle "tm" Anchor
		$bbox_anchor_tm.css({
			"left":totalwidth*0.5 + -"6"+"px",
			"top":"-3"+"px",
		});

		// Position Top Right "tr" Anchor
		$bbox_anchor_tr.css({
			"left":totalwidth + -"6"+"px",
			"top":"-3"+"px",
		});

		// Position Right Middle "rm" Anchor
		$bbox_anchor_rm.css({
			"left":totalwidth + -"6"+"px",
			"top":totalheight*0.5+ -"6" +"px",
		});

		// Position Left Middle "lm" Anchor
		$bbox_anchor_lm.css({
			"left":"-3"+"px",
			"top":totalheight*0.5+ -"6" +"px",
		});

		// Position Bottom Right "br" Anchor
		$bbox_anchor_br.css({
			"left":totalwidth + -"6"+"px",
			"top":totalheight+ -"6" +"px",
		});

		// Position Bottom Middle "bm" Anchor
		$bbox_anchor_bm.css({
			"left":totalwidth*0.5 + -"6"+"px",
			"top":totalheight+ -"6" +"px",
		});

		// Position Bottom Left "bl" Anchor
		$bbox_anchor_bl.css({
			"left":"-3"+"px",
			"top":totalheight+ -"6" +"px",
		});


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

		// Margin Bbox Dynamic Behavoir (Fun Part)
		$bbox_anchor_bm
			.mousedown(function() {
			    $(document).mousemove(function(e) {
			        $element.css("height",e.PageY+2);
			    });
			});
		$(document).mouseup(function(e){
	       	$(document).unbind('mousemove');
       	});



	}
	

}


