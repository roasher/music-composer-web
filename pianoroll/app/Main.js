/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require(["domready", "roll/Roll", "sound/Player", "interface/Interface", "Tone/core/Transport", 
	"midi/preludeInC.json", "midi/preludeInCshort.json", "StartAudioContext", "style/main.scss", "Tone/core/Tone",
		"interface/Orientation"],
function(domReady, Roll, Player, Interface, Transport, preludeInC, preludeInCshort,
	StartAudioContext, mainStyle, Tone, Orientation){

	domReady(function(){

		//the interface
		var player = new Player();

		var roll = new Roll(document.body);

		var interface = new Interface(document.body);

		//set the first score
		roll.setScore(preludeInCshort);
		/**
		 * EVENTS
		 */
		interface.onInstrument(function(inst){
			player.setInstrument(inst);
		});
		interface.onPlay(function(playing){
			if (playing){
				roll.start();
			} else {
				roll.stop();
				player.releaseAll();
			}
		});
		interface.onScore(function(json){
			roll.setScore(json);
		});
		interface.onAddNotes(function(json) {
			roll.addNotes(json);
		});

		var wasPlaying = false;
		interface.onRecord(function(recording){
			if (recording){
				wasPlaying = Transport.state === "started";
				roll.stop();
			} else {
				if (wasPlaying){
					wasPlaying = false;
					roll.start();
				}
			}
		});
		interface.onBuffer(function(buffer, duration, onset){
			player.setBuffer(buffer, duration, onset);
		});


		roll.onnote = function(note, duration, time, velocity){
			player.triggerAttackRelease(note, duration, time, velocity);
		};
		roll.onstop = function(){
			player.releaseAll();
		};
		roll.getVoiceRanges = function () {
			return interface._composerAdjustPanel.getRanges();
        };

		var orientation = new Orientation(function(){
			//called when stopped
			Transport.stop();
			roll.stop();
			interface.stop();
		});

		window.parent.postMessage("loaded", "*");

		//send the ready message to the parent
		var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

		//full screen button on iOS
		if (isIOS){
			//make a full screen element and put it in front
			var iOSTapper = document.createElement("div");
			iOSTapper.id = "iOSTap";
			iOSTapper.addEventListener("touchstart", function(e){
				e.preventDefault();
			});
			document.body.appendChild(iOSTapper);
			StartAudioContext.setContext(Tone.context);
			StartAudioContext.on(iOSTapper);
			StartAudioContext.onStarted(function(){
				iOSTapper.remove();
				window.parent.postMessage("ready","*");
			});
		} else {
			window.parent.postMessage("ready","*");
		}

	});
});
