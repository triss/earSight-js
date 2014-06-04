////////////////////////////////////////////////////////////////////////////////
//
// colour space mappings
// 
// utilizes colorspaces.js to convert from RGB to CIELIUV:
// http://www.boronine.com/colorspaces.js/
//
////////////////////////////////////////////////////////////////////////////////


// converts rgb values to CIELUV space
// 
// args:	rgb - an array of rgb values
// returns: an object containing l, u and v values
function rgbToCIELUV(rgb) {
	cieluv = $.colorspaces.make_color('sRGB', rgb).as('CIELUV');
	
	//console.log("L: " + cieluv[1]);
	//console.log("U: " + cieluv[1]);
	//console.log("V: " + cieluv[2]);
	//console.log();

	return { l: cieluv[0], u: cieluv[1], v: cieluv[2] };
}

// converts rgb values to CIELUV space via XYZ conversionin D50
// rather D65
// 
// args:	rgb - an array of rgb values
// returns: an object containing l, u and v values
function rgbToCIELUVD50(rgb) {
	d50xyz = $.colorspaces.make_color('sRGB', rgb).as('CIEXYZD50');
    cieluv = $.colorspaces.make_color('CIEXYZ', d50xyz).as('CIELUV')

	return { l: cieluv[0], u: cieluv[1], v: cieluv[2] };
}

// converts CIELUV values to Colour Mag space
// 
// args: 	cieluv - an object containing l, u and v values
// returns: an object containing magnitudes for white, black, red, green, blue,
// yellow and grey
function cieluvToRawColourMags(cieluv) {
	// calculate CIE chroma
	var cieChroma = Math.sqrt((cieluv.u * cieluv.u) + (cieluv.v * cieluv.v));

	var mags = {};

	// map CIELUV L to white/black magnitudes
	mags['white'] = Math.pow(cieluv.l, 4) / 100000000;
	mags['black'] = Math.pow(cieluv.l - 100, 4) / 100000000;

	// map CIELUV U to red/green magnitudes
	//mags['red'] = Math.min(cieluv.u / 100, 1);
	//mags['red'] = Math.min(cieluv.u / 100, 1) - 0.22;
	console.log("redb: ", Math.min(cieluv.u / 100, 1));
	mags['red'] = (Math.min(cieluv.u / 100, 1) - 0.22) * 1.25;
	//mags['green'] = Math.pow(Math.max(0, Math.min((cieluv.u * -1) / 80, 1)), 2);
	mags['green'] = Math.max(0, Math.min((cieluv.u * -1) / 15, 1));

	// map CIELUV V to blue/yellow magnitudes
	mags['blue'] = Math.min((cieluv.v * -1) / 15, 1);
	mags['yellow'] = Math.min(cieluv.v / 100, 1);

	// calculate grey mag from CIELUV L and CIE Chroma
	mags['grey'] = 
		Math.pow((cieluv.l * (cieluv.l - 100) / 1000) / 2.5, 4) 
		* Math.pow((180 - cieChroma) / 180, 4);

	//console.log(mags);
	//console.log("blu: " + mags['blue']);
	console.log("blu: " + mags['blue']);
	console.log("red: " + mags['red']);
	//console.log("yel: " + mags['yellow']);
	//console.log("gre: " + mags['green']);

	//for(var c in mags) {
	//	console.log(c + " " + mags[c]);
	//}

	return mags;
}

// ensures all colour magnitudes below the minimums specified are output as 0
//
// args: 	mags - an object containing magnitudes of each colour
// 			mins - an object containing minimum mags for each colour	
function zeroLowColourMags(mags, mins) {
	for(var c in mags) {
		if(mags[c] < mins[c]) {
			mags[c] = 0;
		}
    }

	return mags;
}
