// ******* Twyg Console ******* //

var
	dep = require("./dep"),
	style = require("./styles");
	// mousetrap = require("mousetrap");
 

function TwygConsole($) {
	// Toggle/Hide Twyg Console
	this.show = function() {
		$("body")
			.prepend('<div id="twyg"></div>')
			.css('position','relative');
		$("#twyg")
			.prepend('<input type="text" id="twyg_console"></input>');
		$('#twyg_console').toggle();

		console.log("hello this is console.show working");
	};

	this.toggle = function() {
		var textinput = $('#twyg_console');
		textinput.toggle();
		textinput.focus ();
		textinput.select ();
	};

	// Create Twyg Console On Page Load
	// window.onLoad = console.show();

	// Using Mousetrap.js let's Bind the view of the Twyg Console to the Keystroke Capital "T"
	// mousetrap.bind('P',function () { _toggle(); });

	console.log("Test Test Test");

}

exports.twygconsole = TwygConsole;

	

	// // Actions on What to do on Pressing either "Enter" or "Esc"

	// $("body").keypress(function(e) {
	// 	// By Pressing "Esc" the Console is Toggled if Visible
	// 	// If the Console is not visible though any Bounding Boxes are Removed
	// 	if (e.keyCode == 27) {
	// 		if ($('#twyg_console').is(':hidden')) {$("#twyg_bbox").remove();}
	// 		if ($('#twyg_console').is(':visible')) {$("#twyg_console").toggle();}
	// 	}
	// });

	// $("#twyg_console").keypress(function (e) {
	// 	var Twyg_input = $("#twyg_console").val();
	// // By Pressing "Enter" the Field Content is Passed to the Parsing Function
	//   if (e.which == 13) {
	// 	$("#twyg_console").submit();
	// 	// If a Bounding Box already Exists we delete it
	// 	if ($("#twyg_bbox").length > 0) { $("#twyg_bbox").remove();}
	// 	Twyg_parse(Twyg_input);
	//   }
	// });

	// /********************Parse-Console-Input************************

	// Parse the Contents of the Input
	// See if the Input is Valid, If the Property is Valid, If the Element is Given
	// Then Pass the element to the Bounding-Box-Maker Function

	// ****************************************************************/

	// function Twyg_parse(input) {

	// 	// Bounding Box Parse
	// 	if (
	// 		// A Property is Defined and...
	// 		input.indexOf("{") != -1 
	// 		//If there is only 1 property
	// 		&& input.split("{").length <= 2
	// 		//If there no more than 1 unit type
	// 		&& input.split("/").length <= 2 
	// 		//If the property is valid (future versions should have a validator - for now it's just true)
	// 		&& true) {
	// 			// Since Jquery cannot parse properties we split the input accordingly
	// 			// Element Input for Jquery Parsing
	// 			var e_input = input.split("{")[0];
	// 			// Property Input for Twyg Editing
	// 			var p_input = input.split("{")[1].split("/")[0];
	// 			// Property Unit if Included
	// 			var u_input = input.split("/")[1];
				
	// 			// Let's Also Hide the Twyg Console
	// 			$('#twyg_console').toggle();

	// 			// And Pass the Element Input & Property Input to the Twyg Editor
	// 			return Twyg_bound(e_input,p_input,u_input);

	// 	}

	// 	//// Check for Tools
	// 	// Check for Ruler
	// 	if (input == "ruler" || input == "Ruler") {
	// 		// Hide Console
	// 			$('#twyg_console').toggle();
	// 		return Twyg_ruler();
	// 	}

	// 	// Again For Now For Everything Else We Simply Respond With a "Nope" Animation
	// 	// Future Versions should have a more wide range of responses
	// 	else {
	// 		$("#twyg_console")
	// 			.animate({'left':'10px'},70)
	// 			.animate({'left':'30px'},70)
	// 			.animate({'left':'20px'},70);
	// 	}
	// }