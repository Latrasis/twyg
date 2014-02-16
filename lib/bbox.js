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