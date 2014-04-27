// ******* Styling ******* //


function styles() {

	// Console Style
	var console_style = {
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
	var anchor_style = {
		"position":"absolute",
		"width": "6px",
		"height":"6px",
		"background-color":"#fff",
		"border":"solid 1px rgba(33,33,33,0.8)"
	};

	// Ruler Style
	var ruler_style = {
		"position":"absolute",
		"background-color":"#f00",
		"border":"solid 1px #eee",
		"height":"1px"
	};


	return {
		console: $("#twyg_console").css(console_style),
		anchors: $("#twyg_bbox").css(anchor_style),
		ruler: $("#twyg_ruler").css(ruler_style),
	};
}

exports.styles = styles;