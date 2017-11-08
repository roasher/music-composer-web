define(["data/Colors"],
    function (Colors) {

        var RangeLine = function (rangeLine, displayOptions) {

            this.color = Colors[rangeLine.voice.id];
            this.width = 100;
            this.height = displayOptions.noteHeight - 2;

            // first note
            var lowerNote = rangeLine.lastSavedRange.lowerNote;
            var top1 =  (displayOptions.max - displayOptions.min) * (1 - (lowerNote - displayOptions.min) / (displayOptions.max - displayOptions.min));
            top1 *=  displayOptions.noteHeight - 2;
            this.top1 = top1;

            // second note
            var upperNote = rangeLine.lastSavedRange.upperNote;
            var top2 =  (displayOptions.max - displayOptions.min) * (1 - (upperNote - displayOptions.min) / (displayOptions.max - displayOptions.min));
            top2 *=  displayOptions.noteHeight - 2;
            this.top2 = top2;
        };

        RangeLine.prototype.draw = function (context) {
            context.beginPath();
            context.lineWidth=5;
            context.fillStyle = "black";

            context.moveTo(0, this.top1 * 2);
            context.lineTo(this.width, this.top1 * 2);

            context.moveTo(0, this.top2 * 2);
            context.lineTo(this.width, this.top2 * 2);
            context.strokeStyle = this.color;
            context.stroke();
        };

        return RangeLine;
    }
);