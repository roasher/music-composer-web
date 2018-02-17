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

	var PlayButton = function(container){

		//the play button
		this._playButton = document.createElement("div");
		this._playButton.id = "PlayPause";
		this._playButton.classList.add("Button");
		container.appendChild(this._playButton);
		this._playButton.addEventListener("click", this._play.bind(this));

		//the callbacks
		this.onPlay = function(){};
		this.onScore = function(){};

		this._setPlayIcon();

	};

	PlayButton.prototype.stop = function(move){
		this._setPlayIcon();
	};

	PlayButton.prototype._play = function(){
		if (Transport.state === "started"){
			Transport.stop();
			this._setPlayIcon();
			this.onPlay(false);
		} else {
			this._setPauseIcon();
			Transport.start();
			this.onPlay(true);
		}
	};

	PlayButton.prototype._setPlayIcon = function(){
		this._playButton.classList.remove("icon-svg_pause");
		this._playButton.classList.add("icon-svg_play");
		this._playButton.classList.remove("Active");
	};

	PlayButton.prototype._setPauseIcon = function(){
		this._playButton.classList.add("icon-svg_pause");
		this._playButton.classList.remove("icon-svg_play");
		this._playButton.classList.add("Active");

	};

	PlayButton.prototype._loadScore = function(){
		//pause before the score
		Transport.stop();
		this.onPlay(false);
		var name = Scores[this._scoreIndex];
		var info = ScoreInfo[name];
		var loader = new Loader("score", info);
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "./midi/" + name + ".json" + "&random=" + Math.random());
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var json = JSON.parse(xhr.responseText);
					loader.resolve();
					this.onScore(json);
				} else {
					console.log('Error: ' + xhr.status); // An error occurred during the request.
				}
			}
		}.bind(this);
		xhr.send(null);
	};

	// PlayButton.prototype._setScoreControls = function(){
	// 	if (this._scoreIndex === 0){
	// 		this._prevButton.classList.add("Disabled");
	// 	} else {
	// 		this._prevButton.classList.remove("Disabled");
	// 	}
    //
	// 	if (this._scoreIndex === Scores.length - 1){
	// 		this._nextButton.classList.add("Disabled");
	// 	} else {
	// 		this._nextButton.classList.remove("Disabled");
	// 	}
	// };

	return PlayButton;
});