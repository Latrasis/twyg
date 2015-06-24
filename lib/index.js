/*!
 * Twyg.js - Tweak What You Get | CSS Editor
 * v0.0.2
 *
 * Copyright 2014, Jacob Payne and other contributors
 * Released under the MIT license
 *
 * Date: 2014-02-04
 */

var $ = require('jquery');
var Mousetrap = require('mousetrap');

var styles = require('./styles.json');
var twygConsole = require('./console.js');

var toolRuler = require('./tools/ruler.js');
var toolBbox = require('./tools/bbox.js');

var Twyg = (function() {

	// ******* Small Dependency Functions with Jquery ******* //

	// Find Css Float Value
	$.fn.cssFloat = function (prop) {
	    return parseFloat(this.css(prop)) || 0;
	};

	// Find Css Integer Value
	$.fn.cssInt = function (prop) {
	    return parseInt(this.css(prop),10) || 0;
	};

	// Rotate Css with Transformed Origin
	$.fn.rotate = function(degrees) {
	    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'rad)',
	                '-moz-transform' : 'rotate('+ degrees +'rad)',
	                '-ms-transform' : 'rotate('+ degrees +'rad)',
	                'transform' : 'rotate('+ degrees +'rad)',
	    			'transformOrigin':"left top"});
	};

	// Adding Twyg to the Body

	window.onLoad = twygConsole.show();

	// Using Mousetrap.js let's Bind the view of the Twyg Console to the Keystroke Capital "P"
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
	
}) ();


