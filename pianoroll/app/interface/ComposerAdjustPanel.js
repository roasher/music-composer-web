define(["./NoteSelector", "../fileplayer/Range"],
    function (NoteSelector, Range) {
        var composerAdjustPanel = function (container) {
            this._composerAdjustPanel = document.createElement("div");
            this._composerAdjustPanel.id = "composerAdjustPanel";
            container.appendChild(this._composerAdjustPanel);
            this.selectVoice = [];
            this.selectVoice.push(new NoteSelector(this._composerAdjustPanel, "selectVoiceRanges1", new Range(60, 84)));
            this.selectVoice.push(new NoteSelector(this._composerAdjustPanel, "selectVoiceRanges2", new Range(53, 77)));
            this.selectVoice.push(new NoteSelector(this._composerAdjustPanel, "selectVoiceRanges3", new Range(45, 69)));
            this.selectVoice.push(new NoteSelector(this._composerAdjustPanel, "selectVoiceRanges4", new Range(41, 65)));

            // submit button
            this._submitButton = document.createElement("div");
            this._submitButton.id = "confirmAdjustmentsButton";
            this._submitButton.classList.add("Button");
            this._composerAdjustPanel.appendChild(this._submitButton);
            this._submitButton.addEventListener("click", this._confirmAdjustment.bind(this));

            // callback
            this.doOnConfirmAdjustment = function () {}
        };

        composerAdjustPanel.prototype._confirmAdjustment = function () {
            this.selectVoice.forEach(function (selectVoice) { selectVoice.saveSelectedValues() })
            this.doOnConfirmAdjustment(this.getRanges());
        };

        composerAdjustPanel.prototype.getRanges = function () {
          var ranges = [];
          for (var selectVoiceNumber = 0; selectVoiceNumber < this.selectVoice.length; selectVoiceNumber++ ) {
              ranges.push(this.selectVoice[selectVoiceNumber]);
          }
          return ranges;
        };

        return composerAdjustPanel;
    });