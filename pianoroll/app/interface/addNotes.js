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

define(["style/interface.scss", "data/Scores", "data/ScoreInfo", "Tone/core/Transport", "interface/Loader"],
    function (interfaceStyle, Scores, ScoreInfo, Transport, Loader) {

        var addNotes = function (container) {

            //the play button
            this._addNotes = document.createElement("div");
            this._addNotes.id = "addNotes";
            this._addNotes.classList.add("Button");
            container.appendChild(this._addNotes);
            this._addNotes.addEventListener("click", this._play.bind(this));

            //the prev button
            this._prevButton = document.createElement("div");
            this._prevButton.id = "Previous";
            this._prevButton.classList.add("Button");
            this._prevButton.classList.add("ScoreButton");
            this._prevButton.classList.add("icon-svg_left_arrow");
            container.appendChild(this._prevButton);
            this._prevButton.addEventListener("click", this._selectScore.bind(this, -1));

            //the next button
            this._nextButton = document.createElement("div");
            this._nextButton.id = "Next";
            this._nextButton.classList.add("Button");
            this._nextButton.classList.add("ScoreButton");
            this._nextButton.classList.add("icon-svg_right_arrow");
            container.appendChild(this._nextButton);
            this._nextButton.addEventListener("click", this._selectScore.bind(this, 1));

            this._scoreIndex = 0;
            this._setScoreControls();

            //the callbacks
            this.onPlay = function () {
            };
            this.onAddNotes = function () {
            };

            this._setPlayIcon();

            //load the first score
            // this._loadScore();
            this.sessionId = Math.floor(Math.random() * 10000000000000001)
        };

        addNotes.prototype._selectScore = function (move) {
            this._setPlayIcon();
            this._scoreIndex += move;
            this._setScoreControls();
            this._loadScore(Scores[this._scoreIndex]);
        };

        addNotes.prototype.stop = function (move) {
            this._setPlayIcon();
        };

        addNotes.prototype._play = function () {
            this._loadScore();
        };

        addNotes.prototype._setPlayIcon = function () {
            this._addNotes.classList.remove("icon-svg_pause");
            this._addNotes.classList.add("icon-svg_play");
            this._addNotes.classList.remove("Active");
        };

        addNotes.prototype._setPauseIcon = function () {
            this._addNotes.classList.add("icon-svg_pause");
            this._addNotes.classList.remove("icon-svg_play");
            this._addNotes.classList.add("Active");

        };

        addNotes.prototype._loadScore = function () {
            var compositionId = this.sessionId;
            var numberOfBars = 1;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://localhost:8888/getBars?compositionId=" + compositionId + "&numberOfBars=1");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var json = JSON.parse(xhr.responseText);
                        this.onAddNotes(json);
                    } else {
                        console.log('Error: ' + xhr.status); // An error occurred during the request.
                    }
                }
            }.bind(this);
            xhr.send(null);
        };

        addNotes.prototype._setScoreControls = function () {
            if (this._scoreIndex === 0) {
                this._prevButton.classList.add("Disabled");
            } else {
                this._prevButton.classList.remove("Disabled");
            }

            if (this._scoreIndex === Scores.length - 1) {
                this._nextButton.classList.add("Disabled");
            } else {
                this._nextButton.classList.remove("Disabled");
            }
        };

        return addNotes;
    });