define(["../fileplayer/Range", "./NoteSelector"],
    function (Range, NoteSelector) {
        var rangeSelector = function (container, id, defaultRange, partNumber) {
            this.upperVoiceSelector = new NoteSelector(container, id + "_upper", defaultRange.upperNote);
            this.lowerVoiceSelector = new NoteSelector(container, id + "_lower", defaultRange.lowerNote);
            this.partNumber = partNumber;
            this.voice = {
                "id" : id
            };
            this.setDefaultRange(defaultRange);
        };

        rangeSelector.prototype.setDefaultRange = function(range) {
            this.upperVoiceSelector.setDefault(range.upperNote);
            this.lowerVoiceSelector.setDefault(range.lowerNote);
        };

        rangeSelector.prototype.saveSelectedValues = function () {
            this.upperVoiceSelector.saveSelectedValues();
            this.lowerVoiceSelector.saveSelectedValues();
        };

        // Return an array of the selected opion values
        // select is an HTML select element
        rangeSelector.prototype.getSelectValues = function() {
            var result = [];
            result.push(this.upperVoiceSelector.getSelectedValue());
            result.push(this.lowerVoiceSelector.getSelectedValue());
            return result;
        };

        rangeSelector.prototype.setSelectValues = function(range) {
            this.upperVoiceSelector.setSelectValues(range.upperNote);
            this.lowerVoiceSelector.setSelectValues(range.lowerNote);
        };

        rangeSelector.prototype.getLastSavedLowerNote = function () {
            return this.lowerVoiceSelector.getLastSavedPitch();
        };

        rangeSelector.prototype.getLastSavedUpperNote = function () {
            return this.upperVoiceSelector.getLastSavedPitch();
        };

        return rangeSelector;
    });