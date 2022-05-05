define([],
    function () {
        var noteSelector = function (container, id, defaultPitch) {
            this.possibleNotePitches = [36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84];
            this.pitchCorrespondingNote = ["C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2","C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3","C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5","C6"];

            this.voice = document.createElement("select");
            this.voice.disabled = true;
            this.voice.id = id;

            container.appendChild(this.voice);
            for (var noteNumber = 0; noteNumber < this.possibleNotePitches.length; noteNumber++) {
                var option = document.createElement("option");
                option.value = this.possibleNotePitches[noteNumber];
                option.text = this.pitchCorrespondingNote[noteNumber];
                this.voice.appendChild(option);
            }

            this.setDefault(defaultPitch);
        };

        noteSelector.prototype.setDefault = function(defaultPitch) {
            this.defaultPitch = defaultPitch;
            this.lastSavedPitch = this.defaultPitch;
            this.setSelectValues(defaultPitch);
        };

        noteSelector.prototype.saveSelectedValues = function () {
            this.lastSavedPitch = parseInt(this.voice.value);
        };

        noteSelector.prototype.voiceUp = function () {
            let lastSavedPitch = this.getLastSavedPitch();
            let nextPitchOptionNumber;
            for (let optionNumber = 0; optionNumber < this.voice.options.length; optionNumber++) {
                let option = this.voice.options[optionNumber];
                if (option.value === lastSavedPitch.toString()) {
                    nextPitchOptionNumber = optionNumber !== this.voice.options.length - 1 ? optionNumber + 1 : optionNumber;
                }
            }
            this.setSelectValues(this.voice.options[nextPitchOptionNumber].value);
            this.saveSelectedValues();
            // console.log("pitch now: " + this.getLastSavedPitch() + " ,was: " + lastSavedPitch);
        };

        noteSelector.prototype.voiceDown = function () {
            let lastSavedPitch = this.getLastSavedPitch();
            let previousPitchOptionNumber;
            for (let optionNumber = 0; optionNumber < this.voice.options.length; optionNumber++) {
                let option = this.voice.options[optionNumber];
                if (option.value === lastSavedPitch.toString()) {
                    previousPitchOptionNumber = optionNumber !== 0 ? optionNumber - 1 : optionNumber;
                }
            }
            this.setSelectValues(this.voice.options[previousPitchOptionNumber].value);
            this.saveSelectedValues();
            // console.log("pitch now: " + this.getLastSavedPitch() + " ,was: " + lastSavedPitch);
        };

        noteSelector.prototype.setSelectValues = function(pitch) {
            for (let optionNumber = 0; optionNumber < this.voice.options.length; optionNumber++) {
                let option = this.voice.options[optionNumber];
                if (option.value === pitch.toString()) {
                    option.selected = true;
                }
            }
        };

        noteSelector.prototype.getSelectedValue = function () {
            return this.voice.value;
        };

        noteSelector.prototype.getLastSavedPitch = function () {
            return this.lastSavedPitch;
        };

        return noteSelector;
    });