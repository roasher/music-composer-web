define(["./RangeSelector", "../fileplayer/Range",],
    function (RangeSelector, Range) {
        let bachRangeSelector = function (container, id, confirmAdjustments) {
            this._bachRangeSelector = document.createElement("div");
            this._bachRangeSelector.id = id;
            container.appendChild(this._bachRangeSelector);

            this.selectVoice = [];
            this.selectVoice.push(new RangeSelector(this._bachRangeSelector, "firstVoiceRange", new Range(60, 84), 0));
            this.selectVoice.push(new RangeSelector(this._bachRangeSelector, "secondVoiceRange", new Range(53, 77), 1));
            this.selectVoice.push(new RangeSelector(this._bachRangeSelector, "altoVoiceRange", new Range(45, 69), 2));

            this.selectVoice.push(new RangeSelector(this._bachRangeSelector, "bassVoiceRange", new Range(41, 65), 3));

            // move voices up button
            this._voiceUpButton = document.createElement("div");
            this._voiceUpButton.id = "moveAllVoicesUp";
            this._voiceUpButton.classList.add("Button");
            this._voiceUpButton.classList.add("icon-voice_up");
            this._bachRangeSelector.appendChild(this._voiceUpButton);
            this._voiceUpButton.addEventListener("click", this.allVoicesUp.bind(this));

            // move voices down button
            this._voiceDonwButton = document.createElement("div");
            this._voiceDonwButton.id = "moveAllVoicesDown";
            this._voiceDonwButton.classList.add("Button");
            this._voiceDonwButton.classList.add("icon-voice_down");
            this._bachRangeSelector.appendChild(this._voiceDonwButton);
            this._voiceDonwButton.addEventListener("click", this.allVoicesDown.bind(this));

            this._rangeSelector = document.createElement("div");
            this._bachRangeSelector.appendChild(this._rangeSelector);

            // callbach
            this.doOnRangeChange = function () {};
        };

        bachRangeSelector.prototype.allVoicesUp = function () {
            this.selectVoice.forEach(function (selectVoice) { selectVoice.rangeUp(); });
            this.doOnRangeChange(this.getRanges());
        };

        bachRangeSelector.prototype.allVoicesDown = function () {
            this.selectVoice.forEach(function (selectVoice) { selectVoice.rangeDown(); });
            this.doOnRangeChange(this.getRanges());
        };

        bachRangeSelector.prototype.getRanges = function () {
            let ranges = [];
            for (let selectVoiceNumber = 0; selectVoiceNumber < this.selectVoice.length; selectVoiceNumber++ ) {
                ranges.push(this.selectVoice[selectVoiceNumber]);
            }
            return ranges;
        };

        bachRangeSelector.prototype.saveSelectedRange = function () {
            this.selectVoice.forEach(function (selectVoice) {
                selectVoice.saveSelectedValues();
            });
        };

        return bachRangeSelector;
    });