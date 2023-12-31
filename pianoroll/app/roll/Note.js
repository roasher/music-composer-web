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

define(["Tone/core/Transport", "data/Colors"], function (Transport, Colors){

	/**
	 *  Notes manage both the visual element and trigger the synth
	 */
	var Note = function(noteDescription){

		/**
		 *  Note stats
		 */
		this.noteOn = Transport.toSeconds(noteDescription.time);
		this.duration = Transport.toSeconds(noteDescription.duration);
		this.noteOff = this.noteOn + this.duration;

		//parse the name from the octave, and add it as a class
		var noteName = noteDescription.note.match(/^([a-g]{1}[b|#]{0,1})[0-9]+$/i)[1];

		/**
		 * The notes color
		 */
		// this.color = Colors[noteName];
		this.color = Colors[noteDescription.partNumber];

		/**
		 *  the note name
		 */
		this.note = noteDescription.note;

		/**
		 *  the note velocity
		 */
		this.velocity = noteDescription.velocity;

		/**
		 *  MIDI note number
		 */
		this.midiNote = noteDescription.midiNote;

		/**
		 * If the note is triggered or not
		 */
		this._triggered = false;

	};

	/**
	 *  trigger the attack
	 */
	Note.prototype.triggerAttack = function(time){
		this._triggered = true;
	};

	/**
	 *  trigger the release
	 */
	Note.prototype.triggerRelease = function(time){
		this._triggered = false;
	};

	Note.prototype.triggerAttackRelease = function(duration, time){
		duration = Transport.toSeconds(duration);
		this.needsUpdate = true;
		this._triggered = true;
		setTimeout(function(){
			this._triggered = false;
			this.needsUpdate = true;
		}.bind(this), duration * 1000);
	};


	/**
	 *  Display the element
	 */
	Note.prototype.draw = function(context, top, left, width, height){
		context.beginPath();
		if (this._triggered){
			context.fillStyle = "black";
		} else {
			context.fillStyle = this.color;
		}
		context.fillRect(left, top, width, height);
	};

	/**
	 *  trigger the release
	 */
	Note.prototype.dispose = function(time){
		Transport.cancel(this.noteOnId);
		Transport.cancel(this.noteOffId);
		this.element.remove();
		this.element = null;
	};

	return Note;
});