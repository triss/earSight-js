////////////////////////////////////////////////////////////////////////////////
// controller code
////////////////////////////////////////////////////////////////////////////////

var previouslyOnImage = false;

// when finger/mouse moved on to image start and update the synth
function movedOnToImage(x, y) {
	rgb = getPixelRGB(x, y);
	info = colourSpaceMapping(rgb);
	synth.start(info);
}

// when finger/mouse moved on image update the synth
function movedOnImage(x, y) {
	rgb = getPixelRGB(x, y);
	info = colourSpaceMapping(rgb);
	synth.update(info);
}

// when finger/mouse moved off the image stop synth
function movedOffImage(x, y) {
	rgb = getPixelRGB(x, y);
	info = colourSpaceMapping(rgb);
	synth.stop(info);
}

// works out wether movement is on/off image and triggers appropriate function
function mapXyPosToAction(x, y) {
	// if we were previously on the image
	if(previouslyOnImage) { 
		// and we're still on the image
		if(onImage(x, y)) { 
			movedOnImage(x, y); 
		} else {
			movedOffImage(x, y); 
			previouslyOnImage = false;
		}
	} else { // if we weren't on the image last time we checked
		if(onImage(x, y)) { 
			movedOnToImage(x, y); 
			previouslyOnImage = true;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
// finger tracking
////////////////////////////////////////////////////////////////////////////////

function trackFinger(e) {
	// grab info about first fingers position
	touchInfo = e.changedTouches[0];

	// map it's position to sound
	mapXyPosToAction(touchInfo.clientX, touchInfo.clientY);
}

function fingerOff(e) {
	// grab info about first fingers position
	touchInfo = e.changedTouches[0];

	// map it's position to sound
	movedOffImage(touchInfo.clientX, touchInfo.clientY);
}

// sets up responders for finger tracking
function initFingerTracking() {
	document.addEventListener('touchstart', trackFinger, false);
	document.addEventListener('touchmove', trackFinger, false);
	document.addEventListener('touchend', fingerOff, false);

	// To Disable 'Pinch to Zoom' Note: don't implement gester event handlers if you want to 
	//keep pinch to zoom functionality NOTE: i use this as my pageinit is a delegate of a page
	this.addEventListener("gesturestart", gestureStart, false);
	this.addEventListener("gesturechange", gestureChange, false);
	this.addEventListener("gestureend", gestureEnd, false);
	
	//handle each event by disabling the defaults
	function gestureStart(event) {
		event.preventDefault();
	}

	function gestureChange(event) {
		event.preventDefault();
	}

	function gestureEnd(event) {
		event.preventDefault();
	}
}

////////////////////////////////////////////////////////////////////////////////
// mouse handling
////////////////////////////////////////////////////////////////////////////////

function mouseMove(e) {
	mapXyPosToAction(e.x, e.y);
}

function onMouseOut(e) {
	movedOffImage(e.x, e.y);
}

function initMouseTracking() {
	document.onmousemove = mouseMove;
	document.onmouseout = onMouseOut;
}
