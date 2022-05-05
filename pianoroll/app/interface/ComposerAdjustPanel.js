define(["./RangeSelector", "../fileplayer/Range"],
    function (RangeSelector, Range) {
        var composerAdjustPanel = function (container) {
            this._composerAdjustPanel = document.createElement("div");
            this._composerAdjustPanel.id = "composerAdjustPanel";
            container.appendChild(this._composerAdjustPanel);
            this.selectVoice = [];
            this.selectVoice.push(new RangeSelector(this._composerAdjustPanel, "firstVoiceRange", new Range(60, 84), 0));
            this.selectVoice.push(new RangeSelector(this._composerAdjustPanel, "secondVoiceRange", new Range(53, 77), 1));
            this.selectVoice.push(new RangeSelector(this._composerAdjustPanel, "altoVoiceRange", new Range(45, 69), 2));
            this.selectVoice.push(new RangeSelector(this._composerAdjustPanel, "bassVoiceRange", new Range(41, 65), 3));

            // move voices up button
            this._voiceUpButton = document.createElement("div");
            this._voiceUpButton.id = "moveAllVoicesUp";
            this._voiceUpButton.classList.add("Button");
            this._voiceUpButton.classList.add("icon-voice_up");
            this._composerAdjustPanel.appendChild(this._voiceUpButton);
            this._voiceUpButton.addEventListener("click", this.allVoicesUp.bind(this));

            // move voices down button
            this._voiceDonwButton = document.createElement("div");
            this._voiceDonwButton.id = "moveAllVoicesDown";
            this._voiceDonwButton.classList.add("Button");
            this._voiceDonwButton.classList.add("icon-voice_down");
            this._composerAdjustPanel.appendChild(this._voiceDonwButton);
            this._voiceDonwButton.addEventListener("click", this.allVoicesDown.bind(this));

            // callback
            this.doOnConfirmAdjustment = function () {};
        };

        composerAdjustPanel.prototype._confirmAdjustment = function () {
            this.selectVoice.forEach(function (selectVoice) {
                selectVoice.saveSelectedValues();
            });
            this.doOnConfirmAdjustment(this.getRanges());
        };

        composerAdjustPanel.prototype.allVoicesUp = function () {
            this.selectVoice.forEach(function (selectVoice) { selectVoice.rangeUp(); });
            this.doOnConfirmAdjustment(this.getRanges());
        };

        composerAdjustPanel.prototype.allVoicesDown = function () {
            this.selectVoice.forEach(function (selectVoice) { selectVoice.rangeDown(); });
            this.doOnConfirmAdjustment(this.getRanges());
        };

        composerAdjustPanel.prototype.getRanges = function () {
          let ranges = [];
          for (let selectVoiceNumber = 0; selectVoiceNumber < this.selectVoice.length; selectVoiceNumber++ ) {
              ranges.push(this.selectVoice[selectVoiceNumber]);
          }
          return ranges;
        };

        return composerAdjustPanel;
    });