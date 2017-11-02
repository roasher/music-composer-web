define(["../fileplayer/Range"],
    function (Range) {
        var noteSelector = function (container, id, defaultRange) {
            this.possibleNotePitches = ["36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84"];
            this.pitchCorrespondingNote = ["C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2","C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3","C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5","C6"];
            this.setDefaultRange(defaultRange);

            this.voice = document.createElement("select");
            this.voice.multiple = true;
            this.voice.id = id;
            container.appendChild(this.voice);
            for (var noteNumber = 0; noteNumber < this.possibleNotePitches.length; noteNumber++) {
                var option = document.createElement("option");
                option.value = this.possibleNotePitches[noteNumber];
                option.text = this.pitchCorrespondingNote[noteNumber];
                this.voice.appendChild(option);
            }
            this.voice.addEventListener('change', function () {
                console.log("changed");
            });
        };

        noteSelector.prototype.setDefaultRange = function(range) {
            this.defaultRange = range;
            this.lastSavedRange = this.defaultRange;
            //TODO set selection
        };

        noteSelector.prototype.saveSelectedValues = function () {
            var selectValues = this.getSelectValues();
            this.lastSavedRange = new Range(selectValues[0], selectValues[1])
        };

        // Return an array of the selected opion values
        // select is an HTML select element
        noteSelector.prototype.getSelectValues = function() {
            var result = [];
            var options = this.voice && this.voice.options;
            var opt;

            for (var i=0, iLen=options.length; i<iLen; i++) {
                opt = options[i];

                if (opt.selected) {
                    result.push(opt.value || opt.text);
                }
            }
            return result;
        };

        return noteSelector;
    });