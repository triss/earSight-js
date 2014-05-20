////////////////////////////////////////////////////////////////////////////////
// image handling 
////////////////////////////////////////////////////////////////////////////////

// canvas used to draw our picture on
var display;

// image data used to look up pixel values 
var imageData;

// image bounds - location of image on screen 
var imageBounds;

// display image in canvas
function loadAndDisplayImage(url) {
	// set up our image
	image = new Image();
	
	// set it to display when loaded 
	image.onload = function() {
		// get screen dimensions
		screenDimensions = getViewportDimension();

		// set canvas to fill screen
		display.width = screenDimensions.w;
		display.height = screenDimensions.h;

		// sets the bounds of the image on screen 
		imageBounds = {
			x: 0, y: 0, w: screenDimensions.w, h: screenDimensions.h 
		};

		// load canvas with image to display it
		drawImageIOSFix(
			display.getContext('2d'), image, 
			0, 0, screenDimensions.w, screenDimensions.h
		);

		// get the pixel data so we can read it back
		imageData = display.getContext('2d').getImageData(
			0, 0, screenDimensions.w, screenDimensions.h
		).data;
	}
	
	// load the image
	image.src = url;
}

// takes an pair of coordinates and returns the r g b values as an array
function getPixelRGB(x, y) {
	// imageData is a 1 dimensional array with rgb values for each pixel 
	// arranged from left to right - we do some simple math to get r, g, b and 
	// alpha values for pixel at (x,y)
	r = imageData[((y * imageBounds.w) + x) * 4] / 255;
	g = imageData[(((y * imageBounds.w) + x) * 4) + 1] / 255;
	b = imageData[(((y * imageBounds.w) + x) * 4) + 2] / 255;
 
	// return a single object with rgb values
	return [r, g, b];
}

// return the screen size
function getViewportDimension() {
	return {w: $(window).width(), h: $(window).height() }
}

// returns true if finger on image and false otherwise
function onImage(x, y) {
	return (x >= imageBounds.x)
		&& (x <= imageBounds.x + imageBounds.w)
		&& (y >= imageBounds.y)
		&& (y <= imageBounds.y + imageBounds.h);
}

////////////////////////////////////////////////////////////////////////////////
// Fix for nasty iOS vertical squash bug - 
// http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
////////////////////////////////////////////////////////////////////////////////

/**
 * Detecting vertical squash in loaded image.
 * Fixes a bug which squash image vertically while drawing into canvas for some images.
 * This is a bug in iOS6 devices. This function from:
 * https://github.com/stomita/ios-imagefile-megapixel
 * 
 */
function detectVerticalSquash(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
            ey = py;
        } else {
            sy = py;
        }
        py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
}

/**
 * A replacement for context.drawImage
 * (args are for source and destination).
 */
function drawImageIOSFix(ctx, img, dx, dy, dw, dh) {
    var vertSquashRatio = detectVerticalSquash(img);
	ctx.drawImage(img, dx, dy, dw, dh / vertSquashRatio);
}
