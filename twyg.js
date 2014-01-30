/*!
 * Twyg.js - Tweak What You Get | CSS Editor
 * N/A
 *
 * Copyright 2014, Jacob Payne and other contributors
 * Released under the MIT license
 *
 * Date: 2014-01-29
 */

// Define Twyg Console
var Twyg_show = function() {
	$("body")
		.prepend('<input type="text" id="twyg"></input>')
		.css('position','relative');

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

// Actions on What to do on Pressing either "Enter" or "Esc"

$("#twyg").keypress(function (e) {
	var Twyg_input = $("#twyg").val();
// By Pressing "Enter" the Field Content is Passed to the Parsing Function
  if (e.which == 13) {
    $("#twyg").submit();
    Twyg_parse(Twyg_input);
  }
// By Pressing "Esc" the Twyg Console is Hidden
  if (e.keyCode == 27) {
  	$('#twyg').toggle();
  }
});

// Using Mousetrap.js let's Bind the view of the Twyg Console to the Keystroke Capital "T"
Mousetrap.bind('T',function () { Twyg_toggle(); });


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
			return Twyg_edit(e_input,p_input,u_input);
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
function Twyg_edit(e_input,p_input,u_input) {

	// Error Checking...
	alert(e_input+"  |   "+p_input+"  |  "+u_input);

	var $element = $(e_input);
	var $property = p_input;
	var $unit = u_input;

	// Here we start picking out what the Property actually is and how we respond to it - i.e what "Bones" we show
	// The Responses will return appropriate "Bones" which allow to edit the element with the mouse
	var $property_type = function () {

		// Margin Property
		if ($property == "margin") {}
		if ($property == "margin-left") {return bones_margin_left();}
		if ($property == "margin-right") {return bones_margin_right();}
		if ($property == "margin-bottom") {return bones_margin_bottom();}
		if ($property == "margin-top") {return bones_margin_top();}

		// Padding Property
		if ($property == "padding") {return bones_padding_all();}
		if ($property == "padding-left") {return bones_padding_left();}
		if ($property == "padding-right") {return bones_padding_right();}
		if ($property == "padding-bottom") {return bones_padding_bottom();}
		if ($property == "padding-top") {return bones_padding_top();}

		// Height and Width Properties
		if ($property == "height") {return bones_height();}
		if ($property == "width") {return bones_width();}

		// Letter/Font Properties
		if ($property == "font-size") {return bones_fontsize();}
		if ($property == "word-spacing") {return bones_wordspacing();}
		if ($property == "letter-spacing") {return bones_letterspacing();}

	} 
}


