function bboxRead(input, done) {
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
			// Element Input for Jquery Parsing
			var e_input = input.split("{")[0];
			// Property Input for Twyg Editing
			var p_input = input.split("{")[1].split("/")[0];
			// Property Unit if Included
			var u_input = input.split("/")[1];
			
			// Let's Also Hide the Twyg Console
			$('#twyg_console').toggle();

			// And Pass the Element Input & Property Input to the Twyg Editor
			// return Twyg_bound(e_input,p_input,u_input);

	}
};


module.exports = {
	read: bboxRead
}