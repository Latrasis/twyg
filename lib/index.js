/*!
 * Twyg.js - Tweak What You Get | CSS Editor
 * v0.0.2
 *
 * Copyright 2014, Jacob Payne and other contributors
 * Released under the MIT license
 *
 * Date: 2014-02-04
 */

// Add Dependencies
var jquery = require('jquery');
var fs = require('fs');
var jsdom = require('jsdom');
var indexsource = fs.readFileSync('./test.html',"utf-8");
var twygconsole = require('./console').twygconsole;
	TwygConsole = new twygconsole();

function Twyg() {

	// jsdom.env(
	// 	"file:///Users/jacobpayne/Documents/Repos/Github/twyg/test.html",
	// 	[jquery],
	// 	function(errors,window) {	

	// 		console.log(window.jquery);
	// 		// Twyg.console.show();
	// 		// TwygConsole.show();
	// 	}
	// );

}

exports.twygjs = Twyg;


	


