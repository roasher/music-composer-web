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

define(["./Score", "Tone/core/Transport", "style/roll.scss", "./Scroll"],
function (Score, Transport, rollStyle, Scroll) {

	/**
	 *  the amount of time that notes are processed ahead of time.
	 *  This improves the performance and accuracy of scheduled notes.
	 */
	var lookAhead = 0.05;


	var Roll = function(container){

		/**
		 *  The scroll container
		 */
		this._element = document.createElement("div");
		this._element.id = "RollContainer";
		container.appendChild(this._element);

		// The trigger line that sits in the center
		var triggerLine = document.createElement("div");
		triggerLine.id = "TriggerLine";
		this._element.appendChild(triggerLine);

		/**
		 *  The scrolling container
		 */
		this._scrollContainer = document.createElement("div");
		this._scrollContainer.id = "ScrollContainer";
		this._element.appendChild(this._scrollContainer);


		this._scrollElement = document.createElement("div");
		this._scrollElement.id = "PianoRoll";
		this._scrollContainer.appendChild(this._scrollElement);

		//THE SCORE DISPLAY
		this._score = new Score(this._element, this._scrollElement);

		//the scroll handler
		this._scroll = new Scroll(this._scrollContainer, this._score.pixelsPerSecond);
		this._scroll.scrubstart = this._scrubStarted.bind(this);
		this._scroll.scrubend = this._scrubEnd.bind(this);

		// if it's scrubbing
		this._scrubbing = false;

		this._started = false;

		//the current notes on the screen
		this._currentNotes = [];

		//if the scroll has changed, redraw
		this._currentScroll = -1;

		//the time at the beginning of the piano roll
		this._computedStartTime = 0;

		//callback when a note is triggered
		this.onnote = function(){};
		this.onstop = function(){};

		//a binding of the loop
		this._bindedLoop = this._loop.bind(this);

		// session
        this.sessionId = Math.floor(Math.random() * 10000000000000001);
        this.numberOfBarsToLoad = 2;

		//start the loop
		// this._loop();

		this._width = this._scrollContainer.offsetWidth;

		window.addEventListener("resize", this._resize.bind(this));

		//set the lookahead to match the other one
		// Transport._clock.lookAhead = lookAhead;

		this.loadNotesRequestSend = false;
	};

    Roll.prototype.setRangeLines = function (rangeLines) {
        this._score.setRangeLines(rangeLines)
    };

	Roll.prototype._resize = function(){
		this._width = this._scrollContainer.offsetWidth;
	};

	Roll.prototype._computeStartTime = function(){
		var width = this._scrollContainer.offsetWidth;
		this._computedStartTime = Transport.now() - (this._currentScroll - width/2) / this._score.pixelsPerSecond;
	};

	Roll.prototype._scrubStarted = function(){
		this._scrubbing = true;
		//release all the current notes
		for (var i = 0; i < this._currentNotes.length; i++){
			this._currentNotes[i].triggerRelease();
		}
		this.onstop();
	};

	Roll.prototype._scrubEnd = function(){
		this._scrubbing = false;
		this._computeStartTime();
	};

	/**
	 * Draw the currently on screen notes
	 */
	Roll.prototype._onScreenNotes  = function(){
		// this._score.showOnScreenNotes(this._currentScroll - width/2, this._currentScroll + width/2);
		this._score.showOnScreenNotes(this._currentScroll - this._width, this._currentScroll);
	};

	Roll.prototype.playOnScreenNotes = function () {
        var triggerLineNotes = this._score.getTriggerLine(this._currentScroll - this._width / 2 - 1);
        // console.log("TriggerLineNotes length is " + triggerLineNotes.length);
        if (triggerLineNotes){
            //compare it to the last one and get the note attacks and releases
            for (var i = 0; i < triggerLineNotes.length; i++){
                if (this._currentNotes.indexOf(triggerLineNotes[i]) === -1){
                    var note = triggerLineNotes[i];
                    if (this._scrubbing){
                        this.onnote(note.note, 0.1, "+0.05", note.velocity);
                        note.triggerAttackRelease(0.1, "+0.05", note.velocity);
                    } else {
                        var startTime = this._computedStartTime + note.noteOn + lookAhead;
                        this.onnote(note.note, note.duration, startTime, note.velocity);
                        // var datetime = new Date().toJSON();
                        // console.log(datetime + " " + note.note);
                        note.triggerAttackRelease(note.duration, startTime, note.velocity);
                    }
                }
            }
            this._currentNotes = triggerLineNotes;
        }
    };

	Roll.prototype.loadMoreNotes = function () {
		if (this.loadNotesRequestSend) return;

        let bachChoralVoiceRangeDTO = this._score.getBachChoralVoiceRangeDTO();
        console.log("Having Ranges", bachChoralVoiceRangeDTO);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `http://localhost:8888/getBars?compositionId=${this.sessionId}"&numberOfBars=${this.numberOfBarsToLoad}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            this.loadNotesRequestSend = false;
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    this.addNotes(json);
                } else {
                    console.log("Error: " + xhr.status); // An error occurred during the request.
                }
            }
        }.bind(this);
        xhr.send(JSON.stringify(bachChoralVoiceRangeDTO));
        this.loadNotesRequestSend = true;
    };

	Roll.prototype._loop = function(){
		requestAnimationFrame(this._bindedLoop);
		var scrollLeft = this._scrollContainer.scrollLeft;
		//loop
		if (scrollLeft + this._width >= this._score.width - 2){
			this._currentScroll = -1;
			this._scroll.restart();
			this._computeStartTime();
			this._scrollContainer.scrollLeft = 0;
		}
		if (scrollLeft !== this._currentScroll){
			this._currentScroll = scrollLeft;
			this._onScreenNotes();
			this.playOnScreenNotes();

			// see if we need to load more notes
            var notesFromTo = this._score.getNotesFromTo(this._currentScroll - this._width/24, this._currentScroll);
            if (notesFromTo && notesFromTo.length === 0 ) {
                this.loadMoreNotes();
            }
		}
		//draw all of the notes
		this._score.draw(this._currentScroll - this._width);
	};

	/**
	 * set the json score
	 */
	Roll.prototype.setScore = function(json){
		Transport.bpm.value = json.header.tempo;
		Transport.timeSignature = json.header.timeSignature;
		//set the notes
		this._score.setNotes(json.notes);
		//show the first notes initially
		var width = this._scrollContainer.offsetWidth;
		this._currentScroll =  width / 2 - 3;
		this._scrollContainer.scrollLeft = this._currentScroll;
		this._onScreenNotes();
	};

	Roll.prototype.addNotes = function(json){
		Transport.bpm.value = json.header.tempo;
		Transport.timeSignature = json.header.timeSignature;
		//set the notes
		this._score.addNotes(json.notes);
		//show the first notes initially
		var width = this._scrollContainer.offsetWidth;
		this._currentScroll =  width / 2 - 3;
		this._scrollContainer.scrollLeft = this._currentScroll;
		this._onScreenNotes();
	};

	Roll.prototype.start = function(){
		this._computeStartTime();
		this._scroll.start();
	};

	Roll.prototype.stop = function(){
		this._scroll.stop();
		for (var i = 0; i < this._currentNotes.length; i++){
			this._currentNotes[i].triggerRelease();
		}
		this.onstop();
	};

	return Roll;
});