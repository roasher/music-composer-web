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

define(["style/interface.scss", "./Panel"],
function (interfaceStyle, Panel) {

	var Interface = function(container){

		this._interface = document.createElement("div");
		this._interface.id = "SongControls";
		container.appendChild(this._interface);

		this._panel = new Panel(this._interface);

	};

	Interface.prototype.doOnRangeChange = function (cb) {
		this._panel._composerAdjustPanel.bachRangeSelector.doOnRangeChange = cb;
    };

	Interface.prototype.doOnKeyChange = function (cb) {
		this._panel._composerAdjustPanel.doOnKeyChange= cb;
	};

	Interface.prototype.confirmAdjustment = function () {
		this._panel._composerAdjustPanel._confirmAdjustment();
	};

	Interface.prototype.allVoicesUp = function () {
		this._panel._composerAdjustPanel.allVoicesUp();
    };

	Interface.prototype.allVoicesDown = function () {
		this._panel._composerAdjustPanel.allVoicesDown();
	};

	Interface.prototype.onAddNote = function(cb) {
		this._panel._addNotes.onAddNote = cb;
	};

	Interface.prototype.onPlay = function(cb){
		this._panel._playButton.onPlay = cb;
	};

	Interface.prototype.onScore = function(cb){
		this._panel._playButton.onScore = cb;
	};

	//force it to a stop
	Interface.prototype.stop = function(){
		this._panel._playButton.stop();
	};

	return Interface;
});