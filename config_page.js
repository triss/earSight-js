function getMinColourMagsFromConfig() {
	var minColourMags = {
		white: 	parseFloat($("#white-mag-min").val()),
		black: 	parseFloat($("#black-mag-min").val()),
		blue: 	parseFloat($("#blue-mag-min").val()),
		yellow: parseFloat($("#yellow-mag-min").val()),
		red: 	parseFloat($("#red-mag-min").val()),
		green: 	parseFloat($("#green-mag-min").val()),
		grey: 	parseFloat($("#grey-mag-min").val())
	};

	return minColourMags;
}

function getColourAmpsFromConfig() {
	var colourAmps = {
		white: 	parseFloat($("#white-amp").val()),
		black: 	parseFloat($("#black-amp").val()),
		blue: 	parseFloat($("#blue-amp").val()),
		yellow: parseFloat($("#yellow-amp").val()),
		red: 	parseFloat($("#red-amp").val()),
		green: 	parseFloat($("#green-amp").val()),
		grey: 	parseFloat($("#grey-amp").val())
	};

	return colourAmps;
}

function getGreyColourNoiseFuncFromConfig() {
	var makeNoiseFunc;
	
	if($("#grey-sound-noise-pink").val() == "on") {
		makeNoiseFunc = makePinkNoiseGen;
	} else {
		makeNoiseFunc = makeWhiteNoiseGen;
	}

	return makeNoiseFunc;
}

function getFadeTimeFromConfigPage() {
	return parseFloat($("#fade-out-time").val());
}

function getFadeOutTimeFromConfigPage() {
	return parseFloat($("#fade-time").val());
}

function getLuminanceModeFromConfigPage() {
	var colourFunction;
	
	if($("#luminance-d65").val() == "on") {
		colourFunction = rgbToCIELUV;
	} else {
		colourFunction = rgbToCIELUVD50;
	}

	return colourFunction;
}
