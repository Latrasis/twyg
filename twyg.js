/*!
 * Twyg.js - Tweak What You Get | CSS Editor
 * v0.0.2
 *
 * Copyright 2014, Jacob Payne and other contributors
 * Released under the MIT license
 *
 * Date: 2014-02-04
 */

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

	// Ruler Style

	var $ruler_styles = {
		"position":"absolute",
		"background-color":"#f00",
		"border":"solid 1px #eee",
		"height":"1px"
	};

	function style_console() {$("#twyg_console").css($console_styles);}
	function style_anchors() {$("#twyg_bbox").css($bbox_anchor_styles);}
	function style_ruler() {$("#twyg_ruler").css($ruler_styles);}

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

		//// Check for Tools
		// Check for Ruler
		if (input == "ruler" || input == "Ruler") {
			// Hide Console
				$('#twyg_console').toggle();
			return Twyg_ruler();
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


	/*********** Mouse Panel (Pops next to the mouse) **************/

	var $mousepanel = {

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

	/************************ Twyg-Tools ***************************/

	// Ruler (v.0.1)

	function Twyg_ruler() {
		$(document).mousedown(function(e) {
			// Prevent Defaults
			e.preventDefault();

			// Create Ruler
			$('#twyg').append('<div id="twyg_ruler"></div>');
			$ruler = $('#twyg_ruler');

			// Style Ruler
			style_ruler();

			// Toggle Mouse Panel
			$mousepanel.add();
			$mousepanel.style();
			$mousepanel.position(e);

			// Set Start Point
			var start_x = e.pageX,
				start_y = e.pageY;

			// Set Ruler First Position
			$ruler.css({"left":start_x,"top":start_y});

			$(document).mousemove(function(e) {	

				// Position MousePanel
				$mousepanel.position(e);

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

				$mousepanel.context(ruler_length + "px");
			
			});

			$(document).mouseup(function(e){
				// Unbind MouseMove
				$(document).unbind('mousemove');
				// Toggle Mouse Panel
				$mousepanel.remove();
			});
		});
	}

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
			Anchors_css($bbox_anchor_styles);

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


