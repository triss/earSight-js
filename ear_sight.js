// the synth colours are played back through - it maps colour magnitudes 
// to sound via it's update method
var synth;

// a function that takes a array of rgb values and "Colour magnitudes" for
// mapping to the synth
var colourSpaceMapping;

// where we display our image
var display;

////////////////////////////////////////////////////////////////////////////////
// initialisation
////////////////////////////////////////////////////////////////////////////////

// when the document loads
$(document).ready(function() {
	// hide the image display
	$("#imageDisplay").hide();

	// initilaise audio stuff
	initAudio();
		
	// grab a canvas to display image upon and extract pixel info from
	display = document.getElementById('image-display');

	// set up system to start when image is loaded
	$("#takePictureButton").on("change", startUp);
});


// called when a picture is successfuly loaded/taken
function startUp(e) {
	// if we've really got a picture
	if(e.target.files.length == 1 && 
	   e.target.files[0].type.indexOf("image/") == 0) {
		// disable bouncy scrolling for whole document
		$(document).on('touchmove', function(e) { e.preventDefault(); });
		
	    // hide the option to take a new picture and display the image
		$("#config-form").hide();
		$("#image-display").show();
		
		// load and display the image
		loadAndDisplayImage(URL.createObjectURL(e.target.files[0]));

		$(window).on('orientationchange', function() {
			loadAndDisplayImage(URL.createObjectURL(e.target.files[0]))
		});

		configureSynth();
		configureColourSpaceMapping();

		// init inputs
		initFingerTracking();
		initMouseTracking();
	}
}

function configureSynth() {
	// get max amps for each "colour"
	var colourAmps = getColourAmpsFromConfig();

	// get choen noise generator
	var noiseGenerator = getGreyColourNoiseFuncFromConfig();

	// get fade times
	var fadeOutTime = getFadeOutTimeFromConfigPage();
	var fadeTime = getFadeTimeFromConfigPage();

	synth = makeChordNoiseVoiceSynth(colourAmps, noiseGenerator, fadeTime, fadeOutTime);
}

function configureColourSpaceMapping() {
	var minColourMags = getMinColourMagsFromConfig();

	// set the selected colour space mapping function to be used
	colourSpaceMapping = function(rgb) {
		var ctx = display.getContext("2d");

        // mini display for debugging
		console.log("rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")");
		ctx.fillStyle = "rgb("+(rgb[0]*255)+","+(rgb[1]*255)+","+(rgb[2]*255)+")";
		ctx.fillRect(0, 0, 200, 200);

		var colourMags = zeroLowColourMags(
				cieluvToRawColourMags(rgbToCIELUV(rgb)), 
				minColourMags);

		return colourMags;
	};
}
