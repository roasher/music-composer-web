define(["data/Colors"],
    function (Colors) {

        var RangeLine = function (rangeLine, displayOptions) {

            this.id = rangeLine.voice.id
            this.color = Colors[this.id];
            this.height = displayOptions.noteHeight - 2;

            // first note
            var lowerNote = rangeLine.lastSavedRange.lowerNote;
            var top1 =  (displayOptions.max - displayOptions.min) * (1 - (lowerNote - displayOptions.min) / (displayOptions.max - displayOptions.min));
            top1 *=  displayOptions.noteHeight - 2;
            this.top1 = top1 * 2;

            // second note
            var upperNote = rangeLine.lastSavedRange.upperNote;
            var top2 =  (displayOptions.max - displayOptions.min) * (1 - (upperNote - displayOptions.min) / (displayOptions.max - displayOptions.min));
            top2 *=  displayOptions.noteHeight - 2;
            this.top2 = top2 * 2;
        };

        RangeLine.prototype.draw = function (context, left, right) {
            context.beginPath();
            context.fillStyle = "black";


            context.moveTo(0, this.top1);
            context.lineTo(right, this.top1);

            context.moveTo(0, this.top2);
            context.lineTo(right, this.top2);

            context.strokeStyle = this.color;
            context.font = "20px Arial";
            context.stroke();

            context.fillStyle = Colors[this.id];
            context.fillText(this.id, left, this.top1);
            context.fillText(this.id, left, this.top2);
        };

        return RangeLine;
    }
);