////////////////////////////////////////////////////////////////////////////////
// Audio stuff
//
// Makes chords, white noise and pink noise and sound file players for use with
// web audio
//
// synth.js utilizes these to build a synth
////////////////////////////////////////////////////////////////////////////////

// provides access to web browsers sound functionality
var audioContext;

// set up browser audio
function initAudio() {
	// setup audio context			
	if(typeof AudioContext !== "undefined") {
		audioContext = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
		audioContext = new webkitAudioContext();
	} else {
		throw new Error('AudioContext not supported :(')
	}
}

// make a chord whose amplitude can be set
//
// args: freqs - an array of frequencies
//
// returns:
// 	GainNode for setting amplitude with sinewaves at specified freqs routed in 
// 	to it
function makeChord(freqs) {
	// create an amp to control volume of chord
	var chordGain = audioContext.createGainNode();
	chordGain.gain.value = 0;

	// storage for each of the oscilators
	var oscs = [];

	for(var f in freqs) {
		// create an oscilator for each frequency
		var osc = audioContext.createOscillator();
		osc.frequency.value = freqs[f];
		// osc.start(0);

		// connect it to the amp
		osc.connect(chordGain);

		oscs.push(osc);
	}

	return {
		gain: {
			linearRampToValueAtTime: function(gain, fadeTime) {
				chordGain.gain.linearRampToValueAtTime(gain, fadeTime);
			}
		},

		start: function(time) {
			for(var o in oscs) { oscs[o].start(time); }
		},

		stop: function(time) {
			for(var o in oscs) { oscs[o].stop(time); }
		},

		connect: function(destination) {
			chordGain.connect(destination);
		}
	};
}

// make a buffer source/sound player that plays back sound at url
//
// args: url - the path to a sound file
//
// returns: BufferSource set to play file at url
function makeSoundPlayer(url) {
	var soundPlayer = audioContext.createBufferSource();
	soundPlayer.loop = true;

	// get the sound from the server
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode the sound asynchronously
	request.onload = function() {
		audioContext.decodeAudioData(request.response, function(buffer) {
			// once decoded set the soundplayer to play it
			soundPlayer.buffer = buffer;
			soundPlayer.loop = true;
		}, function(err) { 
			console.log("Error loading soundfile " + url + " : " + err); 
		});
	}

	// request the sound
	request.send();	

	return soundPlayer;
}

// makes a whitenoise generator and returns it
//
// generates white noise as buffer and loops it
function makeWhiteNoiseGen() {
	// create 2 seconds of white noise to loop through and store it in a buffer
	bufferSize = 2 * audioContext.sampleRate;
    noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    output = noiseBuffer.getChannelData(0);

	// populate white noise buffer with random values
	for (var i = 0; i < bufferSize; i++) {
    	output[i] = Math.random() * 2 - 1;
	}

	// create a buffer player for our noise
	noise = audioContext.createBufferSource();
	noise.buffer = noiseBuffer;
	noise.loop = true;

	return noise;
}

// makes a pink noise generator and returns it
//
// port of Pink Noise from Csound
// http://sourceforge.net/p/csound/csound6-git/ci/master/tree/Opcodes/pitch.c#l1336
//
// this generates pink noise on sample by sample basis
function makePinkNoiseGen() {
	var bufferSize = 4096;

    var b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

    var node = audioContext.createScriptProcessor(bufferSize, 1, 1);

    node.onaudioprocess = function(e) {
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;

            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            
			output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            
			output[i] *= 0.11; // (roughly) compensate for gain
            
			b6 = white * 0.115926;
        }
    }

    return node;
}
