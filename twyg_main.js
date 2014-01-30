/*!
 * Twyg.js - Tweak What You Get Tool
 * N/A
 *
 * Copyright 2014, Jacob Payne and other contributors
 * Released under the MIT license
 *
 * Date: 2014-01-29
 */

// Define Twyg Console
var Twyg_show = function() {
	$("body").prepend('<input type="text" id="twyg"></input>');
	$("#twyg").css({
		'width':'40%',
		'height':'auto',
		'background-color':'rgba(200,200,200,0.8)',
		'padding':'20px',
		'color':'#333',
		'font-size':'2em',
		'font-family':'sans-serif',
		'position':'absolute',
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
	// $('body').css({
	// 	'position':'relative',
	// 	'top':'30px;'
	// });
	text_input.focus ();
	text_input.select ();
}


// Parse Object
function Twyg_parse(input) {
	
	$(input).css({
		'background-color':'yellow',
		'margin':'50px'
	});
}

$("#twyg").keypress(function (e) {
	var Twyg_input = $("#twyg").val();

  if (e.which == 13) {
    $("#twyg").submit();
    Twyg_parse(Twyg_input);
  	$('#twyg').toggle();
  }
  if (e.keyCode == 27) {
  	$('#twyg').toggle();
  }
});




Mousetrap.bind('T',function () { Twyg_toggle(); });
