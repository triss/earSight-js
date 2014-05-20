////////////////////////////////////////////////////////////////////////////////
// The synth
////////////////////////////////////////////////////////////////////////////////

// returns a Synth object that can be started, stopped and updated
//
// colourAmps     - the amplitude of each of the colours in a dictionary
// noiseGenerator - the function that generates noise generators
//                  allows swapping in and out of white/pink noise
// fadeTime       - how long to fade from one param setting to another
// fadeOutTime    - how long to fade out the synth for
function makeChordNoiseVoiceSynth(colourAmps, noiseGenerator, fadeTime, fadeOutTime) {
	// specification for sine based notes and chords
	var sineFreqs = {
		white: [3520],
		black: [100],
		blue: [262, 311, 392],
		yellow: [1047, 1319, 1568]
	};

	// container for sound generators amplifiers
	var colourSoundGains = {}; 

	// make the sines - chords can have any number of notes (including 1)
	for(var colour in sineFreqs) {
		colourSoundGains[colour] = makeChord(sineFreqs[colour]);
		colourSoundGains[colour].connect(audioContext.destination);
	}
	
	// noise for use with greyness
	colourSoundGains['grey'] = audioContext.createGainNode();
	colourSoundGains['grey'].gain.value = 0;
	colourSoundGains['grey'].connect(audioContext.destination);

	var greySound = noiseGenerator();
	greySound.connect(colourSoundGains['grey']);

	// make players for green vowel sound
	colourSoundGains['green'] = audioContext.createGainNode();
	colourSoundGains['green'].gain.value = 0;
	colourSoundGains['green'].connect(audioContext.destination);

	var greenSound = makeSoundPlayer('sounds/i.wav');
	greenSound.connect(colourSoundGains['green']);

	// make players for red vowel sound
	colourSoundGains['red'] = audioContext.createGainNode();
	colourSoundGains['red'].gain.value = 0;
	colourSoundGains['red'].connect(audioContext.destination);

	var redSound = makeSoundPlayer('sounds/u.wav');
	redSound.connect(colourSoundGains['red']);

	var started = false;

	return {
        // starts the synth playing - 
        // colourMags - the magnitudes of each colour in a dict
		start: function(colourMags) {
			if(!started) {
				redSound.start(0);
				greenSound.start(0);
				greySound.start(0);
				colourSoundGains['white'].start(0);
				colourSoundGains['black'].start(0);
				colourSoundGains['blue'].start(0);
				colourSoundGains['yellow'].start(0);

				started = true;
			}

			this.update(colourMags);
		},

        // changes the synths paramaters
        // colourMags - the magnitudes of each colour in a dict
		update: function(colourMags) {
			var currentTime = audioContext.currentTime;

            // adjust volume of each sound element based on colour magnitudes
			for(var colour in colourMags) {
				colourSoundGains[colour].gain.linearRampToValueAtTime(
					colourMags[colour] * colourAmps[colour] * 0.1, currentTime + fadeTime
				);
			}
		}, 

        // stop the synth playing and start fade out
		stop: function(colourMags) {
			var currentFadeOutTime = audioContext.currentTime;
			
			for(var colour in colourSoundGains) {
				colourSoundGains[colour].gain.linearRampToValueAtTime(
					0, currentFadeOutTime
				);
			}
		}
	}	
}
