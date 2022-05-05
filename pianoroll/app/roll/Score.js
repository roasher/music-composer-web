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

define(["roll/Note", "interval-tree-1d", "style/roll.scss", "roll/RangeLine"],
    function (Note, createIntervalTree, rollStyle, RangeLine) {

        /**
         *  Parses the score JSON into note on/off events
         *  and orders them. Converts ticks into seconds.
         *  @param  {Object}  scoreJson  JSON returned from Tone.js' MidiToScore
         */
        var Score = function (container, scrollElement) {

            /**
             *  all of the notes
             */
            this.notes = [];

            /**
             *  the score container
             */
            this.element = scrollElement;

            /**
             *  the notes that are currently displayed
             */
            this.currentlyDisplayedNotes = [];

            /**
             *  the notes that are currently being triggered by scrubbing
             */
            this.currentlyTriggeredNotes = [];

            /**
             *  the interval tree
             */
            this.intervalTree = new createIntervalTree();

            /**
             * the width of the scroll container
             */
            this.width = 0;
            /**
             * duration of the score
             */
            this.duration = 0;
            /**
             * Range lines
             */
            this.rangeLines = [];
            /**
             * The canvas which notes are drawn to
             * @type {Element}
             */
            this.canvas = document.createElement("canvas");
            this.canvas.id = "ScoreCanvas";
            container.appendChild(this.canvas);

            /**
             * The canvas measurements
             */
            this.canvasWidth = 0;
            this.canvasHeight = 0;

            this.context = this.canvas.getContext("2d");

            window.addEventListener("resize", this.resize.bind(this));
            this.resize();

            this._currentNotes = [];

            this.displayOptions = null;
            // displayOptions would be set only first time on init
            this.displayOptionsSet = false;
        };

        /**
         *  useful for drawing / scrubbing
         */
        Score.prototype.pixelsPerSecond = 100;

        Score.prototype.setDisplayOptions = function (pitches) {
            if (this.displayOptionsSet) return;
            //get the min/max data
            // let minPitch = this.displayOptions ? this.displayOptions.min : Infinity;
            // let maxPitch = this.displayOptions ? this.displayOptions.max : -Infinity;
            let minPitch = Infinity;
            let maxPitch = -Infinity;
            pitches.forEach(function (pitch) {
                if (pitch > maxPitch) {
                    maxPitch = pitch;
                }
                if (pitch < minPitch) {
                    minPitch = pitch;
                }
            });

            console.log(`${minPitch} ${maxPitch} ${typeof maxPitch}`);
            //some padding
            // minPitch -= 3;
            maxPitch += 3;
            let displayOptions = {
                "min": minPitch,
                "max": maxPitch,
                "pixelsPerSecond": this.pixelsPerSecond,
                "pixelsInOnePitchUnit": Math.round(this.element.offsetHeight / (maxPitch - minPitch))
            };
            this.displayOptions = displayOptions;
            this.displayOptionsSet = true;

            console.log(this.displayOptions);
        };

        Score.prototype.setRangeLines = function (rangeLines) {
            let pitches = [];
            this.rangeLines = [];
            for (let lineNumber = 0; lineNumber < rangeLines.length; lineNumber++) {
                this.rangeLines.push(new RangeLine(rangeLines[lineNumber]));
                pitches.push(rangeLines[lineNumber].getLastSavedLowerNote());
                pitches.push(rangeLines[lineNumber].getLastSavedUpperNote());
            }
            this.setDisplayOptions(pitches);
        };

        /**
         *  Set the array of notes
         */
        Score.prototype.setNotes = function (notes) {
            console.log(new Date().toJSON() + "Set Notes Triggered");
            this._currentNotes = notes;
            this.clearNotes();
            this.intervalTree = new createIntervalTree();
            var duration = -Infinity;
            var pitches = [];
            for (var i = 0; i < notes.length; i++) {
                var note = new Note(notes[i]);
                if (note.noteOff > duration) {
                    duration = note.noteOff;
                }
                this.intervalTree.insert([note.noteOn, note.noteOff, note]);
                pitches.push(notes[i].midiNote);
            }
            // this.setDisplayOptions(pitches);
            //set the width
            this.width = duration * this.pixelsPerSecond + window.innerWidth * 2;
            this.element.style.width = this.width;
        };

        Score.prototype.addNotes = function (notes) {
            console.log(new Date().toJSON() + " Add Notes Triggered");
            this._currentNotes = this._currentNotes.concat(notes);
            var duration = -Infinity;
            var pitches = [];
            for (var i = 0; i < notes.length; i++) {
                var note = new Note(notes[i]);
                if (note.noteOff > duration) {
                    duration = note.noteOff;
                }
                this.intervalTree.insert([note.noteOn, note.noteOff, note]);
                pitches.push(notes[i].midiNote);
            }
            // this.setDisplayOptions(pitches);
            //set the width
            this.duration += duration;
            this.width = this.duration * this.pixelsPerSecond + window.innerWidth * 2;
            this.element.style.width = this.width;
        };

        /**
         *  Resize the drawing canvas
         */
        Score.prototype.resize = function () {
            this.canvasWidth = this.canvas.offsetWidth * 2;
            this.canvasHeight = this.canvas.offsetHeight * 2;
            this.context.canvas.width = this.canvasWidth;
            this.context.canvas.height = this.canvasHeight;
            if (this._currentNotes) {
                this.setNotes(this._currentNotes);
            }
        };

        /**
         *  Returns the length of the score in seconds
         *  @return  {Number}
         */
        Score.prototype.getDuration = function () {
            var lastOff = 0;
            //get the last noteOff
            for (var i = 0; i < this.notes.length; i++) {
                if (this.notes[i].noteOff > lastOff) {
                    lastOff = this.notes[i].noteOff;
                }
            }
            return lastOff;
        };

        /**
         *  get the note attacks between 'from' and 'to' PIXELS!
         *  @return  {Array}
         */
        Score.prototype.showOnScreenNotes = function (from, to) {
            var fromSeconds = from / this.pixelsPerSecond;
            var toSeconds = to / this.pixelsPerSecond;
            if (this.intervalTree !== null) {
                var notes = [];
                this.intervalTree.queryInterval(fromSeconds, toSeconds, function (res) {
                    notes.push(res[2]);
                });
                this.currentlyDisplayedNotes = notes;
            }
        };

        Score.prototype.getNotesFromTo = function (from, to) {
            var fromSeconds = from / this.pixelsPerSecond;
            var toSeconds = to / this.pixelsPerSecond;
            if (this.intervalTree !== null) {
                var notes = [];
                this.intervalTree.queryInterval(fromSeconds, toSeconds, function (res) {
                    notes.push(res[2]);
                });
                return notes;
            }
        };

        /**
         *  get the note attacks between 'from' and 'to' PIXELS!
         *  @return  {Array}
         */
        Score.prototype.getTriggerLine = function (position) {
            if (this.intervalTree !== null) {
                var notes = [];
                position = position / this.pixelsPerSecond;
                this.intervalTree.queryPoint(position, function (res) {
                    notes.push(res[2]);
                });
                return notes;
            }
        };

        /**
         *  clear all of the children
         */
        Score.prototype.clearNotes = function () {
            for (var i = 0; i < this.notes.length; i++) {
                var notes = this.notes[i];
                notes.dispose();
            }
            this.notes = [];
        };

        /**
         *  clean up
         */
        Score.prototype.dispose = function () {
            this.clearNotes();
            this.element.remove();
            this.element = null;
        };

        /**
         *  Draw all of the onscreen notes
         */
        Score.prototype.draw = function (offset) {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.context.save();
            this.context.translate(-offset * 2, 0);
            var notes = this.currentlyDisplayedNotes;
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];

                var width = (note.duration * this.displayOptions.pixelsPerSecond) - 2;
                width = Math.max(width, 3);

                note.draw(this.context,
                    this.calculateTop(note.midiNote),
                    note.noteOn * this.displayOptions.pixelsPerSecond * 2,
                    width * 2,
                    (this.displayOptions.pixelsInOnePitchUnit - 2) * 2
                );
            }
            this.context.restore();
            for (var rangeLineNumber = 0; rangeLineNumber < this.rangeLines.length; rangeLineNumber++) {
                var currentRangeLine = this.rangeLines[rangeLineNumber];
                currentRangeLine.draw(this.context,
                    this.calculateTop(currentRangeLine.lowerNote),
                    this.calculateTop(currentRangeLine.upperNote),
                    this.canvasWidth,
                    rangeLineNumber * 40);
            }
        };

        Score.prototype.calculateTop = function (pitch) {
            var top =  this.displayOptions.max - pitch;
            top *=  this.displayOptions.pixelsInOnePitchUnit - 2;
            top = top * 2;
            return top;
        };

        Score.prototype.getBachChoralVoiceRangeDTO = function () {
            if (this.rangeLines.length === 0) {
                return;
            }
            var findRange = function (id, rangeLines) {
                return rangeLines.find(function (e) {
                    return e.id === id;
                });
            };
            var range1 = {
                lowPitch: findRange("firstVoiceRange", this.rangeLines).lowerNote,
                highPitch: findRange("firstVoiceRange", this.rangeLines).upperNote
            };
            var range2 = {
                lowPitch: findRange("secondVoiceRange", this.rangeLines).lowerNote,
                highPitch: findRange("secondVoiceRange", this.rangeLines).upperNote
            };
            var range3 = {
                lowPitch: findRange("altoVoiceRange", this.rangeLines).lowerNote,
                highPitch: findRange("altoVoiceRange", this.rangeLines).upperNote
            };
            var range4 = {
                lowPitch: findRange("bassVoiceRange", this.rangeLines).lowerNote,
                highPitch: findRange("bassVoiceRange", this.rangeLines).upperNote
            };

            return {range1, range2, range3, range4};
        };

        return Score;
    });