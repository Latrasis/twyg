require.config({
	paths: {
		"jquery": "bower_components/jquery/jquery",
		"mousetrap": "bower_components/mousetrap/mousetrap",
	}
});

require([''], function(twyg) {
	new twyg;
});